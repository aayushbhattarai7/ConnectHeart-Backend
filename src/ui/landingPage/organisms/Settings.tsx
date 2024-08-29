import {
  FaKey,
  FaUnlockAlt,
  FaUserCircle,
  FaSignOutAlt,
  FaAdjust,
  FaLanguage,
} from 'react-icons/fa';

const Settings = () => {
  return (
    <div className="flex flex-col mt-20 2xl:ml-72 lg:ml-0 lg:flex-row bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <div className="w-full lg:w-1/4 bg-white p-4 lg:p-8 shadow-lg">
        <h2 className="text-xl lg:text-2xl font-semibold text-gray-800 mb-6">Settings</h2>
        <ul className="space-y-4">
          <li className="flex items-center cursor-pointer p-4 rounded-lg transition-all duration-200 bg-gray-100 hover:bg-gray-200">
            <FaKey className="text-gray-600 mr-4" size={20} />
            <span className="text-lg font-medium text-gray-800">Update Password</span>
          </li>
          <li className="flex items-center cursor-pointer p-4 rounded-lg transition-all duration-200 hover:bg-gray-200">
            <FaUnlockAlt className="text-gray-600 mr-4" size={20} />
            <span className="text-lg font-medium text-gray-800">Reset Password</span>
          </li>
          <li className="flex items-center cursor-pointer p-4 rounded-lg transition-all duration-200 hover:bg-gray-200">
            <FaUserCircle className="text-gray-600 mr-4" size={20} />
            <span className="text-lg font-medium text-gray-800">Login Details</span>
          </li>
          <li className="flex items-center cursor-pointer p-4 rounded-lg transition-all duration-200 hover:bg-gray-200">
            <FaSignOutAlt className="text-gray-600 mr-4" size={20} />
            <span className="text-lg font-medium text-gray-800">Logout</span>
          </li>
          <li className="flex items-center cursor-pointer p-4 rounded-lg transition-all duration-200 hover:bg-gray-200">
            <FaAdjust className="text-gray-600 mr-4" size={20} />
            <span className="text-lg font-medium text-gray-800">Theme Toggle</span>
          </li>
          <li className="flex items-center cursor-pointer p-4 rounded-lg transition-all duration-200 hover:bg-gray-200">
            <FaLanguage className="text-gray-600 mr-4" size={20} />
            <span className="text-lg font-medium text-gray-800">Language Toggle</span>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white p-4 lg:p-12 shadow-lg">
        <h2 className="text-2xl lg:text-3xl font-bold mb-8 text-gray-800">Update Password</h2>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label
              className="block text-lg font-medium text-gray-700 mb-2"
              htmlFor="current-password"
            >
              Current Password
            </label>
            <input
              type="password"
              id="current-password"
              className="w-fit p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2" htmlFor="new-password">
              New Password
            </label>
            <input
              type="password"
              id="new-password"
              className="w-fit p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              className="block text-lg font-medium text-gray-700 mb-2"
              htmlFor="confirm-password"
            >
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirm-password"
              className="w-fit p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button className="w-full lg:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
