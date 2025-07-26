import Chat from './components/Chat'
import Header from './components/Header'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* AI Chatbot Section Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              HSC বাংলা সাহিত্য AI সহায়ক
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              HSC Bangla Literature AI Assistant
            </p>
            <p className="text-gray-500 max-w-3xl mx-auto">
              বাংলা ও ইংরেজি উভয় ভাষায় HSC বাংলা সাহিত্য সম্পর্কে প্রশ্ন করুন। 
              আমাদের AI সহায়ক আপনাকে তাৎক্ষণিক এবং নির্ভুল উত্তর প্রদান করবে।
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm">
              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full">অপরিচিতা</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">সাহিত্য বিশ্লেষণ</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">দ্বিভাষিক সাপোর্ট</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full">Google Gemini AI</span>
            </div>
          </div>
          
          <div className="flex justify-center">
            <div className="w-full max-w-4xl">
              <Chat />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default App
