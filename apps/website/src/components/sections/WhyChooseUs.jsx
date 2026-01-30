import React, { useState, useEffect } from "react";
import {
  FaLaptopCode,
  FaBriefcase,
  FaClock,
  FaRupeeSign,
  FaQuestionCircle,
} from "react-icons/fa";
import { whyChooseUsData as defaultData } from "../../data/content";
import {
  Section,
  SectionTitle,
  SectionSubtitle,
  Container,
} from "../common/Section";
import SkeletonLoader from "../common/SkeletonLoader";
import api from "../../lib/axios";

const iconMap = {
  FaLaptopCode: FaLaptopCode,
  FaBriefcase: FaBriefcase,
  FaClock: FaClock,
  FaRupeeSign: FaRupeeSign,
  FaQuestionCircle: FaQuestionCircle,
};

const WhyChooseUs = () => {
  const [reasons, setReasons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReasons = async () => {
      try {
        const res = await api.get(
          "/website-content/items?section=why_choose_us",
        );
        if (res.data && res.data.length > 0) {
          setReasons(
            res.data
              .sort((a, b) => a.order - b.order)
              .map((item) => ({
                icon: item.icon,
                title: item.title,
                description: item.subtitle,
              })),
          );
        } else {
          setReasons(defaultData);
        }
      } catch (error) {
        console.error("Failed to fetch why choose us", error);
        setReasons(defaultData);
      } finally {
        setLoading(false);
      }
    };
    fetchReasons();
  }, []);

  return (
    <Section id="why-us" className="bg-white py-20">
      <Container>
        <SectionTitle className="fade-in-down">
          Why Students Choose Us
        </SectionTitle>
        <SectionSubtitle className="fade-in delay-200">
          We're committed to your success with practical training and
          personalized support.
        </SectionSubtitle>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white p-8 rounded-xl border border-gray-200 shadow-md"
                >
                  <SkeletonLoader className="h-12 w-12 rounded-full mb-4 mx-auto" />
                  <SkeletonLoader className="h-6 w-3/4 mx-auto mb-3" />
                  <SkeletonLoader className="h-4 w-full mx-auto" />
                </div>
              ))
            : reasons.map((reason, index) => {
                const IconComponent = iconMap[reason.icon];
                return (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-primary-50 to-white p-8 rounded-xl border-2 border-primary-100 hover:border-primary-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 scale-in"
                    style={{ animationDelay: `${(index + 1) * 0.15}s` }}
                  >
                    <div className="flex justify-center mb-4 transition-transform duration-300 hover:scale-110">
                      {IconComponent && (
                        <IconComponent className="text-4xl text-primary-600" />
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                      {reason.title}
                    </h3>
                    <p className="text-gray-600 text-center">
                      {reason.description}
                    </p>
                  </div>
                );
              })}
        </div>
      </Container>
    </Section>
  );
};

export default WhyChooseUs;
