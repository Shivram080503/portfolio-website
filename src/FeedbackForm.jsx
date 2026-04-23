import { useState } from "react";

export default function FeedbackForm() {
  const [formData, setFormData] = useState({
    colleagueName: "",
    company: "",
    role: "",
    rating: 5,
    message: "",
    email: ""
  });

  const [status, setStatus] = useState("idle");
  const [feedbackList, setFeedbackList] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }

      const data = await response.json();
      setStatus("success");
      setFormData({
        colleagueName: "",
        company: "",
        role: "",
        rating: 5,
        message: "",
        email: ""
      });

      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <div className="feedback-section">
      <div className="feedback-form-wrapper">
        <h3>Share Your Feedback</h3>
        <p className="form-subtitle">Your message helps me grow professionally</p>

        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="form-grid">
            <input
              type="text"
              name="colleagueName"
              placeholder="Your Name"
              value={formData.colleagueName}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-grid">
            <input
              type="text"
              name="company"
              placeholder="Your Company"
              value={formData.company}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="role"
              placeholder="Your Role"
              value={formData.role}
              onChange={handleChange}
              required
            />
          </div>

          <div className="rating-input">
            <label>Rating (1-5 stars)</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star ${formData.rating >= star ? "active" : ""}`}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      rating: star
                    }))
                  }
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <textarea
            name="message"
            placeholder="Your feedback or appreciation message..."
            value={formData.message}
            onChange={handleChange}
            rows="4"
            required
          />

          <button type="submit" className="btn primary" disabled={status === "loading"}>
            {status === "loading" ? "Submitting..." : "Submit Feedback"}
          </button>

          {status === "success" && (
            <div className="form-status success">
              ✓ Thank you! Your feedback has been received and will be displayed soon.
            </div>
          )}
          {status === "error" && (
            <div className="form-status error">
              ✗ Failed to submit feedback. Please try again.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
