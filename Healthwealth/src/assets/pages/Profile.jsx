import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  User,
  Phone,
  Briefcase,
  Lock,
  Bell,
  Moon,
  Mail,
  AlertTriangle,
} from "lucide-react";

function Profile({ activePage, setActivePage, onLogout }) {
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "Alex Rivera",
    phoneNumber: "+1 (555) 012-3456",
    age: "28",
    gender: "Male",
    occupation: "Senior Full Stack Engineer",
  });
  const [isEditing, setIsEditing] = useState(true);

  const handleInputChange = (key, value) => {
    setPersonalInfo((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <div className="h-screen bg-[#f6f8fc] flex text-[#111827] overflow-hidden">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        onLogout={onLogout}
      />

      <main className="flex-1 h-screen overflow-y-auto">
        <Navbar activePage={activePage} setActivePage={setActivePage} />

        <section className="px-10 py-9 space-y-8">
          {/* TOP CARD */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-6">
              <div className="w-[90px] h-[90px] rounded-full bg-gray-200"></div>

              <div>
                <h2 className="text-[30px] font-bold">Alex Rivera</h2>
                <p className="text-gray-500">alex.rivera@nexus-suite.io</p>

                <div className="flex gap-2 mt-3">
                  <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-bold">
                    PRO MEMBER
                  </span>
                  <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full font-bold">
                    DEVELOPER
                  </span>
                </div>
              </div>
            </div>

            <button className="h-[50px] px-7 bg-[#0757f6] text-white rounded-lg font-bold shadow-md shadow-blue-200">
              Save Changes
            </button>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-[1fr_320px] gap-8">
            {/* LEFT */}
            <div className="space-y-8">
              {/* PERSONAL INFO */}
              <Card title="Personal Information" icon={<User />}>
                <div className="grid grid-cols-2 gap-6">
                  <Input
                    label="Full Name"
                    value={personalInfo.fullName}
                    disabled={!isEditing}
                    onChange={(value) => handleInputChange("fullName", value)}
                  />
                  <Input
                    label="Phone Number"
                    value={personalInfo.phoneNumber}
                    disabled={!isEditing}
                    onChange={(value) => handleInputChange("phoneNumber", value)}
                  />
                  <Input
                    label="Age"
                    value={personalInfo.age}
                    disabled={!isEditing}
                    onChange={(value) => handleInputChange("age", value)}
                  />
                  <Input
                    label="Gender"
                    value={personalInfo.gender}
                    disabled={!isEditing}
                    onChange={(value) => handleInputChange("gender", value)}
                  />
                </div>

                <div className="mt-6">
                  <Input
                    label="Occupation"
                    value={personalInfo.occupation}
                    disabled={!isEditing}
                    onChange={(value) => handleInputChange("occupation", value)}
                  />
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <button
                    onClick={handleSave}
                    className="h-[50px] px-6 bg-[#0757f6] text-white rounded-lg font-bold shadow-md shadow-blue-200"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleEdit}
                    className="h-[50px] px-6 bg-white text-[#0757f6] rounded-lg font-bold border border-gray-200"
                  >
                    Edit
                  </button>
                </div>
              </Card>

              {/* SECURITY */}
              <Card title="Security" icon={<Lock />}>
                <div className="flex justify-between items-center bg-gray-50 rounded-lg p-5">
                  <div>
                    <p className="font-semibold">Password</p>
                    <p className="text-gray-400 text-sm">
                      Last updated 3 months ago
                    </p>
                  </div>

                  <button className="text-[#0757f6] font-bold">
                    Change Password
                  </button>
                </div>
              </Card>
            </div>

            {/* RIGHT */}
            <div className="space-y-7">
              {/* PREFERENCES */}
              <Card title="Preferences" icon={<Bell />}>
                <ToggleRow icon={<Bell />} text="Push Notifications" active />
                <ToggleRow icon={<Moon />} text="Dark Mode" />
                <ToggleRow icon={<Mail />} text="Email Updates" active />
              </Card>

              {/* DANGER */}
              <Card title="Danger Zone" icon={<AlertTriangle />} red>
                <button className="w-full h-[50px] bg-red-100 text-red-600 rounded-lg font-bold">
                  Delete Account
                </button>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

/* COMPONENTS */

function Card({ title, icon, children, red }) {
  return (
    <div className="bg-white rounded-xl p-7 shadow-sm border border-gray-100">
      <h2
        className={`text-[24px] font-bold flex items-center gap-3 mb-6 ${
          red ? "text-red-600" : ""
        }`}
      >
        {icon}
        {title}
      </h2>
      {children}
    </div>
  );
}

function Input({ label, value, disabled, onChange }) {
  return (
    <div>
      <p className="text-sm text-gray-500 mb-2">{label}</p>
      <input
        type="text"
        value={value}
        disabled={!onChange || disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className="h-[50px] w-full rounded-lg bg-gray-100 px-4 text-gray-900 outline-none transition focus:border-[#2563eb] focus:bg-white focus:ring-0"
      />
    </div>
  );
}

function ToggleRow({ icon, text, active }) {
  return (
    <div className="flex justify-between items-center mb-5">
      <div className="flex items-center gap-3 text-gray-700">
        {icon}
        <span>{text}</span>
      </div>

      <div
        className={`w-[46px] h-[26px] rounded-full px-1 flex items-center ${
          active ? "bg-[#2563eb] justify-end" : "bg-gray-200 justify-start"
        }`}
      >
        <span className="w-[20px] h-[20px] bg-white rounded-full"></span>
      </div>
    </div>
  );
}

export default Profile;