import React from 'react'

const CourseInfo = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* Course Schedule */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-red-600 text-white p-4">
            <h3 className="text-lg font-semibold text-center">ভার্সিটি A Unit এডমিশন কোর্স - ২০২৫</h3>
            <p className="text-center text-red-100">Weekly Routine</p>
          </div>

          {/* Schedule Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Day</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Time</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Subject</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">Sunday</td>
                  <td className="px-4 py-3 text-sm text-gray-600">7:00 PM</td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">Bangla</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">Monday</td>
                  <td className="px-4 py-3 text-sm text-gray-600">7:00 PM</td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">Physics</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">Tuesday</td>
                  <td className="px-4 py-3 text-sm text-gray-600">7:00 PM</td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">Chemistry</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">Wednesday</td>
                  <td className="px-4 py-3 text-sm text-gray-600">7:00 PM</td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">H.Math</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">Thursday</td>
                  <td className="px-4 py-3 text-sm text-gray-600">7:00 PM</td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">Biology</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">Friday</td>
                  <td className="px-4 py-3 text-sm text-gray-600">7:00 PM</td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">English</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">Saturday</td>
                  <td className="px-4 py-3 text-sm text-gray-600">10:00 AM</td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">Weekly Exam</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Course Subjects */}
          <div className="p-4 border-t border-gray-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">কোর্স সিলেবাস</h4>
            <div className="space-y-3">
              {[
                { name: 'Physics', icon: '⚛️', color: 'pink' },
                { name: 'Chemistry', icon: '🧪', color: 'yellow' },
                { name: 'Biology', icon: '🧬', color: 'blue' },
                { name: 'Higher Math', icon: '📐', color: 'green' },
                { name: 'Bangla', icon: '📚', color: 'purple' }
              ].map((subject, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white bg-${subject.color}-500 mr-3`}>
                    <span className="text-sm">{subject.icon}</span>
                  </div>
                  <span className="text-gray-800 font-medium">{subject.name}</span>
                  <svg className="w-5 h-5 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <button className="text-red-600 font-medium hover:text-red-700">
                সকল বিষয় →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Course Pricing */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Price Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-gray-900">৳4000</span>
              <span className="text-lg text-gray-500 line-through ml-2">৳5000</span>
              <span className="bg-red-600 text-white text-xs px-2 py-1 rounded ml-2">1000 ৳ ছাড়</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">ভার্সিটি A Unit এডমিশন কোর্স - ২০২৫</p>
          </div>

          {/* Enroll Button */}
          <div className="p-4">
            <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
              কোর্সটি কিনুন
            </button>
          </div>

          {/* Course Features */}
          <div className="p-4 border-t border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-3">এই কোর্স যা থাকছে</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start">
                <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-xs">৮১</span>
                </div>
                <span className="text-gray-700">৮১টি বিষয়</span>
              </div>
              
              <div className="flex items-start">
                <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-xs">৮৮</span>
                </div>
                <span className="text-gray-700">১১৭টি লাইভ ক্লাস</span>
              </div>

              <div className="flex items-start">
                <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mr-3 mt-0.5">
                  <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd"/>
                  </svg>
                </div>
                <span className="text-gray-700">১২৭টি Basic to Advanced Live Class</span>
              </div>

              <div className="flex items-start">
                <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mr-3 mt-0.5">
                  <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                  </svg>
                </div>
                <span className="text-gray-700">২৪টি DU Written Special Live Class</span>
              </div>

              <div className="flex items-start">
                <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mr-3 mt-0.5">
                  <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                  </svg>
                </div>
                <span className="text-gray-700">৩২টি Special Live Class (JU, JNU, Sust, CU, RU, GST)</span>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">কোর্স সম্পর্কে বিস্তারিত জানতে</span>
              <div className="flex items-center text-green-600">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                </svg>
                <span className="font-medium">ফোন করুন (16910)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseInfo
