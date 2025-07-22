import os
import re
from typing import List, Dict
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.schema import Document
from dotenv import load_dotenv
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

class DocumentProcessor:
    """Handles PDF loading, text cleaning, and preprocessing"""
    
    def __init__(self):
        self.google_api_key = os.getenv("GOOGLE_API_KEY")
        if not self.google_api_key:
            raise ValueError("GOOGLE_API_KEY not found in environment variables")
    
    def clean_text(self, text: str) -> str:
        """Clean and preprocess extracted text"""
        # Remove excessive whitespace and normalize
        text = re.sub(r'\s+', ' ', text)
        
        # Remove page numbers and common headers/footers
        text = re.sub(r'\n\s*\d+\s*\n', '\n', text)
        text = re.sub(r'HSC.*?Bangla.*?\n', '', text, flags=re.IGNORECASE)
        
        # Fix common PDF extraction issues for Bengali text
        # Remove isolated punctuation marks
        text = re.sub(r'\s+[।,;:]\s+', '। ', text)
        
        # Normalize Bengali spacing
        text = re.sub(r'([।])([^\s])', r'\1 \2', text)
        
        # Remove excessive line breaks
        text = re.sub(r'\n{3,}', '\n\n', text)
        
        return text.strip()
    
    def load_and_process_pdf(self, pdf_path: str) -> List[Document]:
        """Load PDF and return processed documents"""
        try:
            logger.info(f"Loading PDF from: {pdf_path}")
            loader = PyPDFLoader(pdf_path)
            documents = loader.load()
            
            logger.info(f"Loaded {len(documents)} pages from PDF")
            
            # Clean and preprocess text
            processed_docs = []
            for i, doc in enumerate(documents):
                cleaned_text = self.clean_text(doc.page_content)
                if cleaned_text:  # Only keep non-empty pages
                    doc.page_content = cleaned_text
                    doc.metadata['page'] = i + 1
                    doc.metadata['source'] = pdf_path
                    processed_docs.append(doc)
            
            logger.info(f"Processed {len(processed_docs)} pages with content")
            return processed_docs
            
        except Exception as e:
            logger.error(f"Error loading PDF: {str(e)}")
            raise
    
    def load_and_process_text(self, text_path: str) -> List[Document]:
        """Load text file and return processed document"""
        try:
            logger.info(f"Loading text file from: {text_path}")
            with open(text_path, 'r', encoding='utf-8') as file:
                text_content = file.read()
            
            cleaned_text = self.clean_text(text_content)
            if cleaned_text:
                doc = Document(
                    page_content=cleaned_text,
                    metadata={
                        'source': text_path,
                        'type': 'text_file'
                    }
                )
                logger.info(f"Processed text file with {len(cleaned_text)} characters")
                return [doc]
            else:
                logger.warning("Text file was empty after cleaning")
                return []
                
        except Exception as e:
            logger.error(f"Error loading text file: {str(e)}")
            raise
    
    def load_documents_from_directory(self, directory_path: str) -> List[Document]:
        """Load all supported documents from a directory"""
        documents = []
        
        if not os.path.exists(directory_path):
            logger.error(f"Directory not found: {directory_path}")
            return documents
        
        supported_extensions = {'.pdf', '.txt', '.md'}
        
        for filename in os.listdir(directory_path):
            file_path = os.path.join(directory_path, filename)
            if os.path.isfile(file_path):
                file_ext = os.path.splitext(filename)[1].lower()
                
                try:
                    if file_ext == '.pdf':
                        docs = self.load_and_process_pdf(file_path)
                        documents.extend(docs)
                    elif file_ext in {'.txt', '.md'}:
                        docs = self.load_and_process_text(file_path)
                        documents.extend(docs)
                    else:
                        logger.info(f"Skipping unsupported file: {filename}")
                        
                except Exception as e:
                    logger.error(f"Error processing {filename}: {str(e)}")
                    continue
        
        logger.info(f"Loaded {len(documents)} documents from directory")
        return documents

class DocumentChunker:
    """Handles document chunking with semantic awareness"""
    
    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 100):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        
        # Configure text splitter for Bengali and English
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            length_function=len,
            separators=[
                "\n\n",  # Paragraph breaks
                "\n",    # Line breaks
                "। ",    # Bengali sentence endings
                ". ",    # English sentence endings
                "? ",    # Questions
                "! ",    # Exclamations
                "; ",    # Semicolons
                ", ",    # Commas
                " ",     # Spaces
                ""       # Characters
            ]
        )
    
    def chunk_documents(self, documents: List[Document]) -> List[Document]:
        """Split documents into chunks"""
        logger.info(f"Chunking {len(documents)} documents")
        chunks = self.text_splitter.split_documents(documents)
        
        # Add chunk metadata
        for i, chunk in enumerate(chunks):
            chunk.metadata['chunk_id'] = i
            chunk.metadata['chunk_size'] = len(chunk.page_content)
        
        logger.info(f"Created {len(chunks)} chunks")
        return chunks

class VectorStoreManager:
    """Manages vector database operations"""
    
    def __init__(self, persist_directory: str = "./chroma_db"):
        self.persist_directory = persist_directory
        self.google_api_key = os.getenv("GOOGLE_API_KEY")
        
        if not self.google_api_key:
            raise ValueError("GOOGLE_API_KEY not found in environment variables")
        
        # Initialize embedding model
        self.embeddings = GoogleGenerativeAIEmbeddings(
            model="models/text-embedding-004",
            google_api_key=self.google_api_key
        )
    
    def create_vector_store(self, chunks: List[Document]) -> Chroma:
        """Create and persist vector store"""
        logger.info(f"Creating vector store with {len(chunks)} chunks")
        
        # Create vector store
        vectorstore = Chroma.from_documents(
            documents=chunks,
            embedding=self.embeddings,
            persist_directory=self.persist_directory
        )
        
        logger.info(f"Vector store created and saved to {self.persist_directory}")
        return vectorstore
    
    def load_vector_store(self) -> Chroma:
        """Load existing vector store"""
        if not os.path.exists(self.persist_directory):
            raise FileNotFoundError(f"Vector store not found at {self.persist_directory}")
        
        vectorstore = Chroma(
            persist_directory=self.persist_directory,
            embedding_function=self.embeddings
        )
        
        logger.info(f"Vector store loaded from {self.persist_directory}")
        return vectorstore

def main():
    """Main ingestion pipeline"""
    # Configuration
    DOCUMENTS_PATH = os.getenv("DOCUMENTS_PATH", "./documents")
    CHUNK_SIZE = 1000
    CHUNK_OVERLAP = 100
    PERSIST_DIR = os.getenv("CHROMA_DB_PATH", "./chroma_db")
    
    try:
        # Initialize components
        processor = DocumentProcessor()
        chunker = DocumentChunker(chunk_size=CHUNK_SIZE, chunk_overlap=CHUNK_OVERLAP)
        vector_manager = VectorStoreManager(persist_directory=PERSIST_DIR)
        
        # Check if documents directory exists
        if not os.path.exists(DOCUMENTS_PATH):
            logger.error(f"Documents directory not found at {DOCUMENTS_PATH}")
            logger.info("Please create a documents directory and add your PDF/text files")
            return
        
        # Process pipeline
        logger.info("Starting document ingestion pipeline...")
        
        # Step 1: Load and process all documents from directory
        documents = processor.load_documents_from_directory(DOCUMENTS_PATH)
        
        if not documents:
            logger.error("No documents were loaded. Please check your documents directory.")
            return
        
        # Step 2: Chunk documents
        chunks = chunker.chunk_documents(documents)
        
        # Step 3: Create vector store
        vectorstore = vector_manager.create_vector_store(chunks)
        
        logger.info("✅ Document ingestion completed successfully!")
        logger.info(f"📚 Total chunks created: {len(chunks)}")
        logger.info(f"💾 Vector store saved to: {PERSIST_DIR}")
        
        # Test retrieval
        logger.info("Testing retrieval...")
        retriever = vectorstore.as_retriever(search_kwargs={"k": 3})
        test_query = "অনুপমের ভাষায় সুপুরুষ কাকে বলা হয়েছে?"
        results = retriever.get_relevant_documents(test_query)
        
        logger.info(f"Test query returned {len(results)} documents")
        for i, doc in enumerate(results):
            logger.info(f"Document {i+1}: {doc.page_content[:100]}...")
        
    except Exception as e:
        logger.error(f"Error in ingestion pipeline: {str(e)}")
        raise

if __name__ == "__main__":
    main()
