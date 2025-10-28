const express = require('express');
const cors = require('cors');
require('dotenv').config();

const restaurantRoutes = require('./routes/restaurants');
const reviewRoutes = require('./routes/reviews');
const { readJsonFile } = require('./utils/fileManager');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({
    message: '🍜 Restaurant Review API',
    version: '1.0.0',
    endpoints: {
      restaurants: '/api/restaurants',
      reviews: '/api/reviews',
      stats: '/api/stats'
    }
  });
});

app.use('/api/restaurants', restaurantRoutes);
app.use('/api/reviews', reviewRoutes);

// ========================================
// ✅ GET /api/stats - ดึงสถิติทั้งหมด
// ========================================
// ขั้นตอน:
// 1. อ่านข้อมูล restaurants.json และ reviews.json
// 2. คำนวณ:
//    - totalRestaurants: จำนวนร้านทั้งหมด
//    - totalReviews: จำนวนรีวิวทั้งหมด
//    - averageRating: คะแนนเฉลี่ยของร้านทั้งหมด (ปัดเศษ 1 ตำแหน่ง)
//    - topRatedRestaurants: ร้าน 5 อันดับแรกที่มี rating สูงสุด
// 3. ส่งข้อมูลกลับในรูปแบบ: { success: true, data: {...} }

app.get('/api/stats', async (req, res) => {
  try {
    // 1️⃣ อ่านข้อมูลจากไฟล์ JSON
    const restaurants = await readJsonFile('./data/restaurants.json');
    const reviews = await readJsonFile('./data/reviews.json');

    // ตรวจสอบว่ามีข้อมูลหรือไม่
    if (!Array.isArray(restaurants) || !Array.isArray(reviews)) {
      return res.status(500).json({
        success: false,
        message: 'ไฟล์ข้อมูลไม่ถูกต้อง'
      });
    }

    // 2️⃣ คำนวณสถิติพื้นฐาน
    const totalRestaurants = restaurants.length;
    const totalReviews = reviews.length;

    // หาค่าเฉลี่ยคะแนนของร้านทั้งหมด
    const totalRating = restaurants.reduce((sum, r) => sum + (r.averageRating || 0), 0);
    const averageRating = totalRestaurants > 0
      ? parseFloat((totalRating / totalRestaurants).toFixed(1))
      : 0;

    // 3️⃣ หา top 5 ร้านที่มีคะแนนเฉลี่ยสูงสุด
    const topRatedRestaurants = [...restaurants]
      .filter(r => typeof r.averageRating === 'number')
      .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
      .slice(0, 5);

    // 4️⃣ ส่งผลลัพธ์กลับ
    res.json({
      success: true,
      data: {
        totalRestaurants,
        totalReviews,
        averageRating,
        topRatedRestaurants
      }
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงสถิติ'
    });
  }
});

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
});
