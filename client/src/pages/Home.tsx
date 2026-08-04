/*
 * NEO HOME LOANS -MORTGAGE ADVISOR HOMEPAGE TEMPLATE
 * =====================================================
 * Built on the Donald Miller StoryBrand framework.
 * All advisor-specific data lives in ADVISOR_CONFIG below.
 * To generate a new advisor site, only edit ADVISOR_CONFIG.
 *
 * Design System -NEO Brand:
 *   Font:    Montserrat (loaded in index.html)
 *   Navy:    #0A2540  (hero, problem, technology, CTA, footer backgrounds)
 *   Teal:    #5BCBF5  (accent, CTAs, eyebrows, highlights)
 *   Light:   #FAFAFA  (page background)
 *   Mid:     #F0F4F8  (alternate section backgrounds)
 *   Body:    #373A3C  (body text)
 *
 * StoryBrand narrative arc:
 *   Hero → Trust Bar → Reviews → Problem → Guide → Process →
 *   Medical Professionals → Who We Help → CTA + Calendar → Footer
 */

import { useEffect, useRef, useState } from "react";
import { getCurrentAdvisor } from "@/lib/advisor-loader";
import { Testimonials } from "@/components/Testimonials";

export default function Home() {
  const revealRef = useRef<HTMLDivElement>(null);
  const [showThankYou, setShowThankYou] = useState(false);
  const advisor = getCurrentAdvisor();
  const a = advisor;

  // Update meta tags and schemas for SEO
  useEffect(() => {
    // Update page title
    const title = `${a.name} | Mortgage Advisor | ${a.city}, ${a.state} | NEO Home Loans | NMLS #${a.nmls}`;
    document.title = title;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", `${a.name} is a Mortgage Advisor with NEO Home Loans in ${a.city}, ${a.state}. NMLS #${a.nmls}. ${a.yearsExperience} years of experience helping homebuyers with personalized mortgage strategies. Specializing in ${a.specialties.slice(0, 3).join(", ")}.`);
    }

    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute("content", `${a.name}, mortgage advisor, ${a.city}, ${a.state}, NEO Home Loans, NMLS ${a.nmls}, ${a.specialties.join(", ")}, home loans, mortgage strategy`);
    }

    // Update OG tags for social sharing
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute("content", title);
    } else {
      const newOgTitle = document.createElement("meta");
      newOgTitle.setAttribute("property", "og:title");
      newOgTitle.setAttribute("content", title);
      document.head.appendChild(newOgTitle);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute("content", `Mortgage Advisor specializing in ${a.specialties.slice(0, 2).join(" and ")} in ${a.city}, ${a.state}.`);
    } else {
      const newOgDesc = document.createElement("meta");
      newOgDesc.setAttribute("property", "og:description");
      newOgDesc.setAttribute("content", `Mortgage Advisor specializing in ${a.specialties.slice(0, 2).join(" and ")} in ${a.city}, ${a.state}.`);
      document.head.appendChild(newOgDesc);
    }

    // Remove existing JSON-LD scripts
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach(script => {
      if (script.id === "person-schema" || script.id === "local-business-schema" || script.id === "breadcrumb-schema" || script.id === "organization-schema") {
        script.remove();
      }
    });

    // Person Schema (for the advisor)
    const personSchema = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": a.name,
      "jobTitle": a.title,
      "identifier": `NMLS #${a.nmls}`,
      "image": a.headshot,
      "telephone": a.phone,
      "email": a.email,
      "areaServed": a.specialties,
      "knowsAbout": ["Mortgage Loans", "Home Purchase", "Refinancing", "Medical Professional Loans", ...a.specialties],
      "worksFor": {
        "@type": "Organization",
        "name": a.company,
        "url": "https://neohomeloans.com"
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": a.address.split(",")[0].trim(),
        "addressLocality": a.city,
        "addressRegion": a.stateAbbr,
        "postalCode": a.address.split(",").length > 2 ? a.address.split(",")[2].trim() : "84124",
        "addressCountry": "US"
      }
    };

    const personScriptEl = document.createElement("script");
    personScriptEl.id = "person-schema";
    personScriptEl.type = "application/ld+json";
    personScriptEl.textContent = JSON.stringify(personSchema);
    document.head.appendChild(personScriptEl);

    // LocalBusiness Schema
    const localBusinessSchema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": `${a.name} - Mortgage Advisor at ${a.company}`,
      "image": a.headshot,
      "description": `${a.name} is a mortgage advisor specializing in ${a.specialties.slice(0, 2).join(" and ")} with ${a.yearsExperience} years of experience.`,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": a.address.split(",")[0].trim(),
        "addressLocality": a.city,
        "addressRegion": a.stateAbbr,
        "postalCode": "84124",
        "addressCountry": "US"
      },
      "telephone": a.phone,
      "email": a.email,
      "priceRange": "$$",
      "areaServed": ["US"],
      "knowsAbout": a.specialties,
      "url": typeof window !== "undefined" ? window.location.href : ""
    };

    const localBusinessScriptEl = document.createElement("script");
    localBusinessScriptEl.id = "local-business-schema";
    localBusinessScriptEl.type = "application/ld+json";
    localBusinessScriptEl.textContent = JSON.stringify(localBusinessSchema);
    document.head.appendChild(localBusinessScriptEl);

    // Organization Schema (NEO Home Loans)
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": a.company,
      "url": "https://neohomeloans.com",
      "logo": a.logoUrl,
      "description": "NEO Home Loans provides specialized mortgage solutions for medical professionals, military veterans, first-time homebuyers, and entrepreneurs.",
      "sameAs": ["https://www.facebook.com/NEOHomeLoansMortgage", "https://www.linkedin.com/company/neo-home-loans"],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Mortgage Advisor",
        "telephone": a.phone,
        "email": a.email
      }
    };

    const orgScriptEl = document.createElement("script");
    orgScriptEl.id = "organization-schema";
    orgScriptEl.type = "application/ld+json";
    orgScriptEl.textContent = JSON.stringify(organizationSchema);
    document.head.appendChild(orgScriptEl);

    // Breadcrumb Schema
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "NEO Home Loans",
          "item": "https://neohomeloans.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": a.name,
          "item": typeof window !== "undefined" ? window.location.href : ""
        }
      ]
    };

    const breadcrumbScriptEl = document.createElement("script");
    breadcrumbScriptEl.id = "breadcrumb-schema";
    breadcrumbScriptEl.type = "application/ld+json";
    breadcrumbScriptEl.textContent = JSON.stringify(breadcrumbSchema);
    document.head.appendChild(breadcrumbScriptEl);
  }, [a]);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      await fetch("https://www.bntouchmortgage.net/api/webform/", {
        method: "POST",
        body: data,
        mode: "no-cors",
      });
    } catch (_) {
      // no-cors will throw but submission still goes through
    }
    form.reset();
    setShowThankYou(true);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("revealed");
        });
      },
      { threshold: 0.07, rootMargin: "0px 0px -20px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={revealRef} style={{ fontFamily: "'Montserrat', sans-serif", color: "#373A3C", background: "#FAFAFA" }}>

      {/* ── TOP BAR ── */}
      <div style={{ background: "#0A2540", color: "#6a8fa8", fontSize: "0.75rem", fontWeight: 500, padding: "0.55rem 0", textAlign: "center", letterSpacing: "0.03em" }}>
        {a.name} &nbsp;·&nbsp; {a.title} &nbsp;·&nbsp; {a.city}, {a.state} &nbsp;·&nbsp; NMLS #{a.nmls} &nbsp;|&nbsp;
        <a href={`tel:${a.phoneTel}`} style={{ color: "#5BCBF5" }}>{a.phone}</a>
        &nbsp;|&nbsp; {a.company}
      </div>

      {/* ── NAV ── */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "#fff", borderBottom: "1px solid #e8edf2", boxShadow: "0 1px 8px rgba(10,37,64,0.06)" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img src={a.logoUrl} alt="NEO Home Loans" style={{ height: 44, width: "auto", display: "block" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "2.25rem" }} className="nav-links-hide">
            {([["#process", "Our Process"], ["#about", `About ${a.firstName}`], ["#experience", "NEO Experience"], ["#contact", "Contact"]] as [string, string][]).map(([href, label]) => (
              <a key={href} href={href} style={{ fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: "#555", textDecoration: "none" }}>{label}</a>
            ))}
          </div>
          <a href={a.applyUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "#5BCBF5", color: "#0A2540", fontFamily: "'Montserrat', sans-serif", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", padding: "0.75rem 1.5rem", borderRadius: 4, textDecoration: "none" }}>
            Apply Now
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ position: "relative", background: "#0A2540", minHeight: "88vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url('${a.heroBgImage}')`, backgroundSize: "cover", backgroundPosition: "center center" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(10,37,64,0.92) 0%, rgba(10,37,64,0.88) 50%, rgba(10,37,64,0.45) 100%)" }} />
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "5rem 2rem", position: "relative", zIndex: 2, width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }}>
          <div className="reveal">
            <h1 style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)", fontWeight: 900, lineHeight: 1.1, color: "#fff", marginBottom: "1.25rem" }}>
              {a.heroHeadline[0]}<br />
              <span style={{ color: "#5BCBF5" }}>{a.heroHeadline[1]}</span>
            </h1>
            <p style={{ fontSize: "1rem", color: "#a8c4d8", lineHeight: 1.8, marginBottom: "1rem" }}>{a.heroSubhead}</p>
            <p style={{ fontSize: "0.9rem", color: "#6a8fa8", lineHeight: 1.8, marginBottom: "2.25rem" }}>{a.heroBio}</p>
            <a href="#contact" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#5BCBF5", color: "#0A2540", fontFamily: "'Montserrat', sans-serif", fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", padding: "0.9rem 2rem", borderRadius: 4, textDecoration: "none" }}>
              Schedule Your Free Mortgage Strategy Session
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }} className="reveal">
            <img
              src={a.heroTestimonialImage}
              alt={a.heroTestimonialAlt}
              style={{ maxWidth: "100%", width: 460, borderRadius: 12, boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
            />
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e8edf2", padding: "1.25rem 0" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 2rem" }}>
          <div style={{ textAlign: "center", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8ba8c4", marginBottom: "1rem" }}>
            {a.trustBarHeading}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1.5rem", flexWrap: "wrap" }}>
            {a.trustBarItems.map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.78rem", fontWeight: 600, color: "#555" }}>
                <div style={{ width: 16, height: 16, background: "#5BCBF5", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#0A2540" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                {item}
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", fontSize: "0.75rem", color: "#8ba8c4", marginTop: "0.85rem", fontWeight: 500 }}>
            {a.trustBarFootnote}
          </div>
        </div>
      </div>

      {/* ── TESTIMONIALS ── */}
      {a.testimonials && a.testimonials.length > 0 && (
        <Testimonials
          heading="See Why Homebuyers Trust"
          testimonials={a.testimonials}
          advisorName={a.firstName}
        />
      )}

      {/* ── THE PROBLEM ── */}
      <section style={{ background: "#0A2540", padding: "5rem 0" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 2rem" }}>
          <div style={{ maxWidth: 700, marginBottom: "3.5rem" }} className="reveal">
            <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#5BCBF5", marginBottom: "1rem" }}>The Problem</div>
            <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 800, lineHeight: 1.2, color: "#fff", marginBottom: "1.5rem" }}>
              The Right Mortgage Can Save You Thousands.<br />The Wrong One Can Cost You.
            </h2>
            <p style={{ fontSize: "1rem", color: "#a8c4d8", lineHeight: 1.8, marginBottom: "1rem" }}>
              Buying a home is one of the biggest financial decisions you'll ever make. Yet many buyers are simply handed a loan -not a strategy.
            </p>
            <p style={{ fontSize: "0.95rem", color: "#6a8fa8", lineHeight: 1.8 }}>
              Between changing interest rates, rising home prices, and countless financing options, it's easy to wonder if you're making the right decision. You deserve someone who will explain your options, answer your questions, and help you choose a mortgage that fits your goals -not just today, but for years to come.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
            {[
              { num: "01", title: "Rates and prices keep changing", body: "The market shifts constantly. Without a clear strategy, it's easy to make a decision you'll regret -and pay for it for decades." },
              { num: "02", title: "Most lenders just quote a rate", body: "Getting pre-approved is not a strategy. Most lenders focus on closing the loan -not on whether that loan is the right financial decision for your life." },
              { num: "03", title: "The guidance stops at closing", body: "Most lenders close your loan and move on. Your financial situation keeps changing -and you deserve an advisor who stays with you." },
            ].map((card) => (
              <div key={card.num} className="reveal" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "1.75rem" }}>
                <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#5BCBF5", marginBottom: "0.75rem" }}>Problem {card.num}</div>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#fff", marginBottom: "0.6rem", lineHeight: 1.3 }}>{card.title}</h3>
                <p style={{ fontSize: "0.88rem", color: "#6a8fa8", lineHeight: 1.7 }}>{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MEET YOUR GUIDE ── */}
      <section id="about" style={{ background: "#FAFAFA", padding: "5rem 0" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 2rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" }}>
            <div className="reveal" style={{ borderRadius: 8, overflow: "hidden", aspectRatio: "4/5", background: "#dde3ea" }}>
              <img
                src={a.headshot}
                alt={`${a.name} -${a.title}, ${a.company}, ${a.city} ${a.stateAbbr}`}
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }}
              />
            </div>
            <div className="reveal">
              <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#5BCBF5", marginBottom: "1rem" }}>Meet Your Guide</div>
              <div style={{ width: "3rem", height: 3, background: "#5BCBF5", borderRadius: 2, marginBottom: "1.5rem" }} />
              <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 900, color: "#0A2540", marginBottom: "0.25rem" }}>{a.name}</h2>
              <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#5BCBF5", marginBottom: "1.5rem" }}>{a.title} &middot; {a.company} &middot; {a.city}, {a.stateAbbr}</div>
              {a.aboutBio.map((para, i) => (
                <p key={i} style={{ fontSize: i === 0 ? "0.95rem" : "0.92rem", color: "#555", lineHeight: 1.8, marginBottom: "1rem", fontWeight: i === 0 ? 600 : 400 }}>{para}</p>
              ))}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2rem" }}>
                {a.aboutTags.map((tag) => (
                  <div key={tag} style={{ background: "#F0F4F8", border: "1px solid #dde3ea", borderRadius: 3, padding: "0.3rem 0.75rem", fontSize: "0.75rem", fontWeight: 600, color: "#0A2540" }}>{tag}</div>
                ))}
              </div>
              <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8ba8c4", marginBottom: "0.85rem" }}>Why Clients Choose {a.firstName}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
                {a.aboutWhyChoose.map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", padding: "0.75rem", background: "#F0F4F8", borderRadius: 6 }}>
                    <div style={{ width: 8, height: 8, background: "#5BCBF5", borderRadius: "50%", marginTop: "0.3rem", flexShrink: 0 }} />
                    <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#0A2540", lineHeight: 1.4 }}>{item}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SIMPLE PROCESS ── */}
      <section id="process" style={{ background: "#F0F4F8", padding: "5rem 0" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 2rem" }}>
          <div style={{ textAlign: "center", maxWidth: 520, margin: "0 auto 3rem" }} className="reveal">
            <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#5BCBF5", marginBottom: "1rem" }}>Simple Process</div>
            <div style={{ width: "3rem", height: 3, background: "#5BCBF5", borderRadius: 2, margin: "0 auto 1.5rem" }} />
            <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)", fontWeight: 800, color: "#0A2540", lineHeight: 1.2 }}>Three Simple Steps</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, border: "1px solid #dde3ea", borderRadius: 8, overflow: "hidden" }} className="reveal">
            {[
              {
                num: "01",
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5BCBF5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
                title: "Schedule a Free Strategy Session",
                body: `Tell ${a.firstName} about your goals. In 30 minutes, you'll have a clear picture of your options and a plan that fits your life.`,
              },
              {
                num: "02",
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5BCBF5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
                title: "Get Your Custom Mortgage Strategy",
                body: "Receive a personalized plan built around your income, goals, and timeline -not just the lowest rate available today.",
              },
              {
                num: "03",
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5BCBF5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V9.5Z"/></svg>,
                title: "Close with Confidence -and Beyond",
                body: "We handle the details so you can focus on moving in. And after closing, we stay with you to make sure your mortgage keeps working for you.",
              },
            ].map((step, idx) => (
              <div key={step.num} style={{ padding: "2.5rem 2rem", background: "#fff", borderRight: idx < 2 ? "1px solid #e8edf2" : "none" }}>
                <div style={{ width: 48, height: 48, background: "#EBF6FD", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>{step.icon}</div>
                <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#5BCBF5", marginBottom: "0.5rem" }}>Step {step.num}</div>
                <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#0A2540", marginBottom: "0.75rem", lineHeight: 1.3 }}>{step.title}</h3>
                <p style={{ fontSize: "0.88rem", color: "#666", lineHeight: 1.7 }}>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEO EXPERIENCE ── */}
      <section id="experience" style={{ background: "#0A2540", padding: "5rem 0" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 2rem" }}>
          <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 3.5rem" }} className="reveal">
            <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#5BCBF5", marginBottom: "1rem" }}>The NEO Experience</div>
            <div style={{ width: "3rem", height: 3, background: "#5BCBF5", borderRadius: 2, margin: "0 auto 1.5rem" }} />
            <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 800, color: "#fff", lineHeight: 1.2, marginBottom: "1rem" }}>
              We Are Not Loan Officers.<br />We Are Mortgage Advisors.
            </h2>
            <p style={{ fontSize: "0.95rem", color: "#a8c4d8", lineHeight: 1.8 }}>
              At NEO, a mortgage is not a transaction -it's the foundation of a long-term financial strategy. Our Mortgages Under Management system means we stay actively engaged in your financial life long after closing day.
            </p>
          </div>

          {/* 5 Pillars */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1px", background: "rgba(255,255,255,0.08)", borderRadius: 8, overflow: "hidden", marginBottom: "3rem" }} className="reveal">
            {[
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5BCBF5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, title: "Protection", body: "Safeguard your home and family with the right coverage and risk management strategies." },
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5BCBF5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, title: "Financial Planning", body: "Align your mortgage with your broader financial goals, income, and long-term wealth plan." },
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5BCBF5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>, title: "Generational Wealth", body: "Build equity and leverage your home as a vehicle for lasting family wealth." },
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5BCBF5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>, title: "Real Estate Planning", body: "Strategic guidance on buying, selling, and investing in real estate at every stage of life." },
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5BCBF5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>, title: "Debt Management", body: "Optimize your full financial picture -not just your mortgage -to reduce costs and accelerate wealth." },
            ].map((pillar) => (
              <div key={pillar.title} style={{ background: "rgba(255,255,255,0.03)", padding: "1.75rem 1.25rem", textAlign: "center" }}>
                <div style={{ width: 44, height: 44, background: "rgba(91,203,245,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>{pillar.icon}</div>
                <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#fff", marginBottom: "0.5rem" }}>{pillar.title}</div>
                <div style={{ fontSize: "0.78rem", color: "#6a8fa8", lineHeight: 1.6 }}>{pillar.body}</div>
              </div>
            ))}
          </div>

          {/* Service Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }} className="reveal">
            {[
              { title: "Monthly Real Estate Digests", body: "Stay informed with monthly updates on your equity position, interest paid to date, and proactive refinance opportunity alerts." },
              { title: "Annual Financial Reviews", body: "Every year, we review your mortgage alongside your full financial picture and provide a personalized plan to keep you on track." },
              { title: "The Perfect Mortgage Promise", body: "We proactively monitor the market after closing and alert you when refinancing makes financial sense -so you never miss an opportunity." },
              { title: "Global Debt Management", body: "We look beyond your mortgage to help you manage all household debt strategically, accelerating your path to financial freedom." },
            ].map((card) => (
              <div key={card.title} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(91,203,245,0.12)", borderRadius: 8, padding: "1.75rem" }}>
                <div style={{ width: 6, height: 6, background: "#5BCBF5", borderRadius: "50%", marginBottom: "1rem" }} />
                <h3 style={{ fontSize: "0.9rem", fontWeight: 800, color: "#fff", marginBottom: "0.6rem", lineHeight: 1.3 }}>{card.title}</h3>
                <p style={{ fontSize: "0.82rem", color: "#6a8fa8", lineHeight: 1.7 }}>{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MEDICAL PROFESSIONALS ── */}
      <section style={{ background: "#F0F4F8", padding: "5rem 0" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 2rem" }}>
          <div style={{ maxWidth: 620, marginBottom: "3rem" }} className="reveal">
            <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#5BCBF5", marginBottom: "1rem" }}>Medical Professionals</div>
            <div style={{ width: "3rem", height: 3, background: "#5BCBF5", borderRadius: 2, marginBottom: "1.5rem" }} />
            <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)", fontWeight: 800, color: "#0A2540", lineHeight: 1.2, marginBottom: "1rem" }}>
              Specialized Home Loans for Healthcare Professionals
            </h2>
            <p style={{ fontSize: "0.95rem", color: "#555", lineHeight: 1.8 }}>
              Healthcare professionals often have unique financial situations that most lenders don't understand -high student loan debt, non-traditional income, and employment start dates that don't fit standard guidelines. We do.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "start" }} className="reveal">
            <div style={{ background: "#fff", border: "1px solid #dde3ea", borderRadius: 10, padding: "2rem" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#5BCBF5", marginBottom: "1.25rem" }}>Program Highlights</div>
              {[
                "100% financing up to $2M",
                "90% financing up to $3M",
                "No private mortgage insurance (PMI)",
                "Gift funds acceptable",
                "Close prior to employment start date",
                "Flexible with student loan debt",
                "1099 income with guaranteed salary or hourly rate accepted",
              ].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", marginBottom: "0.9rem" }}>
                  <div style={{ width: 20, height: 20, background: "#5BCBF5", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0A2540" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "#555", lineHeight: 1.5 }}>{item}</div>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#5BCBF5", marginBottom: "1.25rem" }}>Eligible Designations</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "2rem" }}>
                {["MD", "DC", "DDS", "DMD", "DO", "OD", "PharmD", "DPT", "DPM", "DVM", "CRNA", "NP", "PA"].map((deg) => (
                  <div key={deg} style={{ background: "#fff", border: "1px solid #dde3ea", borderRadius: 6, padding: "0.65rem 1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{ width: 7, height: 7, background: "#5BCBF5", borderRadius: "50%", flexShrink: 0 }} />
                    <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0A2540" }}>{deg}</div>
                  </div>
                ))}
              </div>
              <a href="#contact" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#5BCBF5", color: "#0A2540", fontFamily: "'Montserrat', sans-serif", fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", padding: "0.9rem 2rem", borderRadius: 4, textDecoration: "none" }}>
                Learn About Medical Professional Home Loans
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHO WE HELP ── */}
      <section style={{ background: "#FAFAFA", padding: "5rem 0" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 2rem" }}>
          <div style={{ textAlign: "center", maxWidth: 520, margin: "0 auto 3rem" }} className="reveal">
            <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#5BCBF5", marginBottom: "1rem" }}>Who We Help</div>
            <div style={{ width: "3rem", height: 3, background: "#5BCBF5", borderRadius: 2, margin: "0 auto 1.5rem" }} />
            <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)", fontWeight: 800, color: "#0A2540", lineHeight: 1.2 }}>
              Mortgage Solutions for Every Stage of Homeownership
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.25rem" }}>
            {[
              { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5BCBF5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V9.5Z"/></svg>, title: "First-Time Homebuyers", body: "We'll walk you through every step with clarity and confidence." },
              { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5BCBF5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>, title: "Growing Families", body: "Financing that fits your family's goals today and tomorrow." },
              { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5BCBF5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>, title: "Medical Professionals", body: "Specialized programs designed for your unique career path." },
              { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5BCBF5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, title: "Veterans", body: "VA loan expertise to honor your service with the right financing." },
              { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5BCBF5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>, title: "Self-Employed Borrowers", body: "We understand non-traditional income and know how to work with it." },
              { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5BCBF5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>, title: "Real Estate Investors", body: "Smart financing strategies for building your investment portfolio." },
              { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5BCBF5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>, title: "Homeowners Refinancing", body: "Lower your rate, tap equity, or restructure for long-term savings." },
              { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5BCBF5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>, title: "Move-Up Buyers", body: "Upgrade to the home your family needs with a strategy that works." },
            ].map((item) => (
              <div key={item.title} className="reveal" style={{ background: "#fff", border: "1px solid #e8edf2", borderRadius: 8, padding: "1.5rem" }}>
                <div style={{ width: 44, height: 44, background: "#EBF6FD", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>{item.icon}</div>
                <h3 style={{ fontSize: "0.9rem", fontWeight: 800, color: "#0A2540", marginBottom: "0.4rem" }}>{item.title}</h3>
                <p style={{ fontSize: "0.82rem", color: "#666", lineHeight: 1.65 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THANK YOU MODAL ── */}
      {showThankYou && (
        <div onClick={() => setShowThankYou(false)} style={{ position: "fixed", inset: 0, background: "rgba(10,37,64,0.85)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 12, padding: "3rem 2.5rem", maxWidth: 480, width: "100%", textAlign: "center", boxShadow: "0 25px 60px rgba(0,0,0,0.3)", position: "relative" }}>
            <button onClick={() => setShowThankYou(false)} style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", cursor: "pointer", color: "#8ba8c4", fontSize: "1.4rem", lineHeight: 1 }} aria-label="Close">&times;</button>
            <div style={{ width: 64, height: 64, background: "#5BCBF5", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0A2540" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0A2540", marginBottom: "0.75rem", fontFamily: "'Montserrat', sans-serif" }}>Thank You!</h3>
            <p style={{ fontSize: "0.95rem", color: "#555", lineHeight: 1.7, marginBottom: "1.5rem" }}>
              {a.firstName} will be reaching out to you shortly. If you'd like to speak with {a.firstName === "Drake" ? "him" : "them"} right away, give {a.firstName === "Drake" ? "him" : "them"} a call:
            </p>
            <a href={`tel:${a.phoneTel}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#0A2540", color: "#5BCBF5", fontFamily: "'Montserrat', sans-serif", fontSize: "1rem", fontWeight: 700, padding: "0.85rem 2rem", borderRadius: 6, textDecoration: "none", letterSpacing: "0.02em" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              {a.phone}
            </a>
            <p style={{ fontSize: "0.75rem", color: "#aaa", marginTop: "1.25rem" }}>Click anywhere outside to close</p>
          </div>
        </div>
      )}

      {/* ── FINAL CTA -FORM + CALENDAR ── */}
      <section id="contact" style={{ background: "#0A2540", padding: "5rem 0" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 2rem" }}>
          <div style={{ textAlign: "center", maxWidth: 620, margin: "0 auto 3.5rem" }} className="reveal">
            <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#5BCBF5", marginBottom: "1rem" }}>Take the Next Step</div>
            <div style={{ width: "3rem", height: 3, background: "#5BCBF5", borderRadius: 2, margin: "0 auto 1.5rem" }} />
            <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 800, color: "#fff", lineHeight: 1.2, marginBottom: "1rem" }}>Ready to Take the Next Step?</h2>
            <p style={{ fontSize: "0.95rem", color: "#a8c4d8", lineHeight: 1.8 }}>
              Schedule a free consultation or fill out the form below. There's no pressure -just expert guidance tailored to your goals.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "start" }} className="reveal">
            {/* BNTouch Lead Form */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(91,203,245,0.2)", borderRadius: 10, padding: "2.5rem" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#5BCBF5", marginBottom: "0.5rem" }}>Get in Touch</div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#fff", marginBottom: "1.75rem" }}>Tell Us About Your Goals</h3>
              <form name="bntWebForm" method="post" action="https://www.bntouchmortgage.net/api/webform/" onSubmit={handleFormSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <label htmlFor="name_1" style={{ fontSize: "0.75rem", fontWeight: 700, color: "#a8c4d8", letterSpacing: "0.05em" }}>First Name</label>
                  <input id="name_1" name="name_1" type="text" required placeholder="First name" style={{ height: 44, padding: "0 0.9rem", borderRadius: 6, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.07)", color: "#fff", fontSize: "0.88rem", fontFamily: "'Montserrat', sans-serif", outline: "none" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <label htmlFor="name_2_only" style={{ fontSize: "0.75rem", fontWeight: 700, color: "#a8c4d8", letterSpacing: "0.05em" }}>Last Name</label>
                  <input id="name_2_only" name="name_2_only" type="text" required placeholder="Last name" style={{ height: 44, padding: "0 0.9rem", borderRadius: 6, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.07)", color: "#fff", fontSize: "0.88rem", fontFamily: "'Montserrat', sans-serif", outline: "none" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <label htmlFor="email" style={{ fontSize: "0.75rem", fontWeight: 700, color: "#a8c4d8", letterSpacing: "0.05em" }}>Email Address</label>
                  <input id="email" name="email" type="email" required placeholder="name@email.com" style={{ height: 44, padding: "0 0.9rem", borderRadius: 6, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.07)", color: "#fff", fontSize: "0.88rem", fontFamily: "'Montserrat', sans-serif", outline: "none" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <label htmlFor="phone_cell" style={{ fontSize: "0.75rem", fontWeight: 700, color: "#a8c4d8", letterSpacing: "0.05em" }}>Cell Phone</label>
                  <input id="phone_cell" name="phone_cell" type="tel" required placeholder="(555) 123-4567" style={{ height: 44, padding: "0 0.9rem", borderRadius: 6, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.07)", color: "#fff", fontSize: "0.88rem", fontFamily: "'Montserrat', sans-serif", outline: "none" }} />
                </div>
                <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <label htmlFor="property_state" style={{ fontSize: "0.75rem", fontWeight: 700, color: "#a8c4d8", letterSpacing: "0.05em" }}>Property State</label>
                  <select id="property_state" name="3566786" required style={{ height: 44, padding: "0 0.9rem", borderRadius: 6, border: "1px solid rgba(255,255,255,0.15)", background: "#0d2e4e", color: "#fff", fontSize: "0.88rem", fontFamily: "'Montserrat', sans-serif", outline: "none" }}>
                    <option value="">Select a State</option>
                    {["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"].map(s => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                {/* Hidden tracking fields -update per advisor */}
                <input type="hidden" name="added_source" value={a.bnTouchSource} />
                <input type="hidden" name="RETURNURL" value="" />
                <input type="hidden" name="USERID" value={a.bnTouchUserId} />
                <input type="hidden" name="WEBFORMID" value={a.bnTouchWebFormId} />
                <div style={{ gridColumn: "1 / -1", paddingTop: "0.5rem" }}>
                  <button type="submit" style={{ width: "100%", height: 48, background: "#5BCBF5", color: "#0A2540", fontFamily: "'Montserrat', sans-serif", fontSize: "0.82rem", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", border: "none", borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                    Get My Free Mortgage Strategy
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </button>
                  <p style={{ fontSize: "0.72rem", color: "#4a6a84", textAlign: "center", marginTop: "0.75rem", lineHeight: 1.5 }}>
                    By submitting this form, you agree to our privacy policy and consent to receive communications.
                  </p>
                </div>
              </form>
            </div>

            {/* YouCanBook.me Calendar */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(91,203,245,0.2)", borderRadius: 10, overflow: "hidden", minHeight: 600 }}>
              <div style={{ padding: "1.5rem 2rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#5BCBF5", marginBottom: "0.25rem" }}>Schedule a Call</div>
                <div style={{ fontSize: "1rem", fontWeight: 700, color: "#fff" }}>Book a Free Mortgage Strategy Session</div>
              </div>
              <iframe
                src={a.calendarUrl}
                style={{ width: "100%", height: 780, border: "none", display: "block" }}
                title={`Schedule a call with ${a.name}`}
                allow="payment"
              />
            </div>
          </div>

          {/* Contact info row */}
          <div style={{ display: "flex", gap: "2.5rem", justifyContent: "center", flexWrap: "wrap", marginTop: "3.5rem", paddingTop: "2.5rem", borderTop: "1px solid rgba(255,255,255,0.08)" }} className="reveal">
            {[
              { label: "Phone", value: a.phone, href: `tel:${a.phoneTel}` },
              { label: "Email", value: a.email, href: `mailto:${a.email}` },
              { label: "Office", value: a.address },
              { label: "NMLS", value: `#${a.nmls}` },
            ].map((c) => (
              <div key={c.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#4a6a84", marginBottom: "0.4rem" }}>{c.label}</div>
                {c.href ? (
                  <a href={c.href} style={{ fontSize: "0.88rem", fontWeight: 600, color: "#5BCBF5", textDecoration: "none" }}>{c.value}</a>
                ) : (
                  <div style={{ fontSize: "0.85rem", color: "#6a8fa8", lineHeight: 1.5 }}>{c.value}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#060F1A", padding: "3rem 0 2rem" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 2rem" }}>
          <div style={{ marginBottom: "2.5rem" }}>
            <div style={{ fontSize: "0.9rem", fontWeight: 800, color: "#fff", marginBottom: "0.5rem" }}>{a.name} &middot; {a.company}</div>
            <p style={{ fontSize: "0.82rem", color: "#4a6a84", lineHeight: 1.75, marginBottom: "1.25rem", maxWidth: 560 }}>{a.footerDescription}</p>
            <div style={{ fontSize: "0.82rem", color: "#4a6a84", marginBottom: "0.4rem" }}>
              Phone: <a href={`tel:${a.phoneTel}`} style={{ color: "#5BCBF5", textDecoration: "none" }}>{a.phone}</a>
            </div>
            <div style={{ fontSize: "0.82rem", color: "#4a6a84", marginBottom: "0.4rem" }}>
              Email: <a href={`mailto:${a.email}`} style={{ color: "#5BCBF5", textDecoration: "none" }}>{a.email}</a>
            </div>
            <div style={{ fontSize: "0.82rem", color: "#4a6a84" }}>{a.address}</div>
          </div>

          <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.05)", marginBottom: "1.5rem" }} />

          <div style={{ fontSize: "0.7rem", color: "#2a4a64", lineHeight: 1.8 }}>
            <p style={{ marginBottom: "0.75rem" }}>&copy; {new Date().getFullYear()} Better Home &amp; Finance Holding Company and/or its affiliates. Better is a family of companies. Better Mortgage Corporation provides home loans; Better Real Estate, LLC and Better Real Estate California Inc License # 02164055 provides real estate services; Better Cover, LLC sells insurance products; and Better Settlement Services provides title insurance services; and Better Inspect, LLC provides home inspection services. All rights reserved.</p>
            <p style={{ marginBottom: "0.75rem" }}>Better BMC operates under the name Better Mortgage Corporation in New York.</p>
            <p style={{ marginBottom: "0.75rem" }}>Home lending products offered by Better Mortgage Corporation. Better Mortgage Corporation is a direct lender. NMLS #330511. 1 World Trade Center, 80th Floor, New York, NY 10007. Loans made or arranged pursuant to a California Finance Lenders Law License. Not available in all states. Equal Housing Lender. NMLS Consumer Access.</p>
            <p style={{ marginBottom: "0.75rem" }}>Better Real Estate, LLC dba BRE, Better Home Services, BRE Services, LLC and Better Real Estate, and operating in the State of California through its wholly owned subsidiary Better Real Estate California Inc., is a licensed real estate brokerage and maintains its corporate headquarters at 325-41 Chestnut Street, Suite 826, Philadelphia, PA 19106. Better Real Estate, LLC provides access to real estate brokerage services via its nationwide network of partner brokerages and real estate agents (&ldquo;Better Real Estate Partner Agents&rdquo;). Equal Housing Opportunity. All rights reserved.</p>
            <p style={{ marginBottom: "0.75rem" }}>Better Settlement Services, LLC. 325-41 Chestnut Street, Suite 803, Philadelphia, PA 19106.</p>
            <p style={{ marginBottom: "0.75rem" }}>Homeowners insurance policies are offered through Better Cover, LLC, a Pennsylvania Resident Producer Agency. License #881593. 325-41 Chestnut Street, Suite 807, Philadelphia, PA 19106.</p>
            <p style={{ marginBottom: "0.75rem" }}>Better Inspect, LLC maintains its corporate headquarters at 325-41 Chestnut Street, Suite 846, Philadelphia, PA 19106.</p>
            <p style={{ marginBottom: "0.75rem" }}>Better Mortgage Corporation, Better Real Estate, LLC, Better Settlement Services, LLC, Better Cover, LLC, Better Connect, and Better Inspect, LLC are separate operating subsidiaries of Better Home &amp; Finance Holding Company. Each company is a separate legal entity operated and managed through its own management and governance structure as required by its state of incorporation, and applicable and legal and regulatory requirements. Products not available in all states.</p>
            <p style={{ marginBottom: "0.75rem" }}>Any unauthorized use of any proprietary or intellectual property is strictly prohibited. All trademarks, service marks, trade names, logos, icons, and domain names are proprietary to Better Home &amp; Finance Holding Company. Better Home &amp; Finance Holding Company trademarks are federally registered with the U.S. Patent and Trademark Office. Better Cover is a registered trademark with the U.S. Patent and Trademark Office and is owned by Better Cover, LLC.</p>
            <p style={{ marginBottom: "0.75rem" }}>Licensed by the Department of Financial Protection and Innovation under the California Residential Mortgage Lending Act.</p>
            <p style={{ marginTop: "1rem", color: "#3a5a74", fontWeight: 600 }}>{a.name} &middot; NMLS #{a.nmls} &middot; {a.company} &middot; {a.address} &middot; Equal Housing Lender</p>
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 900px) {
          .nav-links-hide { display: none !important; }
        }
        .reveal { opacity: 1; transform: none; }
        @media (prefers-reduced-motion: no-preference) {
          .reveal:not(.revealed) { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease; }
          .reveal.revealed { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
}
