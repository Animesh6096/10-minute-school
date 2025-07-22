#!/usr/bin/env python3
"""
Simple test script to verify the RAG system components
"""
import os
import sys
from dotenv import load_dotenv

def test_environment():
    """Test environment setup"""
    print("🔍 Testing Environment Setup...")
    
    # Load environment variables
    load_dotenv()
    
    # Check Google API Key
    api_key = os.getenv("GOOGLE_API_KEY")
    if api_key:
        print("✅ Google API Key found")
    else:
        print("❌ Google API Key not found in environment variables")
        return False
    
    # Check PDF file
    pdf_path = "./data/HSC26_Bangla_1st_paper.pdf"
    if os.path.exists(pdf_path):
        print("✅ PDF file found")
    else:
        print("❌ PDF file not found. Please place 'HSC26_Bangla_1st_paper.pdf' in the data/ directory")
        return False
    
    # Check vector database
    db_path = "./chroma_db"
    if os.path.exists(db_path):
        print("✅ Vector database directory exists")
    else:
        print("⚠️ Vector database not found. Run 'python ingest.py' first")
    
    return True

def test_imports():
    """Test required package imports"""
    print("\n📦 Testing Package Imports...")
    
    required_packages = [
        ('fastapi', 'FastAPI'),
        ('langchain', 'LangChain'),
        ('langchain_google_genai', 'LangChain Google GenAI'),
        ('chromadb', 'ChromaDB'),
        ('PyMuPDF', 'PyMuPDF'),
        ('dotenv', 'Python DotEnv')
    ]
    
    missing_packages = []
    
    for package, name in required_packages:
        try:
            __import__(package)
            print(f"✅ {name} imported successfully")
        except ImportError:
            print(f"❌ {name} import failed")
            missing_packages.append(package)
    
    if missing_packages:
        print(f"\n❌ Missing packages: {', '.join(missing_packages)}")
        print("Run: pip install -r requirements.txt")
        return False
    
    return True

def test_api_connection():
    """Test Google API connection"""
    print("\n🌐 Testing Google API Connection...")
    
    try:
        from langchain_google_genai import GoogleGenerativeAIEmbeddings
        
        api_key = os.getenv("GOOGLE_API_KEY")
        embeddings = GoogleGenerativeAIEmbeddings(
            model="models/embedding-001",
            google_api_key=api_key
        )
        
        # Test embedding
        test_text = "This is a test"
        embedding = embeddings.embed_query(test_text)
        
        if embedding and len(embedding) > 0:
            print(f"✅ Google Embedding API working (dimension: {len(embedding)})")
            return True
        else:
            print("❌ Google Embedding API returned empty result")
            return False
            
    except Exception as e:
        print(f"❌ Google API connection failed: {str(e)}")
        return False

def main():
    """Main test function"""
    print("🚀 Starting RAG System Tests...\n")
    
    tests = [
        test_environment,
        test_imports,
        test_api_connection
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
        print()
    
    print("="*50)
    print(f"Tests Results: {passed}/{total} passed")
    
    if passed == total:
        print("🎉 All tests passed! System is ready to use.")
        print("\nNext steps:")
        print("1. Run 'python ingest.py' to process documents")
        print("2. Run 'python main.py' to start the API server")
        print("3. Run 'python evaluate.py' to test performance")
    else:
        print("❌ Some tests failed. Please fix the issues above.")
        sys.exit(1)

if __name__ == "__main__":
    main()
