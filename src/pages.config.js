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
import Analytics from './pages/Analytics';
import BrandKit from './pages/BrandKit';
import BusinessReport from './pages/BusinessReport';
import CreateBusiness from './pages/CreateBusiness';
import CustomerFeedback from './pages/CustomerFeedback';
import Dashboard from './pages/Dashboard';
import ErrorLogs from './pages/ErrorLogs';
import Home from './pages/Home';
import Omnichannel from './pages/Omnichannel';
import Onboarding from './pages/Onboarding';
import PerformanceReports from './pages/PerformanceReports';
import PhoneSystem from './pages/PhoneSystem';
import Tasks from './pages/Tasks';
import VideoCreation from './pages/VideoCreation';
import WhiteLabel from './pages/WhiteLabel';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Analytics": Analytics,
    "BrandKit": BrandKit,
    "BusinessReport": BusinessReport,
    "CreateBusiness": CreateBusiness,
    "CustomerFeedback": CustomerFeedback,
    "Dashboard": Dashboard,
    "ErrorLogs": ErrorLogs,
    "Home": Home,
    "Omnichannel": Omnichannel,
    "Onboarding": Onboarding,
    "PerformanceReports": PerformanceReports,
    "PhoneSystem": PhoneSystem,
    "Tasks": Tasks,
    "VideoCreation": VideoCreation,
    "WhiteLabel": WhiteLabel,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};