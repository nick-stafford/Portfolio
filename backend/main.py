"""
FastAPI backend for Nick's Portfolio AI Chat
Uses Groq API with llama-3.3-70b-versatile model
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import os
from typing import Optional

app = FastAPI(title="Portfolio AI Chat API")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4321", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Groq API configuration
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

# System prompt with Nick's background
SYSTEM_PROMPT = """You are Nick Stafford's AI assistant on his portfolio website. You help visitors learn about Nick's work, skills, and experience.

About Nick:
- AI Solutions Architect & Financial Software Engineer based in Seattle, WA
- 5+ years of experience in software development
- Specializes in building intelligent systems at the intersection of AI and quantitative finance

Key Projects:
1. ConvexityAI - AI-powered stock momentum scanner with Tier 1/2 alert classification, sector rotation analysis, and AI research using Groq's llama-3.3-70b model. Built with Python, Streamlit, Plotly, and SQLite.

2. Tungsten Analysis - Quantitative financial analysis of tungsten-related equities. Features risk-adjusted performance metrics (Sharpe, Sortino, Calmar ratios), correlation analysis, and professional visualizations. Built with Python, Jupyter, Pandas, and Matplotlib.

3. Financial Statement Builder - Automated system that transforms raw financial data into formatted reports using AI.

Technical Skills:
- Languages: Python, TypeScript, React, Node.js, SQL, Apex
- AI/ML: LLM Integration, Prompt Engineering, Vector Databases, RAG Systems
- Financial: Quantitative Analysis, Technical Indicators, Risk Metrics, Portfolio Theory
- Tools: Salesforce, AWS, Docker, Git, FastAPI, Streamlit

Background:
- Solutions Architect / Consultant (2023-Present)
- Salesforce Developer (2020-2023)
- Software Engineer in FinTech (2018-2020)

Be helpful, professional, and concise. If asked about hiring or contacting Nick, encourage them to use the contact form or reach out via LinkedIn (linkedin.com/in/nickastafford23).
"""


class ChatMessage(BaseModel):
    message: str
    conversation_history: Optional[list] = []


class ChatResponse(BaseModel):
    response: str
    success: bool


@app.get("/")
async def root():
    return {"status": "healthy", "service": "Portfolio AI Chat"}


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatMessage):
    """Process a chat message using Groq API"""

    if not GROQ_API_KEY:
        # Try to read from ConvexityAI's .env file
        env_path = "C:/Users/Nick/Projects/ConvexityAI/.env"
        try:
            with open(env_path, "r") as f:
                for line in f:
                    if line.startswith("GROQ_API_KEY="):
                        global GROQ_API_KEY
                        GROQ_API_KEY = line.split("=", 1)[1].strip().strip('"').strip("'")
                        break
        except FileNotFoundError:
            raise HTTPException(
                status_code=500,
                detail="GROQ_API_KEY not configured"
            )

    if not GROQ_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="GROQ_API_KEY not found"
        )

    # Build messages array
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    # Add conversation history
    for msg in request.conversation_history[-10:]:  # Keep last 10 messages
        messages.append(msg)

    # Add current message
    messages.append({"role": "user", "content": request.message})

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                GROQ_API_URL,
                headers={
                    "Authorization": f"Bearer {GROQ_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "llama-3.3-70b-versatile",
                    "messages": messages,
                    "temperature": 0.7,
                    "max_tokens": 1024,
                },
            )

            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Groq API error: {response.text}"
                )

            data = response.json()
            ai_response = data["choices"][0]["message"]["content"]

            return ChatResponse(response=ai_response, success=True)

    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Request timeout")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
