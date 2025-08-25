const User = require('../models/User');
const Appointment = require('../models/Appointment');
const moment = require('moment');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
const getDashboardStats = async (req, res) => {
  try {
    const today = moment().startOf('day');
    const thisWeek = moment().startOf('week');
    const thisMonth = moment().startOf('month');

    // Get user counts
    const [
      totalUsers,
      totalPatients,
      totalDoctors,
      activeUsers,
      newUsersThisMonth,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'patient' }),
      User.countDocuments({ role: 'doctor' }),
      User.countDocuments({ isActive: true }),
      User.countDocuments({
        createdAt: { $gte: thisMonth.toDate() },
      }),
    ]);

    // Get appointment counts
    const [
      totalAppointments,
      todayAppointments,
      thisWeekAppointments,
      thisMonthAppointments,
      completedAppointments,
      cancelledAppointments,
    ] = await Promise.all([
      Appointment.countDocuments(),
      Appointment.countDocuments({
        appointmentDate: { $gte: today.toDate(), $lt: moment(today).endOf('day').toDate() },
      }),
      Appointment.countDocuments({
        appointmentDate: { $gte: thisWeek.toDate() },
      }),
      Appointment.countDocuments({
        appointmentDate: { $gte: thisMonth.toDate() },
      }),
      Appointment.countDocuments({ status: 'completed' }),
      Appointment.countDocuments({ status: 'cancelled' }),
    ]);

    // Get revenue data
    const monthlyRevenue = await Appointment.aggregate([
      {
        $match: {
          status: 'completed',
          appointmentDate: { $gte: thisMonth.toDate() },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$consultationFee' },
        },
      },
    ]);

    // Get top doctors by appointments
    const topDoctors = await Appointment.aggregate([
      {
        $match: {
          status: 'completed',
          appointmentDate: { $gte: thisMonth.toDate() },
        },
      },
      {
        $group: {
          _id: '$doctor',
          appointmentCount: { $sum: 1 },
          revenue: { $sum: '$consultationFee' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'doctor',
        },
      },
      {
        $unwind: '$doctor',
      },
      {
        $project: {
          name: '$doctor.name',
          specialization: '$doctor.specialization',
          appointmentCount: 1,
          revenue: 1,
        },
      },
      {
        $sort: { appointmentCount: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    const stats = {
      users: {
        total: totalUsers,
        patients: totalPatients,
        doctors: totalDoctors,
        active: activeUsers,
        newThisMonth: newUsersThisMonth,
      },
      appointments: {
        total: totalAppointments,
        today: todayAppointments,
        thisWeek: thisWeekAppointments,
        thisMonth: thisMonthAppointments,
        completed: completedAppointments,
        cancelled: cancelledAppointments,
      },
      revenue: {
        thisMonth: monthlyRevenue[0]?.total || 0,
      },
      topDoctors,
    };

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get system analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin only)
const getSystemAnalytics = async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    const startDate = moment().subtract(parseInt(period), 'days').startOf('day');

    // Get daily appointment counts
    const dailyAppointments = await Appointment.aggregate([
      {
        $match: {
          appointmentDate: { $gte: startDate.toDate() },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$appointmentDate',
            },
          },
          count: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
          },
          cancelled: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] },
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Get daily user registrations
    const dailyRegistrations = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate.toDate() },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt',
            },
          },
          patients: {
            $sum: { $cond: [{ $eq: ['$role', 'patient'] }, 1, 0] },
          },
          doctors: {
            $sum: { $cond: [{ $eq: ['$role', 'doctor'] }, 1, 0] },
          },
          total: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Get specialization distribution
    const specializationStats = await User.aggregate([
      {
        $match: { role: 'doctor', isActive: true },
      },
      {
        $group: {
          _id: '$specialization',
          count: { $sum: 1 },
          avgRating: { $avg: '$rating.average' },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    const analytics = {
      dailyAppointments,
      dailyRegistrations,
      specializationStats,
    };

    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = {
  getDashboardStats,
  getSystemAnalytics,
};
