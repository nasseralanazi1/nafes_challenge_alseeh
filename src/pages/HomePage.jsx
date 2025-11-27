import { useState, useEffect } from 'react'

export default function HomePage({ onStartQuiz, onAdminClick }) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [studentName, setStudentName] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    fetchCategories()
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/nafs-logo.png" alt="شعار نافس" className="h-20 w-auto" />
        </div>
        
        {/* School Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Teacher */}
          <div className="bg-white rounded-lg shadow-lg p-4 flex items-center justify-between">
            <div className="text-right flex-1">
              <p className="text-gray-600 text-sm">المعلم</p>
              <p className="text-gray-800 font-semibold">ناصر بن رجيل العنزي</p>
            </div>
            <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center ml-4">
              <span className="text-xl">👤</span>
            </div>
          </div>
          
          {/* Principal */}
          <div className="bg-white rounded-lg shadow-lg p-4 flex items-center justify-between">
            <div className="text-right flex-1">
              <p className="text-gray-600 text-sm">مدير المدرسة</p>
              <p className="text-gray-800 font-semibold">تركي بن مطير العنزي</p>
            </div>
            <div className="bg-purple-500 text-white rounded-full w-12 h-12 flex items-center justify-center ml-4">
              <span className="text-xl">👨‍💼</span>
            </div>
          </div>
          
          {/* School */}
          <div className="bg-white rounded-lg shadow-lg p-4 flex items-center justify-between">
            <div className="text-right flex-1">
              <p className="text-gray-600 text-sm">المدرسة</p>
              <p className="text-gray-800 font-semibold">متوسطة السيح بمحافظة الخرج</p>
            </div>
            <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center ml-4">
              <span className="text-xl">🏫</span>
            </div>
          </div>
        </div>
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">تحدي نافس</h1>
          <p className="text-xl text-white/90 mb-2">مرحباً بك في تحدي نافس لمتوسطة السيح</p>
          <p className="text-lg text-white/80">اختبر معلوماتك وحقق النجاح</p>
        </div>

        {/* Login Form or Categories */}
        {!isLoggedIn ? (
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-auto mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">تسجيل الدخول</h2>
            <form onSubmit={handleLogin}>
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">اسم الطالب</label>
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
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition"
              >
                ابدأ الآن
              </button>
            </form>
          </div>
        ) : (
          <div className="mb-8">
            <div className="flex justify-center mb-6">
              <div className="bg-white rounded-lg shadow-lg px-6 py-3">
                <p className="text-gray-800 font-semibold">مرحباً بك: <span className="text-purple-600">{studentName}</span></p>
              </div>
            </div>
          </div>
        )}

        {/* Admin Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={onAdminClick}
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg transition"
          >
            لوحة التحكم
          </button>
        </div>

        {/* Categories Grid */}
        {!isLoggedIn ? (
          <div className="text-center text-white text-lg">يرجى تسجيل الدخول أولاً</div>
        ) : loading ? (
          <div className="text-center text-white">جاري التحميل...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-white rounded-xl shadow-xl p-8 hover:shadow-2xl hover:scale-105 transition transform"
              >
                <div className="text-5xl mb-4">
                  {category.name === 'reading' && '📖'}
                  {category.name === 'math' && '🔢'}
                  {category.name === 'science' && '🔬'}
                  {category.name === 'comprehensive' && '📝'}
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{category.nameAr}</h2>
                <p className="text-gray-600 mb-4">اختبر نفسك في هذا القسم</p>
                <button
                  onClick={() => onStartQuiz(category.id)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded-lg transition cursor-pointer"
                >
                  ابدأ الاختبار
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Logout Button */}
        {isLoggedIn && (
          <div className="flex justify-center mt-8 mb-8">
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition"
            >
              تسجيل الخروج
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-white/80">
          <p>© 2025 متوسطة السيح - جميع الحقوق محفوظة</p>
        </div>
      </div>
    </div>
  )
}
