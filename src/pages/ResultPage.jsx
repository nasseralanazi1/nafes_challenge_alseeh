export default function ResultPage({ result, onBack }) {
  const { result: resultData, passed, percentage } = result

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
        {passed ? (
          <>
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-green-600 mb-2">مبروك!</h2>
            <p className="text-gray-600 mb-6">لقد نجحت في الاختبار</p>
            
            {/* Certificate */}
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg p-6 mb-6 text-white">
              <h3 className="text-2xl font-bold mb-2">شهادة نجاح</h3>
              <p className="text-lg mb-4">يشهد هذا بأن</p>
              <p className="text-xl font-bold mb-4">{resultData.student?.name || 'الطالب'}</p>
              <p className="text-lg mb-4">قد حقق {percentage.toFixed(1)}%</p>
              <p className="text-sm">في اختبار {resultData.category?.nameAr}</p>
            </div>
          </>
        ) : (
          <>
            <div className="text-6xl mb-4">😔</div>
            <h2 className="text-3xl font-bold text-red-600 mb-2">لم تنجح</h2>
            <p className="text-gray-600 mb-6">حاول مرة أخرى لتحقيق 80% على الأقل</p>
          </>
        )}

        {/* Score */}
        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <p className="text-gray-600 mb-2">نسبتك</p>
          <p className="text-4xl font-bold text-purple-600">{percentage.toFixed(1)}%</p>
          <p className="text-gray-600 text-sm mt-2">
            {resultData.score} من {resultData.totalQuestions}
          </p>
        </div>

        <button
          onClick={onBack}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition"
        >
          العودة للصفحة الرئيسية
        </button>
      </div>
    </div>
  )
}
