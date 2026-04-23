import { useState } from "react";

const initialState = {
  name: "",
  email: "",
  company: "",
  projectType: "",
  budget: "",
  timeline: "",
  message: "",
  website: ""
};

export default function ContactForm() {
  const [formData, setFormData] = useState(initialState);
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: "idle", message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Unable to submit the form right now.");
      }

      setStatus({
        type: "success",
        message: result.message || "Your message has been submitted successfully."
      });
      setFormData(initialState);
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error.message ||
          "The contact API is not reachable right now. You can still email me directly at shivramshinde2003@gmail.com."
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          <span>Name</span>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your full name"
            required
          />
        </label>
        <label>
          <span>Email</span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />
        </label>
        <label>
          <span>Company</span>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Company or team"
          />
        </label>
        <label>
          <span>Project Type</span>
          <select name="projectType" value={formData.projectType} onChange={handleChange}>
            <option value="">Select one</option>
            <option value="full-time-role">Full-time role</option>
            <option value="contract-project">Contract project</option>
            <option value="freelance-collaboration">Freelance collaboration</option>
            <option value="technical-discussion">Technical discussion</option>
          </select>
        </label>
        <label>
          <span>Budget</span>
          <input
            type="text"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            placeholder="Optional budget range"
          />
        </label>
        <label>
          <span>Timeline</span>
          <input
            type="text"
            name="timeline"
            value={formData.timeline}
            onChange={handleChange}
            placeholder="Expected start or delivery"
          />
        </label>
      </div>

      <label className="form-area">
        <span>Message</span>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell me about the role, project, challenge, or product idea."
          rows="6"
          required
        />
      </label>

      <input
        className="honeypot"
        type="text"
        name="website"
        value={formData.website}
        onChange={handleChange}
        tabIndex="-1"
        autoComplete="off"
        aria-hidden="true"
      />

      <div className="form-actions">
        <button className="btn primary" type="submit" disabled={submitting}>
          {submitting ? "Sending..." : "Send Message"}
        </button>
        <a className="btn ghost" href="mailto:shivramshinde2003@gmail.com">
          Email Directly
        </a>
      </div>

      {status.type !== "idle" ? (
        <p className={`form-status ${status.type}`}>{status.message}</p>
      ) : null}
    </form>
  );
}
