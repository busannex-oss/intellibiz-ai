/* =============================================
   ADMIN Panel Styles
   Scope: .admin-scope
   Pages: AdminDashboard, ErrorLogs
   ============================================= */

/* --- Typography: dense data layout --- */
.admin-scope p,
.admin-scope li,
.admin-scope td,
.admin-scope th,
.admin-scope label {
  font-size: 13px;
  line-height: 1.5;
}

.admin-scope h1 { font-size: 1.5rem;  font-weight: 700; letter-spacing: -0.02em; }
.admin-scope h2 { font-size: 1.15rem; font-weight: 600; letter-spacing: -0.015em; }
.admin-scope h3 { font-size: 1rem;    font-weight: 600; }

/* --- Button fixes: no white bg on dark admin surfaces --- */
.admin-scope button[class*="outline"] {
  background-color: transparent !important;
}

.admin-scope nav button,
.admin-scope .bg-slate-900 button,
.admin-scope .bg-slate-800 button {
  background-color: transparent;
}

/* --- Tables: compact & readable --- */
.admin-scope table {
  font-size: 12px;
  width: 100%;
}
.admin-scope th {
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 10px;
  padding: 8px 12px;
}
.admin-scope td {
  padding: 8px 12px;
}
.admin-scope tr {
  transition: background-color 0.1s ease;
}

/* --- Status badges --- */
.admin-scope .status-active  { color: #22c55e; }
.admin-scope .status-inactive { color: #ef4444; }
.admin-scope .status-pending  { color: #f59e0b; }

/* --- Action buttons: compact --- */
.admin-scope .action-btn {
  padding: 4px 10px;
  font-size: 12px;
}

/* --- Permission-level indicator strip --- */
.admin-scope .admin-bar {
  border-left: 3px solid #ef4444;
  padding-left: 12px;
}