from fastapi import FastAPI
from google import genai
import os
from dotenv import load_dotenv

# Loading environment variables from .env
load_dotenv()
client = genai.Client(api_key=os.getenv('GEMINI_API'))

app = FastAPI(title="Generative AI Service", version="1.0.0")

@app.get("/")
async def get_root():
    return {"message": "AI Service Running"}

@app.get("/get-activities")
async def get_activities(user_prompt: str):
    SYSTEM_PROMPT = """
        You are an activity recommendation assistant. Suggest 3-5 fun activities based on user preferences.
        
        IMPORTANT: Return ONLY a valid JSON array of objects. No additional text, explanations, or formatting.
        Each object should have "activity" and "location" fields.
        
        Format: [{"activity": "activity name", "location": "specific location"}, {"activity": "activity name", "location": "specific location"}]
        
        Example: [{"activity": "Kayaking", "location": "Lake Michigan"}, {"activity": "Bike Riding", "location": "Lakefront Trail"}, {"activity": "Zoo Visit", "location": "Lincoln Park Zoo"}]
    """

    full_prompt = f"{SYSTEM_PROMPT}\n\nUser Request: {user_prompt}"

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=full_prompt
    )

    return {"activities" : response.text.strip()}

if __name__ == "__main__":
    import uvicorn 
    uvicorn.run(app, host="localhost", port=8000)