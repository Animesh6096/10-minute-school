#!/bin/bash

# Multilingual RAG System Start Script
# This is the main script to run both backend and frontend

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions for colored output
print_status() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

echo "🚀 Starting Multilingual RAG System..."
echo "======================================"

# Check directory structure
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# ===== BACKEND SETUP =====
print_status "Setting up backend..."
cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    print_status "Creating Python virtual environment..."
    python3 -m venv venv
    if [ $? -ne 0 ]; then
        print_error "Failed to create virtual environment. Check Python installation."
        exit 1
    fi
fi

# Activate virtual environment
print_status "Activating virtual environment..."
source venv/bin/activate

# Check if dependencies are installed
if [ ! -f ".dependencies_installed" ]; then
    print_status "Installing Python dependencies..."
    
    # First upgrade pip
    pip install --upgrade pip setuptools wheel
    
    # Install other dependencies
    print_status "Installing requirements..."
    pip install -r requirements.txt
    
    if [ $? -eq 0 ]; then
        touch .dependencies_installed
        print_success "Dependencies installed successfully"
    else
        print_error "Failed to install dependencies"
        exit 1
    fi
else
    print_success "Dependencies already installed"
fi

# Check if API key is configured
if [ ! -f ".env" ]; then
    print_warning "API key not found. Creating .env file..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
    else
        echo "GOOGLE_API_KEY=YOUR_API_KEY_HERE" > .env
    fi
    print_warning "Please edit backend/.env and add your Google API key"
    echo "You can get an API key from: https://makersuite.google.com/app/apikey"
    read -p "Press Enter after adding your API key to continue..."
fi

# Check if PDF exists and vector database is built
if [ ! -d "chroma_db" ]; then
    print_warning "Vector database not found"
    
    # Check for PDF files
    found_pdf=false
    for pdf_path in documents/*.pdf data/*.pdf *.pdf; do
        if [ -f "$pdf_path" ]; then
            found_pdf=true
            print_status "Found PDF: $pdf_path"
            break
        fi
    done
    
    if [ "$found_pdf" = false ]; then
        print_warning "No PDF files found. Please add HSC Bangla PDF to backend/documents/"
        read -p "Press Enter after adding PDF files to continue..."
    fi
    
    # Run ingestion
    print_status "Building vector database from documents..."
    python ingest.py
    
    if [ $? -ne 0 ]; then
        print_error "Failed to build vector database"
        exit 1
    fi
    
    print_success "Vector database built successfully"
fi

# Start backend server
print_status "Starting backend server..."
python main.py &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Verify backend is running
if kill -0 $BACKEND_PID 2>/dev/null; then
    print_success "Backend server started on http://localhost:8000"
else
    print_error "Failed to start backend server"
    exit 1
fi

# ===== FRONTEND SETUP =====
cd ../frontend

print_status "Setting up frontend..."

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    print_status "Installing frontend dependencies..."
    npm install
    
    if [ $? -ne 0 ]; then
        print_error "Failed to install frontend dependencies"
        kill $BACKEND_PID
        exit 1
    fi
    
    print_success "Frontend dependencies installed"
else
    print_success "Frontend dependencies already installed"
fi

# Start frontend
print_status "Starting frontend development server..."
npm run dev &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 5

# Display success
echo ""
print_success "🎉 System started successfully!"
echo ""
echo "🌐 Access the system at:"
echo "  • Frontend: http://localhost:5173"
echo "  • API Documentation: http://localhost:8000/docs"
echo ""
echo "📝 Example queries:"
echo "  • Bengali: কল্যাণীর পিতার নাম কী?"
echo "  • English: What is the name of Kalyani's father?"
echo ""
echo "💡 Press Ctrl+C to stop the system"

# Cleanup on exit
cleanup() {
    echo ""
    print_status "Shutting down system..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    print_success "System stopped"
    exit 0
}

trap cleanup SIGINT SIGTERM

# Keep running
wait
