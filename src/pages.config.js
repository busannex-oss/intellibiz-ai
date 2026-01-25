import BusinessReport from './pages/BusinessReport';
import CreateBusiness from './pages/CreateBusiness';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Omnichannel from './pages/Omnichannel';
import PhoneSystem from './pages/PhoneSystem';
import WhiteLabel from './pages/WhiteLabel';
import Analytics from './pages/Analytics';
import __Layout from './Layout.jsx';


export const PAGES = {
    "BusinessReport": BusinessReport,
    "CreateBusiness": CreateBusiness,
    "Dashboard": Dashboard,
    "Home": Home,
    "Omnichannel": Omnichannel,
    "PhoneSystem": PhoneSystem,
    "WhiteLabel": WhiteLabel,
    "Analytics": Analytics,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};