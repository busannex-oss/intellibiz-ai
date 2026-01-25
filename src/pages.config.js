import Analytics from './pages/Analytics';
import BusinessReport from './pages/BusinessReport';
import CreateBusiness from './pages/CreateBusiness';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Omnichannel from './pages/Omnichannel';
import PhoneSystem from './pages/PhoneSystem';
import WhiteLabel from './pages/WhiteLabel';
import Tasks from './pages/Tasks';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Analytics": Analytics,
    "BusinessReport": BusinessReport,
    "CreateBusiness": CreateBusiness,
    "Dashboard": Dashboard,
    "Home": Home,
    "Omnichannel": Omnichannel,
    "PhoneSystem": PhoneSystem,
    "WhiteLabel": WhiteLabel,
    "Tasks": Tasks,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};