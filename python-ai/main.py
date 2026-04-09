from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
from career_model import career_engine

app = FastAPI(title="Arivon AI Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ProfileData(BaseModel):
    skills: List[str]
    interests: List[str]
    goal: str
    favoriteSubjects: List[str]
    strengths: List[str]
    experience: Optional[str] = "Beginner"

@app.post("/analyze-profile")
async def analyze_profile(data: ProfileData):
    try:
        matches = career_engine.calculate_match(data.dict())
        return {"roles": matches}
    except Exception as e:
        print(f"Python processing error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
