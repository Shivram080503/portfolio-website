import { useEffect, useState } from "react";

export default function ColleagueFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeedbacks() {
      try {
        const response = await fetch("/api/feedbacks");
        if (response.ok) {
          const data = await response.json();
          setFeedbacks(data);
        }
      } catch (error) {
        console.error("Failed to load feedbacks:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFeedbacks();
  }, []);

  if (loading) {
    return <div className="feedback-scroll">Loading feedback...</div>;
  }

  if (!feedbacks.length) {
    return (
      <div className="feedback-scroll empty">
        <p>No feedback yet. Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="feedback-scroll">
      {feedbacks.map((feedback, idx) => (
        <div key={idx} className="feedback-card">
          <div className="feedback-header">
            <div>
              <h4>{feedback.colleagueName}</h4>
              <p className="feedback-role">{feedback.role}</p>
              <p className="feedback-company">{feedback.company}</p>
            </div>
            <div className="feedback-rating">
              {Array(feedback.rating).fill("⭐").join("")}
            </div>
          </div>
          <p className="feedback-message">{feedback.message}</p>
          <p className="feedback-date">
            {new Date(feedback.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric"
            })}
          </p>
        </div>
      ))}
    </div>
  );
}
