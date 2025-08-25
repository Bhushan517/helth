import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FiTrendingUp,
  FiUsers,
  FiCalendar,
  FiDollarSign,
  FiActivity,
  FiPieChart,
  FiDownload,
  FiRefreshCw
} from 'react-icons/fi';
import { getAnalytics } from '../../redux/slices/adminSlice';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const SystemAnalytics = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.admin);
  const [timeRange, setTimeRange] = useState('30');
  const [activeChart, setActiveChart] = useState('appointments');

  useEffect(() => {
    dispatch(getAnalytics({ period: timeRange }));
  }, [dispatch, timeRange]);

  // Mock data for charts (replace with real data from analytics)
  const mockChartData = {
    appointments: [
      { date: '2024-01-15', total: 45, completed: 38, cancelled: 7 },
      { date: '2024-01-16', total: 52, completed: 47, cancelled: 5 },
      { date: '2024-01-17', total: 38, completed: 35, cancelled: 3 },
      { date: '2024-01-18', total: 61, completed: 55, cancelled: 6 },
      { date: '2024-01-19', total: 49, completed: 44, cancelled: 5 },
      { date: '2024-01-20', total: 57, completed: 51, cancelled: 6 },
      { date: '2024-01-21', total: 43, completed: 39, cancelled: 4 },
    ],
    users: [
      { date: '2024-01-15', patients: 12, doctors: 2, total: 14 },
      { date: '2024-01-16', patients: 18, doctors: 1, total: 19 },
      { date: '2024-01-17', patients: 8, doctors: 3, total: 11 },
      { date: '2024-01-18', patients: 22, doctors: 1, total: 23 },
      { date: '2024-01-19', patients: 15, doctors: 2, total: 17 },
      { date: '2024-01-20', patients: 19, doctors: 1, total: 20 },
      { date: '2024-01-21', patients: 11, doctors: 0, total: 11 },
    ]
  };

  const specializations = [
    { name: 'Cardiology', count: 45, percentage: 25, color: 'bg-blue-500' },
    { name: 'Dermatology', count: 38, percentage: 21, color: 'bg-green-500' },
    { name: 'Neurology', count: 32, percentage: 18, color: 'bg-purple-500' },
    { name: 'Orthopedics', count: 28, percentage: 16, color: 'bg-yellow-500' },
    { name: 'Pediatrics', count: 22, percentage: 12, color: 'bg-red-500' },
    { name: 'Others', count: 15, percentage: 8, color: 'bg-gray-500' },
  ];

  const kpiCards = [
    {
      title: 'Total Revenue',
      value: '$45,230',
      change: '+12.5%',
      trend: 'up',
      icon: FiDollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Active Users',
      value: '2,847',
      change: '+8.2%',
      trend: 'up',
      icon: FiUsers,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Appointments',
      value: '1,234',
      change: '+15.3%',
      trend: 'up',
      icon: FiCalendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Completion Rate',
      value: '94.2%',
      change: '+2.1%',
      trend: 'up',
      icon: FiActivity,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights into your healthcare system</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="input-field w-auto"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <button className="btn-secondary flex items-center">
            <FiRefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          <button className="btn-primary flex items-center">
            <FiDownload className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => (
          <div key={index} className="card">
            <div className="flex items-center">
              <div className={`w-12 h-12 ${kpi.bgColor} rounded-lg flex items-center justify-center`}>
                <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm text-gray-600">{kpi.title}</p>
                <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                <div className="flex items-center mt-1">
                  <FiTrendingUp className={`h-4 w-4 mr-1 ${kpi.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
                  <span className={`text-sm ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {kpi.change}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Trends Overview</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveChart('appointments')}
                    className={`px-3 py-1 text-sm rounded-md ${
                      activeChart === 'appointments'
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Appointments
                  </button>
                  <button
                    onClick={() => setActiveChart('users')}
                    className={`px-3 py-1 text-sm rounded-md ${
                      activeChart === 'users'
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Users
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="h-64">
                <SimpleLineChart
                  data={mockChartData[activeChart]}
                  type={activeChart}
                />
              </div>
            )}
          </div>
        </div>

        {/* Specialization Distribution */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <FiPieChart className="h-5 w-5 mr-2" />
                Doctor Specializations
              </h2>
            </div>
            <div className="space-y-4">
              {specializations.map((spec, index) => (
                <div key={index} className="flex items-center">
                  <div className={`w-4 h-4 ${spec.color} rounded mr-3`}></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-900">{spec.name}</span>
                      <span className="text-sm text-gray-600">{spec.count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${spec.color}`}
                        style={{ width: `${spec.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Doctors */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900">Top Performing Doctors</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="table-header">Doctor</th>
                  <th className="table-header">Appointments</th>
                  <th className="table-header">Revenue</th>
                  <th className="table-header">Rating</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[
                  { name: 'Dr. Sarah Wilson', appointments: 156, revenue: 15600, rating: 4.9 },
                  { name: 'Dr. Michael Chen', appointments: 142, revenue: 14200, rating: 4.8 },
                  { name: 'Dr. Emily Davis', appointments: 138, revenue: 13800, rating: 4.7 },
                  { name: 'Dr. James Brown', appointments: 125, revenue: 12500, rating: 4.6 },
                  { name: 'Dr. Lisa Johnson', appointments: 118, revenue: 11800, rating: 4.8 },
                ].map((doctor, index) => (
                  <tr key={index}>
                    <td className="table-cell">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-sm font-medium text-primary-600">
                            {doctor.name.split(' ')[1].charAt(0)}
                          </span>
                        </div>
                        <span className="font-medium">{doctor.name}</span>
                      </div>
                    </td>
                    <td className="table-cell">{doctor.appointments}</td>
                    <td className="table-cell">${doctor.revenue.toLocaleString()}</td>
                    <td className="table-cell">
                      <div className="flex items-center">
                        <span className="text-yellow-400 mr-1">★</span>
                        <span>{doctor.rating}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900">Recent System Activity</h2>
          </div>
          <div className="space-y-4">
            {[
              { action: 'New doctor registration', user: 'Dr. Alex Thompson', time: '2 minutes ago', type: 'success' },
              { action: 'Appointment cancelled', user: 'John Doe', time: '15 minutes ago', type: 'warning' },
              { action: 'Payment processed', user: 'Sarah Wilson', time: '32 minutes ago', type: 'success' },
              { action: 'Profile updated', user: 'Dr. Emily Chen', time: '1 hour ago', type: 'info' },
              { action: 'New patient registration', user: 'Mike Johnson', time: '2 hours ago', type: 'success' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'warning' ? 'bg-yellow-500' :
                  activity.type === 'info' ? 'bg-blue-500' : 'bg-gray-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-600">{activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple Line Chart Component
const SimpleLineChart = ({ data, type }) => {
  const maxValue = Math.max(...data.map(d =>
    type === 'appointments' ? d.total : d.total
  ));

  return (
    <div className="h-full flex items-end justify-between px-4 py-4">
      {data.map((item, index) => {
        return (
          <div key={index} className="flex flex-col items-center space-y-2">
            <div className="flex flex-col items-center space-y-1">
              {type === 'appointments' ? (
                <>
                  <div
                    className="w-6 bg-primary-500 rounded-t"
                    style={{ height: `${(item.completed / maxValue) * 200}px` }}
                    title={`Completed: ${item.completed}`}
                  ></div>
                  <div
                    className="w-6 bg-red-300 rounded-t"
                    style={{ height: `${(item.cancelled / maxValue) * 200}px` }}
                    title={`Cancelled: ${item.cancelled}`}
                  ></div>
                </>
              ) : (
                <>
                  <div
                    className="w-6 bg-blue-500 rounded-t"
                    style={{ height: `${(item.patients / maxValue) * 200}px` }}
                    title={`Patients: ${item.patients}`}
                  ></div>
                  <div
                    className="w-6 bg-green-500 rounded-t"
                    style={{ height: `${(item.doctors / maxValue) * 200}px` }}
                    title={`Doctors: ${item.doctors}`}
                  ></div>
                </>
              )}
            </div>
            <span className="text-xs text-gray-600 transform -rotate-45">
              {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default SystemAnalytics;
