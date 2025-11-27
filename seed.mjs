import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'reading',
        nameAr: 'قراءة'
      }
    }),
    prisma.category.create({
      data: {
        name: 'math',
        nameAr: 'رياضيات'
      }
    }),
    prisma.category.create({
      data: {
        name: 'science',
        nameAr: 'علوم'
      }
    }),
    prisma.category.create({
      data: {
        name: 'comprehensive',
        nameAr: 'اختبار شامل'
      }
    })
  ])

  console.log('Categories created:', categories)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
