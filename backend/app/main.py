from fastapi import FastAPI, HTTPException
from uuid import uuid4
from fastapi.middleware.cors import CORSMiddleware
from app.database import supabase
from app.agent import run_agent
from app.schema import (
    AgentCreate,
    AgentResponse,
    ChatRequest,
    ChatResponse
)

app = FastAPI(title="Autonomous AI Agent Platform")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # dev ke liye
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 🔹 CREATE AGENT
@app.post("/create-agent", response_model=AgentResponse)
def create_agent(data: AgentCreate):
    agent_id = str(uuid4())

    return AgentResponse(
        agent_id=agent_id,
        embed_url=f"http://localhost:3000/chatbot/{agent_id}"
    )


# 🔹 CHAT WITH AGENT
@app.post("/chat/{agent_id}", response_model=ChatResponse)
def chat(agent_id: str, req: ChatRequest):

    result = (
        supabase
        .table("agents")
        .select("*")
        .eq("agent_id", agent_id)
        .single()
        .execute()
    )

    if not result.data:
        raise HTTPException(status_code=404, detail="Agent not found")

    reply = run_agent(result.data, req.message)

    return ChatResponse(reply=reply)


# from fastapi import FastAPI
# from pydantic import BaseModel
# from uuid import uuid4
# from app.database import supabase
# from app.agent import run_agent

# app = FastAPI(tittle="Autonomous AI Agent Platform")

# class AgentCreate(BaseModel):
#     name: str
#     description: str
#     tone: str

# class ChatRequest(BaseModel):
#     message: str

# @app.post("/create-agent")
# def create_agent(data: AgentCreate):
#     agent_id = str(uuid4())

#     supabase.table("agents").insert({
#         "id": agent_id,
#         "name": data.name,
#         "description": data.description,
#         "tone": data.tone
#     }).execute()

#     return {
#         "agent_id": agent_id,
#         "embed_url": f"http://localhost:3000/chatbot/{agent_id}"
#     }

# @app.post("/chat/{agent_id}")
# def chat(agent_id: str, req: ChatRequest):
#     agent = supabase.table("agents").select("*").eq("id", agent_id).single().execute().data
#     reply = run_agent(agent, req.message)
#     return {"reply": reply}


# # from fastapi import FastAPI
# # from pydantic import BaseModel
# # from chat import ask_agent

# # app = FastAPI(title="Ahmed Malik Autonomous AI Agent")

# # class ChatRequest(BaseModel):
# #     message: str

# # @app.post("/chat")
# # def chat(req: ChatRequest):
# #     reply = ask_agent(req.message)
# #     return {"reply": reply}



