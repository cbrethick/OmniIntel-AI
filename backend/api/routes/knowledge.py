"""Knowledge Base Routes"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from rag.retriever import RAGRetriever

router = APIRouter()
rag = RAGRetriever()


class Document(BaseModel):
    content: str
    domain: str = "general"
    metadata: Optional[dict] = {}


@router.post("/add")
async def add_document(doc: Document):
    """Add a document to the knowledge base"""
    await rag.add_documents([{"content": doc.content, "metadata": doc.metadata}], doc.domain)
    return {"message": "Document added successfully"}


@router.post("/search")
async def search_knowledge(query: str, domain: str = "general"):
    """Search the knowledge base"""
    docs = await rag.retrieve(query, domain)
    return {"results": docs, "count": len(docs)}


@router.post("/seed")
async def seed_knowledge():
    """Seed the knowledge base with default content"""
    rag.seed_default_knowledge()
    return {"message": "Knowledge base seeded successfully"}
