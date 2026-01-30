import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaLock, FaCheck, FaSave, FaPalette } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useUI } from "../../context/UIContext";
import AnimatedButton from "../common/AnimatedButton";
import {
  staggerContainer,
  staggerItem,
  fadeInUp,
} from "../../utils/animations";
import api from "../../lib/axios";

// --- Schemas ---

const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100)
    .optional(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers and underscores",
    )
    .optional()
    .or(z.literal("")),
  phoneNumber: z.string().optional(),
  dob: z.string().optional(),
  gender: z.string().optional(),
});

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type UpdateProfileData = z.infer<typeof updateProfileSchema>;
type ChangePasswordData = z.infer<typeof changePasswordSchema>;

const Settings = () => {
  const { user, checkAuth } = useAuth();
  const { navColor, setNavColor } = useUI();
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "appearance">("profile");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedFile] = useState<File | null>(null);

  // --- Profile Form ---
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: errorsProfile, isSubmitting: isSubmittingProfile },
    setError: setErrorProfile,
  } = useForm<UpdateProfileData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user?.name || "",
      username: user?.username || "",
      phoneNumber: user?.phoneNumber || "",
      dob: user?.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
      gender: user?.gender || "",
    },
  });

  // --- Password Form ---
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: errorsPassword, isSubmitting: isSubmittingPassword },
    setError: setErrorPassword,
    reset: resetPassword,
  } = useForm<ChangePasswordData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onProfileSubmit = async (data: UpdateProfileData) => {
    setSuccessMessage(null);
    try {
      const formData = new FormData();
      if (data.name) formData.append("name", data.name);
      if (data.username) formData.append("username", data.username);
      if (data.phoneNumber) formData.append("phoneNumber", data.phoneNumber);
      if (data.dob) formData.append("dob", data.dob);
      if (data.gender) formData.append("gender", data.gender);

      // If we have a file selected, append it
      // Note: We need to handle file selection state separately from react-hook-form for simplicity
      // or use a controller. For now, let's assume we have a file state.
      if (selectedFile) {
        formData.append("avatar", selectedFile);
      }

      await api.patch("/auth/me", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await checkAuth();
      setSuccessMessage("Profile updated successfully");
      setTimeout(() => setSuccessMessage(null), 3000);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setErrorProfile("root", {
        message: err.response?.data?.error?.message || err.response?.data?.message || "Failed to update profile",
      });
    }
  };

  const onPasswordSubmit = async (data: ChangePasswordData) => {
    setSuccessMessage(null);
    try {
      await api.post("/auth/change-password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setSuccessMessage("Password changed successfully");
      resetPassword();
      setTimeout(() => setSuccessMessage(null), 3000);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setErrorPassword("root", {
        message: err.response?.data?.error?.message || err.response?.data?.message || "Failed to change password",
      });
    }
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto"
      initial="initial"
      animate="animate"
      variants={staggerContainer}
    >
      <motion.div variants={fadeInUp} className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your profile and account preferences
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Navigation */}
        <div className="lg:col-span-1 space-y-4">
          <motion.div
            variants={staggerItem}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
          >
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === "profile"
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <FaUser className="mr-3 h-4 w-4" />
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === "security"
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <FaLock className="mr-3 h-4 w-4" />
                Security
              </button>
              <button
                onClick={() => setActiveTab("appearance")}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === "appearance"
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <FaPalette className="mr-3 h-4 w-4" />
                Appearance
              </button>
            </nav>
          </motion.div>
        </div>

        {/* Right Column - Forms */}
        <div className="lg:col-span-2">
          <motion.div
            variants={staggerItem}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              {activeTab === "profile"
                ? "Profile Information"
                : activeTab === "security"
                ? "Security Settings"
                : "Appearance Settings"}
            </h2>

            <AnimatePresence mode="wait">
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2"
                >
                  <FaCheck className="text-green-500" />
                  <span>{successMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {activeTab === "profile" ? (
              <form
                onSubmit={handleSubmitProfile(onProfileSubmit)}
                className="space-y-6"
              >
                {/* Avatar URL */}
                <div>
                  <label
                    htmlFor="avatarUrl"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Profile Picture URL
                  </label>
                  <div className="flex gap-4 items-center">
                    <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                      {user?.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt="Avatar"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <FaUser className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        id="avatarUrl"
                        type="text"
                        placeholder="https://example.com/photo.jpg"
                        className="block w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      {...registerProfile("name")}
                      className="block w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {errorsProfile.name && (
                      <p className="mt-1 text-sm text-red-600">
                        {errorsProfile.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Username
                    </label>
                    <div className="flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                        @
                      </span>
                      <input
                        id="username"
                        type="text"
                        {...registerProfile("username")}
                        className="flex-1 min-w-0 block w-full px-4 py-2 border rounded-none rounded-r-lg outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    {errorsProfile.username && (
                      <p className="mt-1 text-sm text-red-600">
                        {errorsProfile.username.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone Number
                    </label>
                    <input
                      id="phoneNumber"
                      type="tel"
                      {...registerProfile("phoneNumber")}
                      className="block w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="gender"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Gender
                    </label>
                    <select
                      id="gender"
                      {...registerProfile("gender")}
                      className="block w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">
                        Prefer not to say
                      </option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label
                      htmlFor="dob"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Date of Birth
                    </label>
                    <input
                      id="dob"
                      type="date"
                      {...registerProfile("dob")}
                      className="block w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {errorsProfile.root && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {errorsProfile.root.message}
                  </div>
                )}

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <AnimatedButton
                    type="submit"
                    variant="primary"
                    disabled={isSubmittingProfile}
                    loading={isSubmittingProfile}
                    className="px-6 py-2"
                  >
                    <FaSave className="mr-2" /> Save Changes
                  </AnimatedButton>
                </div>
              </form>
            ) : activeTab === "security" ? (
              <form
                onSubmit={handleSubmitPassword(onPasswordSubmit)}
                className="space-y-6"
              >
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Current Password
                  </label>
                  <input
                    id="currentPassword"
                    type="password"
                    {...registerPassword("currentPassword")}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  {errorsPassword.currentPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {errorsPassword.currentPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    {...registerPassword("newPassword")}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  {errorsPassword.newPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {errorsPassword.newPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    {...registerPassword("confirmPassword")}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  {errorsPassword.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {errorsPassword.confirmPassword.message}
                    </p>
                  )}
                </div>

                {errorsPassword.root && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {errorsPassword.root.message}
                  </div>
                )}

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <AnimatedButton
                    type="submit"
                    variant="primary"
                    disabled={isSubmittingPassword}
                    loading={isSubmittingPassword}
                    className="px-6 py-2"
                  >
                    <FaLock className="mr-2" /> Change Password
                  </AnimatedButton>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-4">
                    Navigation Bar Style
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => setNavColor("light")}
                      className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${
                        navColor === "light"
                          ? "border-primary-500 bg-primary-50 text-primary-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="w-full h-12 bg-white border border-gray-200 rounded-md shadow-sm mb-2 relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1/4 border-r border-gray-100 bg-white"></div>
                      </div>
                      <span className="font-medium">Light</span>
                    </button>
                    <button
                      onClick={() => setNavColor("dark")}
                      className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${
                        navColor === "dark"
                          ? "border-primary-500 bg-primary-50 text-primary-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="w-full h-12 bg-white border border-gray-200 rounded-md shadow-sm mb-2 relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1/4 bg-gray-900"></div>
                      </div>
                      <span className="font-medium">Dark</span>
                    </button>
                    <button
                      onClick={() => setNavColor("brand")}
                      className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${
                        navColor === "brand"
                          ? "border-primary-500 bg-primary-50 text-primary-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="w-full h-12 bg-white border border-gray-200 rounded-md shadow-sm mb-2 relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1/4 bg-red-600"></div>
                      </div>
                      <span className="font-medium">Brand</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;
