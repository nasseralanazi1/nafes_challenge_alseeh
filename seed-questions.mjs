import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // Get categories
    const reading = await prisma.category.findUnique({ where: { name: 'reading' } })
    const math = await prisma.category.findUnique({ where: { name: 'math' } })
    const science = await prisma.category.findUnique({ where: { name: 'science' } })
    const comprehensive = await prisma.category.findUnique({ where: { name: 'comprehensive' } })

    console.log('Categories found:', { reading: reading?.id, math: math?.id, science: science?.id, comprehensive: comprehensive?.id })

    // Add Reading Questions
    if (reading) {
      const readingQuestions = [
        {
          categoryId: reading.id,
          text: 'ما هو معنى كلمة "استقلال"؟',
          options: JSON.stringify(['الاعتماد على الآخرين', 'الاعتماد على النفس والحرية', 'الخوف من المسؤولية', 'عدم القدرة على القرار']),
          correctAnswer: 1
        },
        {
          categoryId: reading.id,
          text: 'في الجملة "الطالب المجتهد ينجح"، ما نوع الجملة؟',
          options: JSON.stringify(['اسمية', 'فعلية', 'شرطية', 'استفهامية']),
          correctAnswer: 0
        },
        {
          categoryId: reading.id,
          text: 'ما هو الفكرة الرئيسية للنص؟',
          options: JSON.stringify(['تفاصيل ثانوية', 'الفكرة المركزية', 'أمثلة توضيحية', 'خلاصة النص']),
          correctAnswer: 1
        },
        {
          categoryId: reading.id,
          text: 'ما معنى كلمة "الحكمة"؟',
          options: JSON.stringify(['الغباء', 'الفهم والعلم والحنكة', 'الخوف', 'الكسل']),
          correctAnswer: 1
        },
        {
          categoryId: reading.id,
          text: 'أي من الكلمات التالية مرادف لكلمة "سريع"؟',
          options: JSON.stringify(['بطيء', 'خاطف', 'ثابت', 'ضعيف']),
          correctAnswer: 1
        }
      ]

      for (const q of readingQuestions) {
        await prisma.question.create({ data: q })
      }
      console.log('✓ Reading questions added')
    }

    // Add Math Questions
    if (math) {
      const mathQuestions = [
        {
          categoryId: math.id,
          text: '2 + 3 × 4 = ؟',
          options: JSON.stringify(['14', '20', '12', '10']),
          correctAnswer: 0
        },
        {
          categoryId: math.id,
          text: 'ما هو الجذر التربيعي للعدد 16؟',
          options: JSON.stringify(['2', '4', '8', '6']),
          correctAnswer: 1
        },
        {
          categoryId: math.id,
          text: 'إذا كان x + 5 = 12، فما قيمة x؟',
          options: JSON.stringify(['7', '17', '5', '12']),
          correctAnswer: 0
        },
        {
          categoryId: math.id,
          text: 'ما هو محيط المربع الذي طول ضلعه 5 سم؟',
          options: JSON.stringify(['10 سم', '20 سم', '25 سم', '15 سم']),
          correctAnswer: 1
        },
        {
          categoryId: math.id,
          text: '50% من 200 = ؟',
          options: JSON.stringify(['50', '100', '150', '200']),
          correctAnswer: 1
        }
      ]

      for (const q of mathQuestions) {
        await prisma.question.create({ data: q })
      }
      console.log('✓ Math questions added')
    }

    // Add Science Questions
    if (science) {
      const scienceQuestions = [
        {
          categoryId: science.id,
          text: 'كم عدد كواكب المجموعة الشمسية؟',
          options: JSON.stringify(['7', '8', '9', '10']),
          correctAnswer: 1
        },
        {
          categoryId: science.id,
          text: 'ما هو أكبر كوكب في المجموعة الشمسية؟',
          options: JSON.stringify(['زحل', 'المشتري', 'نبتون', 'أورانوس']),
          correctAnswer: 1
        },
        {
          categoryId: science.id,
          text: 'ما هو الغاز الذي نتنفسه؟',
          options: JSON.stringify(['ثاني أكسيد الكربون', 'الأكسجين', 'النيتروجين', 'الهيدروجين']),
          correctAnswer: 1
        },
        {
          categoryId: science.id,
          text: 'كم عدد عظام جسم الإنسان البالغ؟',
          options: JSON.stringify(['186', '206', '226', '246']),
          correctAnswer: 1
        },
        {
          categoryId: science.id,
          text: 'ما هي أصغر وحدة في الكائن الحي؟',
          options: JSON.stringify(['الذرة', 'الجزيء', 'الخلية', 'النسيج']),
          correctAnswer: 2
        }
      ]

      for (const q of scienceQuestions) {
        await prisma.question.create({ data: q })
      }
      console.log('✓ Science questions added')
    }

    console.log('\n✅ All questions added successfully!')
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()
