import os
import json
import numpy as np
from typing import List, Dict, Tuple
from sklearn.metrics.pairwise import cosine_similarity
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import Chroma
from dotenv import load_dotenv
import logging

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class RAGEvaluator:
    """Evaluate RAG system performance using multiple metrics"""
    
    def __init__(self, vector_store_path: str = "./chroma_db"):
        self.google_api_key = os.getenv("GOOGLE_API_KEY")
        if not self.google_api_key:
            raise ValueError("GOOGLE_API_KEY not found")
        
        self.embeddings = GoogleGenerativeAIEmbeddings(
            model="models/embedding-001",
            google_api_key=self.google_api_key
        )
        
        # Load vector store
        self.vectorstore = Chroma(
            persist_directory=vector_store_path,
            embedding_function=self.embeddings
        )
        
        self.retriever = self.vectorstore.as_retriever(
            search_kwargs={"k": 5}
        )
    
    def calculate_relevance_score(self, query: str, retrieved_docs: List[str]) -> float:
        """Calculate relevance using cosine similarity"""
        if not retrieved_docs:
            return 0.0
        
        try:
            # Get embeddings for query and documents
            query_embedding = self.embeddings.embed_query(query)
            doc_embeddings = self.embeddings.embed_documents(retrieved_docs)
            
            # Calculate cosine similarities
            query_embedding = np.array(query_embedding).reshape(1, -1)
            doc_embeddings = np.array(doc_embeddings)
            
            similarities = cosine_similarity(query_embedding, doc_embeddings)[0]
            
            # Return average similarity
            return float(np.mean(similarities))
            
        except Exception as e:
            logger.error(f"Error calculating relevance: {str(e)}")
            return 0.0
    
    def evaluate_groundedness(self, answer: str, context: List[str]) -> float:
        """
        Simple groundedness check - how much of the answer can be found in context
        This is a simplified version - in production, use more sophisticated methods
        """
        if not context or not answer:
            return 0.0
        
        answer_words = set(answer.lower().split())
        context_text = " ".join(context).lower()
        context_words = set(context_text.split())
        
        # Calculate overlap
        overlap = len(answer_words.intersection(context_words))
        total_answer_words = len(answer_words)
        
        if total_answer_words == 0:
            return 0.0
        
        return overlap / total_answer_words
    
    def evaluate_test_cases(self, test_cases: List[Dict]) -> Dict:
        """Evaluate system on test cases"""
        results = {
            "total_cases": len(test_cases),
            "relevance_scores": [],
            "groundedness_scores": [],
            "exact_match_scores": [],
            "case_results": []
        }
        
        for i, case in enumerate(test_cases):
            query = case["question"]
            expected_answer = case["expected_answer"]
            
            logger.info(f"Evaluating case {i+1}: {query}")
            
            # Get retrieved documents
            retrieved_docs = self.retriever.get_relevant_documents(query)
            retrieved_texts = [doc.page_content for doc in retrieved_docs]
            
            # Calculate metrics
            relevance = self.calculate_relevance_score(query, retrieved_texts)
            
            # For groundedness, we'll use expected answer as a proxy
            groundedness = self.evaluate_groundedness(expected_answer, retrieved_texts)
            
            # Simple exact match check in retrieved context
            context_text = " ".join(retrieved_texts).lower()
            exact_match = 1.0 if expected_answer.lower() in context_text else 0.0
            
            case_result = {
                "question": query,
                "expected_answer": expected_answer,
                "relevance_score": relevance,
                "groundedness_score": groundedness,
                "exact_match": exact_match,
                "retrieved_docs_count": len(retrieved_docs),
                "retrieved_context_preview": retrieved_texts[0][:200] if retrieved_texts else ""
            }
            
            results["relevance_scores"].append(relevance)
            results["groundedness_scores"].append(groundedness)
            results["exact_match_scores"].append(exact_match)
            results["case_results"].append(case_result)
        
        # Calculate averages
        results["avg_relevance"] = np.mean(results["relevance_scores"])
        results["avg_groundedness"] = np.mean(results["groundedness_scores"])
        results["exact_match_accuracy"] = np.mean(results["exact_match_scores"])
        
        return results

def main():
    """Run evaluation on test cases"""
    
    # Define test cases based on the project requirements
    test_cases = [
        {
            "question": "অনুপমের ভাষায় সুপুরুষ কাকে বলা হয়েছে?",
            "expected_answer": "শুম্ভুনাথ"
        },
        {
            "question": "কাকে অনুপমের ভাগ্য দেবতা বলে উল্লেখ করা হয়েছে?",
            "expected_answer": "মামাকে"
        },
        {
            "question": "বিয়ের সময় কল্যাণীর প্রকৃত বয়স কত ছিল?",
            "expected_answer": "১৫ বছর"
        },
        {
            "question": "Who is described as a good man according to Anupam?",
            "expected_answer": "Shumbhunath"
        },
        {
            "question": "What was Kalyani's actual age at the time of marriage?",
            "expected_answer": "15 years"
        }
    ]
    
    try:
        # Initialize evaluator
        evaluator = RAGEvaluator()
        
        # Run evaluation
        logger.info("Starting RAG system evaluation...")
        results = evaluator.evaluate_test_cases(test_cases)
        
        # Print results
        print("\n" + "="*60)
        print("RAG SYSTEM EVALUATION RESULTS")
        print("="*60)
        
        print(f"\nOverall Metrics:")
        print(f"Total Test Cases: {results['total_cases']}")
        print(f"Average Relevance Score: {results['avg_relevance']:.3f}")
        print(f"Average Groundedness Score: {results['avg_groundedness']:.3f}")
        print(f"Exact Match Accuracy: {results['exact_match_accuracy']:.3f}")
        
        print(f"\nDetailed Results:")
        print("-"*60)
        
        for i, case in enumerate(results['case_results']):
            print(f"\nCase {i+1}:")
            print(f"Question: {case['question']}")
            print(f"Expected: {case['expected_answer']}")
            print(f"Relevance: {case['relevance_score']:.3f}")
            print(f"Groundedness: {case['groundedness_score']:.3f}")
            print(f"Exact Match: {'✓' if case['exact_match'] == 1.0 else '✗'}")
            print(f"Retrieved Docs: {case['retrieved_docs_count']}")
            print(f"Context Preview: {case['retrieved_context_preview']}...")
        
        # Save results to file
        with open("evaluation_results.json", "w", encoding="utf-8") as f:
            json.dump(results, f, ensure_ascii=False, indent=2)
        
        print(f"\n📊 Full results saved to: evaluation_results.json")
        
        # Provide recommendations
        print(f"\n💡 Recommendations:")
        if results['avg_relevance'] < 0.7:
            print("- Consider improving embedding model or chunking strategy")
        if results['avg_groundedness'] < 0.6:
            print("- Review document preprocessing and chunk quality")
        if results['exact_match_accuracy'] < 0.8:
            print("- Check if test answers are present in the document corpus")
            print("- Consider improving retrieval parameters (k, threshold)")
        
        if results['avg_relevance'] > 0.8 and results['exact_match_accuracy'] > 0.8:
            print("- System performance looks good! ✅")
        
    except Exception as e:
        logger.error(f"Evaluation failed: {str(e)}")
        raise

if __name__ == "__main__":
    main()
