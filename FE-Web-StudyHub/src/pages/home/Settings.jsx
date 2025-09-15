import React from "react";

export default function Settings() {
  const handleSave = () => {
    alert("Settings saved successfully!");
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6">
      <h1 className="text-2xl font-bold mb-6 text-black">Settings</h1>

      {/* Profile Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-600 mb-3">Profile</h2>
        <div className="flex justify-between items-center border-b border-gray-200 py-2">
          <label className="text-base text-gray-800">Username</label>
          <input
            type="text"
            value="EnglishLearner"
            readOnly
            className="bg-gray-100 px-2 py-1 rounded text-gray-700 text-sm"
          />
        </div>
        <div className="flex justify-between items-center border-b border-gray-200 py-2">
          <label className="text-base text-gray-800">Email</label>
          <input
            type="email"
            value="learner@example.com"
            readOnly
            className="bg-gray-100 px-2 py-1 rounded text-gray-700 text-sm"
          />
        </div>
      </div>

      {/* Language Preferences Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-600 mb-3">
          Language Preferences
        </h2>
        <div className="flex justify-between items-center border-b border-gray-200 py-2">
          <label className="text-base text-gray-800">Interface Language</label>
          <select className="border border-gray-300 rounded px-2 py-1 text-sm">
            <option value="en">English</option>
            <option value="vi">Vietnamese</option>
            <option value="es">Spanish</option>
          </select>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-600 mb-3">
          Notifications
        </h2>
        <div className="flex justify-between items-center border-b border-gray-200 py-2">
          <label className="text-base text-gray-800">Email Notifications</label>
          <input type="checkbox" defaultChecked className="w-5 h-5" />
        </div>
      </div>

      {/* Appearance Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-600 mb-3">Appearance</h2>
        <div className="flex justify-between items-center border-b border-gray-200 py-2">
          <label className="text-base text-gray-800">Theme</label>
          <select className="border border-gray-300 rounded px-2 py-1 text-sm">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full bg-green-600 text-white py-2 rounded-lg text-lg font-medium hover:bg-green-700 transition"
      >
        Save Changes
      </button>
    </div>
  );
}
