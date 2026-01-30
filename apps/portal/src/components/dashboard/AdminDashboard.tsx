import { useAuth } from "../../context/AuthContext";
import { useUI } from "../../context/UIContext";
import {
  FaUsers,
  FaGraduationCap,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaBookOpen,
  FaUserGraduate,
  FaBell,
  FaSearch,
  FaBars,
  FaTimes,
  FaGlobe,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
} from "../../utils/animations";
import { useState } from "react";
import StudentOverview from "./StudentOverview";
import Settings from "./Settings";
import WebsiteManagement from "./WebsiteManagement";
const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { navColor } = useUI();
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const stats = [
    {
      title: "Total Students",
      value: "2,543",
      change: "+12%",
      icon: FaUsers,
      color: "bg-blue-500",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Courses",
      value: "24",
      change: "+3",
      icon: FaBookOpen,
      color: "bg-purple-500",
      textColor: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Course Completions",
      value: "156",
      change: "+18%",
      icon: FaUserGraduate,
      color: "bg-green-500",
      textColor: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Revenue",
      value: "₹4,52,000",
      change: "+8.5%",
      icon: FaChartBar,
      color: "bg-orange-500",
      textColor: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  const menuItems = [
    "Overview",
    "Students",
    "Courses",
    "Analytics",
    "Website",
    "Settings",
  ].filter((item) => {
    if (user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") return true;
    if (user?.role === "TEACHER")
      return ["Overview", "Students", "Courses"].includes(item);
    if (user?.role === "STUDENT" || user?.role === "USER")
      return ["Overview", "Courses"].includes(item);
    return ["Overview"].includes(item);
  });

  const getSidebarStyles = () => {
    switch (navColor) {
      case "dark":
        return {
          container: "bg-gray-900 border-gray-800",
          headerText: "text-white",
          itemText: "text-gray-300",
          itemHover: "hover:bg-gray-800 hover:text-white",
          itemActive: "bg-gray-800 text-white",
          border: "border-gray-800",
        };
      case "brand":
        return {
          container: "bg-red-700 border-red-800",
          headerText: "text-white",
          itemText: "text-red-100",
          itemHover: "hover:bg-red-600 hover:text-white",
          itemActive: "bg-red-800 text-white",
          border: "border-red-800",
        };
      default: // light
        return {
          container: "bg-white border-gray-200",
          headerText: "text-red-600",
          itemText: "text-gray-600",
          itemHover: "hover:bg-gray-50 hover:text-gray-900",
          itemActive: "bg-red-50 text-red-700",
          border: "border-gray-200",
        };
    }
  };

  const styles = getSidebarStyles();

  const SidebarContent = () => (
    <>
      <div className={`h-16 flex items-center px-6 border-b ${styles.border}`}>
        <span className={`text-xl font-bold ${styles.headerText}`}>
          {user?.role === "ADMIN"
            ? "Admin Portal"
            : user?.role === "TEACHER"
              ? "Teacher Portal"
              : user?.role === "STUDENT"
                ? "Student Portal"
                : "User Dashboard"}
        </span>
      </div>
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item}
            onClick={() => {
              setActiveTab(item.toLowerCase());
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              activeTab === item.toLowerCase()
                ? styles.itemActive
                : `${styles.itemText} ${styles.itemHover}`
            }`}
          >
            {item === "Overview" && <FaChartBar className="mr-3 h-5 w-5" />}
            {item === "Students" && <FaUsers className="mr-3 h-5 w-5" />}
            {item === "Courses" && <FaBookOpen className="mr-3 h-5 w-5" />}
            {item === "Analytics" && (
              <FaGraduationCap className="mr-3 h-5 w-5" />
            )}
            {item === "Website" && <FaGlobe className="mr-3 h-5 w-5" />}
            {item === "Settings" && <FaCog className="mr-3 h-5 w-5" />}
            {item}
          </button>
        ))}
      </nav>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside
        className={`w-64 shadow-md hidden md:block fixed h-full z-30 transition-colors duration-300 ${styles.container}`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`fixed inset-y-0 left-0 w-64 shadow-xl z-50 md:hidden ${styles.container}`}
            >
              <div className="absolute top-0 right-0 -mr-12 pt-4">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                >
                  <span className="sr-only">Close sidebar</span>
                  <FaTimes className="h-6 w-6 text-white" />
                </button>
              </div>
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-20">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Mobile menu button */}
              <div className="flex items-center md:hidden">
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500"
                >
                  <span className="sr-only">Open sidebar</span>
                  <FaBars className="h-6 w-6" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="flex-1 max-w-lg ml-4 md:ml-0">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm transition duration-150 ease-in-out"
                    placeholder="Search..."
                    type="search"
                  />
                </div>
              </div>

              {/* Right Side Actions */}
              <div className="ml-4 flex items-center md:ml-6 space-x-2 sm:space-x-4">
                <button className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                  <span className="sr-only">View notifications</span>
                  <FaBell className="h-6 w-6" />
                </button>

                <div className="flex items-center space-x-3 border-l pl-4 ml-2 sm:ml-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user?.role?.replace("_", " ") || "User"}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Sign out"
                  >
                    <FaSignOutAlt className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          {activeTab === "settings" ? (
            <Settings />
          ) : activeTab === "website" ? (
            <WebsiteManagement />
          ) : (user?.role === "USER" || user?.role === "STUDENT") &&
            activeTab === "overview" ? (
            <StudentOverview />
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="space-y-6"
            >
              <motion.div variants={fadeInUp}>
                <h1 className="text-2xl font-bold text-gray-900">
                  Dashboard Overview
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Welcome back! Here's what's happening at AY Digital Institute
                  today.
                </p>
              </motion.div>

              {/* Stats Grid */}
              <motion.div
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
                variants={staggerContainer}
              >
                {stats.map((stat) => (
                  <motion.div
                    key={stat.title}
                    variants={staggerItem}
                    className="bg-white overflow-hidden shadow-sm rounded-xl hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="p-5">
                      <div className="flex items-center">
                        <div
                          className={`flex-shrink-0 rounded-md p-3 ${stat.bgColor}`}
                        >
                          <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              {stat.title}
                            </dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-gray-900">
                                {stat.value}
                              </div>
                              <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                                {stat.change}
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Recent Activity */}
                <motion.div
                  className="bg-white shadow-sm rounded-xl p-6"
                  variants={fadeInUp}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Recent Activity
                    </h3>
                    <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                      View all
                    </button>
                  </div>
                  <div className="flow-root">
                    <ul className="-mb-8">
                      {[1, 2, 3, 4].map((item, itemIdx) => (
                        <li key={item}>
                          <div className="relative pb-8">
                            {itemIdx !== 3 ? (
                              <span
                                className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                aria-hidden="true"
                              />
                            ) : null}
                            <div className="relative flex space-x-3">
                              <div>
                                <span
                                  className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                                    item % 2 === 0
                                      ? "bg-blue-500"
                                      : "bg-green-500"
                                  }`}
                                >
                                  {item % 2 === 0 ? (
                                    <FaUsers className="h-4 w-4 text-white" />
                                  ) : (
                                    <FaGraduationCap className="h-4 w-4 text-white" />
                                  )}
                                </span>
                              </div>
                              <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                <div>
                                  <p className="text-sm text-gray-500">
                                    {item % 2 === 0
                                      ? "New student registration"
                                      : "Course completion certificate issued"}
                                    <a
                                      href="#"
                                      className="font-medium text-gray-900 ml-1"
                                    >
                                      {item % 2 === 0
                                        ? "Rahul Kumar"
                                        : "Priya Singh"}
                                    </a>
                                  </p>
                                </div>
                                <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                  <time dateTime="2020-09-20">{item}h ago</time>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                  className="bg-white shadow-sm rounded-xl p-6"
                  variants={fadeInUp}
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button className="p-4 border border-gray-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition-all group text-left">
                      <FaUsers className="h-6 w-6 text-gray-400 group-hover:text-red-500 mb-2" />
                      <span className="block font-medium text-gray-900 group-hover:text-red-700">
                        Add Student
                      </span>
                      <span className="text-xs text-gray-500">
                        Register new enrollment
                      </span>
                    </button>
                    <button className="p-4 border border-gray-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition-all group text-left">
                      <FaBookOpen className="h-6 w-6 text-gray-400 group-hover:text-red-500 mb-2" />
                      <span className="block font-medium text-gray-900 group-hover:text-red-700">
                        Create Course
                      </span>
                      <span className="text-xs text-gray-500">
                        Add new curriculum
                      </span>
                    </button>
                    <button className="p-4 border border-gray-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition-all group text-left">
                      <FaChartBar className="h-6 w-6 text-gray-400 group-hover:text-red-500 mb-2" />
                      <span className="block font-medium text-gray-900 group-hover:text-red-700">
                        Generate Report
                      </span>
                      <span className="text-xs text-gray-500">
                        Download statistics
                      </span>
                    </button>
                    <button className="p-4 border border-gray-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition-all group text-left">
                      <FaCog className="h-6 w-6 text-gray-400 group-hover:text-red-500 mb-2" />
                      <span className="block font-medium text-gray-900 group-hover:text-red-700">
                        System Config
                      </span>
                      <span className="text-xs text-gray-500">
                        Manage settings
                      </span>
                    </button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
