import React, { useState, useEffect } from 'react'
import html2canvas from 'html2canvas'

export default function ResultsPage({ result, studentName, categoryId, questions, answers, onBack }) {
  const [showCertificate, setShowCertificate] = useState(false)
  const certificateRef = React.useRef(null)

  // حساب النسبة المئوية
  const correctCount = result?.correctCount || 0
  const totalCount = result?.totalQuestions || questions?.length || 0
  const percentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0
  const isPassed = percentage >= 80

  // الحصول على تفاصيل الإجابات
  const getAnswerDetails = () => {
    if (!questions || !answers) return []
    
    return questions.map((question, index) => {
      const selectedAnswerIndex = answers[index]
      const selectedAnswer = question.shuffledOptions?.[selectedAnswerIndex] || 'لم يتم الإجابة'
      const correctAnswer = question.options?.[question.originalCorrectAnswer] || question.options?.[question.correctAnswer]
      const isCorrect = selectedAnswer === correctAnswer
      
      return {
        questionId: question.id,
        questionText: question.text,
        questionImage: question.imageUrl,
        selectedAnswer,
        correctAnswer,
        isCorrect,
        allOptions: question.options || question.shuffledOptions
      }
    })
  }

  const answerDetails = getAnswerDetails()

  const downloadCertificate = async () => {
    if (certificateRef.current) {
      try {
        const canvas = await html2canvas(certificateRef.current, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff'
        })
        const link = document.createElement('a')
        link.href = canvas.toDataURL('image/png')
        link.download = `شهادة_${studentName}_${new Date().getTime()}.png`
        link.click()
      } catch (error) {
        console.error('Error downloading certificate:', error)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">نتائج الاختبار</h1>
          <p className="text-xl text-gray-600">اسم الطالب: {studentName}</p>
        </div>

        {/* Score Card */}
        <div className="bg-white rounded-xl shadow-2xl p-8 mb-8">
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="text-4xl font-bold text-blue-600">{correctCount}</div>
              <div className="text-gray-600 mt-2">إجابات صحيحة</div>
            </div>
            <div className="text-center p-6 bg-red-50 rounded-lg">
              <div className="text-4xl font-bold text-red-600">{totalCount - correctCount}</div>
              <div className="text-gray-600 mt-2">إجابات خاطئة</div>
            </div>
            <div className={`text-center p-6 rounded-lg ${isPassed ? 'bg-green-50' : 'bg-yellow-50'}`}>
              <div className={`text-5xl font-bold ${isPassed ? 'text-green-600' : 'text-yellow-600'}`}>
                {percentage}%
              </div>
              <div className="text-gray-600 mt-2">النسبة المئوية</div>
            </div>
          </div>

          {/* Status Message */}
          <div className={`text-center p-6 rounded-lg ${isPassed ? 'bg-green-100 border-2 border-green-500' : 'bg-yellow-100 border-2 border-yellow-500'}`}>
            {isPassed ? (
              <div>
                <p className="text-2xl font-bold text-green-700 mb-2">🎉 مبروك! لقد نجحت!</p>
                <p className="text-green-600">لقد حققت {percentage}% من الإجابات الصحيحة</p>
              </div>
            ) : (
              <div>
                <p className="text-2xl font-bold text-yellow-700 mb-2">⚠️ حاول مرة أخرى</p>
                <p className="text-yellow-600">تحتاج إلى 80% لتجاوز الاختبار. حاليًا لديك {percentage}%</p>
              </div>
            )}
          </div>
        </div>

        {/* Certificate Button */}
        {isPassed && (
          <div className="text-center mb-8">
            <button
              onClick={() => setShowCertificate(!showCertificate)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-lg transition"
            >
              {showCertificate ? 'إخفاء الشهادة' : 'عرض الشهادة'}
            </button>
          </div>
        )}

        {/* Certificate */}
        {isPassed && showCertificate && (
          <div className="bg-white rounded-xl shadow-2xl p-8 mb-8">
            <div
              ref={certificateRef}
              className="bg-gradient-to-br from-blue-50 to-purple-50 p-12 text-center border-8 border-gold rounded-lg"
              style={{ borderColor: '#FFD700' }}
            >
              <div className="mb-8">
                <div className="text-6xl mb-4">🏆</div>
                <h2 className="text-4xl font-bold text-gray-800 mb-2">شهادة إتمام</h2>
                <p className="text-gray-600">تُمنح هذه الشهادة لـ</p>
              </div>

              <div className="my-8 pb-4 border-b-4 border-gray-800">
                <p className="text-3xl font-bold text-blue-600">{studentName}</p>
              </div>

              <div className="mb-8">
                <p className="text-lg text-gray-700 mb-4">
                  لنجاحه في اختبار تحدي نافس بنسبة {percentage}%
                </p>
                <p className="text-gray-600">
                  التاريخ: {new Date().toLocaleDateString('ar-SA')}
                </p>
              </div>

              <div className="text-gray-500 text-sm mt-8">
                <p>متوسطة السيح بمحافظة الخرج</p>
              </div>
            </div>

            <div className="text-center mt-6">
              <button
                onClick={downloadCertificate}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition"
              >
                تحميل الشهادة
              </button>
            </div>
          </div>
        )}

        {/* Feedback Section */}
        <div className="bg-white rounded-xl shadow-2xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">تغذية راجعة مفصلة</h2>

          <div className="space-y-6">
            {answerDetails.map((detail, index) => (
              <div
                key={index}
                className={`p-6 rounded-lg border-l-4 ${
                  detail.isCorrect
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                }`}
              >
                {/* Question Number and Status */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-gray-700">السؤال {index + 1}</span>
                    <span className={`text-2xl ${detail.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                      {detail.isCorrect ? '✓' : '✗'}
                    </span>
                  </div>
                  <span className={`font-bold ${detail.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    {detail.isCorrect ? 'إجابة صحيحة' : 'إجابة خاطئة'}
                  </span>
                </div>

                {/* Question Image */}
                {detail.questionImage && (
                  <div className="mb-4">
                    <img
                      src={detail.questionImage}
                      alt="صورة السؤال"
                      className="max-w-md mx-auto rounded-lg"
                    />
                  </div>
                )}

                {/* Question Text */}
                <div className="mb-4">
                  <p className="text-lg font-semibold text-gray-800 text-right mb-2">السؤال:</p>
                  <p className="text-gray-700 text-right">{detail.questionText}</p>
                </div>

                {/* Student's Answer */}
                <div className="mb-4">
                  <p className="text-lg font-semibold text-gray-800 text-right mb-2">إجابتك:</p>
                  <div className={`p-3 rounded-lg text-right ${detail.isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                    <p className="text-gray-700">{detail.selectedAnswer}</p>
                  </div>
                </div>

                {/* Correct Answer (if wrong) */}
                {!detail.isCorrect && (
                  <div className="mb-4">
                    <p className="text-lg font-semibold text-green-700 text-right mb-2">الإجابة الصحيحة:</p>
                    <div className="p-3 rounded-lg text-right bg-green-100">
                      <p className="text-gray-700">{detail.correctAnswer}</p>
                    </div>
                  </div>
                )}

                {/* All Options */}
                <div className="mt-4">
                  <p className="text-lg font-semibold text-gray-800 text-right mb-2">جميع الخيارات:</p>
                  <div className="space-y-2 text-right">
                    {detail.allOptions?.map((option, optIndex) => (
                      <div
                        key={optIndex}
                        className={`p-2 rounded-lg ${
                          option === detail.correctAnswer
                            ? 'bg-green-100 border-2 border-green-500'
                            : option === detail.selectedAnswer && !detail.isCorrect
                            ? 'bg-red-100 border-2 border-red-500'
                            : 'bg-gray-100'
                        }`}
                      >
                        <span className="font-semibold">{String.fromCharCode(65 + optIndex)}.</span> {option}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mb-8">
          <button
            onClick={onBack}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-lg transition"
          >
            العودة إلى الصفحة الرئيسية
          </button>
        </div>
      </div>
    </div>
  )
}
