from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from youtube_transcript_api import YouTubeTranscriptApi, NoTranscriptFound
from openai import OpenAI
from dotenv import load_dotenv
import os
import json
import requests

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env.local'))
api_key = os.getenv("OPENAI_API_KEY")
yt_api_key = os.getenv("YOUTUBE_API_KEY")
client = OpenAI(api_key=api_key)

app = FastAPI()

class VidRequest(BaseModel):
    video_id: str

def fetch_video_title(video_id):
    url = "https://www.googleapis.com/youtube/v3/videos"
    params = {
        "part": "snippet",
        "id": video_id,
        "key": yt_api_key
    }
    response = requests.get(url, params=params)
    if response.status_code != 200:
        return None
    data = response.json()
    items = data.get("items")
    if not items:
        return None
    title = items[0]["snippet"]["title"]
    return title

def chunk_text(text, max_words=2500):
    words = text.split()
    chunks = []
    for i in range(0, len(words), max_words):
        chunk = ' '.join(words[i:i + max_words])
        chunks.append(chunk)
    return chunks

def call_openai(prompt, max_tokens=500):
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are an expert educational assistant."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3,
        max_tokens=max_tokens
    )
    return response.choices[0].message.content

@app.post("/analyze")
async def analyze_video(request: VidRequest):
    try:
        transcript = YouTubeTranscriptApi.get_transcript(request.video_id)
    except NoTranscriptFound:
        raise HTTPException(status_code=404, detail="Transcript not found for this video.")
    
    title = fetch_video_title(request.video_id) or "Untitled Video"
    full_transcript = ' '.join([entry['text'] for entry in transcript])
    chunks = chunk_text(full_transcript, max_words=2500)

    chunk_summaries = []
    for i, chunk in enumerate(chunks):
        prompt = f"""
Here is a part of a YouTube video transcript (part {i+1} of {len(chunks)}):
\"\"\"{chunk}\"\"\"
Please provide a detailed summary focusing on the key facts and important concepts covered in this part.
"""
        summary = call_openai(prompt)
        chunk_summaries.append(summary.strip())

    combined_summary_text = "\n\n".join(chunk_summaries)

    combine_prompt = f"""
You are an expert educational assistant.

Here is the combined summary of a YouTube video transcript:
\"\"\"{combined_summary_text}\"\"\"

Based on this combined summary, please:

1. Provide a clear and concise **summary of the general concepts and principles** related to the topic (avoid referencing the specific video or its examples).
2. Create 3-5 unique multiple choice questions testing understanding of these concepts, without relying on the video's examples.
3. Create 3-5 flashcards, each with a key term or concept and its clear, general definition.

Please format your response as valid JSON with three keys: "summary", "questions", and "flashcards".

Example format:
{{
    "summary": "Your summary here",
    "questions": [
        {{
            "question": "Question text",
            "options": ["A", "B", "C", "D"],
            "answer": "Correct option"
        }},
        ...
    ],
    "flashcards": [
        {{
            "term": "Key term",
            "definition": "Definition text"
        }},
        ...
    ]
}}
"""

    final_result_text = call_openai(combine_prompt, max_tokens=1500)

    try:
        final_result = json.loads(final_result_text)
    except Exception:
        final_result = {
            "summary": final_result_text,
            "questions": [],
            "flashcards": []
        }
    final_result['videoId'] = request.video_id
    final_result['title'] = title 

    return final_result