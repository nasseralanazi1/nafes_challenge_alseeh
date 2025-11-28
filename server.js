import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware للتحقق من التوكن
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// API Routes

// 1. تسجيل دخول الإدارة
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // التحقق من بيانات المسؤول
    if (username === 'ناصر العنزي' && password === 'Abolama5025$') {
      const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
      return res.json({ token, success: true });
    }
    
    res.status(401).json({ error: 'Invalid credentials' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. إضافة فئة (قسم)
app.post('/api/categories', verifyToken, async (req, res) => {
  try {
    const { name, nameAr } = req.body;
    const category = await prisma.category.create({
      data: { name, nameAr }
    });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. الحصول على جميع الفئات
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. إضافة سؤال
app.post('/api/questions', verifyToken, async (req, res) => {
  try {
    const { categoryId, text, options, correctAnswer } = req.body;
    const question = await prisma.question.create({
      data: {
        categoryId: parseInt(categoryId),
        text,
        options: JSON.stringify(options),
        correctAnswer: parseInt(correctAnswer)
      }
    });
    res.json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. الحصول على الأسئلة حسب الفئة
app.get('/api/questions/category/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const questions = await prisma.question.findMany({
      where: { categoryId: parseInt(categoryId) }
    });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5.5 الحصول على أسئلة عشوائية من فئة معينة
app.get('/api/questions/category/:categoryId/random/:count', async (req, res) => {
  try {
    const { categoryId, count } = req.params;
    const questions = await prisma.question.findMany({
      where: { categoryId: parseInt(categoryId) }
    });
    
    // تحويل العدد إلى رقم
    const questionsCount = Math.min(parseInt(count), questions.length);
    
    // اختيار أسئلة عشوائية
    const shuffled = questions.sort(() => Math.random() - 0.5);
    const randomQuestions = shuffled.slice(0, questionsCount);
    
    res.json(randomQuestions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5.6 الحصول على أسئلة للاختبار الشامل (10 من كل قسم)
app.get('/api/questions/comprehensive', async (req, res) => {
  try {
    // الأقسام الثلاثة (بدون الشامل)
    const categoryNames = ['reading', 'math', 'science'];
    const comprehensiveQuestions = [];
    
    for (const categoryName of categoryNames) {
      const category = await prisma.category.findUnique({
        where: { name: categoryName }
      });
      
      if (category) {
        const questions = await prisma.question.findMany({
          where: { categoryId: category.id }
        });
        
        // اختيار 10 أسئلة عشوائية من كل قسم
        const shuffled = questions.sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, 10);
        comprehensiveQuestions.push(...selected);
      }
    }
    
    // خلط الأسئلة النهائية
    const finalQuestions = comprehensiveQuestions.sort(() => Math.random() - 0.5);
    res.json(finalQuestions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. تحديث سؤال
app.put('/api/questions/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { text, options, correctAnswer } = req.body;
    const question = await prisma.question.update({
      where: { id: parseInt(id) },
      data: {
        text,
        options: JSON.stringify(options),
        correctAnswer: parseInt(correctAnswer)
      }
    });
    res.json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 7. حذف سؤال
app.delete('/api/questions/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.question.delete({
      where: { id: parseInt(id) }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 8. حذف جميع الأسئلة في فئة معينة
app.delete('/api/categories/:categoryId/questions', verifyToken, async (req, res) => {
  try {
    const { categoryId } = req.params;
    await prisma.question.deleteMany({
      where: { categoryId: parseInt(categoryId) }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 9. إنشاء نتيجة اختبار
app.post('/api/results', async (req, res) => {
  try {
    const { studentName, categoryId, answers, totalQuestions } = req.body;
    
    // إنشاء أو البحث عن الطالب
    let student = await prisma.student.findUnique({
      where: { name: studentName }
    });
    
    if (!student) {
      student = await prisma.student.create({
        data: { name: studentName }
      });
    }
    
    // حساب النتيجة
    let score = 0;
    for (const answer of answers) {
      if (answer.isCorrect) score++;
    }
    
    const percentage = (score / totalQuestions) * 100;
    const passed = percentage >= 80;
    
    // حفظ النتيجة
    const result = await prisma.result.create({
      data: {
        studentId: student.id,
        categoryId: parseInt(categoryId),
        score,
        totalQuestions,
        percentage,
        passed
      }
    });
    
    // حفظ الإجابات
    for (const answer of answers) {
      await prisma.answer.create({
        data: {
          studentId: student.id,
          questionId: answer.questionId,
          selectedAnswer: answer.selectedAnswer,
          isCorrect: answer.isCorrect
        }
      });
    }
    
    res.json({ result, passed, percentage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 9.5 الحصول على الإحصائيات
app.get('/api/stats', async (req, res) => {
  try {
    // عدد الطلاب الناجحين
    const passedResults = await prisma.result.findMany({
      where: { passed: true },
      distinct: ['studentId']
    });
    
    // إجمالي المحاولات
    const totalAttempts = await prisma.result.count();
    
    // عدد الطلاب المنفردين
    const totalStudents = await prisma.student.count();
    
    // حساب نسبة النجاح
    const percentage = totalAttempts > 0 ? Math.round((passedResults.length / totalStudents) * 100) : 0;
    
    res.json({
      passed: passedResults.length,
      total: totalAttempts,
      percentage: percentage
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 10. الحصول على النتائج الناجحة
app.get('/api/results/passed', verifyToken, async (req, res) => {
  try {
    const results = await prisma.result.findMany({
      where: { passed: true },
      include: { student: true, category: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 11. الحصول على النتائج حسب الفئة
app.get('/api/results/category/:categoryId', verifyToken, async (req, res) => {
  try {
    const { categoryId } = req.params;
    const results = await prisma.result.findMany({
      where: {
        categoryId: parseInt(categoryId),
        passed: true
      },
      include: { student: true }
    });
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 12. جميع الأسئلة (للطباعة)
app.get('/api/admin/questions', verifyToken, async (req, res) => {
  try {
    const questions = await prisma.question.findMany({
      include: { category: true }
    });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// تشغيل الخادم
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
