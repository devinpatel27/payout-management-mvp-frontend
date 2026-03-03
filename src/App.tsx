import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import AddVendorPage from './pages/AddVendor';
import LoginPage from './pages/Login';
import PayoutDetailPage from './pages/PayoutDetail';
import PayoutsPage from './pages/Payouts';
import VendorsPage from './pages/Vendors';

function App() {
    const isAuthenticated = !!localStorage.getItem('token');

    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/payouts" element={isAuthenticated ? <PayoutsPage /> : <Navigate to="/login" />} />
                    <Route path="/payouts/:id" element={isAuthenticated ? <PayoutDetailPage /> : <Navigate to="/login" />} />
                    <Route path="/vendors" element={isAuthenticated ? <VendorsPage /> : <Navigate to="/login" />} />
                    <Route path="/vendors/add" element={isAuthenticated ? <AddVendorPage /> : <Navigate to="/login" />} />
                    <Route path="/" element={<Navigate to={isAuthenticated ? "/payouts" : "/login"} />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
