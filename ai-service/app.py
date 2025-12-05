from fastapi import FastAPI
from google import genai
import os
import re
import json
from dotenv import load_dotenv

# Loading environment variables from .env
load_dotenv()
client = genai.Client(api_key=os.getenv('GEMINI_API'))

app = FastAPI(title="Generative AI Service", version="1.0.0")

@app.get("/")
async def get_root():
    return {"message": "AI Service Running"}

@app.get("/get-images")
async def get_activities(activities: list[str], images: list[str]):
    SYSTEM_PROMPT = """
        For each activity in the list of activities, choose an image that matches it the best from the list of images provided.

        IMPORTANT: Return ONLY a valid JSON array of objects. No additional text, explanations, or formatting.
        Each object should have "activity" and "location" fields.
        
        Format: [{"activity": "activity name", "image": "image url"}, {"activity": "activity name", "image": "image url"}]
        
        Example: [{"activity": "Kayaking", "image": "kayaking.jpg"}, {"activity": "Bike Riding", "image": "bikeRiding.jpg"}, {"activity": "Zoo Visit", "image": zoo.jpg"}]
    """

    full_prompt = f"{SYSTEM_PROMPT}\n\nUser list of activities: {activities} with list of images: {images}"

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=full_prompt
    )

    cleaned_response = response.text.strip()
    
    # Remove ```json and ``` markers
    cleaned_response = re.sub(r'^```json\s*', '', cleaned_response)
    cleaned_response = re.sub(r'^```\s*', '', cleaned_response)
    cleaned_response = re.sub(r'\s*```$', '', cleaned_response)
    cleaned_response = cleaned_response.strip()


    # Validate it's actually JSON
    try:
        json.loads(cleaned_response)  # Test if it's valid JSON
    except json.JSONDecodeError as e:
        print(f"JSON parsing error: {e}")
        return {"error": "Invalid JSON response from AI", "raw": cleaned_response}

    return {"activity_images" : cleaned_response}

@app.get("/get-activities")
async def get_activities(user_prompt: str, location: str):
    print("i reached the localhost:8000!")

    SYSTEM_PROMPT = """
        You are an activity recommendation assistant. Suggest 3-5 fun activities based on user preferences.
        
        IMPORTANT: Return ONLY a valid JSON array of objects. No additional text, explanations, or formatting.
        Each object should have "activity" and "location" fields.
        
        Format: [{"activity": "activity name", "location": "specific location"}, {"activity": "activity name", "location": "specific location"}]
        
        Example: [{"activity": "Kayaking", "location": "Lake Michigan"}, {"activity": "Bike Riding", "location": "Lakefront Trail"}, {"activity": "Zoo Visit", "location": "Lincoln Park Zoo"}]
    """

    full_prompt = f"{SYSTEM_PROMPT}\n\nUser Request: {user_prompt} with {location}"

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=full_prompt
    )

    print(f"here is the response from the ai: {response.text}")# Clean the response - remove markdown code blocks
    cleaned_response = response.text.strip()
    
    # Remove ```json and ``` markers
    cleaned_response = re.sub(r'^```json\s*', '', cleaned_response)
    cleaned_response = re.sub(r'^```\s*', '', cleaned_response)
    cleaned_response = re.sub(r'\s*```$', '', cleaned_response)
    cleaned_response = cleaned_response.strip()
    
    print(f"Cleaned response: {cleaned_response}")
    
    # Validate it's actually JSON
    try:
        json.loads(cleaned_response)  # Test if it's valid JSON
    except json.JSONDecodeError as e:
        print(f"JSON parsing error: {e}")
        return {"error": "Invalid JSON response from AI", "raw": cleaned_response}

    return {"activities" : cleaned_response}

if __name__ == "__main__":
    import uvicorn 
    uvicorn.run(app, host="localhost", port=8000)