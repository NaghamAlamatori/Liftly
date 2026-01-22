import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ArticlesPage from "./pages/ArticlesPage";
import ArticleDetailsPage from "./pages/ArticleDetailsPage";
import LoginPage from "./pages/LoginPage";
import CreateAccountPage from "./pages/CreateAccountPage";
import ProfilePage from "./pages/ProfilePage";
import ProductInfoPage from "./pages/ProductInfoPage";
import ProductsCategoryPage from "./pages/ProductsCategoryPage";
import CartPage from "./pages/CartPage";
import AboutPage from "./pages/AboutPage";
import PlanPage from "./pages/PlanPage";
import PlansListPage from "./pages/PlansListPage";
import PlanDetailsPage from "./pages/PlanDetailsPage";
import DashboardPage from "./pages/admin pages/DashboardPage";
import AdminCreateUserPage from "./pages/admin pages/AdminCreateUserPage";
import AdminUsersPage from "./pages/admin pages/AdminUsersPage";
import AdminProductsPage from "./pages/admin pages/AdminProductsPage";
import AdminProductInfoPage from "./pages/admin pages/AdminProductInfoPage";
import AdminArticlesPage from "./pages/admin pages/AdminArticlesPage";
import AdminArticleInfoPage from "./pages/admin pages/AdminArticleInfoPage";
import PlanBuilderPage from "./pages/PlanBuilderPage";
import PlanBuilderSuccessPage from "./pages/PlanBuilderSuccessPage";
import ProtectedRoute from "./auth/ProtectedRoute";
import AdminRoute from "./auth/AdminRoute";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/dashboard"
            element={
              <AdminRoute>
                <DashboardPage />
              </AdminRoute>
            }
          />
          <Route
            path="/dashboard/create-user"
            element={
              <AdminRoute>
                <AdminCreateUserPage />
              </AdminRoute>
            }
          />
          <Route
            path="/dashboard/users"
            element={
              <AdminRoute>
                <AdminUsersPage />
              </AdminRoute>
            }
          />
          <Route
            path="/dashboard/products"
            element={
              <AdminRoute>
                <AdminProductsPage />
              </AdminRoute>
            }
          />
          <Route
            path="/dashboard/products/:productId"
            element={
              <AdminRoute>
                <AdminProductInfoPage />
              </AdminRoute>
            }
          />
          <Route
            path="/dashboard/articles"
            element={
              <AdminRoute>
                <AdminArticlesPage />
              </AdminRoute>
            }
          />
          <Route
            path="/dashboard/articles/:articleId"
            element={
              <AdminRoute>
                <AdminArticleInfoPage />
              </AdminRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/category/:slug" element={<ProductsCategoryPage />} />
          <Route path="/product/:id" element={<ProductInfoPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/articles/:id" element={<ArticleDetailsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route
            path="/plan"
            element={
              <ProtectedRoute>
                <PlanPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/plan/list"
            element={
              <ProtectedRoute>
                <PlansListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/plan/list/:planId"
            element={
              <ProtectedRoute>
                <PlanDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/plan1"
            element={
              <ProtectedRoute>
                <PlansListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/plan/builder"
            element={
              <ProtectedRoute>
                <PlanBuilderPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/plan/builder/success"
            element={
              <ProtectedRoute>
                <PlanBuilderSuccessPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/signup" element={<CreateAccountPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
