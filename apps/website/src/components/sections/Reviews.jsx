import React, { useState, useEffect } from "react";
import { FaStar, FaQuoteLeft } from "react-icons/fa";
import { reviewsData as defaultReviews } from "../../data/content";
import {
  Section,
  SectionTitle,
  SectionSubtitle,
  Container,
} from "../common/Section";
import SkeletonLoader from "../common/SkeletonLoader";
import api from "../../lib/axios";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get("/website-content/testimonials");
        if (res.data && res.data.length > 0) {
          setReviews(res.data);
        } else {
          setReviews(defaultReviews);
        }
      } catch (e) {
        console.error("Failed to fetch reviews", e);
        setReviews(defaultReviews);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <Section id="reviews" className="bg-gray-50 py-20">
      <Container>
        <SectionTitle className="fade-in-down">Student Reviews</SectionTitle>
        <SectionSubtitle className="fade-in delay-200">
          See what our students have to say about their learning experience.
        </SectionSubtitle>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
                >
                  <SkeletonLoader className="h-8 w-8 mx-auto mb-4 rounded-full" />
                  <SkeletonLoader className="h-4 w-full mb-2" />
                  <SkeletonLoader className="h-4 w-3/4 mx-auto mb-4" />
                  <SkeletonLoader className="h-4 w-1/2 mx-auto mb-2" />
                  <SkeletonLoader className="h-4 w-1/3 mx-auto" />
                </div>
              ))
            : reviews.map((review, index) => (
                <div
                  key={review.id}
                  className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 scale-in"
                  style={{ animationDelay: `${(index + 1) * 0.2}s` }}
                >
                  <div className="flex justify-center mb-4">
                    <FaQuoteLeft className="text-3xl text-primary-300" />
                  </div>
                  <p className="text-gray-700 mb-4 text-center italic">
                    "{review.text}"
                  </p>
                  <div className="flex justify-center gap-1 mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-500 text-center font-medium">
                    — {review.author}
                  </p>
                </div>
              ))}
        </div>
      </Container>
    </Section>
  );
};

export default Reviews;
