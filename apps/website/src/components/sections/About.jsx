import React, { useState, useEffect } from "react";
import {
  FaUserFriends,
  FaHandsHelping,
  FaUsers,
  FaCertificate,
} from "react-icons/fa";
import { aboutFeaturesData as defaultFeatures } from "../../data/content";
import { Section, SectionTitle, Container } from "../common/Section";
import SkeletonLoader, { SkeletonText } from "../common/SkeletonLoader";
import api from "../../lib/axios";

const iconMap = {
  FaUserFriends: FaUserFriends,
  FaHandsHelping: FaHandsHelping,
  FaUsers: FaUsers,
  FaCertificate: FaCertificate,
};

const About = () => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState({
    description: "",
    nielitTitle: "",
    nielitDescription: "",
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [featuresRes, contentRes] = await Promise.all([
          api.get("/website-content/items?section=about_features"),
          api.get("/website-content/items?section=about_content"),
        ]);

        if (featuresRes.data && featuresRes.data.length > 0) {
          setFeatures(
            featuresRes.data
              .sort((a, b) => a.order - b.order)
              .map((item) => ({
                icon: item.icon,
                text: item.title,
              })),
          );
        } else {
          setFeatures(defaultFeatures);
        }

        if (contentRes.data && contentRes.data.length > 0) {
          const newContent = {
            description: "",
            nielitTitle: "",
            nielitDescription: "",
          };
          contentRes.data.forEach((item) => {
            if (item.key === "about_description")
              newContent.description = item.subtitle || item.title;
            if (item.key === "nielit_title")
              newContent.nielitTitle = item.title;
            if (item.key === "nielit_description")
              newContent.nielitDescription = item.subtitle || item.title;
          });
          setContent(newContent);
        } else {
          setContent({
            description:
              "AY Digital Institute provides practical computer education for students, job seekers, and working professionals. We focus on step-by-step learning, real assignments, and personal support so you can confidently use skills in real life or at work.",
            nielitTitle: "NIELIT Certified Courses",
            nielitDescription:
              "We offer NIELIT (National Institute of Electronics & Information Technology) courses — a Government of India organisation under the Ministry of Electronics & Information Technology (MeitY). Our courses range from basic digital literacy (ACC, BCC, CCC) to advanced professional certifications (O/A/B/C Level) and short-term skill boost programs. All certifications are government-recognized and nationally valid, making them valuable for job applications and career advancement.",
          });
        }
      } catch (error) {
        console.error("Failed to fetch about content", error);
        setFeatures(defaultFeatures);
        setContent({
          description:
            "AY Digital Institute provides practical computer education for students, job seekers, and working professionals. We focus on step-by-step learning, real assignments, and personal support so you can confidently use skills in real life or at work.",
          nielitTitle: "NIELIT Certified Courses",
          nielitDescription:
            "We offer NIELIT (National Institute of Electronics & Information Technology) courses — a Government of India organisation under the Ministry of Electronics & Information Technology (MeitY). Our courses range from basic digital literacy (ACC, BCC, CCC) to advanced professional certifications (O/A/B/C Level) and short-term skill boost programs. All certifications are government-recognized and nationally valid, making them valuable for job applications and career advancement.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);
  return (
    <Section id="about" className="bg-gray-50 py-20">
      <Container>
        <div className="max-w-4xl mx-auto">
          <SectionTitle className="fade-in-down">
            About AY Digital Institute
          </SectionTitle>
          {loading ? (
            <SkeletonText lines={4} />
          ) : (
            <p className="text-lg text-gray-700 mb-6 text-center leading-relaxed fade-in delay-200">
              {content.description}
            </p>
          )}
          {loading ? (
            <div className="bg-white p-6 rounded-xl shadow-md mb-8 border-l-4 border-gray-200">
              <SkeletonLoader className="h-6 w-1/2 mb-4 mx-auto" />
              <SkeletonText lines={5} />
            </div>
          ) : (
            <div className="bg-white p-6 rounded-xl shadow-md mb-8 border-l-4 border-primary-600 fade-in delay-300 hover:shadow-lg transition-all duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                {content.nielitTitle}
              </h3>
              <p
                className="text-gray-700 text-center leading-relaxed"
                dangerouslySetInnerHTML={{ __html: content.nielitDescription }}
              />
            </div>
          )}

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-xl shadow-md text-center"
                  >
                    <SkeletonLoader className="h-10 w-10 mx-auto mb-4 rounded-full" />
                    <SkeletonLoader className="h-4 w-3/4 mx-auto" />
                  </div>
                ))
              : features.map((feature, index) => {
                  const IconComponent = iconMap[feature.icon];
                  return (
                    <div
                      key={index}
                      className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 scale-in"
                      style={{ animationDelay: `${(index + 1) * 0.15}s` }}
                    >
                      <div className="flex justify-center mb-4">
                        {IconComponent && (
                          <IconComponent className="text-3xl text-primary-600" />
                        )}
                      </div>
                      <p className="text-gray-700 font-medium">{feature.text}</p>
                    </div>
                  );
                })}
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default About;
