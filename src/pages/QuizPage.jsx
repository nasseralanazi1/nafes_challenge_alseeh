import { useState, useEffect } from 'react'

export default function QuizPage({ categoryId, onComplete, onBack }) {
  const [studentName, setStudentName] = useState('')
  const [quizStarted, setQuizStarted] = useState(false)
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState(null)

  useEffect(() => {
    if (quizStarted && studentName) {
      fetchQuestions()
    }
  }, [quizStarted, studentName])

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/questions/category/${categoryId}`)
      const allQuestions = await response.json()
      
      // اختيار 10 أسئلة عشوائية
      const shuffled = allQuestions.sort(() => Math.random() - 0.5)
      const selected = shuffled.slice(0, 10)
      
      // ترتيب الخيارات عشوائياً لكل سؤال
      const questionsWithShuffledOptions = selected.map(q => ({
        ...q,
        options: JSON.parse(q.options),
        originalCorrectAnswer: q.correctAnswer,
        shuffledOptions: shuffleArray(JSON.parse(q.options)),
        correctAnswerIndex: JSON.parse(q.options).indexOf(JSON.parse(q.options)[q.correctAnswer])
      }))
      
      setQuestions(questionsWithShuffledOptions)
      setAnswers(new Array(questionsWithShuffledOptions.length).fill(null))
    } catch (error) {
      console.error('Error fetching questions:', error)
    } finally {
      setLoading(false)
    }
  }

  const shuffleArray = (array) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const handleAnswerSelect = (optionIndex) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = optionIndex
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      // حساب النتيجة
      const answersData = questions.map((q, index) => {
        const selectedOptionIndex = answers[index]
        const selectedOption = q.shuffledOptions[selectedOptionIndex]
        const isCorrect = selectedOption === q.options[q.originalCorrectAnswer]
        
        return {
          questionId: q.id,
          selectedAnswer: selectedOptionIndex,
          isCorrect
        }
      })

      const response = await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName,
          categoryId,
          answers: answersData,
          totalQuestions: questions.length
        })
      })

      const result = await response.json()
      onComplete(result)
    } catch (error) {
      console.error('Error submitting quiz:', error)
    }
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">ابدأ الاختبار</h2>
          
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">اسم الطالب</label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="أدخل اسمك الكامل"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setQuizStarted(true)}
              disabled={!studentName}
              className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition"
            >
              ابدأ الآن
            </button>
            <button
              onClick={onBack}
              className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 rounded-lg transition"
            >
              رجوع
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-2xl">جاري تحميل الأسئلة...</div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl p-8 text-center">
          <p className="text-xl text-gray-800 mb-4">لا توجد أسئلة متاحة في هذا القسم</p>
          <button
            onClick={onBack}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg"
          >
            رجوع
          </button>
        </div>
      </div>
    )
  }

  const question = questions[currentQuestion]
  const selectedAnswer = answers[currentQuestion]

  return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">السؤال {currentQuestion + 1} من {questions.length}</span>
            <span className="text-gray-600">{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <h3 className="text-2xl font-bold text-gray-800 mb-6">{question.text}</h3>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {question.shuffledOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full p-4 text-right rounded-lg border-2 transition ${
                selectedAnswer === index
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-300 hover:border-purple-400'
              }`}
            >
              <span className="font-semibold">{String.fromCharCode(65 + index)}.</span> {option}
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex-1 bg-gray-400 hover:bg-gray-500 disabled:bg-gray-300 text-white font-bold py-2 rounded-lg transition"
          >
            السابق
          </button>
          
          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={answers.includes(null)}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 rounded-lg transition"
            >
              إرسال
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded-lg transition"
            >
              التالي
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
