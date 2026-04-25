const styles = `
/* =============================================
   FRONTEND (Public-Facing) Styles
   Scope: .frontend-scope
   Pages: Home, HowItWorks, Services, WhiteLabel,
          InvestorInfo, PrivacyPolicy, TermsOfService,
          CookiePolicy, Disclaimer, Resources, PlatformVideo
    ============================================= */

/* --- Typography --- */
.frontend-scope body,
.frontend-scope p,
.frontend-scope li {
  font-size: 15px;
  line-height: 1.7;
  letter-spacing: -0.011em;
}

.frontend-scope h1 { font-size: 3rem;   line-height: 1.1; letter-spacing: -0.03em; font-weight: 800; }
.frontend-scope h2 { font-size: 2rem;   line-height: 1.2; letter-spacing: -0.025em; font-weight: 700; }
.frontend-scope h3 { font-size: 1.35rem; line-height: 1.3; letter-spacing: -0.02em;  font-weight: 600; }
.frontend-scope h4 { font-size: 1.1rem;  line-height: 1.4; font-weight: 600; }

/* --- Buttons: transparent base on dark surfaces --- */
.frontend-scope nav button,
.frontend-scope nav a button {
  background-color: transparent;
}

/* Outline variant fix */
.frontend-scope button[class*="outline"],
.frontend-scope a button[class*="outline"] {
  background-color: transparent !important;
}

/* --- Hero & Marketing Sections --- */
.frontend-scope .hero-gradient {
  background: radial-gradient(ellipse at top, rgba(245,158,11,0.1) 0%, transparent 60%);
}

/* --- Feature Cards --- */
.frontend-scope .feature-card {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease;
}
.frontend-scope .feature-card:hover {
  transform: translateY(-4px);
}

/* --- Responsive text --- */
@media (max-width: 768px) {
  .frontend-scope h1 { font-size: 2rem; }
  .frontend-scope h2 { font-size: 1.5rem; }
}
`;

export default styles;