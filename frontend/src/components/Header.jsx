import React from 'react'

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-red-600 rounded-md flex items-center justify-center text-white font-bold text-lg">
                ১০
              </div>
              <div className="ml-2">
                <div className="text-sm font-semibold text-gray-800">MINUTE</div>
                <div className="text-xs text-gray-600">SCHOOL</div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="বিগান কোর্স, বিজ্ঞান ক্লাস দেখেতে শুরু করুন..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <div className="absolute right-3 top-2.5">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-1 text-gray-700 hover:text-red-600 cursor-pointer">
              <span>ক্লাস ৯-১২</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            <div className="flex items-center space-x-1 text-gray-700 hover:text-red-600 cursor-pointer">
              <span>বিজ্ঞান</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <span className="text-green-600 font-medium cursor-pointer hover:text-green-700">
              ফ্রি পরীক্ষা
            </span>

            <div className="flex items-center space-x-1 text-gray-700 hover:text-red-600 cursor-pointer">
              <span>অ্যাডমিশন ব্যাচ</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <div className="flex items-center space-x-1 text-gray-700 hover:text-red-600 cursor-pointer">
              <span>স্কিল সেকশন</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <div className="flex items-center space-x-1 text-gray-700 hover:text-red-600 cursor-pointer">
              <span>আরো</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <span className="text-blue-600 font-medium">EN</span>
            
            <div className="flex items-center space-x-1 text-gray-700">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>16910</span>
            </div>

            <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
              লগ-ইন
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Navigation */}
      <div className="bg-gray-50 border-t">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-8 py-3 text-sm">
            <div className="text-red-600 font-semibold bg-red-50 px-4 py-2 rounded-lg">
              🤖 HSC বাংলা সাহিত্য AI চ্যাট বট
            </div>
            <span className="text-gray-500">|</span>
            <span className="text-gray-600">বাংলা ও ইংরেজি উভয় ভাষায় প্রশ্ন করুন</span>
            <span className="text-gray-500">|</span>
            <span className="text-gray-600">Google Gemini AI দ্বারা চালিত</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
