# Setup Script for Multilingual RAG System Backend

echo "🚀 Setting up Multilingual RAG System Backend..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

# Create virtual environment
echo "📦 Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "🔌 Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "⬆️ Upgrading pip..."
python -m pip install --upgrade pip

# Install requirements
echo "📚 Installing Python packages..."
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "🔑 Creating .env file..."
    cp .env.example .env
    echo ""
    echo "⚠️  IMPORTANT: Please edit the .env file and add your GOOGLE_API_KEY"
    echo "   You can get your API key from: https://makersuite.google.com/app/apikey"
    echo ""
else
    echo "✅ .env file already exists"
fi

# Create data directory
mkdir -p data

echo ""
echo "✅ Backend setup completed!"
echo ""
echo "Next steps:"
echo "1. Add your Google API key to the .env file"
echo "2. Place your HSC26_Bangla_1st_paper.pdf file in the data/ directory"
echo "3. Run the ingestion script: python ingest.py"
echo "4. Start the API server: python main.py"
echo ""
