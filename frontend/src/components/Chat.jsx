import React, { useState, useRef, useEffect } from 'react'

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      type: 'assistant',
      content: 'স্বাগতম! আমি ১০ মিনিট স্কুলের বাংলা সাহিত্য AI চ্যাট বট। আপনি বাংলা ও ইংরেজি যেকোনো ভাষায় HSC বাংলা সাহিত্য সম্পর্কে প্রশ্ন করতে পারেন।\n\nWelcome! I am 10 Minute School\'s Bengali Literature AI Chat Bot. You can ask questions about HSC Bengali Literature in both Bengali and English.',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('checking') // 'checking', 'connected', 'disconnected'
  const messagesEndRef = useRef(null)
  const [apiUrl] = useState('http://localhost:8000')

  // Check backend connection on component mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch(`${apiUrl}/health`, {
          method: 'GET',
          signal: AbortSignal.timeout(5000) // 5 second timeout
        })
        
        if (response.ok) {
          setConnectionStatus('connected')
        } else {
          setConnectionStatus('disconnected')
        }
      } catch (error) {
        console.error('Connection check failed:', error)
        setConnectionStatus('disconnected')
      }
    }
    
    checkConnection()
    
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000)
    return () => clearInterval(interval)
  }, [apiUrl])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const detectLanguage = (text) => {
    const bengaliChars = /[\u0980-\u09FF]/
    return bengaliChars.test(text) ? 'bn' : 'en'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = {
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // First check if backend is reachable
      const healthCheck = await fetch(`${apiUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).catch(() => null)

      if (!healthCheck) {
        throw new Error('Backend server is not running. Please start the backend server on port 8000.')
      }

      const response = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: userMessage.content,
          language: detectLanguage(userMessage.content)
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()

      const assistantMessage = {
        type: 'assistant',
        content: data.answer,
        context_chunks: data.context_chunks,
        confidence_score: data.confidence_score,
        metadata: data.metadata,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])

    } catch (error) {
      console.error('Error:', error)
      let errorContent = 'দুঃখিত, একটি ত্রুটি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।\n\nSorry, there was an error. Please try again.'
      
      if (error.message.includes('Backend server is not running')) {
        errorContent += '\n\n🔧 সমাধান/Solution:\n' +
                      '1. Backend server চালু করুন/Start the backend server:\n' +
                      '   cd backend && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000\n' +
                      '2. অথবা/Or run: ./start_both_servers.sh'
      } else if (error.message.includes('Failed to fetch')) {
        errorContent += '\n\n🔧 সমাধান/Solution:\n' +
                      '1. Backend server (port 8000) চালু আছে কিনা চেক করুন\n' +
                      '2. Check if backend server is running on port 8000\n' +
                      '3. CORS configuration সঠিক আছে কিনা দেখুন\n' +
                      '4. Network connection চেক করুন'
      }
      
      errorContent += `\n\nError details: ${error.message}`

      const errorMessage = {
        type: 'assistant',
        content: errorContent,
        timestamp: new Date(),
        isError: true
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const formatTimestamp = (timestamp) => {
    return timestamp.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const sampleQuestions = [
    "অনুপম কেমন চরিত্রের মানুষ?",
    "কল্যাণীর বাবার নাম কী?",
    "গল্পে যৌতুক নিয়ে কী ঘটেছিল?",
    "Who is the author of Oporichita story?"
  ]

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-full">
      {/* Chat Header */}
      <div className="bg-red-600 text-white p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-semibold truncate">HSC বাংলা সাহিত্য AI সহায়ক</h3>
            <p className="text-red-100 text-xs sm:text-sm truncate">HSC Bangla Literature AI Assistant</p>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-400 animate-pulse' :
              connectionStatus === 'disconnected' ? 'bg-red-400' :
              'bg-yellow-400 animate-pulse'
            }`}></div>
            <span className={`text-xs sm:text-sm ${
              connectionStatus === 'connected' ? 'text-green-200' :
              connectionStatus === 'disconnected' ? 'text-red-200' :
              'text-yellow-200'
            }`}>
              {connectionStatus === 'connected' ? 'অনলাইন' :
               connectionStatus === 'disconnected' ? 'অফলাইন' :
               'সংযোগ পরীক্ষা...'}
            </span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="h-[400px] sm:h-[500px] md:h-[600px] overflow-y-auto p-2 sm:p-4 space-y-3 sm:space-y-4 bg-gray-50">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-[85%] sm:max-w-[80%] md:max-w-[75%]">
              <div 
                className={`
                  p-3 sm:p-4 rounded-lg shadow-sm text-sm sm:text-base
                  ${message.type === 'user' 
                    ? 'bg-red-600 text-white' 
                    : message.isError 
                      ? 'bg-red-50 text-red-800 border border-red-200' 
                      : 'bg-white text-gray-800 border border-gray-200'
                  }
                `}
              >
                <div className="whitespace-pre-wrap break-words">
                  {message.content}
                </div>
                
                {/* Show metadata for assistant messages */}
                {message.type === 'assistant' && message.metadata && !message.isError && (
                  <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-200">
                    <div className="text-xs text-gray-500 space-y-1">
                      <div className="flex items-center justify-between flex-wrap gap-1">
                        <span>সূত্র: {message.metadata.num_sources}টি</span>
                        {message.confidence_score && (
                          <span>নির্ভরযোগ্যতা: {(message.confidence_score * 100).toFixed(0)}%</span>
                        )}
                      </div>
                      <div>ভাষা: {message.metadata.detected_language === 'bn' ? 'বাংলা' : 'ইংরেজি'}</div>
                    </div>
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-500 mt-1 px-1 sm:px-2">
                {formatTimestamp(message.timestamp)}
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[85%] sm:max-w-[80%] md:max-w-[75%]">
              <div className="bg-white border border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-600 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-600 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-600 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                  </div>
                  <span className="text-gray-500 text-xs sm:text-sm">চিন্তা করছি...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Sample Questions */}
      {messages.length === 1 && (
        <div className="p-3 sm:p-4 bg-gray-100 border-t border-gray-200">
          <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3 flex items-center">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            নমুনা প্রশ্ন / Sample Questions
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {sampleQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => setInput(question)}
                className="text-left p-2 sm:p-3 bg-white rounded-lg text-xs sm:text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors border border-gray-200 break-words"
                disabled={isLoading}
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-3 sm:p-4 border-t border-gray-200 bg-white">
        <form onSubmit={handleSubmit} className="flex space-x-2 sm:space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="আপনার প্রশ্ন লিখুন / Type your question..."
            className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center flex-shrink-0"
          >
            {isLoading ? (
              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg 
                className="w-4 h-4 sm:w-5 sm:h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
                />
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Chat
