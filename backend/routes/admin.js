const express = require('express');
const {
  getDashboardStats,
  getSystemAnalytics,
} = require('../controllers/admin');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes are protected and admin only
router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/analytics', getSystemAnalytics);

module.exports = router;
