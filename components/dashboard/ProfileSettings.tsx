import React, { useState } from 'react';
import { ChevronDown, User } from 'lucide-react';
import Image from 'next/image';
import avatar from '@/public/Photo.png'

const ProfileSettings = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    college: '',
    educationYear: '',
    examInterests: '',
    dailyGoal: '',
    mentor: ''
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Profile Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-purple-700">Welcome, Anima</h1>
          <button className="px-4 py-2 bg-purple-700 text-white rounded-md">
            Edit
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
            <Image src={avatar} alt='' className="w-full h-full text-gray-500" />
          </div>
          <div>
            <h2 className="text-lg font-medium">Anima Agrawal</h2>
            <p className="text-gray-500">alexarowles@gmail.com</p>
          </div>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name*</label>
              <input
                type="text"
                placeholder="Your First Name"
                className="w-full p-3 rounded-md bg-gray-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">College</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Your College Name"
                  className="w-full p-3 rounded-md bg-gray-50"
                />
                <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Current Education Year*</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Your Education Year"
                  className="w-full p-3 rounded-md bg-gray-50"
                />
                <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Exam Interests</label>
              <input
                type="text"
                placeholder="Your Interests"
                className="w-full p-3 rounded-md bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Daily Goal</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Your Hours"
                  className="w-full p-3 rounded-md bg-gray-50"
                />
                <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Mentor</label>
              <input
                type="text"
                placeholder="Your Mentor"
                className="w-full p-3 rounded-md bg-gray-50"
              />
            </div>
          </div>
        </div>

        <button className="px-6 py-2 bg-green-600 text-white rounded-md">
          Submit
        </button>
      </div>

      {/* Password Settings Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium">Password settings</h2>
          <div className="space-x-4">
            <button className="text-red-500">Change Password</button>
            <button className="text-gray-500">Forget Password</button>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Old password</label>
            <input
              type="password"
              placeholder="Enter Old password"
              className="w-full p-3 rounded-md bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">New password</label>
            <input
              type="password"
              placeholder="Enter New Password"
              className="w-full p-3 rounded-md bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Confirm New password</label>
            <input
              type="password"
              placeholder="Confirm New Password"
              className="w-full p-3 rounded-md bg-white"
            />
          </div>
        </div>

        <button className="px-6 py-2 bg-green-600 text-white rounded-md">
          Submit
        </button>
      </div>
    </div>
  );
};

export default ProfileSettings;