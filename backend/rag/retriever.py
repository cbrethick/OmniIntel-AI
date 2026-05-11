"""
RAG Retriever — ChromaDB + FAISS powered knowledge base
Retrieves relevant documents for context-aware responses
"""
import chromadb
from chromadb.utils import embedding_functions
from sentence_transformers import SentenceTransformer
import logging
import os

logger = logging.getLogger(__name__)


class RAGRetriever:
    def __init__(self, db_path: str = "./chroma_db"):
        self.db_path = db_path
        self.model = SentenceTransformer("all-MiniLM-L6-v2")
        self.client = chromadb.PersistentClient(path=db_path)
        self._init_collections()

    def _init_collections(self):
        """Initialize collections for each intent domain"""
        self.collections = {}
        for domain in ["sales", "support", "care", "general"]:
            self.collections[domain] = self.client.get_or_create_collection(
                name=f"omnibot_{domain}",
                metadata={"hnsw:space": "cosine"},
            )
        logger.info("RAG collections initialized")

    async def retrieve(self, query: str, intent: str, top_k: int = 5) -> list:
        """Retrieve relevant documents for a query"""
        try:
            collection_key = intent if intent in self.collections else "general"
            collection = self.collections[collection_key]

            if collection.count() == 0:
                return []

            results = collection.query(
                query_texts=[query],
                n_results=min(top_k, collection.count()),
            )

            docs = []
            if results and results["documents"]:
                for i, doc in enumerate(results["documents"][0]):
                    docs.append({
                        "content": doc,
                        "metadata": results["metadatas"][0][i] if results["metadatas"] else {},
                        "distance": results["distances"][0][i] if results["distances"] else 1.0,
                    })

            return docs

        except Exception as e:
            logger.error(f"RAG retrieval error: {e}")
            return []

    async def add_documents(self, documents: list, domain: str = "general"):
        """Add documents to the knowledge base"""
        if domain not in self.collections:
            domain = "general"

        collection = self.collections[domain]
        
        ids = [f"{domain}_{i}_{hash(doc['content'])}" for i, doc in enumerate(documents)]
        contents = [doc["content"] for doc in documents]
        metadatas = [doc.get("metadata", {}) for doc in documents]

        collection.upsert(
            ids=ids,
            documents=contents,
            metadatas=metadatas,
        )
        logger.info(f"Added {len(documents)} documents to {domain} collection")

    def seed_default_knowledge(self):
        """Seed with default knowledge base content"""
        sales_docs = [
            {"content": "OmniBot AI pricing starts at $49/month for Starter, $149/month for Pro, and $399/month for Enterprise.", "metadata": {"type": "pricing"}},
            {"content": "Our Sales Bot can increase conversion rates by up to 35% through intelligent lead qualification and personalized follow-ups.", "metadata": {"type": "benefit"}},
            {"content": "We offer a 14-day free trial with no credit card required. You can cancel anytime.", "metadata": {"type": "trial"}},
            {"content": "OmniBot integrates with Salesforce, HubSpot, Pipedrive, and all major CRM platforms.", "metadata": {"type": "integration"}},
        ]
        support_docs = [
            {"content": "To reset your API key: Go to Settings > API > Regenerate Key. This will invalidate your old key immediately.", "metadata": {"type": "howto"}},
            {"content": "Webhook configuration: Navigate to Settings > Integrations > Webhooks. Add your endpoint URL and select events.", "metadata": {"type": "howto"}},
            {"content": "If the bot is not responding, check: 1) API key validity, 2) Rate limits, 3) Network connectivity, 4) Service status at status.omnibot.ai", "metadata": {"type": "troubleshoot"}},
        ]
        care_docs = [
            {"content": "Refund policy: Full refunds available within 30 days of purchase. Contact billing@omnibot.ai with your order ID.", "metadata": {"type": "policy"}},
            {"content": "Billing cycles run monthly on the date of subscription. Annual plans receive 20% discount.", "metadata": {"type": "billing"}},
            {"content": "To cancel your subscription: Settings > Billing > Cancel Plan. Your access continues until the end of the billing period.", "metadata": {"type": "policy"}},
        ]

        import asyncio
        loop = asyncio.new_event_loop()
        loop.run_until_complete(self.add_documents(sales_docs, "sales"))
        loop.run_until_complete(self.add_documents(support_docs, "support"))
        loop.run_until_complete(self.add_documents(care_docs, "care"))
        loop.close()
        logger.info("Default knowledge base seeded")
