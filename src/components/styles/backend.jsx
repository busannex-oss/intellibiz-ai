/* =============================================
   BACKEND (App / Dashboard) Styles
   Scope: .backend-scope
   Pages: Dashboard, CreateBusiness, BrandKit,
          VideoCreation, SEOTools, Analytics,
          ContentStrategy, Tasks, Advertising,
          Omnichannel, PhoneSystem, CustomerFeedback,
          PerformanceReports, ColorThemes, Onboarding,
          KnowledgeBase, BusinessReport, PitchDeck,
          AccountSettings, CustomerJourney, etc.
   ============================================= */

/* --- Typography --- */
.backend-scope p,
.backend-scope li,
.backend-scope td,
.backend-scope th {
  font-size: 14px;
  line-height: 1.6;
  letter-spacing: -0.011em;
}

.backend-scope h1 { font-size: 1.75rem; line-height: 1.2; letter-spacing: -0.025em; font-weight: 700; }
.backend-scope h2 { font-size: 1.35rem; line-height: 1.3; letter-spacing: -0.02em;  font-weight: 600; }
.backend-scope h3 { font-size: 1.1rem;  line-height: 1.4; letter-spacing: -0.015em; font-weight: 600; }
.backend-scope h4 { font-size: 0.95rem; line-height: 1.5; font-weight: 600; }

/* --- Button fixes: no white backgrounds on dark surfaces --- */
.backend-scope button[class*="outline"] {
  background-color: transparent !important;
}

.backend-scope .bg-slate-900 button,
.backend-scope .bg-slate-800 button,
.backend-scope nav button {
  background-color: transparent;
}

/* Explicit white-bg override for intentionally white button surfaces */
.backend-scope .bg-white button[class*="outline"],
.backend-scope .card button[class*="outline"] {
  background-color: transparent;
  border-color: hsl(var(--border));
  color: hsl(var(--foreground));
}

/* --- Dashboard Cards --- */
.backend-scope .stat-card {
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}
.backend-scope .stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

/* --- Tables --- */
.backend-scope table {
  font-size: 13px;
}
.backend-scope th {
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-size: 11px;
}

/* --- Sidebar / Nav panels --- */
.backend-scope .sidebar-nav a {
  transition: background-color 0.15s ease, color 0.15s ease;
  border-radius: 0.5rem;
}