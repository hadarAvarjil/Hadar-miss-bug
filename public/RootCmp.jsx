const Router = ReactRouterDOM.HashRouter
const { Route, Routes } = ReactRouterDOM

import { AppHeader } from './cmps/AppHeader.jsx'
import { AppFooter } from './cmps/AppFooter.jsx'
import { UserDetails } from "./pages/UserDetails.jsx";
import { Home } from './pages/Home.jsx'
import { BugIndex } from './pages/BugIndex.jsx'
import { BugDetails } from './pages/BugDetails.jsx'
import { AboutUs } from './pages/AboutUs.jsx'
import { BugEdit } from './pages/BugEdit.jsx'
import { UserIndex } from './pages/UserIndex.jsx'

export function App() {
    return (
        <Router>
            <div className='main-app'>
                <AppHeader />
                <main className='container'>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/bug" element={<BugIndex />} />
                        <Route element={<BugEdit />} path={'/bug/edit'} />
                        <Route element={<BugEdit />} path={'/bug/edit/:bugId'} />
                        <Route path="/bug/:bugId" element={<BugDetails />} />
                        <Route path="/about" element={<AboutUs />} />
                        <Route path="/user/:userId" element={<UserDetails />} />
                        <Route path="/user" element={<UserIndex />} />
                    </Routes>
                </main>
                <AppFooter />
            </div>
        </Router>
    )
}
