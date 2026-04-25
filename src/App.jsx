import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import NavigationTracker from '@/lib/NavigationTracker'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

import PWAPrompt from './components/PWAPrompt';
import AgentMemoryLogPage from './pages/AgentMemoryLog';
import AgentProfilesPage from './pages/AgentProfiles';
import WhiteLabelSettings from './pages/WhiteLabelSettings';
import ServiceAgreement from './pages/ServiceAgreement';
import IndependentContractorAgreement from './pages/IndependentContractorAgreement';
import PartnershipAgreement from './pages/PartnershipAgreement';
import LetterOfIntent from './pages/LetterOfIntent';
import IPAssignmentAgreement from './pages/IPAssignmentAgreement';
const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/" element={
        <LayoutWrapper currentPageName={mainPageKey}>
          <MainPage />
        </LayoutWrapper>
      } />
      {Object.entries(Pages).map(([path, Page]) => (
        <Route
          key={path}
          path={`/${path}`}
          element={
            <LayoutWrapper currentPageName={path}>
              <Page />
            </LayoutWrapper>
          }
        />
      ))}
      <Route path="/AgentProfiles" element={<LayoutWrapper currentPageName="AgentProfiles"><AgentProfilesPage /></LayoutWrapper>} />
      <Route path="/AgentMemoryLog" element={<LayoutWrapper currentPageName="AgentMemoryLog"><AgentMemoryLogPage /></LayoutWrapper>} />

      <Route path="/WhiteLabelSettings" element={<LayoutWrapper currentPageName="WhiteLabelSettings"><WhiteLabelSettings /></LayoutWrapper>} />
      <Route path="/ServiceAgreement" element={<LayoutWrapper currentPageName="ServiceAgreement"><ServiceAgreement /></LayoutWrapper>} />
      <Route path="/IndependentContractorAgreement" element={<LayoutWrapper currentPageName="IndependentContractorAgreement"><IndependentContractorAgreement /></LayoutWrapper>} />
      <Route path="/PartnershipAgreement" element={<LayoutWrapper currentPageName="PartnershipAgreement"><PartnershipAgreement /></LayoutWrapper>} />
      <Route path="/LetterOfIntent" element={<LayoutWrapper currentPageName="LetterOfIntent"><LetterOfIntent /></LayoutWrapper>} />
      <Route path="/IPAssignmentAgreement" element={<LayoutWrapper currentPageName="IPAssignmentAgreement"><IPAssignmentAgreement /></LayoutWrapper>} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <NavigationTracker />
          <AuthenticatedApp />
        </Router>
        <Toaster />
        <PWAPrompt />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App