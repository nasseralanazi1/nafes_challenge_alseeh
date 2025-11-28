import { useState, useEffect } from 'react'

export default function HomePage({ onStartQuiz, onAdminClick }) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [studentName, setStudentName] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [stats, setStats] = useState({ passed: 0, total: 0, percentage: 0 })

  useEffect(() => {
    fetchCategories()
    fetchStats()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats')
      const data = await response.json()
      setStats(data || { passed: 0, total: 0, percentage: 0 })
    } catch (error) {
      console.error('Error fetching stats:', error)
      setStats({ passed: 0, total: 0, percentage: 0 })
    }
  }

  const handleLogin = (e) => {
    e.preventDefault()
    if (studentName.trim()) {
      setIsLoggedIn(true)
    }
  }

  const handleLogout = () => {
    setStudentName('')
    setIsLoggedIn(false)
  }

  const getCategoryColor = (categoryName) => {
    const colors = {
      'reading': { bg: 'bg-green-500', text: 'text-green-600', border: 'border-green-200', light: 'bg-green-50', icon: '📚' },
      'math': { bg: 'bg-blue-600', text: 'text-blue-600', border: 'border-blue-200', light: 'bg-blue-50', icon: '🧮' },
      'science': { bg: 'bg-purple-600', text: 'text-purple-600', border: 'border-purple-200', light: 'bg-purple-50', icon: '🔬' },
      'comprehensive': { bg: 'bg-orange-500', text: 'text-orange-600', border: 'border-orange-200', light: 'bg-orange-50', icon: '🏆' }
    }
    return colors[categoryName] || colors['reading']
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {!isLoggedIn ? (
        // Login Page
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-50 flex flex-col items-center justify-center p-4">
          <div className="max-w-md w-full">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <img src="/nafs-logo.png" alt="شعار نافس" className="h-24 w-auto" />
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">مبادرة روبوت تحدي نافس لمتوسطة السيح</h1>
              <p className="text-gray-600 text-sm">مرحباً بك في تحدي نافس</p>
            </div>

            {/* Info Cards */}
            <div className="space-y-3 mb-8">
              <div className="bg-blue-50 rounded-lg p-6 flex items-center justify-between shadow-sm border border-blue-100">
                <div className="text-right flex-1">
                  <p className="text-gray-600 text-sm mb-1">المعلم</p>
                  <p className="text-gray-800 font-bold text-lg">ناصر بن رجيل العنزي</p>
                </div>
                <div className="bg-blue-500 text-white rounded-full w-14 h-14 flex items-center justify-center ml-4 flex-shrink-0">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82M12 3L1 9v2h2v9h16v-9h2V9L12 3z"/>
                  </svg>
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg p-6 flex items-center justify-between shadow-sm border border-purple-100">
                <div className="text-right flex-1">
                  <p className="text-gray-600 text-sm mb-1">مدير المدرسة</p>
                  <p className="text-gray-800 font-bold text-lg">تركي بن مطير العنزي</p>
                </div>
                <div className="bg-purple-500 text-white rounded-full w-14 h-14 flex items-center justify-center ml-4 flex-shrink-0">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82M12 3L1 9v2h2v9h16v-9h2V9L12 3z"/>
                  </svg>
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-6 flex items-center justify-between shadow-sm border border-green-100">
                <div className="text-right flex-1">
                  <p className="text-gray-600 text-sm mb-1">المدرسة</p>
                  <p className="text-gray-800 font-bold text-lg">متوسطة السيح بمحافظة الخرج</p>
                </div>
                <div className="bg-green-500 text-white rounded-full w-14 h-14 flex items-center justify-center ml-4 flex-shrink-0">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 2.18L17.46 9H6.54L12 4.18zM6 11h12v7H6v-7z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Login Form */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">تسجيل الطالب</h2>
              <form onSubmit={handleLogin}>
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2 text-right">اسم الطالب</label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="أدخل اسمك الكامل"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-right"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 rounded-lg transition"
                >
                  ابدأ الاختبار
                </button>
              </form>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-200">
                <p className="text-blue-600 font-bold text-2xl">{stats.passed}</p>
                <p className="text-gray-600 text-xs">الطلاب الناجحة</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center border border-green-200">
                <p className="text-green-600 font-bold text-2xl">{stats.total}</p>
                <p className="text-gray-600 text-xs">إجمالي المحاولات</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center border border-purple-200">
                <p className="text-purple-600 font-bold text-2xl">{stats.percentage}%</p>
                <p className="text-gray-600 text-xs">نسبة النجاح</p>
              </div>
            </div>

            {/* Admin Button */}
            <div className="text-center">
              <button
                onClick={onAdminClick}
                className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
              >
                لوحة التحكم
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Categories Page
        <div className="min-h-screen bg-white">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-8 px-4">
            <div className="max-w-6xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-2">مرحباً بك: {studentName}</h1>
              <p className="text-lg opacity-90">اختر التحدي المناسب لك</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-6xl mx-auto px-4 py-12">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">اختر الموضوع</h2>

            {/* Categories Grid */}
            {loading ? (
              <div className="text-center text-gray-600">جاري التحميل...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {categories.map((category) => {
                  const color = getCategoryColor(category.name)
                  return (
                    <div
                      key={category.id}
                      className={`${color.light} rounded-xl border-2 ${color.border} p-8 shadow-lg hover:shadow-xl transition transform hover:scale-105`}
                    >
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <h3 className={`text-2xl font-bold ${color.text} mb-2`}>{category.nameAr}</h3>
                          <p className="text-gray-600 text-sm">اختبر نفسك في هذا القسم</p>
                        </div>
                        <div className={`${color.bg} text-white rounded-lg w-16 h-16 flex items-center justify-center text-3xl ml-4 flex-shrink-0`}>
                          {color.icon}
                        </div>
                      </div>
                      <button
                        onClick={() => onStartQuiz(category.id)}
                        className={`w-full ${color.bg} hover:opacity-90 text-white font-bold py-3 rounded-lg transition cursor-pointer`}
                      >
                        ابدأ التحدي
                      </button>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Logout and Admin Buttons */}
            <div className="flex justify-center gap-4 mb-12">
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-2 rounded-lg transition font-semibold"
              >
                تسجيل الخروج
              </button>
              <button
                onClick={onAdminClick}
                className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-2 rounded-lg transition font-semibold"
              >
                لوحة التحكم
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
