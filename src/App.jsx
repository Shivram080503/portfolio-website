import { useEffect, useMemo, useState } from "react";
import portrait from "../assets/IMG_20260418_152422.jpg";
import resumePdf from "../assets/ShivramShinde_Resume_Software_Engineer.pdf";
import ContactForm from "./ContactForm";
import SkillsScene from "./SkillsScene";
import FeedbackForm from "./FeedbackForm";
import ColleagueFeedback from "./ColleagueFeedback";
import {
  contactMethods,
  educationCards,
  experiences,
  faqItems,
  featuredProjects,
  highlights,
  impactMetrics,
  navItems,
  processSteps,
  serviceCards,
  skillGroups,
  stats,
  techChips,
  testimonials,
  certificates,
  awards,
  blogArticles,
  resources,
  caseStudies,
  careerTimeline,
  achievements,
  quickLinks,
  skillsProjectMap,
  linkedinProfile,
  jobRecommendations,
  skillsEndorsements,
  careerRoadmap,
  referralNetwork,
  jobAlerts,
  industryInsights,
  linkedinActivity,
  recommendations,
  targetRoleAnalyzer
} from "./content";

function useReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.17 }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
}

function useGithubRepos() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const response = await fetch(
          "https://api.github.com/users/Shivram080503/repos?per_page=100&sort=updated"
        );
        if (!response.ok) {
          throw new Error("GitHub API request failed");
        }

        const data = await response.json();
        const nextRepos = data
          .filter((repo) => !repo.fork)
          .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
          .slice(0, 8);

        if (!cancelled) {
          setRepos(nextRepos);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return { repos, loading, error };
}

function Counter({ value }) {
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    const decimal = value.includes(".");
    const target = Number(value);
    const step = Math.max(1, target / 70);
    let current = 0;
    let frame = 0;

    const tick = () => {
      current = Math.min(target, current + step);
      setDisplay(decimal ? current.toFixed(1) : String(Math.floor(current)));
      if (current < target) {
        frame = requestAnimationFrame(tick);
      } else {
        setDisplay(value);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return display;
}

function RepoGrid({ loading, error, repos }) {
  if (loading) {
    return (
      <div className="repo-grid">
        <article>
          <p>Loading repositories...</p>
        </article>
      </div>
    );
  }

  if (error) {
    return (
      <div className="repo-grid">
        <article>
          <p>Could not load GitHub repositories right now. Please check your internet connection.</p>
        </article>
      </div>
    );
  }

  return (
    <div className="repo-grid">
      {repos.map((repo) => (
        <article key={repo.id}>
          <div className="repo-topline">
            <h4>{repo.name}</h4>
            <span>{repo.language || "Code"}</span>
          </div>
          <p>{repo.description || "No description provided yet."}</p>
          <div className="repo-links">
            <a href={repo.html_url} target="_blank" rel="noreferrer">
              Repository
            </a>
            {repo.homepage ? (
              <a href={repo.homepage} target="_blank" rel="noreferrer">
                Live Link
              </a>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}

function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return isVisible ? (
    <button className="back-to-top" onClick={scrollToTop} aria-label="Back to top">
      ↑
    </button>
  ) : null;
}

function SkillsMatcher() {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const allSkills = [...new Set(skillsProjectMap.flatMap((s) => s.skill))];

  const matchedProjects = selectedSkill
    ? skillsProjectMap.find((s) => s.skill === selectedSkill)?.projects || []
    : [];

  return (
    <div className="skills-matcher">
      <div className="skills-filter">
        <div className="filter-chips">
          {allSkills.map((skill) => (
            <button
              key={skill}
              className={`filter-chip ${selectedSkill === skill ? "active" : ""}`}
              onClick={() => setSelectedSkill(selectedSkill === skill ? null : skill)}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      {selectedSkill && (
        <div className="matched-projects">
          <p className="matcher-label">Projects using <strong>{selectedSkill}</strong>:</p>
          <div className="project-list">
            {matchedProjects.map((project) => (
              <span key={project} className="project-tag">
                {project}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function GitHubStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("https://api.github.com/users/Shivram080503");
        const data = await response.json();
        setStats({
          repos: data.public_repos,
          followers: data.followers,
          following: data.following,
          gists: data.public_gists,
          avatar: data.avatar_url,
          bio: data.bio
        });
      } catch (error) {
        console.error("Failed to fetch GitHub stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return <div className="github-stats-container">Loading GitHub stats...</div>;
  }

  if (!stats) {
    return <div className="github-stats-container">Could not load GitHub stats</div>;
  }

  return (
    <div className="github-stats-container">
      <div className="github-header">
        <img src={stats.avatar} alt="GitHub Avatar" className="github-avatar" />
        <div>
          <h3>GitHub Profile</h3>
          <p className="github-bio">{stats.bio}</p>
        </div>
      </div>
      <div className="github-stats-grid">
        <article>
          <span className="stat-value">{stats.repos}</span>
          <span className="stat-label">Repositories</span>
        </article>
        <article>
          <span className="stat-value">{stats.followers}</span>
          <span className="stat-label">Followers</span>
        </article>
        <article>
          <span className="stat-value">{stats.following}</span>
          <span className="stat-label">Following</span>
        </article>
        <article>
          <span className="stat-value">{stats.gists}</span>
          <span className="stat-label">Public Gists</span>
        </article>
      </div>
    </div>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const year = useMemo(() => new Date().getFullYear(), []);
  const { repos, loading, error } = useGithubRepos();

  useReveal();

  useEffect(() => {
    const doc = document.documentElement;
    if (darkMode) {
      doc.classList.add("dark-mode");
    } else {
      doc.classList.remove("dark-mode");
    }
  }, [darkMode]);

  return (
    <>
      <div className="bg-layer"></div>
      <header className="topbar">
        <a className="brand" href="#home">
          Shivram<span>Shinde</span>
        </a>
        <div className="header-controls">
          <button
            type="button"
            className="theme-toggle"
            aria-label="Toggle dark mode"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
          <button
            type="button"
            className="menu-btn"
            aria-label="Toggle navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            Menu
          </button>
        </div>
        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          {navItems.map(([label, id]) => (
            <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>
              {label}
            </a>
          ))}
        </nav>
      </header>

      <main>
        <section id="home" className="hero reveal">
          <div className="hero-content">
            <p className="eyebrow">React | Node.js | Express | DevOps | Full-Stack</p>
            <h1>
              Building reliable software,
              <span>from architecture to automation.</span>
            </h1>
            <p>
              I am Shivram Shinde, Associate Software Analyst at PTC India with 1.5+ years in
              SDLC, CI/CD pipeline engineering, API performance, release automation, and
              production-grade systems.
            </p>
            <div className="hero-cta">
              <a className="btn primary" href="#contact">
                Start a Conversation
              </a>
              <a className="btn ghost" href={resumePdf} target="_blank" rel="noreferrer">
                Download Resume
              </a>
            </div>
            <div className="quick-stats">
              {stats.map((stat) => (
                <article key={stat.label}>
                  <h3>
                    <Counter value={stat.value} />
                  </h3>
                  <p>{stat.label}</p>
                </article>
              ))}
            </div>
            <div className="impact-strip">
              {impactMetrics.map((item) => (
                <article key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </article>
              ))}
            </div>
          </div>
          <div className="hero-media">
            <div className="photo-shell">
              <img src={portrait} alt="Portrait of Shivram Shinde" />
            </div>
            <div className="badge floating">Open to product-focused engineering roles</div>
          </div>
        </section>

        <section id="about" className="about reveal">
          <div className="section-heading">
            <p className="eyebrow">About</p>
            <h2>Engineering with reliability, speed, and ownership</h2>
          </div>
          <p className="section-copy">
            I focus on systems that need strong delivery discipline, measurable performance, and
            maintainable architecture. My work spans frontend experiences, backend services,
            automation, integration testing, and release workflows.
          </p>
          <div className="highlights-grid">
            {highlights.map((item) => (
              <article key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="services" className="services reveal">
          <div className="section-heading">
            <p className="eyebrow">What I Build</p>
            <h2>Capabilities expected from a modern portfolio engineer</h2>
          </div>
          <div className="cards cards-four">
            {serviceCards.map((service) => (
              <article key={service.title} className="card feature-card">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="experience" className="timeline reveal">
          <div className="section-heading">
            <p className="eyebrow">Experience</p>
            <h2>Professional work focused on delivery quality and system confidence</h2>
          </div>
          {experiences.map((experience) => (
            <article key={experience.title} className="timeline-item">
              <div>
                <h3>{experience.title}</h3>
                <p className="meta">{experience.meta}</p>
              </div>
              <ul>
                {experience.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section id="projects" className="projects reveal">
          <div className="section-heading">
            <p className="eyebrow">Projects</p>
            <h2>Selected builds and live repository activity</h2>
          </div>
          <div className="cards">
            {featuredProjects.map((project) => (
              <article key={project.title} className="card">
                <h3>{project.title}</h3>
                <p className="meta">{project.stack}</p>
                <p>{project.description}</p>
                <div className="tag-row">
                  {project.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
          <h3 className="subhead">Live GitHub Repositories</h3>
          <p className="repo-note">Auto-fetched from your public GitHub profile to keep this section current.</p>
          <RepoGrid loading={loading} error={error} repos={repos} />
        </section>

        <section id="skills" className="skill-lab reveal">
          <div className="skill-text">
            <div className="section-heading compact-heading">
              <p className="eyebrow">Skills</p>
              <h2>3D skills lab and engineering toolkit</h2>
            </div>
            <p>
              This React-powered scene visualizes the stack I use across frontend, backend,
              automation, testing, and system design. Drag across the canvas to explore the
              interaction.
            </p>
            <div className="chip-wrap">
              {techChips.map((chip) => (
                <span key={chip}>{chip}</span>
              ))}
            </div>
            <div className="skill-groups">
              {skillGroups.map((group) => (
                <article key={group.title}>
                  <h3>{group.title}</h3>
                  <ul>
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
          <div className="canvas-wrap">
            <SkillsScene />
          </div>
        </section>

        <section className="process reveal">
          <div className="section-heading">
            <p className="eyebrow">How I Work</p>
            <h2>A practical engineering process, not just design polish</h2>
          </div>
          <div className="cards cards-three">
            {processSteps.map((step) => (
              <article key={step.title} className="card process-card">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="education" className="education reveal">
          <div className="section-heading">
            <p className="eyebrow">Education</p>
            <h2>Academic performance and technical credibility</h2>
          </div>
          <div className="edu-grid">
            {educationCards.map((card) => (
              <article key={card.title}>
                <h3>{card.title}</h3>
                {card.description ? <p>{card.description}</p> : null}
                {card.list ? (
                  <ul>
                    {card.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section id="testimonials" className="testimonials reveal">
          <div className="section-heading">
            <p className="eyebrow">Testimonials</p>
            <h2>What colleagues and mentors have said</h2>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial) => (
              <article key={testimonial.name} className="testimonial-card">
                <div className="testimonial-header">
                  <div className="avatar">{testimonial.image}</div>
                  <div>
                    <h3>{testimonial.name}</h3>
                    <p className="meta">{testimonial.role}</p>
                  </div>
                </div>
                <p className="testimonial-content">{testimonial.content}</p>
                <div className="rating">
                  {Array(testimonial.rating).fill("⭐").join("")}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="certificates reveal">
          <div className="section-heading">
            <p className="eyebrow">Certifications</p>
            <h2>Professional credentials and achievements</h2>
          </div>
          <div className="cert-grid">
            {certificates.map((cert) => (
              <article key={cert.title} className="cert-card">
                <h3>{cert.title}</h3>
                <p className="issuer">{cert.issuer}</p>
                <p className="score">{cert.score}</p>
                <p className="date">{cert.date}</p>
                {cert.credentialUrl !== "#" && (
                  <a href={cert.credentialUrl} target="_blank" rel="noreferrer">
                    View Credential →
                  </a>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="awards reveal">
          <div className="section-heading">
            <p className="eyebrow">Recognition</p>
            <h2>Awards, honors, and notable achievements</h2>
          </div>
          <div className="awards-list">
            {awards.map((award) => (
              <article key={award.title} className="award-item">
                <span className="award-icon">{award.icon}</span>
                <div>
                  <h3>{award.title}</h3>
                  <p className="organization">{award.organization}</p>
                  <p>{award.description}</p>
                  <p className="date">{award.date}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="blog" className="blog reveal">
          <div className="section-heading">
            <p className="eyebrow">Blog & Articles</p>
            <h2>Technical insights and engineering deep dives</h2>
          </div>
          <div className="blog-grid">
            {blogArticles.map((article) => (
              <a key={article.title} href={article.link} className="blog-card">
                <div className="blog-category">{article.category}</div>
                <h3>{article.title}</h3>
                <p>{article.excerpt}</p>
                <div className="blog-meta">
                  <span className="read-time">{article.readTime}</span>
                  <span className="blog-date">{article.date}</span>
                </div>
                <div className="blog-tags">
                  {article.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="newsletter reveal">
          <div className="section-heading">
            <p className="eyebrow">Stay Updated</p>
            <h2>Get notified about new blog posts and insights</h2>
          </div>
          <p className="section-copy">
            Subscribe to my newsletter for engineering insights, DevOps tips, and technical deep dives delivered to your inbox.
          </p>
          <form className="newsletter-form" onSubmit={(e) => {
            e.preventDefault();
            alert("Thank you for subscribing! Feature coming soon.");
            e.target.reset();
          }}>
            <input
              type="email"
              placeholder="Your email address"
              required
              aria-label="Email address"
            />
            <button type="submit" className="btn primary">
              Subscribe
            </button>
          </form>
        </section>

        <section className="resources reveal">
          <div className="section-heading">
            <p className="eyebrow">Resources</p>
            <h2>Download and explore</h2>
          </div>
          <div className="resources-grid">
            {resources.map((resource) => (
              <a key={resource.title} href={resource.link} className="resource-card" target={resource.link.startsWith("http") ? "_blank" : undefined} rel={resource.link.startsWith("http") ? "noreferrer" : undefined}>
                <span className="resource-icon">{resource.icon}</span>
                <h3>{resource.title}</h3>
                <p>{resource.description}</p>
                <span className="resource-action">{resource.action} →</span>
              </a>
            ))}
          </div>
        </section>

        <section className="github-stats reveal">
          <div className="section-heading">
            <p className="eyebrow">GitHub Profile</p>
            <h2>Live repository statistics and activity</h2>
          </div>
          <GitHubStats />
        </section>

        <section className="case-studies reveal">
          <div className="section-heading">
            <p className="eyebrow">Case Studies</p>
            <h2>In-depth project analysis with metrics and impact</h2>
          </div>
          <div className="case-studies-list">
            {caseStudies.map((caseStudy) => (
              <article key={caseStudy.title} className="case-study-card">
                <div className="case-header">
                  <h3>{caseStudy.title}</h3>
                  <p className="case-company">{caseStudy.company}</p>
                  <p className="case-duration">{caseStudy.duration}</p>
                </div>

                <div className="case-sections">
                  <div className="case-section">
                    <h4>Problem</h4>
                    <p>{caseStudy.problem}</p>
                  </div>

                  <div className="case-section">
                    <h4>Solution</h4>
                    <p>{caseStudy.solution}</p>
                  </div>

                  <div className="case-section">
                    <h4>Results</h4>
                    <ul>
                      {caseStudy.results.map((result) => (
                        <li key={result}>{result}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="case-section">
                    <h4>Business Impact</h4>
                    <p className="impact-highlight">{caseStudy.impact}</p>
                  </div>
                </div>

                <div className="case-metrics">
                  {Object.entries(caseStudy.metrics).map(([key, value]) => (
                    <div key={key} className="metric">
                      <span className="metric-label">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                      <span className="metric-value">{value}</span>
                    </div>
                  ))}
                </div>

                <div className="case-tech">
                  {caseStudy.technologies.map((tech) => (
                    <span key={tech} className="tech-badge">
                      {tech}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="career-timeline reveal">
          <div className="section-heading">
            <p className="eyebrow">Career Journey</p>
            <h2>Timeline of milestones, achievements, and growth</h2>
          </div>
          <div className="timeline">
            {careerTimeline.map((item, idx) => (
              <div key={idx} className={`timeline-item type-${item.type}`}>
                <div className="timeline-marker">
                  <span className="timeline-icon">{item.icon}</span>
                </div>
                <div className="timeline-content">
                  <span className="timeline-year">{item.year}</span>
                  <h3>{item.title}</h3>
                  <p className="timeline-company">{item.company}</p>
                  <p className="timeline-achievement">{item.achievement}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="achievements reveal">
          <div className="section-heading">
            <p className="eyebrow">Achievements</p>
            <h2>Skills, badges, and professional accomplishments</h2>
          </div>
          <div className="achievements-grid">
            {achievements.map((achievement) => (
              <div key={achievement.title} className="achievement-card">
                <div className="achievement-icon">{achievement.icon}</div>
                <h3>{achievement.title}</h3>
                <p>{achievement.description}</p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${achievement.progress}%` }}></div>
                </div>
                <span className="progress-text">{achievement.progress}% Mastered</span>
              </div>
            ))}
          </div>
        </section>

        <section className="skills-matcher-section reveal">
          <div className="section-heading">
            <p className="eyebrow">Skills & Projects</p>
            <h2>Interactive skill-to-project matcher</h2>
          </div>
          <p className="section-copy">Click on any skill to see which projects utilize it.</p>
          <SkillsMatcher />
        </section>

        <section className="colleague-feedback reveal">
          <div className="section-heading">
            <p className="eyebrow">Colleague Feedback</p>
            <h2>What peers and colleagues have to say</h2>
          </div>
          <p className="section-copy">Share your feedback or appreciation here. Your message helps me grow professionally.</p>

          <div className="feedback-container">
            <div className="feedback-display">
              <h3>Recent Feedback</h3>
              <ColleagueFeedback />
            </div>

            <div className="feedback-form-display">
              <FeedbackForm />
            </div>
          </div>
        </section>

        <section className="quick-contact reveal">
          <div className="section-heading">
            <p className="eyebrow">Quick Connect</p>
            <h2>Reach out instantly on your preferred platform</h2>
          </div>
          <div className="quick-links-grid">
            {quickLinks.map((link) => (
              <a
                key={link.title}
                href={link.link}
                target="_blank"
                rel="noreferrer"
                className="quick-link-card"
                style={{ borderTopColor: link.color }}
              >
                <span className="quick-link-icon">{link.icon}</span>
                <span className="quick-link-title">{link.title}</span>

                      <section className="linkedin-hub reveal">
                        <div className="section-heading">
                          <p className="eyebrow">LinkedIn & Career Hub</p>
                          <h2>Professional growth and career opportunities</h2>
                        </div>
          
                        <div className="linkedin-profile-card">
                          <div className="profile-header">
                            <div className="profile-avatar">👤</div>
                            <div className="profile-info">
                              <h3>{linkedinProfile.headline}</h3>
                              <p>{linkedinProfile.about}</p>
                              <div className="profile-stats">
                                <span>{linkedinProfile.connections} Connections</span>
                                <span>{linkedinProfile.followers} Followers</span>
                              </div>
                            </div>
                          </div>
                          <a href={linkedinProfile.profileUrl} target="_blank" rel="noreferrer" className="btn primary">
                            View Full LinkedIn Profile
                          </a>
                        </div>

                        <div className="mutual-connections">
                          <h3>Mutual Connections</h3>
                          <div className="connections-grid">
                            {linkedinProfile.mutualConnections.map((conn) => (
                              <div key={conn.name} className="connection-card">
                                <span className="conn-emoji">{conn.imageEmoji}</span>
                                <h4>{conn.name}</h4>
                                <p className="conn-role">{conn.role}</p>
                                <p className="conn-company">{conn.company}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </section>

                      <section className="job-recommendations reveal">
                        <div className="section-heading">
                          <p className="eyebrow">Job Recommendations</p>
                          <h2>Roles that match your skills and experience</h2>
                        </div>
                        <div className="jobs-grid">
                          {jobRecommendations.map((job) => (
                            <div key={job.title} className="job-card">
                              <div className="job-header">
                                <h3>{job.title}</h3>
                                <span className="match-score">{job.matchScore}% Match</span>
                              </div>
                              <p className="company">{job.company}</p>
                              <p className="location">📍 {job.location}</p>
                              <p className="description">{job.description}</p>
                              <div className="job-skills">
                                {job.skills.map((skill) => (
                                  <span key={skill}>{skill}</span>
                                ))}
                              </div>
                              <div className="job-footer">
                                <span className="salary">{job.salary}</span>
                                <span className="posted">{job.posted}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>

                      <section className="skills-endorsements reveal">
                        <div className="section-heading">
                          <p className="eyebrow">Skills Endorsements</p>
                          <h2>Most recognized skills on LinkedIn</h2>
                        </div>
                        <div className="endorsements-list">
                          {skillsEndorsements.map((skill) => (
                            <div key={skill.skill} className="endorsement-item">
                              <div className="endorsement-info">
                                <h4>{skill.skill}</h4>
                                <span className="trend">{skill.trend}</span>
                              </div>
                              <div className="endorsement-bar">
                                <div className="bar-fill" style={{ width: `${Math.min(skill.endorsements, 150)}px` }}></div>
                                <span className="endorsement-count">{skill.endorsements} endorsements</span>
                              </div>
                              {skill.endorsed && <span className="endorsed-badge">✓ Endorsed</span>}
                            </div>
                          ))}
                        </div>
                      </section>

                      <section className="career-roadmap-section reveal">
                        <div className="section-heading">
                          <p className="eyebrow">Career Roadmap</p>
                          <h2>5-year career progression plan</h2>
                        </div>
                        <div className="roadmap-timeline">
                          {careerRoadmap.map((phase, idx) => (
                            <div key={idx} className={`roadmap-phase ${phase.completed ? "completed" : ""}`}>
                              <div className="phase-marker"></div>
                              <div className="phase-content">
                                <h3>{phase.phase}</h3>
                                <p className="phase-role">{phase.role}</p>
                                {phase.company && <p className="phase-company">@ {phase.company}</p>}
                                {phase.targetCompanies && (
                                  <p className="target-companies">Target: {phase.targetCompanies.join(", ")}</p>
                                )}
                                <p className="phase-focus">{phase.focus}</p>
                                <div className="phase-certs">
                                  {phase.certifications.map((cert) => (
                                    <span key={cert}>{cert}</span>
                                  ))}
                                </div>
                                <p className="phase-timeline">{phase.timeline}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>

                      <section className="referral-network reveal">
                        <div className="section-heading">
                          <p className="eyebrow">Referral Network</p>
                          <h2>Professional connections who can refer you</h2>
                        </div>
                        <div className="referrals-grid">
                          {referralNetwork.map((ref) => (
                            <div key={ref.name} className={`referral-card ${ref.canRefer ? "can-refer" : ""}`}>
                              <span className="ref-emoji">{ref.emoji}</span>
                              <h4>{ref.name}</h4>
                              <p className="ref-role">{ref.role}</p>
                              <p className="ref-company">{ref.company}</p>
                              <p className="ref-connection">{ref.connection}</p>
                              {ref.canRefer && <span className="referral-badge">💼 Can Refer</span>}
                              {ref.linkedIn !== "#" && (
                                <a href={ref.linkedIn} target="_blank" rel="noreferrer">
                                  View Profile
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      </section>

                      <section className="job-alerts reveal">
                        <div className="section-heading">
                          <p className="eyebrow">Latest Job Alerts</p>
                          <h2>Fresh opportunities that match your profile</h2>
                        </div>
                        <div className="alerts-list">
                          {jobAlerts.map((alert, idx) => (
                            <div key={idx} className="alert-item">
                              <div className="alert-header">
                                <h3>{alert.title}</h3>
                                <span className={`relevance relevance-${alert.relevance}`}>{alert.relevance}%</span>
                              </div>
                              <p className="alert-company">{alert.company} • {alert.location}</p>
                              <p className="alert-salary">{alert.salary}</p>
                              <div className="alert-skills">
                                {alert.skills.map((skill) => (
                                  <span key={skill}>{skill}</span>
                                ))}
                              </div>
                              <p className="alert-posted">Posted {alert.posted}</p>
                            </div>
                          ))}
                        </div>
                      </section>

                      <section className="industry-insights reveal">
                        <div className="section-heading">
                          <p className="eyebrow">Industry Insights</p>
                          <h2>Market trends, salary data, and demand analysis</h2>
                        </div>

                        <div className="insights-section">
                          <h3>Top Hiring Companies</h3>
                          <div className="companies-grid">
                            {industryInsights.topCompanies.map((company) => (
                              <div key={company.name} className="company-card">
                                <h4>{company.name}</h4>
                                <p>{company.sector}</p>
                                <div className="company-metrics">
                                  <span>📈 {company.growthRate}</span>
                                  <span>💰 {company.avgSalary}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="insights-section">
                          <h3>Salary Trends by Level</h3>
                          <div className="salary-grid">
                            {Object.entries(industryInsights.salaryTrends).map(([level, data]) => (
                              <div key={level} className="salary-card">
                                <h4>{level} {data.trend}</h4>
                                <p className="salary-range">{data.low} - {data.high}</p>
                                <p className="salary-avg">Avg: {data.avg}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="insights-section">
                          <h3>Most Demanded Skills</h3>
                          <div className="skills-demand">
                            {industryInsights.demandedSkills.map((skill) => (
                              <div key={skill.skill} className="demand-item">
                                <h4>{skill.skill}</h4>
                                <div className="demand-bar">
                                  <div className="demand-fill" style={{ width: `${skill.demand}%` }}></div>
                                </div>
                                <p className="demand-meta">{skill.demand}% Demand • {skill.jobsAvailable}+ Jobs</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </section>

                      <section className="linkedin-activity reveal">
                        <div className="section-heading">
                          <p className="eyebrow">LinkedIn Activity</p>
                          <h2>Recent posts, articles, and achievements</h2>
                        </div>
                        <div className="activity-feed">
                          {linkedinActivity.map((activity, idx) => (
                            <div key={idx} className={`activity-card type-${activity.type}`}>
                              <div className="activity-header">
                                <span className="activity-emoji">{activity.emoji}</span>
                                <span className="activity-type">{activity.type}</span>
                              </div>
                              <h3>{activity.title}</h3>
                              <p>{activity.description}</p>
                              <div className="activity-engagement">
                                <span>❤️ {activity.engagement.likes}</span>
                                <span>💬 {activity.engagement.comments}</span>
                                <span>↗️ {activity.engagement.shares}</span>
                              </div>
                              <p className="activity-date">{activity.date}</p>
                            </div>
                          ))}
                        </div>
                      </section>

                      <section className="recommendations-section reveal">
                        <div className="section-heading">
                          <p className="eyebrow">LinkedIn Recommendations</p>
                          <h2>Professional endorsements from colleagues and mentors</h2>
                        </div>
                        <div className="recommendations-list">
                          {recommendations.map((rec, idx) => (
                            <div key={idx} className="recommendation-card">
                              <div className="rec-header">
                                <span className="rec-emoji">{rec.emoji}</span>
                                <div>
                                  <h4>{rec.name}</h4>
                                  <p className="rec-role">{rec.role}</p>
                                </div>
                              </div>
                              <p className="rec-relationship">{rec.relationship}</p>
                              <p className="rec-text">"{rec.recommendation}"</p>
                              <p className="rec-date">{rec.date}</p>
                            </div>
                          ))}
                        </div>
                      </section>

                      <section className="target-role-section reveal">
                        <div className="section-heading">
                          <p className="eyebrow">Target Role Analyzer</p>
                          <h2>Skills gap analysis for your next career move</h2>
                        </div>
                        <div className="role-comparison">
                          <div className="role-card">
                            <h3>Current Role</h3>
                            <p className="role-title">{targetRoleAnalyzer.currentRole}</p>
                            <p className="skills-count">{targetRoleAnalyzer.currentSkillsCount} Skills</p>
                          </div>
                          <div className="match-meter">
                            <div className="meter-bar">
                              <div className="meter-fill" style={{ height: `${targetRoleAnalyzer.matchPercentage}%` }}></div>
                            </div>
                            <p className="match-text">{targetRoleAnalyzer.matchPercentage}% Match</p>
                          </div>
                          <div className="role-card">
                            <h3>Target Role</h3>
                            <p className="role-title">{targetRoleAnalyzer.targetRole}</p>
                            <p className="skills-count">{targetRoleAnalyzer.targetSkillsCount} Skills</p>
                          </div>
                        </div>

                        <div className="skills-gap">
                          <h3>Skills Comparison</h3>
                          <div className="gap-matrix">
                            {targetRoleAnalyzer.skillsMatch.map((skill) => (
                              <div key={skill.skill} className={`skill-row status-${skill.status.includes("Match") ? "match" : skill.status.includes("Priority") ? "priority" : "develop"}`}>
                                <span className="skill-name">{skill.skill}</span>
                                <span className="skill-current">{skill.current}</span>
                                <span className="skill-arrow">→</span>
                                <span className="skill-target">{skill.target}</span>
                                <span className="skill-status">{skill.status}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="gap-analysis">
                          <div className="analysis-box">
                            <h4>Critical Skills to Develop</h4>
                            <ul>
                              {targetRoleAnalyzer.gapAnalysis.criticalSkills.map((skill) => (
                                <li key={skill}>{skill}</li>
                              ))}
                            </ul>
                            <p className="timeline">Estimated Time: {targetRoleAnalyzer.gapAnalysis.estimatedTime}</p>
                          </div>

                          <div className="analysis-box">
                            <h4>Recommended Certifications</h4>
                            <ul>
                              {targetRoleAnalyzer.gapAnalysis.recommendedCertifications.map((cert) => (
                                <li key={cert}>{cert}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="analysis-box">
                            <h4>Action Plan</h4>
                            <ol>
                              {targetRoleAnalyzer.gapAnalysis.nextSteps.map((step, idx) => (
                                <li key={idx}>{step}</li>
                              ))}
                            </ol>
                          </div>
                        </div>
                      </section>

              </a>
            ))}
          </div>
        </section>


        <section className="faq reveal">
          <div className="section-heading">
            <p className="eyebrow">FAQ</p>
            <h2>What this portfolio communicates beyond visuals</h2>
          </div>
          <div className="faq-list">
            {faqItems.map((item) => (
              <article key={item.question} className="faq-item">
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="contact reveal">
          <div className="section-heading">
            <p className="eyebrow">Contact</p>
            <h2>Contact form, direct channels, and collaboration details</h2>
          </div>
          <p className="section-copy">
            This portfolio includes a real Node.js and Express API for contact submissions. You can
            also reach out directly through email, phone, LinkedIn, GitHub, or LeetCode.
          </p>
          <div className="contact-layout">
            <div className="contact-panel">
              <h3>Send a message</h3>
              <p>Use the form for job opportunities, project discussions, or technical collaboration.</p>
              <ContactForm />
            </div>
            <aside className="contact-side">
              <article className="contact-card availability-card">
                <h3>Availability</h3>
                <p>Open to full-time roles, ambitious product teams, and technically challenging builds.</p>
                <a className="btn ghost wide" href={resumePdf} target="_blank" rel="noreferrer">
                  View Resume
                </a>
              </article>
              <div className="contact-method-grid">
                {contactMethods.map((method) => (
                  <a
                    key={method.title}
                    className="contact-card method-card"
                    href={method.href}
                    target={method.href.startsWith("http") ? "_blank" : undefined}
                    rel={method.href.startsWith("http") ? "noreferrer" : undefined}
                  >
                    <span>{method.title}</span>
                    <strong>{method.value}</strong>
                  </a>
                ))}
              </div>
            </aside>
          </div>
        </section>
      </main>

      <footer>
        <p>© {year} Shivram Shinde. Built with React, Node.js, Express, and Three.js.</p>
      </footer>

      <BackToTop />
    </>
  );
}
