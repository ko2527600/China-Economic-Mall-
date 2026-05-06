/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

// Lazy load pages for performance
const HomePage = lazy(() => import('./pages/HomePage'));
const StoresPage = lazy(() => import('./pages/StoresPage'));
const StoreDetailsPage = lazy(() => import('./pages/StoreDetailsPage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const PromotionsPage = lazy(() => import('./pages/PromotionsPage'));
const LoyaltyPage = lazy(() => import('./pages/LoyaltyPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// Simple loading fallback
const PageLoader = () => (
  <div className="fixed inset-0 bg-white flex items-center justify-center z-[999]">
    <div className="w-12 h-12 border-4 border-slate-100 border-t-primary rounded-full animate-spin" />
  </div>
);

export default function App() {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/*" element={
            <Layout>
              <Suspense fallback={<PageLoader />}>
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
              </Suspense>
            </Layout>
          } />
        </Routes>
      </Suspense>
    </Router>
  );
}
