import React from 'react';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';

const Reviews = () => {
  const reviews = [
    {
      id: 1,
      text: 'I learned Excel properly and now I can make reports easily.',
      author: 'Student',
      rating: 5,
    },
    {
      id: 2,
      text: 'Best for beginners, teaching is simple and practical.',
      author: 'Student',
      rating: 5,
    },
    {
      id: 3,
      text: 'I built my first website and portfolio in the course.',
      author: 'Student',
      rating: 5,
    },
  ];

  return (
    <section id="reviews" className="bg-gray-50 py-20">
      <div className="section-container">
        <h2 className="section-title">Student Reviews</h2>
        <p className="section-subtitle">
          See what our students have to say about their learning experience.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex justify-center mb-4">
                <FaQuoteLeft className="text-3xl text-primary-300" />
              </div>
              <p className="text-gray-700 mb-4 text-center italic">"{review.text}"</p>
              <div className="flex justify-center gap-1 mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-500 text-center font-medium">— {review.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
