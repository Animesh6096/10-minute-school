# Deployment & Troubleshooting Guide

## 🚀 Quick Start

The fastest way to get started is using the automated startup script:

```bash
chmod +x start.sh
./start.sh
```

This script will:
1. Set up the Python virtual environment
2. Install all dependencies
3. Configure environment variables
4. Process your PDF document
5. Start both backend and frontend servers
6. Open the application in your browser

## 🔧 Manual Setup

If you prefer manual setup or encounter issues with the automated script:

### Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your GOOGLE_API_KEY

# Place PDF in data directory
mkdir -p data
# Copy your HSC26_Bangla_1st_paper.pdf to data/

# Process documents
python ingest.py

# Test setup
python test_setup.py

# Start API server
python main.py
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🐛 Common Issues & Solutions

### 1. Google API Key Issues

**Problem:** Authentication errors or API key not found

**Solutions:**
- Verify your API key at https://makersuite.google.com/app/apikey
- Ensure the key is correctly added to `.env` file
- Check for extra spaces or quotes around the key
- Verify the key has access to Gemini Pro and Embedding models

### 2. PDF Processing Errors

**Problem:** Text extraction fails or produces poor results

**Solutions:**
- Ensure PDF file is placed in `backend/data/` directory
- Check PDF file isn't corrupted or password-protected
- Verify filename exactly matches `HSC26_Bangla_1st_paper.pdf`
- Try re-downloading the PDF if issues persist

### 3. Vector Database Issues

**Problem:** ChromaDB initialization fails

**Solutions:**
- Delete `chroma_db` folder and re-run ingestion
- Check disk space availability
- Verify Python dependencies are correctly installed
- Run `pip install chromadb --upgrade`

### 4. Frontend Build Issues

**Problem:** React app fails to start or build

**Solutions:**
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version (16+ required)
- Update npm: `npm install -g npm@latest`
- Clear npm cache: `npm cache clean --force`

### 5. CORS Issues

**Problem:** Frontend can't connect to backend

**Solutions:**
- Ensure backend is running on port 8000
- Check CORS middleware is enabled in `main.py`
- Verify frontend is making requests to correct URL
- Try clearing browser cache

### 6. Memory Issues

**Problem:** System runs out of memory during processing

**Solutions:**
- Reduce chunk size in `ingest.py`
- Process documents in smaller batches
- Increase system RAM if possible
- Use lighter embedding models

### 7. Bengali Text Display Issues

**Problem:** Bengali characters appear as boxes or incorrect fonts

**Solutions:**
- Install Bengali fonts: `fc-cache -fv`
- Check browser supports Bengali Unicode
- Verify CSS includes Bengali font fallbacks
- Test with different browsers

## 🔍 Testing Your Setup

### Backend Health Check

```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "components": {
    "rag_system": "ok",
    "vector_store": "ok",
    "llm": "ok"
  }
}
```

### Test Query

```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"query": "অনুপমের ভাষায় সুপুরুষ কাকে বলা হয়েছে?"}'
```

### Frontend Test

- Navigate to http://localhost:5173
- Verify Bengali text displays correctly
- Test sample queries
- Check browser console for errors

## 📊 Performance Optimization

### Backend Optimization

1. **Adjust chunk size** in `ingest.py`:
   ```python
   chunker = DocumentChunker(chunk_size=800, chunk_overlap=80)
   ```

2. **Tune retrieval parameters** in `main.py`:
   ```python
   retriever = self.vectorstore.as_retriever(
       search_kwargs={"k": 3, "score_threshold": 0.7}
   )
   ```

3. **Enable caching** for repeated queries
4. **Use SSD storage** for ChromaDB

### Frontend Optimization

1. **Enable React production mode**:
   ```bash
   npm run build
   npm run preview
   ```

2. **Optimize images and assets**
3. **Use service worker for caching**
4. **Implement virtual scrolling for long conversations**

## 🌐 Production Deployment

### Environment Variables for Production

```bash
# Backend .env
GOOGLE_API_KEY=your_production_key
CHROMADB_PATH=./chroma_db
ENVIRONMENT=production
LOG_LEVEL=INFO

# Frontend environment
VITE_API_URL=https://your-api-domain.com
VITE_ENVIRONMENT=production
```

### Docker Deployment

Create `Dockerfile` for backend:
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["python", "main.py"]
```

### Security Considerations

1. **API Key Security**: Use environment variables, never commit keys
2. **CORS Configuration**: Restrict origins in production
3. **Rate Limiting**: Implement request throttling
4. **Input Validation**: Sanitize user inputs
5. **HTTPS**: Use SSL certificates for production

### Monitoring

1. **Logging**: Configure structured logging
2. **Health Checks**: Implement comprehensive health endpoints
3. **Metrics**: Track query response times and success rates
4. **Error Reporting**: Set up error tracking service

## 📈 Scaling Considerations

### Horizontal Scaling

1. **Load Balancing**: Use nginx or similar
2. **Database Replication**: Replicate ChromaDB
3. **Caching Layer**: Implement Redis for query caching
4. **CDN**: Use CDN for static frontend assets

### Vertical Scaling

1. **Memory**: Increase RAM for larger document collections
2. **CPU**: More cores for parallel processing
3. **Storage**: Fast SSD for vector database
4. **GPU**: Consider GPU acceleration for embeddings

## 🆘 Getting Help

1. **Check Logs**: Both backend and frontend logs
2. **GitHub Issues**: Report bugs on the repository
3. **Documentation**: Refer to component-specific docs
4. **Community**: Ask questions in discussions

### Log Locations

- Backend: Console output and `backend.log`
- Frontend: Browser console (F12)
- System: Check `journalctl` on Linux/macOS

### Debug Mode

Enable debug logging:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

---

**Remember**: Always test changes in a development environment before deploying to production!
