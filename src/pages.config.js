import Home from './pages/Home';
import CreateBusiness from './pages/CreateBusiness';
import Dashboard from './pages/Dashboard';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "CreateBusiness": CreateBusiness,
    "Dashboard": Dashboard,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};