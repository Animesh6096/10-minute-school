import React, { useState, useRef, useEffect } from 'react'

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      type: 'assistant',
      content: 'আস্সালামু আলাইকুম! আমি আপনার বাংলা ও ইংরেজি প্রশ্নের উত্তর দিতে পারি। HSC বাংলা সাহিত্য সম্পর্কে যেকোনো প্রশ্ন করুন।\n\nHello! I can answer your questions in both Bengali and English. Feel free to ask any questions about HSC Bangla literature.',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const [apiUrl] = useState('http://localhost:8000')

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
        throw new Error(`HTTP error! status: ${response.status}`)
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
      const errorMessage = {
        type: 'assistant',
        content: 'দুঃখিত, একটি ত্রুটি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।\n\nSorry, there was an error. Please try again.\n\n' + 
                 `Error: ${error.message}`,
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
    "অনুপমের ভাষায় সুপুরুষ কাকে বলা হয়েছে?",
    "কাকে অনুপমের ভাগ্য দেবতা বলে উল্লেখ করা হয়েছে?",
    "বিয়ের সময় কল্যাণীর প্রকৃত বয়স কত ছিল?",
    "Who is described as a good man according to Anupam?"
  ]

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Chat Header */}
      <div className="bg-red-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">HSC বাংলা সাহিত্য AI সহায়ক</h3>
            <p className="text-red-100 text-sm">HSC Bangla Literature AI Assistant</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-200">অনলাইন</span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="h-[600px] overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-[80%]">
              <div 
                className={`
                  p-4 rounded-lg shadow-sm
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
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="text-xs text-gray-500 space-y-1">
                      <div className="flex items-center justify-between">
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
              <div className="text-xs text-gray-500 mt-1 px-2">
                {formatTimestamp(message.timestamp)}
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%]">
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                  </div>
                  <span className="text-gray-500 text-sm">চিন্তা করছি...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Sample Questions */}
      {messages.length === 1 && (
        <div className="p-4 bg-gray-100 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <svg className="w-4 h-4 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            নমুনা প্রশ্ন / Sample Questions
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {sampleQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => setInput(question)}
                className="text-left p-3 bg-white rounded-lg text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors border border-gray-200"
                disabled={isLoading}
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <form onSubmit={handleSubmit} className="flex space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="আপনার প্রশ্ন লিখুন / Type your question..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg 
                className="w-5 h-5" 
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
        
        <div className="mt-3 text-xs text-gray-500 text-center flex items-center justify-center space-x-2">
          <span>Powered by</span>
          <span className="text-red-600 font-medium">Google Gemini</span>
          <span>•</span>
          <span>HSC বাংলা সাহিত্য ডেটাসেট</span>
        </div>
      </div>
    </div>
  )
}

export default Chat
