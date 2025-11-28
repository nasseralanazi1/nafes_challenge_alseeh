import { useState, useEffect } from 'react'

export default function AdminDashboard({ token, onLogout }) {
  const [activeTab, setActiveTab] = useState('questions')
  const [categories, setCategories] = useState([])
  const [questions, setQuestions] = useState([])
  const [passedResults, setPassedResults] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    categoryId: '',
    text: '',
    image: null,
    imageUrl: '',
    options: ['', '', '', ''],
    correctAnswer: 0
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (selectedCategory) {
      fetchQuestions()
    }
  }, [selectedCategory])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      setCategories(data)
      if (data.length > 0) {
        setSelectedCategory(data[0].id)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`/api/questions/category/${selectedCategory}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      setQuestions(data)
    } catch (error) {
      console.error('Error fetching questions:', error)
    }
  }

  const fetchPassedResults = async () => {
    try {
      const response = await fetch('/api/results/passed', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      setPassedResults(data)
    } catch (error) {
      console.error('Error fetching results:', error)
    }
  }

  const handleAddQuestion = async (e) => {
    e.preventDefault()
    try {
      // Validate inputs
      if (!formData.text.trim()) {
        alert('الرجاء إدخال نص السؤال')
        return
      }
      if (formData.options.filter(o => o.trim()).length < 2) {
        alert('الرجاء إدخال خيارين على الأقل')
        return
      }
      
      const formDataToSend = new FormData()
      formDataToSend.append('categoryId', selectedCategory)
      formDataToSend.append('text', formData.text.trim())
      formDataToSend.append('options', JSON.stringify(formData.options.filter(o => o.trim())))
      formDataToSend.append('correctAnswer', formData.correctAnswer)
      if (formData.image) {
        formDataToSend.append('image', formData.image)
      }
      if (formData.imageUrl) {
        formDataToSend.append('imageUrl', formData.imageUrl)
      }

      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      })

      if (response.ok) {
        alert('تم إضافة السؤال بنجاح')
        setFormData({
          categoryId: '',
          text: '',
          image: null,
          imageUrl: '',
          options: ['', '', '', ''],
          correctAnswer: 0
        })
        setShowAddForm(false)
        fetchQuestions()
      } else {
        const error = await response.json()
        alert('خطأ: ' + (error.error || 'فشل إضافة السؤال'))
      }
    } catch (error) {
      console.error('Error adding question:', error)
      alert('خطأ: ' + error.message)
    }
  }

  const handleDeleteQuestion = async (id) => {
    if (confirm('هل أنت متأكد من حذف هذا السؤال؟')) {
      try {
        const response = await fetch(`/api/questions/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (response.ok) {
          fetchQuestions()
        }
      } catch (error) {
        console.error('Error deleting question:', error)
      }
    }
  }

  const handleDeleteAllQuestions = async () => {
    if (confirm('هل أنت متأكد من حذف جميع الأسئلة؟')) {
      try {
        for (const question of questions) {
          await fetch(`/api/questions/${question.id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          })
        }
        fetchQuestions()
      } catch (error) {
        console.error('Error deleting questions:', error)
      }
    }
  }

  const handlePrintQuestions = () => {
    const printContent = questions.map((q, idx) => 
      `${idx + 1}. ${q.text}\n${JSON.parse(q.options).map((opt, i) => `  ${String.fromCharCode(97 + i)}) ${opt}`).join('\n')}\n`
    ).join('\n')
    
    const printWindow = window.open('', '', 'height=600,width=800')
    printWindow.document.write('<pre>' + printContent + '</pre>')
    printWindow.print()
  }

  const handleDownloadResults = () => {
    let csv = 'اسم الطالب,النسبة المئوية,التاريخ\n'
    passedResults.forEach(r => {
      csv += `${r.student.name},${r.percentage.toFixed(1)}%,${new Date(r.createdAt).toLocaleDateString('ar-SA')}\n`
    })

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'نتائج_الناجحين.csv'
    link.click()
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">لوحة التحكم</h1>
          <div className="flex gap-4">
            <button
              onClick={() => window.location.href = '/'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              الصفحة الرئيسية
            </button>
            <button
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <button
            onClick={() => {
              setActiveTab('questions')
              setShowAddForm(false)
            }}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === 'questions'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-800 hover:bg-gray-100'
            }`}
          >
            إدارة الأسئلة
          </button>
          <button
            onClick={() => {
              setActiveTab('results')
              fetchPassedResults()
            }}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === 'results'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-800 hover:bg-gray-100'
            }`}
          >
            الطلاب الناجحون
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {activeTab === 'questions' && (
            <div>
              {/* Category Selection */}
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">اختر القسم</label>
                <select
                  value={selectedCategory || ''}
                  onChange={(e) => setSelectedCategory(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nameAr}</option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-6 flex-wrap">
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                >
                  {showAddForm ? 'إلغاء' : 'إضافة سؤال'}
                </button>
                <button
                  onClick={handlePrintQuestions}
                  disabled={questions.length === 0}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg"
                >
                  طباعة الأسئلة
                </button>
                <button
                  onClick={handleDownloadResults}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg"
                >
                  تنزيل النتائج
                </button>
                <button
                  onClick={handleDeleteAllQuestions}
                  disabled={questions.length === 0}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg"
                >
                  مسح الأسئلة
                </button>
              </div>

              {/* Add Question Form */}
              {showAddForm && (
                <form onSubmit={handleAddQuestion} className="bg-gray-50 p-6 rounded-lg mb-6">
                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">السؤال</label>
                    <textarea
                      value={formData.text}
                      onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                      placeholder="أدخل نص السؤال"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                      rows="3"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">رفع صورة (اختياري)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0]
                        if (file) {
                          setFormData({ ...formData, image: file })
                        }
                      }}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                    />
                    {formData.image && (
                      <p className="text-sm text-green-600 mt-2">✓ تم اختيار الصورة: {formData.image.name}</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">أو رابط صورة (اختياري)</label>
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">الخيارات</label>
                    {formData.options.map((option, index) => (
                      <input
                        key={index}
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...formData.options]
                          newOptions[index] = e.target.value
                          setFormData({ ...formData, options: newOptions })
                        }}
                        placeholder={`الخيار ${index + 1}`}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg mb-2 focus:outline-none focus:border-purple-500"
                        required
                      />
                    ))}
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">الإجابة الصحيحة</label>
                    <select
                      value={formData.correctAnswer}
                      onChange={(e) => setFormData({ ...formData, correctAnswer: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                    >
                      {formData.options.map((_, index) => (
                        <option key={index} value={index}>الخيار {index + 1}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg"
                  >
                    إضافة السؤال
                  </button>
                </form>
              )}

              {/* Questions List */}
              <div className="space-y-4">
                {questions.map((q, index) => (
                  <div key={q.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-2">{index + 1}. {q.text}</h4>
                        {q.imageUrl && (
                          <img src={q.imageUrl} alt="سؤال" className="max-w-xs mb-2 rounded" />
                        )}
                        <ul className="text-sm text-gray-600">
                          {JSON.parse(q.options).map((opt, i) => (
                            <li key={i}>• {opt}</li>
                          ))}
                        </ul>
                      </div>
                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded ml-4"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'results' && (
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">الطلاب الناجحون</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="px-4 py-2 text-right">اسم الطالب</th>
                      <th className="px-4 py-2 text-right">النسبة المئوية</th>
                      <th className="px-4 py-2 text-right">التاريخ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {passedResults.map((result, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-2">{result.student.name}</td>
                        <td className="px-4 py-2 text-purple-600 font-semibold">{result.percentage.toFixed(1)}%</td>
                        <td className="px-4 py-2">{new Date(result.createdAt).toLocaleDateString('ar-SA')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                onClick={handleDownloadResults}
                className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
              >
                تنزيل Excel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
