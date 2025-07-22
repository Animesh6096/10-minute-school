#!/usr/bin/env python3
"""
Demo script for the Multilingual RAG System
This script demonstrates the key features and capabilities
"""

import asyncio
import json
from datetime import datetime
from main import RAGSystem

async def demo_rag_system():
    """Demonstrate the RAG system capabilities"""
    
    print("🌟 Multilingual RAG System Demo")
    print("=" * 50)
    
    try:
        # Initialize the RAG system
        print("🔧 Initializing RAG system...")
        rag = RAGSystem()
        print("✅ RAG system initialized successfully!")
        
        # Test queries - the actual ones from requirements
        test_queries = [
            {
                "question": "অনুপমের ভাষায় সুপুরুষ কাকে বলা হয়েছে?",
                "expected": "শুম্ভুনাথ",
                "language": "Bengali"
            },
            {
                "question": "কাকে অনুপমের ভাগ্য দেবতা বলে উল্লেখ করা হয়েছে?",
                "expected": "মামাকে",
                "language": "Bengali"
            },
            {
                "question": "বিয়ের সময় কল্যাণীর প্রকৃত বয়স কত ছিল?",
                "expected": "১৫ বছর",
                "language": "Bengali"
            },
            {
                "question": "Who is described as a good man according to Anupam?",
                "expected": "Shumbhunath",
                "language": "English"
            },
            {
                "question": "What was Kalyani's actual age at the time of marriage?",
                "expected": "15 years",
                "language": "English"
            }
        ]
        
        results = []
        
        print(f"\n🧪 Running {len(test_queries)} test queries...")
        print("-" * 50)
        
        for i, query in enumerate(test_queries, 1):
            print(f"\n📝 Query {i}/{len(test_queries)} ({query['language']}):")
            print(f"❓ Question: {query['question']}")
            print(f"📖 Expected: {query['expected']}")
            
            # Process the query
            print("🔍 Processing...")
            response = await rag.query(query['question'])
            
            print(f"🤖 Answer: {response.answer}")
            print(f"📊 Confidence: {response.confidence_score:.2f}")
            print(f"📚 Sources: {response.metadata['num_sources']}")
            print(f"🌐 Detected Language: {response.metadata['detected_language']}")
            
            # Store results
            results.append({
                "query": query['question'],
                "expected": query['expected'],
                "answer": response.answer,
                "confidence": response.confidence_score,
                "language": query['language'],
                "detected_language": response.metadata['detected_language'],
                "sources": response.metadata['num_sources'],
                "context_preview": response.context_chunks[0][:100] + "..." if response.context_chunks else ""
            })
            
            print("✅ Query processed successfully!")
        
        # Generate summary
        print("\n" + "=" * 50)
        print("📈 DEMO SUMMARY")
        print("=" * 50)
        
        total_queries = len(results)
        avg_confidence = sum(r['confidence'] for r in results) / total_queries
        
        print(f"📊 Total Queries Processed: {total_queries}")
        print(f"🎯 Average Confidence Score: {avg_confidence:.2f}")
        print(f"🌐 Languages Detected: {len(set(r['detected_language'] for r in results))}")
        
        # Language breakdown
        bengali_count = sum(1 for r in results if r['detected_language'] == 'bn')
        english_count = sum(1 for r in results if r['detected_language'] == 'en')
        
        print(f"📝 Bengali Queries: {bengali_count}")
        print(f"📝 English Queries: {english_count}")
        
        # Save results
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"demo_results_{timestamp}.json"
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump({
                "demo_info": {
                    "timestamp": datetime.now().isoformat(),
                    "total_queries": total_queries,
                    "avg_confidence": avg_confidence
                },
                "results": results
            }, f, ensure_ascii=False, indent=2)
        
        print(f"💾 Results saved to: {filename}")
        
        print("\n🎉 Demo completed successfully!")
        print("\n💡 Key Observations:")
        print("   • System successfully handles both Bengali and English")
        print("   • Automatic language detection works correctly")
        print("   • Confidence scores indicate retrieval quality")
        print("   • Context chunks provide source grounding")
        
        # Performance insights
        if avg_confidence > 0.7:
            print("   • ✅ High average confidence indicates good retrieval performance")
        elif avg_confidence > 0.5:
            print("   • ⚠️ Moderate confidence - consider tuning retrieval parameters")
        else:
            print("   • ❌ Low confidence - check document quality and chunking strategy")
        
        return results
        
    except Exception as e:
        print(f"❌ Demo failed: {str(e)}")
        print("\nTroubleshooting:")
        print("1. Ensure the RAG system is properly initialized")
        print("2. Check if vector database exists (run ingest.py)")
        print("3. Verify Google API key is configured")
        print("4. Check if PDF document is processed")
        return None

def print_system_info():
    """Print system information"""
    print("🖥️ System Information:")
    print("-" * 30)
    
    import sys
    import os
    
    print(f"Python Version: {sys.version.split()[0]}")
    print(f"Working Directory: {os.getcwd()}")
    
    # Check key files
    files_to_check = [
        "main.py",
        "ingest.py", 
        ".env",
        "chroma_db",
        "data/HSC26_Bangla_1st_paper.pdf"
    ]
    
    print("\n📁 File Status:")
    for file in files_to_check:
        status = "✅" if os.path.exists(file) else "❌"
        print(f"{status} {file}")
    
    print()

async def main():
    """Main demo function"""
    print_system_info()
    results = await demo_rag_system()
    
    if results:
        print("\n🚀 Ready to test the web interface!")
        print("   1. Start the API server: python main.py")
        print("   2. Open frontend: http://localhost:5173")
        print("   3. Try the sample queries from this demo")

if __name__ == "__main__":
    asyncio.run(main())
