import os
import json
import re
import unicodedata
from typing import List, Dict, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_community.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain.schema import Document
from dotenv import load_dotenv
import logging
from datetime import datetime

# Load environment variables
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class BengaliTextHelper:
    """Enhanced helper class for proper Bengali text processing in story context"""
    
    @staticmethod
    def normalize_bengali_text(text: str) -> str:
        """Enhanced Bengali Unicode normalization for story content"""
        # Normalize Unicode to NFC (Canonical Decomposition, followed by Canonical Composition)
        text = unicodedata.normalize('NFC', text)
        
        # Fix broken Bengali conjuncts commonly found in PDFs
        conjunct_fixes = {
            # Fix র্ + অন্য অক্ষর (র্ followed by other characters)
            'র্ি': 'রি',      # র্ি -> রি  
            'র্ব্': 'র্ব',      # র্ব্ -> র্ব (remove extra halant)
            'র্ন': 'রন',      # র্ন -> রন
            'র্ত': 'রত',      # র্ত -> রত
            'র্চ': 'রচ',      # র্চ -> রচ
            'র্ক': 'রক',      # র্ক -> রক
            'র্ম': 'রম',      # র্ম -> রম
            'র্প': 'রপ',      # র্প -> রপ
            'র্ল': 'রল',      # র্ল -> রল
            'র্স': 'রস',      # র্স -> রস
            'র্গ': 'রগ',      # র্গ -> রগ
            'র্থ': 'রথ',      # র্থ -> রথ
            'র্ভ': 'রভ',      # র্ভ -> রভ
            'র্দ': 'রদ',      # র্দ -> রদ
            'র্জ': 'রজ',      # র্জ -> রজ
            
            # Clean up zero-width characters
            '\u200c': '',     # Remove ZWNJ (Zero Width Non-Joiner)
            '\u200d': '',     # Remove ZWJ (Zero Width Joiner)
            '\ufeff': '',     # Remove BOM (Byte Order Mark)
        }
        
        # Apply fixes
        for broken, fixed in conjunct_fixes.items():
            text = text.replace(broken, fixed)
        
        # Clean up extra whitespace
        text = re.sub(r'\s+', ' ', text)
        text = text.strip()
        
        return text
    
    @staticmethod
    def extract_character_info(context: str, character_name: str) -> str:
        """Extract information about a specific character from story context"""
        # This method can be enhanced to extract character-specific information
        # For now, it returns the context as-is but could be made smarter
        return context

# Pydantic models
class QueryRequest(BaseModel):
    query: str
    language: Optional[str] = "auto"  # "en", "bn", or "auto"

class QueryResponse(BaseModel):
    answer: str
    context_chunks: List[str]
    confidence_score: Optional[float] = None
    metadata: Dict

class ConversationMemory:
    """Simple conversation memory to maintain short-term context"""
    
    def __init__(self, max_history: int = 5):
        self.max_history = max_history
        self.history = []
    
    def add_exchange(self, query: str, answer: str):
        """Add a query-answer pair to history"""
        self.history.append({
            "query": query,
            "answer": answer,
            "timestamp": datetime.now().isoformat()
        })
        
        # Keep only recent history
        if len(self.history) > self.max_history:
            self.history = self.history[-self.max_history:]
    
    def get_context(self) -> str:
        """Get formatted conversation history"""
        if not self.history:
            return ""
        
        context = "Previous conversation:\n"
        for exchange in self.history[-3:]:  # Last 3 exchanges
            context += f"Q: {exchange['query']}\nA: {exchange['answer']}\n\n"
        
        return context

class RAGSystem:
    """Main RAG system with multilingual support"""
    
    def __init__(self):
        self.google_api_key = os.getenv("GOOGLE_API_KEY")
        self.persist_directory = os.getenv("CHROMADB_PATH", "./chroma_db_story_focused")  # Use story-focused vector store
        
        if not self.google_api_key:
            raise ValueError("GOOGLE_API_KEY not found in environment variables")
        
        # Initialize components
        self.embeddings = GoogleGenerativeAIEmbeddings(
            model="models/text-embedding-004",
            google_api_key=self.google_api_key
        )
        
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            google_api_key=self.google_api_key,
            temperature=0.7,  # Increased for more creative reasoning
            max_tokens=2048,  # Allow longer responses
            top_p=0.9  # Better diversity in responses
        )
        
        # Load vector store
        self.vectorstore = self._load_vector_store()
        self.retriever = self.vectorstore.as_retriever(
            search_type="similarity_score_threshold",
            search_kwargs={
                "k": 8,  # Get more context for story content
                "score_threshold": 0.3  # Adjusted for story content
            }
        )
        
        # Conversation memory
        self.memory = ConversationMemory()
        
        # Create prompt template
        self.prompt_template = self._create_prompt_template()
        
        # Create QA chain
        self.qa_chain = RetrievalQA.from_chain_type(
            llm=self.llm,
            chain_type="stuff",
            retriever=self.retriever,
            return_source_documents=True,
            chain_type_kwargs={"prompt": self.prompt_template}
        )
    
    def _load_vector_store(self) -> Chroma:
        """Load the vector store"""
        if not os.path.exists(self.persist_directory):
            raise FileNotFoundError(
                f"Vector store not found at {self.persist_directory}. "
                "Please run the ingestion script first."
            )
        
        vectorstore = Chroma(
            persist_directory=self.persist_directory,
            embedding_function=self.embeddings
        )
        
        logger.info("Vector store loaded successfully")
        return vectorstore
    
    def _create_prompt_template(self) -> PromptTemplate:
        """Create a prompt template focused on story comprehension and character analysis"""
        template = """You are an intelligent AI assistant for Bengali literature, specifically expert in Rabindranath Tagore's "Oporichita" (The Stranger) story. Your job is to answer questions based on the story content.

**IMPORTANT LANGUAGE INSTRUCTION:**
- If the question is in Bengali, respond in Bengali
- If the question is in English, respond in English
- Match the language of your response to the language of the question

Your expertise includes:
1. **Story Analysis**: Characters, events, situations from the story
2. **Character Analysis**: Anupam, Kallyani, Shombhunath Sen, Mama (Uncle), and others
3. **Social Context**: Dowry system, marriage, family relationships
4. **Dialogues & Events**: Key events and character conversations
5. **Themes & Messages**: Core message and social criticism

Key Characters:
- **Anupam**: The protagonist, weak personality
- **Kallyani**: The heroine, Shombhunath's daughter  
- **Shombhunath Sen**: Kallyani's father, self-respecting person
- **Mama (Uncle)**: Anupam's guardian, greedy for dowry
- **Binudada**: Anupam's friend
- **Harish**: Another friend of Anupam

Response Guidelines:
✓ Use story context in your answers
✓ Analyze character psychology and behavior
✓ Give clear and concise answers in the appropriate language
✓ Provide story examples when needed
✓ If information is not available, say "This information is not clear in the story"

Context from story:
{context}

Question: {question}

Answer:"""

        return PromptTemplate(
            template=template,
            input_variables=["context", "question"]
        )
    
    def detect_language(self, text: str) -> str:
        """Simple language detection"""
        bengali_chars = set('অআইঈউঊঋএঐওঔকখগঘঙচছজঝঞটঠডঢণতথদধনপফবভমযরলশষসহড়ঢ়য়ৎংঃঁািীুূৃেৈোৌ্')
        bengali_count = sum(1 for char in text if char in bengali_chars)
        
        if bengali_count > len(text) * 0.1:  # More than 10% Bengali characters
            return "bn"
        return "en"
    
    async def query(self, query_text: str, language: str = "auto") -> QueryResponse:
        """Process a query and return response with intelligent reasoning"""
        try:
            # Normalize Bengali text in query
            query_text = BengaliTextHelper.normalize_bengali_text(query_text)
            
            # Detect language if auto
            if language == "auto":
                language = self.detect_language(query_text)
            
            # Get conversation context
            context_history = self.memory.get_context()
            
            # Modify the query input to include conversation history
            enhanced_query = query_text
            if context_history:
                enhanced_query = f"{context_history}\nCurrent question: {query_text}"
            
            # Get response from QA chain
            result = await self.qa_chain.ainvoke({
                "query": enhanced_query
            })
            
            answer = result["result"]
            source_docs = result["source_documents"]
            
            # Normalize Bengali text in answer and context chunks
            answer = BengaliTextHelper.normalize_bengali_text(answer)
            
            # Extract and normalize context chunks
            context_chunks = []
            for doc in source_docs:
                normalized_chunk = BengaliTextHelper.normalize_bengali_text(doc.page_content)
                context_chunks.append(normalized_chunk)
            
            # Let Gemini do the reasoning instead of rigid MCQ extraction
            # Only do basic cleanup
            if answer.strip() == "" or len(answer.strip()) < 5:
                answer = "তথ্যে এই উত্তর পাওয়া যায়নি।"
            
            # Calculate confidence based on answer quality and source relevance
            confidence = 0.8 if len(source_docs) >= 3 and "তথ্যে এই উত্তর পাওয়া যায়নি" not in answer else 0.3
            
            # Prepare metadata
            metadata = {
                "detected_language": language,
                "num_sources": len(source_docs),
                "timestamp": datetime.now().isoformat(),
                "source_pages": [doc.metadata.get("page", "unknown") for doc in source_docs],
                "reasoning_mode": True,
                "gemini_processing": True
            }
            
            # Add to conversation memory
            self.memory.add_exchange(query_text, answer)
            
            return QueryResponse(
                answer=answer,
                context_chunks=context_chunks,
                confidence_score=confidence,
                metadata=metadata
            )
            
        except Exception as e:
            logger.error(f"Error processing query: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")

# Initialize FastAPI app
app = FastAPI(
    title="Multilingual RAG System",
    description="A RAG system that can handle queries in Bengali and English",
    version="1.0.0"
)

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "message": "RAG system is running", 
        "models": {
            "llm": "Google Gemini 1.5-flash",
            "embeddings": "Google text-embedding-004"
        },
        "vector_db": "ChromaDB",
        "documents": "HSC Bangla Literature"
    }

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize RAG system
try:
    rag_system = RAGSystem()
    logger.info("✅ RAG system initialized successfully")
except Exception as e:
    logger.error(f"❌ Failed to initialize RAG system: {str(e)}")
    rag_system = None

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Multilingual RAG System API",
        "status": "healthy" if rag_system else "error",
        "version": "1.0.0"
    }

@app.post("/chat", response_model=QueryResponse)
async def chat(request: QueryRequest):
    """Main chat endpoint for querying the RAG system"""
    if not rag_system:
        raise HTTPException(
            status_code=503, 
            detail="RAG system not initialized. Please check logs and run ingestion first."
        )
    
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    
    try:
        response = await rag_system.query(request.query, request.language)
        return response
    except Exception as e:
        logger.error(f"Chat error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Detailed health check"""
    health_status = {
        "status": "healthy" if rag_system else "unhealthy",
        "timestamp": datetime.now().isoformat(),
        "components": {
            "rag_system": "ok" if rag_system else "error",
            "vector_store": "ok" if rag_system and rag_system.vectorstore else "error",
            "llm": "ok" if rag_system and rag_system.llm else "error"
        }
    }
    
    if rag_system:
        try:
            # Test vector store
            collection_count = rag_system.vectorstore._collection.count()
            health_status["vector_store_documents"] = collection_count
        except:
            health_status["components"]["vector_store"] = "error"
    
    return health_status

@app.get("/stats")
async def get_stats():
    """Get system statistics"""
    if not rag_system:
        raise HTTPException(status_code=503, detail="RAG system not initialized")
    
    try:
        collection_count = rag_system.vectorstore._collection.count()
        
        return {
            "total_documents": collection_count,
            "memory_history_length": len(rag_system.memory.history),
            "last_query_time": rag_system.memory.history[-1]["timestamp"] if rag_system.memory.history else None
        }
    except Exception as e:
        logger.error(f"Stats error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
