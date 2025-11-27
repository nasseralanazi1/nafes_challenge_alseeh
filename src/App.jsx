import { useState, useEffect } from 'react'
import HomePage from './pages/HomePage'
import QuizPage from './pages/QuizPage'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import ResultPage from './pages/ResultPage'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken'))
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [quizResult, setQuizResult] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      setAdminToken(token)
    }
  }, [])

  const handleAdminLogin = (token) => {
    localStorage.setItem('adminToken', token)
    setAdminToken(token)
    setCurrentPage('admin')
  }

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken')
    setAdminToken(null)
    setCurrentPage('home')
  }

  const handleStartQuiz = (categoryId) => {
    setSelectedCategory(categoryId)
    setCurrentPage('quiz')
  }

  const handleQuizComplete = (result) => {
    setQuizResult(result)
    setCurrentPage('result')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500">
      {currentPage === 'home' && (
        <HomePage 
          onStartQuiz={handleStartQuiz}
          onAdminClick={() => setCurrentPage('admin-login')}
        />
      )}
      
      {currentPage === 'admin-login' && (
        <AdminLogin 
          onLogin={handleAdminLogin}
          onBack={() => setCurrentPage('home')}
        />
      )}
      
      {currentPage === 'admin' && adminToken && (
        <AdminDashboard 
          token={adminToken}
          onLogout={handleAdminLogout}
        />
      )}
      
      {currentPage === 'quiz' && selectedCategory && (
        <QuizPage 
          categoryId={selectedCategory}
          onComplete={handleQuizComplete}
          onBack={() => setCurrentPage('home')}
        />
      )}
      
      {currentPage === 'result' && quizResult && (
        <ResultPage 
          result={quizResult}
          onBack={() => setCurrentPage('home')}
        />
      )}
    </div>
  )
}

export default App
