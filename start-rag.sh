#!/bin/bash

# 🎓 10 Minute School - RAG System Startup Script
# Complete setup and startup script for the Bengali Literature Analysis System

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Functions for colored output
print_status() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[✅ SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[⚠️  WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[❌ ERROR]${NC} $1"; }
print_header() { echo -e "${PURPLE}$1${NC}"; }

# Header
echo ""
print_header "🎓 ১০ মিনিট স্কুল - Bengali Literature RAG System"
print_header "==================================================="
echo ""

# Check if running from correct directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    print_error "Please run this script from the project root directory"
    print_error "Expected structure: project_root/backend and project_root/frontend"
    exit 1
fi

# Check prerequisites
print_status "Checking prerequisites..."

# Check Python
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 is required but not installed"
    exit 1
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is required but not installed"
    exit 1
fi

# Check npm
if ! command -v npm &> /dev/null; then
    print_error "npm is required but not installed"
    exit 1
fi

print_success "All prerequisites found"

# ===== BACKEND SETUP =====
print_header "🐍 Setting up Backend Environment..."
cd backend

# Create virtual environment if not exists
if [ ! -d "venv" ]; then
    print_status "Creating Python virtual environment..."
    python3 -m venv venv
    if [ $? -ne 0 ]; then
        print_error "Failed to create virtual environment"
        exit 1
    fi
    print_success "Virtual environment created"
else
    print_success "Virtual environment already exists"
fi

# Activate virtual environment
print_status "Activating virtual environment..."
source venv/bin/activate

# Verify virtual environment is active
if [[ "$VIRTUAL_ENV" == "" ]]; then
    print_error "Failed to activate virtual environment"
    exit 1
fi
print_success "Virtual environment activated"

# Install/update dependencies
print_status "Installing Python dependencies..."
pip install --upgrade pip setuptools wheel -q
pip install -r requirements.txt -q

if [ $? -eq 0 ]; then
    print_success "Python dependencies installed"
else
    print_error "Failed to install Python dependencies"
    exit 1
fi

# Check environment configuration
if [ ! -f ".env" ]; then
    print_warning "Environment file not found. Creating from template..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_success "Environment file created from template"
    else
        echo "GOOGLE_API_KEY=YOUR_API_KEY_HERE" > .env
        echo "DOCUMENTS_PATH=./documents" >> .env
        echo "CHROMA_DB_PATH=./chroma_db" >> .env
        print_success "Environment file created"
    fi
    
    print_warning "⚠️  IMPORTANT: Please edit backend/.env and add your Google API key"
    echo ""
    echo "   Get your API key from: https://makersuite.google.com/app/apikey"
    echo "   Then edit the GOOGLE_API_KEY line in backend/.env"
    echo ""
    read -p "   Press Enter after adding your API key to continue..."
fi

# Verify API key is set
if grep -q "YOUR_API_KEY_HERE" .env; then
    print_warning "Please update your Google API key in backend/.env"
    read -p "Press Enter after updating to continue..."
fi

# Check and build vector database if needed
if [ ! -d "chroma_db_story_focused" ]; then
    print_status "Checking for story documents..."
    
    # Check for PDF files
    found_pdf=false
    for pdf_path in documents/*.pdf data/*.pdf *.pdf; do
        if [ -f "$pdf_path" ]; then
            found_pdf=true
            print_success "Found PDF: $(basename "$pdf_path")"
            break
        fi
    done
    
    if [ "$found_pdf" = false ]; then
        print_warning "No PDF files found in documents directory"
        print_warning "Please add your Bengali literature PDF to backend/documents/"
        read -p "Press Enter after adding PDF files to continue..."
    fi
    
    print_status "Building vector database from documents..."
    python story_focused_processor.py
    
    if [ $? -eq 0 ]; then
        print_success "Vector database built successfully"
    else
        print_error "Failed to build vector database"
        exit 1
    fi
else
    print_success "Vector database already exists"
fi

# Start backend server
print_status "Starting backend server..."
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000 > server.log 2>&1 &
BACKEND_PID=$!

# Wait and verify backend startup
print_status "Waiting for backend to initialize..."
sleep 5

if kill -0 $BACKEND_PID 2>/dev/null; then
    print_success "Backend server started (PID: $BACKEND_PID)"
    print_success "Backend API: http://localhost:8000"
else
    print_error "Backend server failed to start"
    cat server.log
    exit 1
fi

# ===== FRONTEND SETUP =====
print_header "⚛️  Setting up Frontend Environment..."
cd ../frontend

# Install frontend dependencies
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.install_complete" ]; then
    print_status "Installing frontend dependencies..."
    npm install
    
    if [ $? -eq 0 ]; then
        touch node_modules/.install_complete
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

# Wait and verify frontend startup
print_status "Waiting for frontend to initialize..."
sleep 3

if kill -0 $FRONTEND_PID 2>/dev/null; then
    print_success "Frontend server started (PID: $FRONTEND_PID)"
else
    print_error "Frontend server failed to start"
    kill $BACKEND_PID
    exit 1
fi

# ===== SUCCESS MESSAGE =====
echo ""
print_header "🎉 System Started Successfully!"
echo ""
echo -e "${CYAN}🌐 Access Points:${NC}"
echo "   • Frontend Application: http://localhost:5173"
echo "   • Backend API: http://localhost:8000"
echo "   • API Documentation: http://localhost:8000/docs"
echo ""
echo -e "${CYAN}📝 Try These Queries:${NC}"
echo "   • Bengali: অনুপম কেমন চরিত্রের মানুষ?"
echo "   • English: What kind of person is Anupam?"
echo ""
echo -e "${CYAN}💻 Server Information:${NC}"
echo "   • Backend PID: $BACKEND_PID"
echo "   • Frontend PID: $FRONTEND_PID"
echo ""
echo -e "${YELLOW}💡 Press Ctrl+C to stop both servers${NC}"
echo ""

# Cleanup function
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

# Set up signal handling
trap cleanup SIGINT SIGTERM

# Keep script running
while true; do
    sleep 1
    
    # Check if servers are still running
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        print_error "Backend server stopped unexpectedly"
        break
    fi
    
    if ! kill -0 $FRONTEND_PID 2>/dev/null; then
        print_error "Frontend server stopped unexpectedly"
        break
    fi
done
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
if [ ! -d "chroma_db_story_focused" ]; then
    print_warning "Story-focused vector database not found"
    
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
    
    # Run story-focused processing
    print_status "Building story-focused vector database from documents..."
    python story_focused_processor.py
    
    if [ $? -ne 0 ]; then
        print_error "Failed to build story-focused vector database"
        exit 1
    fi
    
    print_success "Story-focused vector database built successfully"
fi

# Start backend server
print_status "Starting backend server..."
python -m uvicorn main:app --reload --port 8000 &
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
