interface Testimonial {
  quote: string;
  author: string;
  location: string;
}

interface TestimonialsProps {
  heading: string;
  subheading?: string;
  testimonials: Testimonial[];
  advisorName: string;
}

export function Testimonials({ heading, testimonials, advisorName }: TestimonialsProps) {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section style={{ background: "#F0F4F8", padding: "6rem 2rem" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <p style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#5BCBF5", marginBottom: "0.5rem" }}>
            Client Reviews
          </p>
          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", fontWeight: 900, color: "#0A2540", lineHeight: 1.2 }}>
            See Why Homebuyers Trust {advisorName}
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}>
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="reveal"
              style={{
                background: "#fff",
                borderRadius: 8,
                padding: "2rem",
                boxShadow: "0 2px 12px rgba(10, 37, 64, 0.08)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ marginBottom: "1.5rem", flex: 1 }}>
                <p style={{ fontSize: "0.95rem", fontStyle: "italic", color: "#373A3C", lineHeight: 1.6, margin: 0 }}>
                  "{testimonial.quote}"
                </p>
              </div>
              <div style={{ borderTop: "1px solid #e8edf2", paddingTop: "1rem" }}>
                <p style={{ fontWeight: 600, color: "#0A2540", margin: "0 0 0.25rem 0", fontSize: "0.9rem" }}>
                  {testimonial.author}
                </p>
                <p style={{ fontSize: "0.8rem", color: "#6a8fa8", margin: 0 }}>
                  {testimonial.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
