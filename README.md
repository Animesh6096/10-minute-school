# Multilingual RAG System for HSC Bangla Literature

A comprehensive Retrieval-Augmented Generation (RAG) system capable of answering questions in both Bengali (বাংলা) and English about HSC Bangla literature. The system extracts knowledge from PDF documents and provides contextually accurate answers using Google's Gemini Pro and embedding models.

## 🌟 Features

- **Multilingual Support**: Handles queries in both Bengali and English
- **Document Processing**: Sophisticated PDF text extraction and cleaning
- **Semantic Search**: Vector-based document retrieval using Google's embedding model
- **Conversation Memory**: Maintains short-term conversation context
- **REST API**: FastAPI-based backend with interactive documentation
- **Modern UI**: React frontend with Tailwind CSS and responsive design
- **Evaluation System**: Built-in metrics for groundedness and relevance
- **Real-time Chat**: WebSocket-ready chat interface

## 🏗️ System Architecture

```
Frontend (React + Vite)
        ↓
Backend API (FastAPI)
        ↓
Vector Database (ChromaDB)
        ↓
Google Gemini Pro + Embedding Models
```

### Data Flow
1. **Offline Processing**: PDF → Text Extraction → Cleaning → Chunking → Embedding → Vector Storage
2. **Online Query**: User Query → Embedding → Similarity Search → Context Retrieval → LLM Generation → Response

## 🛠️ Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | React + Vite + Tailwind CSS | Modern, responsive user interface |
| **Backend** | Python + FastAPI | High-performance API server |
| **AI Orchestration** | LangChain | RAG pipeline management |
| **PDF Processing** | PyMuPDF | Robust text extraction |
| **Vector Database** | ChromaDB | Document embeddings storage |
| **Embeddings** | Google Embedding-001 | Multilingual semantic understanding |
| **LLM** | Google Gemini Pro | Answer generation |
| **Evaluation** | Custom metrics | System performance assessment |

## 📁 Project Structure

```
multilingual-rag-system/
├── backend/
│   ├── data/                 # PDF documents storage
│   ├── chroma_db/           # Vector database storage
│   ├── ingest.py            # Document processing pipeline
│   ├── main.py              # FastAPI application
│   ├── evaluate.py          # Evaluation system
│   ├── requirements.txt     # Python dependencies
│   ├── .env.example         # Environment variables template
│   └── setup.sh            # Backend setup script
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Chat.jsx    # Main chat interface
│   │   │   └── Header.jsx  # Application header
│   │   ├── App.jsx         # Main application
│   │   └── index.css       # Tailwind CSS styles
│   ├── package.json        # Frontend dependencies
│   └── tailwind.config.js  # Tailwind configuration
├── README.md               # This file
└── evaluation_results.json # System performance metrics
```

## 🚀 Setup Guide

### Prerequisites

- Python 3.8+
- Node.js 16+
- Google API Key (Gemini Pro access)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Run setup script:**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env file and add your GOOGLE_API_KEY
   ```

4. **Place your PDF document:**
   ```bash
   # Copy HSC26_Bangla_1st_paper.pdf to backend/data/ directory
   cp path/to/HSC26_Bangla_1st_paper.pdf data/
   ```

5. **Run document ingestion:**
   ```bash
   source venv/bin/activate
   python ingest.py
   ```

6. **Start the API server:**
   ```bash
   python main.py
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## 📊 Sample Queries and Outputs

### Bengali Queries

**Query:** অনুপমের ভাষায় সুপুরুষ কাকে বলা হয়েছে?
**Expected Answer:** শুম্ভুনাথ
**System Response:** [Based on document analysis]

**Query:** কাকে অনুপমের ভাগ্য দেবতা বলে উল্লেখ করা হয়েছে?
**Expected Answer:** মামাকে
**System Response:** [Based on document analysis]

**Query:** বিয়ের সময় কল্যাণীর প্রকৃত বয়স কত ছিল?
**Expected Answer:** ১৫ বছর
**System Response:** [Based on document analysis]

### English Queries

**Query:** Who is described as a good man according to Anupam?
**Expected Answer:** Shumbhunath
**System Response:** [Based on document analysis]

**Query:** What was Kalyani's actual age at the time of marriage?
**Expected Answer:** 15 years
**System Response:** [Based on document analysis]

## 🔧 API Documentation

### Main Endpoints

#### POST `/chat`
Process user queries and return AI-generated responses.

**Request:**
```json
{
  "query": "আপনার প্রশ্ন",
  "language": "auto"  // "bn", "en", or "auto"
}
```

**Response:**
```json
{
  "answer": "AI generated response",
  "context_chunks": ["relevant document chunks"],
  "confidence_score": 0.85,
  "metadata": {
    "detected_language": "bn",
    "num_sources": 3,
    "timestamp": "2024-01-15T10:30:00",
    "source_pages": [1, 5, 12]
  }
}
```

#### GET `/health`
System health check with component status.

#### GET `/stats`
System statistics including document count and query history.

## 📈 Evaluation Metrics

The system includes comprehensive evaluation metrics:

### Performance Metrics

- **Relevance Score**: Cosine similarity between query and retrieved documents
- **Groundedness Score**: How well answers are supported by retrieved context
- **Exact Match Accuracy**: Presence of expected answers in retrieved context

### Example Evaluation Results

```json
{
  "total_cases": 5,
  "avg_relevance": 0.82,
  "avg_groundedness": 0.75,
  "exact_match_accuracy": 0.80,
  "recommendations": [
    "System performance looks good! ✅"
  ]
}
```

### Running Evaluation

```bash
cd backend
python evaluate.py
```

## ❓ Technical Implementation Answers

### 1. Text Extraction Method

**Method Used:** PyMuPDF via `langchain_community.document_loaders.PyMuPDFLoader`

**Why Chosen:**
- Exceptional handling of Bengali Unicode characters (যুক্তাক্ষর)
- Robust parsing of complex PDF layouts
- Better performance than alternatives like PyPDF2

**Formatting Challenges:**
- Incorrect line breaks in multi-column layouts
- Header/footer text mixed with main content
- Unicode normalization issues for Bengali text

**Solutions Implemented:**
- Post-extraction text cleaning with regex patterns
- Bengali-specific character normalization
- Header/footer removal using pattern matching

### 2. Chunking Strategy

**Strategy:** `RecursiveCharacterTextSplitter` from LangChain

**Configuration:**
- Chunk size: 1000 characters
- Overlap: 100 characters
- Custom separators: `["\n\n", "\n", "। ", ". ", "? ", "! ", "; ", ", ", " ", ""]`

**Why This Works Well:**
- Semantic-aware splitting preserves complete thoughts
- Bengali sentence boundaries (।) are respected
- Overlap ensures context continuity across chunks
- Hierarchical splitting maintains document structure

### 3. Embedding Model

**Model:** Google's `text-embedding-001`

**Why Chosen:**
- State-of-the-art multilingual capabilities
- Optimized for Bengali and English
- High-dimensional semantic representation
- Excellent retrieval performance

**Semantic Capture Method:**
- Transforms text into 768-dimensional vectors
- Similar concepts cluster in vector space
- Captures contextual meaning beyond keywords
- Enables cross-lingual semantic similarity

### 4. Similarity Comparison

**Method:** Cosine Similarity with ChromaDB

**Storage Setup:**
- Vector embeddings stored in ChromaDB
- Persistent local storage for development
- Automatic indexing for fast retrieval

**Why Cosine Similarity:**
- Measures semantic direction, not magnitude
- Effective for high-dimensional embeddings
- Normalized comparison across different text lengths
- Industry standard for semantic search

### 5. Meaningful Query Comparison

**Process:**
1. Query and documents embedded by same model
2. Vectors exist in shared semantic space
3. Similarity threshold filtering (0.6)
4. Top-k retrieval with score ranking

**Handling Vague Queries:**
- **Problem:** "What about Anupam?" returns generic results
- **Impact:** Poor retrieval leads to unhelpful answers
- **Mitigation Strategies:**
  - Conversation memory for context
  - Query expansion techniques
  - Multi-query retrieval for broader coverage

### 6. Result Relevance Analysis

**Current Performance:**
- High accuracy for specific factual queries
- Good multilingual understanding
- Effective context preservation

**Potential Improvements:**
- **Better Chunking:** Experiment with semantic chunking
- **Advanced Retrieval:** Implement hybrid search (vector + keyword)
- **Re-ranking:** Add neural re-ranker for better relevance
- **Query Enhancement:** Use query expansion and reformulation
- **Larger Dataset:** Include more comprehensive literature corpus

## 🚦 Getting Started - Quick Commands

```bash
# Clone and setup
git clone <your-repo-url>
cd multilingual-rag-system

# Backend setup
cd backend
chmod +x setup.sh && ./setup.sh
source venv/bin/activate
# Add your GOOGLE_API_KEY to .env
# Place PDF in data/ directory
python ingest.py
python main.py &

# Frontend setup (in new terminal)
cd frontend
npm install
npm run dev

# Visit http://localhost:5173
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎯 Future Enhancements

- [ ] WebSocket support for real-time streaming
- [ ] Multiple document support
- [ ] Advanced conversation memory
- [ ] Voice input/output capabilities
- [ ] Mobile responsive improvements
- [ ] Docker containerization
- [ ] Production deployment guides
- [ ] Multi-model support (Ollama, OpenAI)
- [ ] Advanced evaluation metrics
- [ ] Performance monitoring dashboard

## 📞 Support

For questions or support, please open an issue on GitHub or contact the development team.

---

**Developed with ❤️ for HSC Bangla Literature Students**
