from google import genai
from google.genai import types
from PIL import Image
import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def generate_prompt(activity: str) -> str:
    prompt = (
        f"""
        Create a high-quality, aesthetic, cute horizontal banner illustration for a student activity planning web app.

        Main focus:
        - Show a small group of diverse college-age students actively engaged in: {activity}.
        - The scene should clearly represent the activity while staying friendly, positive, and inviting.
        - Characters should look modern, expressive, and relatable.

        Composition:
        - CRITICAL: Wide horizontal banner in 16:9 aspect ratio (1920x1080 or similar).
        - Fill the ENTIRE width of the image edge-to-edge with the scene - NO white borders or empty margins.
        - The scene should extend to all four edges of the canvas.
        - Keep main characters slightly off-center with intentional compositional space to allow overlaid UI text.
        - Background should imply the correct environment (outdoor field, living room, study area, etc.) but remain simple, uncluttered, and secondary to the characters.
        - Medium-distance perspective so faces and body language are readable.
        - Use a full, immersive background that fills the entire frame.

        Art Direction:
        - Clean, modern illustration suitable for a web interface.
        - Soft, cohesive color palette with smooth lighting.
        - Avoid extreme stylization — keep it balanced (not overly cartoonish, not hyper-realistic).
        - No text, no logos, no watermarks, no UI elements.
        - NO white space, NO borders, NO padding - the illustration must bleed to the edges.

        Details:
        - Lighting should match the activity (daylight for outdoors, soft warm lighting for indoors).
        - Include subtle props or context elements that reinforce the activity without crowding the frame.
        - Characters should include gender and ethnic diversity and wear activity-appropriate casual clothing.
        - Ensure the background environment extends fully to all edges of the image.

        Output:
        - Generate one edge-to-edge horizontal banner illustration in 16:9 aspect ratio optimized for use as a card header image.
        """
    )

    return prompt

def main():
    # Test with just one activity
    activity = "Playing basketball"

    # Create images directory if it doesn't exist
    os.makedirs("images", exist_ok=True)

    # Initialize Supabase client
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_KEY")
    supabase: Client = create_client(supabase_url, supabase_key)

    client = genai.Client(api_key=os.getenv("GEMINI_API"))

    print(f"Generating image for: {activity}")
    prompt = generate_prompt(activity)

    response = client.models.generate_content(
        model="gemini-2.5-flash-image",
        contents=[prompt],
    )

    for part in response.parts:
        if part.text is not None:
            print(part.text)
        elif part.inline_data is not None:
            image = part.as_image()
            # Sanitize the file name - replace spaces and special characters with underscores
            safe_filename = activity.replace(" ", "_").replace("/", "_").replace("\\", "_").replace(":", "_")
            filepath = f"images/{safe_filename}.png"
            image.save(filepath)
            print(f"✓ Saved locally: {filepath}")
            
            # Upload to Supabase Storage
            try:
                with open(filepath, "rb") as f:
                    supabase.storage.from_("activity-images").upload(
                        path=f"{safe_filename}.png",
                        file=f,
                        file_options={"content-type": "image/png"}
                    )
                print(f"✓ Uploaded to Supabase: {safe_filename}.png")
            except Exception as e:
                print(f"✗ Upload failed: {e}")
    
    print("Test complete!")

if __name__ == "__main__":
    main()
