import CreateBusiness from './pages/CreateBusiness';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import PhoneSystem from './pages/PhoneSystem';
import WhiteLabel from './pages/WhiteLabel';
import Omnichannel from './pages/Omnichannel';
import __Layout from './Layout.jsx';


export const PAGES = {
    "CreateBusiness": CreateBusiness,
    "Dashboard": Dashboard,
    "Home": Home,
    "PhoneSystem": PhoneSystem,
    "WhiteLabel": WhiteLabel,
    "Omnichannel": Omnichannel,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};