import { useState } from 'react';

interface NavLink {
  href: string;
  label: string;
}

interface NavProps {
  logoUrl: string;
  applyUrl: string;
}

export function Navigation({ logoUrl, applyUrl }: NavProps) {
  const [showResourcesDropdown, setShowResourcesDropdown] = useState(false);

  const mainLinks: NavLink[] = [
    { href: '#process', label: 'Process' },
    { href: '#about', label: 'About' },
    { href: '#experience', label: 'Experience' },
    { href: '#contact', label: 'Contact' },
  ];

  const resourcesLinks: NavLink[] = [
    { href: '/calculator', label: 'Financial Freedom Calculator' },
  ];

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: '#fff',
      borderBottom: '1px solid #e8edf2',
      boxShadow: '0 1px 8px rgba(10,37,64,0.06)'
    }}>
      <div style={{
        maxWidth: 1140,
        margin: '0 auto',
        padding: '0 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 'auto',
        minHeight: 60,
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={logoUrl} alt="NEO Home Loans" style={{
            height: 'clamp(32px, 8vw, 44px)',
            width: 'auto',
            display: 'block'
          }} />
        </div>

        {/* Desktop Nav Links */}
        <div style={{ display: 'none', alignItems: 'center', gap: '1rem' }} className="nav-links-hide">
          {mainLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
                color: '#555',
                textDecoration: 'none',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#5BCBF5'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#555'}
            >
              {label}
            </a>
          ))}

          {/* Resources Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowResourcesDropdown(!showResourcesDropdown)}
              onMouseEnter={() => setShowResourcesDropdown(true)}
              onMouseLeave={() => setShowResourcesDropdown(false)}
              style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
                color: '#555',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#5BCBF5'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#555'}
            >
              Resources
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 1l5 5 5-5"/>
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showResourcesDropdown && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  background: '#fff',
                  border: '1px solid #e8edf2',
                  borderRadius: '6px',
                  boxShadow: '0 4px 12px rgba(10,37,64,0.1)',
                  minWidth: '220px',
                  marginTop: '0.5rem',
                  zIndex: 1000,
                }}
                onMouseEnter={() => setShowResourcesDropdown(true)}
                onMouseLeave={() => setShowResourcesDropdown(false)}
              >
                {resourcesLinks.map(({ href, label }) => (
                  <a
                    key={href}
                    href={href}
                    style={{
                      display: 'block',
                      padding: '0.75rem 1rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      letterSpacing: '0.01em',
                      textTransform: 'uppercase',
                      color: '#555',
                      textDecoration: 'none',
                      borderBottom: label === resourcesLinks[0].label ? '1px solid #e8edf2' : 'none',
                      transition: 'background-color 0.2s ease, color 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#F0F4F8';
                      e.currentTarget.style.color = '#5BCBF5';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#fff';
                      e.currentTarget.style.color = '#555';
                    }}
                  >
                    {label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Apply Button */}
        <a
          href={applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            background: '#5BCBF5',
            color: '#0A2540',
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 'clamp(0.65rem, 2vw, 0.78rem)',
            fontWeight: 700,
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            padding: '0.6rem 1rem',
            borderRadius: 4,
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            transition: 'background-color 0.2s ease',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#8ad8f8'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#5BCBF5'}
        >
          Apply
        </a>
      </div>
    </nav>
  );
}
