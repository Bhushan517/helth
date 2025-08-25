import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser, FiPhone } from 'react-icons/fi';
import { register as registerUser } from '../../redux/slices/authSlice';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userRole, setUserRole] = useState('patient');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    const result = await dispatch(registerUser(data));
    if (result.type === 'auth/register/fulfilled') {
      const dashboardRoute = getDashboardRoute(result.payload.user.role);
      navigate(dashboardRoute, { replace: true });
    }
  };

  const getDashboardRoute = (role) => {
    switch (role) {
      case 'patient':
        return '/dashboard/patient';
      case 'doctor':
        return '/dashboard/doctor';
      case 'admin':
        return '/dashboard/admin';
      default:
        return '/dashboard';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">H</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Role Selection */}
          <div>
            <label className="form-label">I am a</label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center">
                <input
                  {...register('role')}
                  id="patient"
                  type="radio"
                  value="patient"
                  checked={userRole === 'patient'}
                  onChange={(e) => setUserRole(e.target.value)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <label htmlFor="patient" className="ml-3 block text-sm font-medium text-gray-700">
                  Patient
                </label>
              </div>
              <div className="flex items-center">
                <input
                  {...register('role')}
                  id="doctor"
                  type="radio"
                  value="doctor"
                  checked={userRole === 'doctor'}
                  onChange={(e) => setUserRole(e.target.value)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <label htmlFor="doctor" className="ml-3 block text-sm font-medium text-gray-700">
                  Doctor
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('name', {
                    required: 'Name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters',
                    },
                  })}
                  type="text"
                  className="input-field pl-10"
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && (
                <p className="form-error">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  type="email"
                  className="input-field pl-10"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="form-error">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="form-label">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPhone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('phone', {
                    required: 'Phone number is required',
                  })}
                  type="tel"
                  className="input-field pl-10"
                  placeholder="Enter your phone number"
                />
              </div>
              {errors.phone && (
                <p className="form-error">{errors.phone.message}</p>
              )}
            </div>

            {/* Role-specific fields */}
            {userRole === 'patient' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="dateOfBirth" className="form-label">
                      Date of Birth
                    </label>
                    <input
                      {...register('dateOfBirth', {
                        required: 'Date of birth is required',
                      })}
                      type="date"
                      className="input-field"
                    />
                    {errors.dateOfBirth && (
                      <p className="form-error">{errors.dateOfBirth.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="gender" className="form-label">
                      Gender
                    </label>
                    <select
                      {...register('gender', {
                        required: 'Gender is required',
                      })}
                      className="input-field"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.gender && (
                      <p className="form-error">{errors.gender.message}</p>
                    )}
                  </div>
                </div>
              </>
            )}

            {userRole === 'doctor' && (
              <>
                <div>
                  <label htmlFor="specialization" className="form-label">
                    Specialization
                  </label>
                  <input
                    {...register('specialization', {
                      required: 'Specialization is required',
                    })}
                    type="text"
                    className="input-field"
                    placeholder="e.g., Cardiology, Dermatology"
                  />
                  {errors.specialization && (
                    <p className="form-error">{errors.specialization.message}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="licenseNumber" className="form-label">
                      License Number
                    </label>
                    <input
                      {...register('licenseNumber', {
                        required: 'License number is required',
                      })}
                      type="text"
                      className="input-field"
                      placeholder="Medical license number"
                    />
                    {errors.licenseNumber && (
                      <p className="form-error">{errors.licenseNumber.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="experience" className="form-label">
                      Experience (years)
                    </label>
                    <input
                      {...register('experience', {
                        required: 'Experience is required',
                        min: {
                          value: 0,
                          message: 'Experience cannot be negative',
                        },
                      })}
                      type="number"
                      className="input-field"
                      placeholder="Years of experience"
                    />
                    {errors.experience && (
                      <p className="form-error">{errors.experience.message}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label htmlFor="consultationFee" className="form-label">
                    Consultation Fee ($)
                  </label>
                  <input
                    {...register('consultationFee', {
                      required: 'Consultation fee is required',
                      min: {
                        value: 0,
                        message: 'Fee cannot be negative',
                      },
                    })}
                    type="number"
                    className="input-field"
                    placeholder="Consultation fee in USD"
                  />
                  {errors.consultationFee && (
                    <p className="form-error">{errors.consultationFee.message}</p>
                  )}
                </div>
              </>
            )}

            {/* Password */}
            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pl-10 pr-10"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <FiEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="form-error">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) =>
                      value === password || 'Passwords do not match',
                  })}
                  type="password"
                  className="input-field pl-10"
                  placeholder="Confirm your password"
                />
              </div>
              {errors.confirmPassword && (
                <p className="form-error">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="agree-terms"
              name="agree-terms"
              type="checkbox"
              required
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-900">
              I agree to the{' '}
              <Link to="/terms" className="text-primary-600 hover:text-primary-500">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-primary-600 hover:text-primary-500">
                Privacy Policy
              </Link>
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <LoadingSpinner size="small" />
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
