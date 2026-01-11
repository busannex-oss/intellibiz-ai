import Home from './pages/Home';
import CreateBusiness from './pages/CreateBusiness';
import Dashboard from './pages/Dashboard';
import PhoneSystem from './pages/PhoneSystem';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "CreateBusiness": CreateBusiness,
    "Dashboard": Dashboard,
    "PhoneSystem": PhoneSystem,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};