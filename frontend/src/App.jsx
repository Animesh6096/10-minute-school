import Chat from './components/Chat'
import Header from './components/Header'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      {/* Hero Section with AI Chatbot Introduction */}
      <main className="flex-1">
        <div className="bg-gradient-to-r from-red-50 to-red-100 py-4 sm:py-6 md:py-8">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                বাংলা সাহিত্য AI চ্যাট বট
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-3 sm:mb-4">
                HSC Bangla Literature AI Chat Bot
              </p>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 text-xs sm:text-sm">
                <span className="bg-red-100 text-red-800 px-2 sm:px-3 py-1 rounded-full">অপরিচিতা</span>
                <span className="bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full">সাহিত্য বিশ্লেষণ</span>
                <span className="bg-green-100 text-green-800 px-2 sm:px-3 py-1 rounded-full">দ্বিভাষিক সাপোর্ট</span>
                <span className="bg-purple-100 text-purple-800 px-2 sm:px-3 py-1 rounded-full">Google Gemini AI</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 md:py-8">
          <Chat />
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default App
