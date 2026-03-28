/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import AccountSettings from './pages/AccountSettings';
import AdminDashboard from './pages/AdminDashboard';
import AdminDocs from './pages/AdminDocs';
import Advertising from './pages/Advertising';
import Analytics from './pages/Analytics';
import BrandKit from './pages/BrandKit';
import BusinessReport from './pages/BusinessReport';
import ColorThemes from './pages/ColorThemes';
import ContentStrategy from './pages/ContentStrategy';
import CookiePolicy from './pages/CookiePolicy';
import CreateBusiness from './pages/CreateBusiness';
import CustomerFeedback from './pages/CustomerFeedback';
import CustomerJourney from './pages/CustomerJourney';
import Dashboard from './pages/Dashboard';
import Disclaimer from './pages/Disclaimer';
import ErrorLogs from './pages/ErrorLogs';
import Home from './pages/Home';
import HowItWorks from './pages/HowItWorks.jsx';
import InvestorInfo from './pages/InvestorInfo.jsx';
import KnowledgeBase from './pages/KnowledgeBase';
import Omnichannel from './pages/Omnichannel';
import Onboarding from './pages/Onboarding';
import PerformanceReports from './pages/PerformanceReports';
import PhoneIntegrations from './pages/PhoneIntegrations';
import PhoneSystem from './pages/PhoneSystem';
import PitchDeck from './pages/PitchDeck';
import PlatformVideo from './pages/PlatformVideo';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Resources from './pages/Resources.jsx';
import SEOTools from './pages/SEOTools';
import Services from './pages/Services.jsx';
import Tasks from './pages/Tasks';
import TermsOfService from './pages/TermsOfService';
import VideoCreation from './pages/VideoCreation';
import WhiteLabel from './pages/WhiteLabel';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AccountSettings": AccountSettings,
    "AdminDashboard": AdminDashboard,
    "AdminDocs": AdminDocs,
    "Advertising": Advertising,
    "Analytics": Analytics,
    "BrandKit": BrandKit,
    "BusinessReport": BusinessReport,
    "ColorThemes": ColorThemes,
    "ContentStrategy": ContentStrategy,
    "CookiePolicy": CookiePolicy,
    "CreateBusiness": CreateBusiness,
    "CustomerFeedback": CustomerFeedback,
    "CustomerJourney": CustomerJourney,
    "Dashboard": Dashboard,
    "Disclaimer": Disclaimer,
    "ErrorLogs": ErrorLogs,
    "Home": Home,
    "HowItWorks": HowItWorks,
    "InvestorInfo": InvestorInfo,
    "KnowledgeBase": KnowledgeBase,
    "Omnichannel": Omnichannel,
    "Onboarding": Onboarding,
    "PerformanceReports": PerformanceReports,
    "PhoneIntegrations": PhoneIntegrations,
    "PhoneSystem": PhoneSystem,
    "PitchDeck": PitchDeck,
    "PlatformVideo": PlatformVideo,
    "PrivacyPolicy": PrivacyPolicy,
    "Resources": Resources,
    "SEOTools": SEOTools,
    "Services": Services,
    "Tasks": Tasks,
    "TermsOfService": TermsOfService,
    "VideoCreation": VideoCreation,
    "WhiteLabel": WhiteLabel,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};