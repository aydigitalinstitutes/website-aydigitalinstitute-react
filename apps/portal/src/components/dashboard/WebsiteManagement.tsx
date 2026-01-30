import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaGlobe,
  FaBars,
  FaLayerGroup,
  FaGraduationCap,
  FaPlus,
  FaTrash,
  FaEdit,
  FaSave,
  FaTimes,
  FaPalette,
} from "react-icons/fa";
import { useForm } from "react-hook-form";
import api from "../../lib/axios";
import AnimatedButton from "../common/AnimatedButton";
import {
  staggerContainer,
  staggerItem,
  fadeInUp,
} from "../../utils/animations";

// Types
interface ContentItem {
  id: string;
  section: string;
  key?: string;
  title?: string;
  subtitle?: string;
  icon?: string;
  link?: string;
  order: number;
  isActive: boolean;
}

interface Course {
  id: string;
  title: string;
  category: string;
  icon: string;
  topics: string[];
  duration: string;
  level: string;
  order: number;
  isActive: boolean;
}

const WebsiteManagement = () => {
  const [activeTab, setActiveTab] = useState<
    "navbar" | "footer" | "content" | "courses" | "theme"
  >("navbar");
  const [selectedSection, setSelectedSection] = useState("hero_highlights");
  const [items, setItems] = useState<ContentItem[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | Course | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch data based on active tab
  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "courses") {
        const res = await api.get("/website-content/courses");
        setCourses(res.data.data);
      } else if (activeTab === "content") {
        const res = await api.get(
          `/website-content/items?section=${selectedSection}`,
        );
        setItems(res.data.data);
      } else if (activeTab === "theme") {
        const res = await api.get("/website-content/items?section=theme");
        setItems(res.data.data);
      } else {
        const res = await api.get(
          `/website-content/items?section=${activeTab}`,
        );
        setItems(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, selectedSection]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      if (activeTab === "courses") {
        await api.delete(`/website-content/courses/${id}`);
      } else {
        await api.delete(`/website-content/items/${id}`);
      }
      fetchData();
    } catch (error) {
      console.error("Failed to delete item", error);
    }
  };

  const openModal = (item: ContentItem | Course | null = null) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  return (
    <motion.div
      className="max-w-6xl mx-auto"
      initial="initial"
      animate="animate"
      variants={staggerContainer}
    >
      <motion.div
        variants={fadeInUp}
        className="mb-8 flex justify-between items-center"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Website Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your website content, navigation, and courses
          </p>
        </div>
        <AnimatedButton onClick={() => openModal()} variant="primary">
          <FaPlus className="mr-2" /> Add New
        </AnimatedButton>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation */}
        <div className="lg:col-span-1">
          <motion.div
            variants={staggerItem}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
          >
            <nav className="space-y-1">
              <NavButton
                active={activeTab === "navbar"}
                onClick={() => setActiveTab("navbar")}
                icon={FaBars}
                label="Navbar"
              />
              <NavButton
                active={activeTab === "footer"}
                onClick={() => setActiveTab("footer")}
                icon={FaLayerGroup}
                label="Footer"
              />
              <NavButton
                active={activeTab === "content"}
                onClick={() => setActiveTab("content")}
                icon={FaGlobe}
                label="Page Content"
              />
              <NavButton
                active={activeTab === "courses"}
                onClick={() => setActiveTab("courses")}
                icon={FaGraduationCap}
                label="Courses"
              />
              <NavButton
                active={activeTab === "theme"}
                onClick={() => setActiveTab("theme")}
                icon={FaPalette}
                label="Theme Settings"
              />
            </nav>
          </motion.div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <motion.div
            variants={staggerItem}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <h2 className="text-lg font-medium text-gray-900 mb-6 capitalize flex justify-between items-center">
              <span>
                {activeTab === "content"
                  ? "Page Content"
                  : activeTab === "theme"
                    ? "Theme Settings"
                    : activeTab + " Management"}
              </span>
              {activeTab === "content" && (
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="ml-4 text-sm border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 p-1"
                >
                  <option value="hero_highlights">Hero Highlights</option>
                  <option value="hero_stats">Hero Stats</option>
                  <option value="hero_content">
                    Hero Content (Title/Subtitle)
                  </option>
                  <option value="about_features">About Features</option>
                  <option value="about_content">
                    About Content (Description)
                  </option>
                  <option value="courses_content">
                    Courses Content (Description)
                  </option>
                  <option value="why_choose_us">Why Choose Us</option>
                  <option value="contact">Contact Info</option>
                </select>
              )}
            </h2>

            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : (
              <div className="space-y-4">
                {activeTab === "courses"
                  ? courses.map((course) => (
                      <CourseItem
                        key={course.id}
                        course={course}
                        onEdit={() => openModal(course)}
                        onDelete={() => handleDelete(course.id)}
                      />
                    ))
                  : activeTab === "theme"
                    ? items.map((item) => (
                        <ThemeItem
                          key={item.id}
                          item={item}
                          onEdit={() => openModal(item)}
                        />
                      ))
                    : items.map((item) => (
                        <ContentListItem
                          key={item.id}
                          item={item}
                          onEdit={() => openModal(item)}
                          onDelete={() => handleDelete(item.id)}
                        />
                      ))}

                {!loading &&
                  ((activeTab === "courses" && courses.length === 0) ||
                    (activeTab !== "courses" && items.length === 0)) && (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                      No items found. Click "Add New" to create one.
                    </div>
                  )}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <ItemModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            activeTab={activeTab}
            selectedSection={selectedSection}
            editingItem={editingItem}
            onSave={() => {
              setIsModalOpen(false);
              fetchData();
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
}

const NavButton = ({ active, onClick, icon: Icon, label }: NavButtonProps) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
      active ? "bg-red-50 text-red-700" : "text-gray-700 hover:bg-gray-50"
    }`}
  >
    <Icon className="mr-3 h-4 w-4" />
    {label}
  </button>
);

const ContentListItem = ({
  item,
  onEdit,
  onDelete,
}: {
  item: ContentItem;
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
    <div>
      <h3 className="font-medium text-gray-900">
        {item.title || item.key || "Untitled"}
      </h3>
      <p className="text-sm text-gray-500">
        {item.subtitle || item.link || item.section}
      </p>
    </div>
    <div className="flex space-x-2">
      <button
        onClick={onEdit}
        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
      >
        <FaEdit />
      </button>
      <button
        onClick={onDelete}
        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
      >
        <FaTrash />
      </button>
    </div>
  </div>
);

const CourseItem = ({
  course,
  onEdit,
  onDelete,
}: {
  course: Course;
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
    <div>
      <h3 className="font-medium text-gray-900">{course.title}</h3>
      <p className="text-sm text-gray-500">
        {course.category} • {course.level} • {course.duration}
      </p>
    </div>
    <div className="flex space-x-2">
      <button
        onClick={onEdit}
        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
      >
        <FaEdit />
      </button>
      <button
        onClick={onDelete}
        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
      >
        <FaTrash />
      </button>
    </div>
  </div>
);

const ThemeItem = ({
  item,
  onEdit,
}: {
  item: ContentItem;
  onEdit: () => void;
}) => {
  if (item.key === "primary_color") {
    return (
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center gap-4">
          <div
            className="w-10 h-10 rounded-full border border-gray-300 shadow-sm"
            style={{ backgroundColor: item.subtitle }}
          />
          <div>
            <h3 className="font-medium text-gray-900">{item.title}</h3>
            <p className="text-sm text-gray-500 font-mono">{item.subtitle}</p>
          </div>
        </div>
        <button
          onClick={onEdit}
          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
        >
          <FaEdit />
        </button>
      </div>
    );
  }

  if (item.key === "brand_logo") {
    return (
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center gap-4">
          {item.subtitle ? (
            <img
              src={item.subtitle}
              alt="Brand Logo"
              className="w-10 h-10 object-contain rounded-md border border-gray-200 bg-white"
            />
          ) : (
            <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-md text-gray-400">
              <FaGlobe />
            </div>
          )}
          <div>
            <h3 className="font-medium text-gray-900">{item.title}</h3>
            <p className="text-sm text-gray-500 truncate max-w-[200px]">
              {item.subtitle || "No logo set"}
            </p>
          </div>
        </div>
        <button
          onClick={onEdit}
          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
        >
          <FaEdit />
        </button>
      </div>
    );
  }

  // Default for brand_name etc
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div>
        <h3 className="font-medium text-gray-900">{item.title}</h3>
        <p className="text-sm text-gray-500">{item.subtitle || item.title}</p>
      </div>
      <button
        onClick={onEdit}
        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
      >
        <FaEdit />
      </button>
    </div>
  );
};

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  selectedSection: string;
  editingItem: ContentItem | Course | null;
  onSave: () => void;
}

// Modal Component
const ItemModal = ({
  onClose,
  activeTab,
  selectedSection,
  editingItem,
  onSave,
}: ItemModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: editingItem || {
      section:
        activeTab === "courses"
          ? ""
          : activeTab === "content"
            ? selectedSection
            : activeTab,
      isActive: true,
      order: 0,
      topics: [], // for courses
    },
  });

  useEffect(() => {
    reset(
      editingItem || {
        section:
          activeTab === "courses"
            ? ""
            : activeTab === "content"
              ? selectedSection
              : activeTab,
        isActive: true,
        order: 0,
      },
    );
  }, [editingItem, activeTab, selectedSection, reset]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    try {
      // Format data if needed
      if (activeTab === "courses") {
        if (typeof data.topics === "string") {
          data.topics = data.topics.split(",").map((t: string) => t.trim());
        }

        if (editingItem) {
          await api.patch(`/website-content/courses/${editingItem.id}`, data);
        } else {
          await api.post("/website-content/courses", data);
        }
      } else {
        // Ensure section is set
        if (!data.section)
          data.section = activeTab === "content" ? selectedSection : activeTab;

        if (editingItem) {
          await api.patch(`/website-content/items/${editingItem.id}`, data);
        } else {
          await api.post("/website-content/items", data);
        }
      }
      onSave();
    } catch (error) {
      console.error("Failed to save", error);
      alert("Failed to save item");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">
            {editingItem ? "Edit" : "Add"}{" "}
            {activeTab === "courses" ? "Course" : "Item"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {activeTab === "courses" ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Title
                </label>
                <input
                  {...register("title", { required: true })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <input
                    {...register("category", { required: true })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Level
                  </label>
                  <select
                    {...register("level", { required: true })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration
                </label>
                <input
                  {...register("duration", { required: true })}
                  placeholder="e.g. 8 Weeks"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon (Emoji or URL)
                </label>
                <input
                  {...register("icon", { required: true })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Topics (comma separated)
                </label>
                <textarea
                  {...register("topics")}
                  placeholder="React, Node.js, Database..."
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </>
          ) : (
            <>
              {activeTab === "content" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Section
                  </label>
                  <select
                    {...register("section", { required: true })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="hero_highlights">Hero Highlights</option>
                    <option value="hero_stats">Hero Stats</option>
                    <option value="hero_content">
                      Hero Content (Title/Subtitle)
                    </option>
                    <option value="about_features">About Features</option>
                    <option value="about_content">
                      About Content (Description)
                    </option>
                    <option value="courses_content">
                      Courses Content (Description)
                    </option>
                    <option value="why_choose_us">Why Choose Us</option>
                    <option value="contact">Contact Info</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {activeTab === "theme" ? "Setting Name" : "Title / Label"}
                </label>
                <input
                  {...register("title")}
                  readOnly={activeTab === "theme"}
                  className={`block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 ${activeTab === "theme" ? "bg-gray-100" : ""}`}
                />
              </div>

              {(activeTab === "navbar" || activeTab === "footer") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link URL
                  </label>
                  <input
                    {...register("link")}
                    placeholder="/about"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              )}

              {activeTab === "theme" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {editingItem?.key === "primary_color"
                      ? "Color Value"
                      : editingItem?.key === "brand_logo"
                        ? "Logo URL"
                        : "Value"}
                  </label>

                  {editingItem?.key === "primary_color" ? (
                    <div className="flex gap-4 items-center">
                      <input
                        type="color"
                        {...register("subtitle")}
                        className="h-10 w-20 p-1 border border-gray-300 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        {...register("subtitle")}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 uppercase"
                      />
                    </div>
                  ) : (
                    <input
                      {...register("subtitle")}
                      placeholder={
                        editingItem?.key === "brand_logo"
                          ? "https://example.com/logo.png"
                          : "Enter value"
                      }
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    />
                  )}
                </div>
              )}

              {activeTab === "content" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subtitle / Description
                    </label>
                    <textarea
                      {...register("subtitle")}
                      rows={3}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Key (optional)
                    </label>
                    <input
                      {...register("key")}
                      placeholder="e.g. hero_title"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </>
              )}

              {activeTab !== "theme" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order
                  </label>
                  <input
                    type="number"
                    {...register("order", { valueAsNumber: true })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              )}
            </>
          )}

          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <AnimatedButton
              type="submit"
              variant="primary"
              loading={isSubmitting}
              className="px-6 py-2"
            >
              <FaSave className="mr-2" /> Save
            </AnimatedButton>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default WebsiteManagement;
