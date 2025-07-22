#!/bin/bash

# Multilingual RAG System Startup Script
# This script sets up and runs both backend and frontend

echo "🚀 Starting Multilingual RAG System..."
echo "======================================"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "README.md" ] || [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    print_error "Please run this script from the root of the multilingual-rag-system directory"
    exit 1
fi

print_status "Setting up backend..."

# Backend setup
cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    print_status "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
print_status "Activating virtual environment..."
source venv/bin/activate

# Install requirements if needed
if [ ! -f ".requirements_installed" ]; then
    print_status "Installing Python dependencies..."
    pip install -r requirements.txt
    if [ $? -eq 0 ]; then
        touch .requirements_installed
        print_success "Python dependencies installed"
    else
        print_error "Failed to install Python dependencies"
        exit 1
    fi
else
    print_success "Python dependencies already installed"
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    print_warning ".env file not found. Creating from template..."
    cp .env.example .env
    print_warning "Please edit .env file and add your GOOGLE_API_KEY"
    echo ""
    echo "You can get your API key from: https://makersuite.google.com/app/apikey"
    echo ""
    read -p "Press Enter after you've added your API key to continue..."
fi

# Check if PDF exists
if [ ! -f "data/HSC26_Bangla_1st_paper.pdf" ]; then
    print_warning "PDF file not found in data/ directory"
    print_warning "Please place 'HSC26_Bangla_1st_paper.pdf' in the backend/data/ directory"
    echo ""
    read -p "Press Enter after you've added the PDF file to continue..."
fi

# Check if vector database exists
if [ ! -d "chroma_db" ]; then
    print_status "Vector database not found. Running document ingestion..."
    python ingest.py
    if [ $? -eq 0 ]; then
        print_success "Document ingestion completed"
    else
        print_error "Document ingestion failed"
        exit 1
    fi
else
    print_success "Vector database already exists"
fi

# Test the setup
print_status "Testing system setup..."
python test_setup.py
if [ $? -ne 0 ]; then
    print_error "System test failed. Please check the errors above."
    exit 1
fi

print_success "Backend setup complete!"

# Start backend server in background
print_status "Starting backend server..."
python main.py &
BACKEND_PID=$!

# Wait a moment for server to start
sleep 3

# Check if backend is running
if kill -0 $BACKEND_PID 2>/dev/null; then
    print_success "Backend server started (PID: $BACKEND_PID)"
else
    print_error "Failed to start backend server"
    exit 1
fi

# Frontend setup
cd ../frontend

print_status "Setting up frontend..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    print_status "Installing frontend dependencies..."
    npm install
    if [ $? -eq 0 ]; then
        print_success "Frontend dependencies installed"
    else
        print_error "Failed to install frontend dependencies"
        kill $BACKEND_PID
        exit 1
    fi
else
    print_success "Frontend dependencies already installed"
fi

# Start frontend server
print_status "Starting frontend development server..."
npm run dev &
FRONTEND_PID=$!

# Wait for both servers to be ready
sleep 5

echo ""
print_success "🎉 System startup complete!"
echo ""
echo "Available URLs:"
echo "• Frontend Application: http://localhost:5173"
echo "• Backend API: http://localhost:8000"
echo "• API Documentation: http://localhost:8000/docs"
echo ""
echo "Sample queries to test:"
echo "• অনুপমের ভাষায় সুপুরুষ কাকে বলা হয়েছে?"
echo "• Who is described as a good man according to Anupam?"
echo "• বিয়ের সময় কল্যাণীর প্রকৃত বয়স কত ছিল?"
echo ""
echo "Process IDs:"
echo "• Backend PID: $BACKEND_PID"
echo "• Frontend PID: $FRONTEND_PID"
echo ""
echo "To stop the system:"
echo "• Press Ctrl+C to stop this script"
echo "• Or run: kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "Monitoring logs... (Press Ctrl+C to exit)"

# Function to cleanup on exit
cleanup() {
    echo ""
    print_status "Shutting down system..."
    
    if kill -0 $BACKEND_PID 2>/dev/null; then
        kill $BACKEND_PID
        print_success "Backend server stopped"
    fi
    
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        kill $FRONTEND_PID
        print_success "Frontend server stopped"
    fi
    
    print_success "System shutdown complete"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait
