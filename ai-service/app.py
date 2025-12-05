from fastapi import FastAPI
from google import genai
import os
import re
import json
from dotenv import load_dotenv
from supabase import create_client, Client

# Loading environment variables from .env
load_dotenv()

# Validate environment variables
gemini_api = os.getenv('GEMINI_API')
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")

if not gemini_api:
    raise ValueError("GEMINI_API environment variable is not set")
if not supabase_url:
    raise ValueError("SUPABASE_URL environment variable is not set")
if not supabase_key:
    raise ValueError("SUPABASE_KEY environment variable is not set")

print(f"🔧 Initializing with Supabase URL: {supabase_url}")

client = genai.Client(api_key=gemini_api)
supabase: Client = create_client(supabase_url, supabase_key)


app = FastAPI(title="Generative AI Service", version="1.0.0")

@app.get("/")
async def get_root():
    return {"message": "AI Service Running"}

@app.get("/health", include_in_schema=False)
@app.head("/health", include_in_schema=False)
async def health():
    return {"status": "ok"}

@app.get("/get-images")
async def get_images(activities: str):
    try:
        print(f"🖼️ Getting images for activities: {activities}")
        
        SYSTEM_PROMPT = """
            For each activity in the list of activities, choose an image that matches it the best from the list of images provided.
            Do not make up any of your own images or urls, just choose the ones from the list of images that are provided.
            IMPORTANT: Return ONLY a valid JSON array of objects. No additional text, explanations, or formatting.
            Each object should have "activity" and "image" fields where image is ONLY the filename.
            
            Format: [{"activity": "activity name", "image": "filename.png"}, {"activity": "activity name", "image": "filename.png"}]
            
            Example: [{"activity": "Kayaking", "image": "kayaking.png"}, {"activity": "Bike Riding", "image": "bikeRiding.png"}, {"activity": "Zoo Visit", "image": "zoo.png"}]
        """

        bucket = supabase.storage.from_("activity-images")
        print(f"📦 Fetching files from Supabase bucket...")
        files = bucket.list("")
        print(f"✅ Retrieved {len(files) if files else 0} files from bucket")
        
        # Extract just the filenames from the files list
        filenames = [file['name'] for file in files if 'name' in file]
        print(f"📝 Available filenames: {filenames}")
        
        full_prompt = f"{SYSTEM_PROMPT}\n\nUser list of activities: {activities}\n\nAvailable image files: {filenames}"

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=full_prompt
        )

        print("✅ AI response received")

        cleaned_response = response.text.strip()
        
        # Remove ```json and ``` markers
        cleaned_response = re.sub(r'^```json\s*', '', cleaned_response)
        cleaned_response = re.sub(r'^```\s*', '', cleaned_response)
        cleaned_response = re.sub(r'\s*```$', '', cleaned_response)
        cleaned_response = cleaned_response.strip()

        print("Cleaned Response: ", cleaned_response)

        # Validate it's actually JSON
        try:
            json.loads(cleaned_response)  # Test if it's valid JSON
        except json.JSONDecodeError as e:
            print(f"❌ JSON parsing error: {e}")
            return {"error": "Invalid JSON response from AI", "raw": cleaned_response}

        return {"activity_images" : cleaned_response}
    except Exception as e:
        print(f"❌ Error in get_images: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
        raise

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
    port_str = os.getenv("PORT")
    port = int(port_str)
    uvicorn.run(app, host="localhost", port=port)