/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import StoresPage from './pages/StoresPage';
import StoreDetailsPage from './pages/StoreDetailsPage';
import ProductsPage from './pages/ProductsPage';
import PromotionsPage from './pages/PromotionsPage';
import LoyaltyPage from './pages/LoyaltyPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/stores" element={<StoresPage />} />
              <Route path="/stores/:id" element={<StoreDetailsPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/promotions" element={<PromotionsPage />} />
              <Route path="/loyalty" element={<LoyaltyPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  );
}
