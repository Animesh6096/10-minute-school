#!/usr/bin/env python3
"""
Enhanced Story-Focused Document Processor for Bengali Literature
Fixes Bengali encoding issues and focuses on extracting actual story content
"""

import os
import re
import json
import unicodedata
from typing import List, Dict, Tuple, Optional
import fitz  # PyMuPDF for PDF processing
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.schema import Document
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class BengaliTextProcessor:
    """Advanced Bengali text processor with proper Unicode handling"""
    
    @staticmethod
    def fix_bengali_encoding(text: str) -> str:
        """Fix broken Bengali text encoding comprehensively"""
        
        # Step 1: Normalize to NFC (Canonical Decomposition + Composition)
        text = unicodedata.normalize('NFC', text)
        
        # Step 2: Fix common broken conjuncts and characters
        # These are the actual broken patterns we see in the PDF
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
            'র্য': 'র্য',      # Keep as is (this is correct)
            
            # Fix ন্ + অন্য অক্ষর patterns  
            'ন্ত': 'ন্ত',     # Keep correct
            'ন্ধ': 'ন্ধ',     # Keep correct
            'ন্দ': 'ন্দ',     # Keep correct
            'ন্ন': 'ন্ন',     # Keep correct
            
            # Fix ত্ + অন্য অক্ষর patterns
            'ত্ত': 'ত্ত',     # Keep correct
            'ত্র': 'ত্র',     # Keep correct
            'ত্ম': 'ত্ম',     # Keep correct
            
            # Fix ক্ + অন্য অক্ষর patterns
            'ক্ত': 'ক্ত',     # Keep correct
            'ক্র': 'ক্র',     # Keep correct
            'ক্ষ': 'ক্ষ',     # Keep correct
            
            # Fix ল্ + অন্য অক্ষর patterns
            'ল্ল': 'ল্ল',     # Keep correct
            'ল্প': 'ল্প',     # Keep correct
            'ল্ট': 'ল্ট',     # Keep correct
            
            # Fix স্ + অন্য অক্ষর patterns
            'স্ত': 'স্ত',     # Keep correct
            'স্থ': 'স্থ',     # Keep correct
            'স্ব': 'স্ব',     # Keep correct
            'স্ম': 'স্ম',     # Keep correct
            'স্ন': 'স্ন',     # Keep correct
            
            # Clean up zero-width characters
            '\u200c': '',     # Remove ZWNJ (Zero Width Non-Joiner)
            '\u200d': '',     # Remove ZWJ (Zero Width Joiner)
            '\ufeff': '',     # Remove BOM (Byte Order Mark)
        }
        
        # Apply fixes
        for broken, fixed in conjunct_fixes.items():
            text = text.replace(broken, fixed)
        
        # Step 3: Fix specific Bengali character issues
        text = re.sub(r'্([ক-হড়ঢ়য়])', r'\1', text)  # Remove unnecessary halant before consonants
        
        # Step 4: Normalize whitespace
        text = re.sub(r'\s+', ' ', text)
        text = text.strip()
        
        return text
    
    @staticmethod
    def is_story_content(text: str) -> bool:
        """Determine if text is likely story content vs MCQ/metadata"""
        # Story content indicators (including train scene indicators)
        story_indicators = [
            'গল্প', 'কাহিনী', 'চরিত্র', 'নায়ক', 'নায়িকা',
            'বিয়ে', 'বিবাহ', 'অনুপম', 'কল্যাণী', 'শম্ভুনাথ',
            'মামা', 'বাবা', 'মা', 'পিতা', 'মাতা',
            'ঘটনা', 'পরিস্থিতি', 'সংলাপ', 'কথোপকথন',
            'স্টেশন', 'গাড়ি', 'ট্রেন', 'রেল', 'প্ল্যাটফর্ম',
            'যাত্রা', 'ভ্রমণ', 'স্টেশন-মাস্টার', 'টিকিট'
        ]
        
        # MCQ indicators (to exclude)
        mcq_indicators = [
            'প্রশ্ন', 'উত্তর:', '(ক)', '(খ)', '(গ)', '(ঘ)',
            'সঠিক', 'ভুল', 'নিচের কোনটি', 'কোন সালে'
        ]
        
        # Check length (story content should be longer)
        if len(text.strip()) < 50:
            return False
            
        # Count indicators
        story_count = sum(1 for indicator in story_indicators if indicator in text)
        mcq_count = sum(1 for indicator in mcq_indicators if indicator in text)
        
        # If it has MCQ patterns, it's likely not story content
        if mcq_count > 0 and '(ক)' in text:
            return False
            
        # If it has story indicators and is substantial text, it's likely story
        # OR if it contains transportation/journey elements (train scenes)
        transportation_indicators = ['স্টেশন', 'গাড়ি', 'ট্রেন', 'রেল', 'প্ল্যাটফর্ম', 'যাত্রা']
        has_transportation = any(indicator in text for indicator in transportation_indicators)
        
        return story_count > 0 or len(text.strip()) > 200 or has_transportation
    
    @staticmethod
    def clean_story_text(text: str) -> str:
        """Clean and normalize story text"""
        # Fix encoding first
        text = BengaliTextProcessor.fix_bengali_encoding(text)
        
        # Remove page numbers, headers, footers
        text = re.sub(r'পৃষ্ঠা\s*\d+', '', text)
        text = re.sub(r'Page\s*\d+', '', text)
        text = re.sub(r'^\d+\s*$', '', text, flags=re.MULTILINE)
        
        # Remove excessive whitespace but preserve paragraph breaks
        text = re.sub(r'\n\s*\n\s*\n+', '\n\n', text)  # Multiple empty lines -> double line break
        text = re.sub(r'[ \t]+', ' ', text)  # Multiple spaces/tabs -> single space
        text = text.strip()
        
        return text

class StoryFocusedProcessor:
    """Process PDF to extract and properly encode Bengali story content"""
    
    def __init__(self, pdf_path: str):
        self.pdf_path = pdf_path
        self.google_api_key = os.getenv("GOOGLE_API_KEY")
        
        if not self.google_api_key:
            raise ValueError("GOOGLE_API_KEY not found in environment variables")
    
    def extract_story_content(self) -> List[Dict]:
        """Extract story content from PDF with proper Bengali encoding"""
        print(f"📖 Extracting story content from: {self.pdf_path}")
        
        # Open PDF
        pdf_document = fitz.open(self.pdf_path)
        
        story_chunks = []
        page_count = 0
        story_pages = 0
        
        for page_num in range(pdf_document.page_count):
            page = pdf_document[page_num]
            
            # Extract text with better encoding handling
            raw_text = page.get_text(flags=fitz.TEXT_PRESERVE_LIGATURES | fitz.TEXT_PRESERVE_WHITESPACE)
            
            if not raw_text.strip():
                continue
                
            page_count += 1
            
            # Fix Bengali encoding
            fixed_text = BengaliTextProcessor.fix_bengali_encoding(raw_text)
            
            # Check if this is likely story content
            if BengaliTextProcessor.is_story_content(fixed_text):
                # Clean the story text
                clean_text = BengaliTextProcessor.clean_story_text(fixed_text)
                
                if len(clean_text.strip()) > 50:  # Only include substantial content
                    story_chunks.append({
                        "page_number": page_num + 1,
                        "content": clean_text,
                        "content_length": len(clean_text),
                        "content_type": "story"
                    })
                    story_pages += 1
                    print(f"✅ Page {page_num + 1}: Extracted {len(clean_text)} chars of story content")
                else:
                    print(f"⚠️  Page {page_num + 1}: Content too short after cleaning")
            else:
                print(f"⏭️  Page {page_num + 1}: Skipped (MCQ/metadata content)")
        
        pdf_document.close()
        
        print(f"\n📊 Extraction Summary:")
        print(f"   Total pages processed: {page_count}")
        print(f"   Story content pages: {story_pages}")
        print(f"   Total story chunks: {len(story_chunks)}")
        
        return story_chunks
    
    def create_langchain_documents(self, story_chunks: List[Dict]) -> List[Document]:
        """Convert story chunks to LangChain documents with proper chunking"""
        print(f"📄 Creating LangChain documents from {len(story_chunks)} story chunks...")
        
        # Initialize text splitter for better chunking
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=800,  # Smaller chunks for better retrieval
            chunk_overlap=100,  # Some overlap to preserve context
            length_function=len,
            separators=['\n\n', '\n', '।', '।', '.', ' ']  # Bengali-aware separators
        )
        
        documents = []
        
        for chunk in story_chunks:
            page_num = chunk["page_number"]
            content = chunk["content"]
            
            # Split long content into smaller chunks
            if len(content) > 600:
                sub_chunks = text_splitter.split_text(content)
                
                for i, sub_chunk in enumerate(sub_chunks):
                    if len(sub_chunk.strip()) > 30:  # Only meaningful chunks
                        doc = Document(
                            page_content=sub_chunk.strip(),
                            metadata={
                                "page": page_num,
                                "chunk_id": f"{page_num}_{i}",
                                "content_type": "story",
                                "source": self.pdf_path,
                                "encoding_fixed": True
                            }
                        )
                        documents.append(doc)
            else:
                # Small content, keep as single document
                doc = Document(
                    page_content=content.strip(),
                    metadata={
                        "page": page_num,
                        "chunk_id": f"{page_num}_0",
                        "content_type": "story", 
                        "source": self.pdf_path,
                        "encoding_fixed": True
                    }
                )
                documents.append(doc)
        
        print(f"✅ Created {len(documents)} LangChain documents")
        return documents
    
    def create_vector_store(self, documents: List[Document], persist_directory: str = "./chroma_db_story_focused") -> Chroma:
        """Create vector store with story-focused documents"""
        print(f"🔗 Creating vector store at: {persist_directory}")
        
        # Remove existing vector store
        if os.path.exists(persist_directory):
            import shutil
            shutil.rmtree(persist_directory)
            print(f"🗑️  Removed existing vector store")
        
        # Initialize embeddings
        embeddings = GoogleGenerativeAIEmbeddings(
            model="models/text-embedding-004",
            google_api_key=self.google_api_key
        )
        
        # Create vector store
        vectorstore = Chroma.from_documents(
            documents=documents,
            embedding=embeddings,
            persist_directory=persist_directory
        )
        
        # Persist the vector store
        vectorstore.persist()
        
        print(f"✅ Vector store created with {len(documents)} documents")
        return vectorstore

def main():
    """Main function to process PDF and create story-focused vector store"""
    pdf_path = "./documents/HSC26-Bangla1st-Paper.pdf"
    
    if not os.path.exists(pdf_path):
        print(f"❌ PDF file not found: {pdf_path}")
        return
    
    print("🚀 Starting Story-Focused Processing...")
    print("=" * 60)
    
    try:
        # Initialize processor
        processor = StoryFocusedProcessor(pdf_path)
        
        # Extract story content with fixed encoding
        story_chunks = processor.extract_story_content()
        
        if not story_chunks:
            print("❌ No story content found in PDF")
            return
        
        # Create LangChain documents
        documents = processor.create_langchain_documents(story_chunks)
        
        if not documents:
            print("❌ No valid documents created")
            return
        
        # Create vector store
        vectorstore = processor.create_vector_store(documents)
        
        print("\n🎉 Story-focused processing completed successfully!")
        print(f"📊 Final Stats:")
        print(f"   Story chunks extracted: {len(story_chunks)}")
        print(f"   LangChain documents: {len(documents)}")
        print(f"   Vector store: chroma_db_story_focused")
        print(f"   Bengali encoding: ✅ Fixed")
        
        # Test the vector store
        print("\n🧪 Testing vector store...")
        test_results = vectorstore.similarity_search("অনুপম কলযাণী", k=3)
        print(f"Test query returned {len(test_results)} results")
        
        for i, result in enumerate(test_results[:2]):
            print(f"\nResult {i+1}:")
            print(f"Page: {result.metadata.get('page', 'unknown')}")
            print(f"Content (first 100 chars): {result.page_content[:100]}...")
        
    except Exception as e:
        print(f"❌ Error during processing: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
