import { useContext } from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';
import { UserRole } from 'src/constants/enum';

import PATH from 'src/constants/path';
import { AppContext } from 'src/contexts/app.context';

import AuthLayout from 'src/layouts/AuthLayout/AuthLayout';
import DashboardLayout from 'src/layouts/DashboardLayout/DashboardLayout';
import MainLayout from 'src/layouts/MainLayout/MainLayout';

import DashboardBlogCreate from 'src/pages/admin/Blog/Create';
import DashboardBlog from 'src/pages/admin/Blog/List';
import DashboardBrandCreate from 'src/pages/admin/Brand/Create';
import DashboardBrand from 'src/pages/admin/Brand/List';
import DashboardCategoryCreate from 'src/pages/admin/Category/Create';
import DashboardCategory from 'src/pages/admin/Category/List';
import Dashboard from 'src/pages/admin/Dashboard/Dashboard';
import DashboardProductCreate from 'src/pages/admin/Product/Create';
import DashboardProduct from 'src/pages/admin/Product/List';
import DashboardUser from 'src/pages/admin/User';
import Home from 'src/pages/shop/Home/Home';
import Login from 'src/pages/shop/Login/Login';
import NotFound from 'src/pages/shop/NotFound/NotFound';
import ProductDetail from 'src/pages/shop/ProductDetail';
import Profile from 'src/pages/shop/Profile/Profile';
import Register from 'src/pages/shop/Register/Register';
import Blog from 'src/pages/shop/Blog';
import BlogDetail from 'src/pages/shop/BlogDetail';

const ProtectedRoute = () => {
  const { isAuthenticated } = useContext(AppContext);
  return isAuthenticated ? <Outlet /> : <Navigate to={PATH.LOGIN} />;
};

const RejectedRoute = () => {
  const { isAuthenticated } = useContext(AppContext);
  return !isAuthenticated ? <Outlet /> : <Navigate to={PATH.HOME} />;
};

const AdminAndSellerRoute = () => {
  const { isAuthenticated, profile } = useContext(AppContext);
  return isAuthenticated && (profile?.role === UserRole.Admin || profile?.role === UserRole.Seller) ? (
    <Outlet />
  ) : (
    <Navigate to={PATH.HOME} />
  );
};

const useElement = () => {
  const element = useRoutes([
    // PUBLIC ROUTES
    {
      index: true,
      path: PATH.HOME,
      element: (
        <MainLayout>
          <Home />
        </MainLayout>
      )
    },
    {
      path: PATH.NOT_FOUND,
      element: (
        <MainLayout>
          <NotFound />
        </MainLayout>
      )
    },
    {
      path: PATH.PRODUCT_DETAIL,
      element: (
        <MainLayout>
          <ProductDetail />
        </MainLayout>
      )
    },
    {
      path: PATH.BLOG,
      element: (
        <MainLayout>
          <Blog />
        </MainLayout>
      )
    },
    {
      path: PATH.BLOG_DETAIL,
      element: (
        <MainLayout>
          <BlogDetail />
        </MainLayout>
      )
    },
    // PROTECTED ROUTES
    {
      path: '/',
      element: <ProtectedRoute />,
      children: [
        {
          path: PATH.PROFILE,
          element: (
            <MainLayout>
              <Profile />
            </MainLayout>
          )
        }
      ]
    },
    // REJECTED ROUTES
    {
      path: '/',
      element: <RejectedRoute />,
      children: [
        {
          path: PATH.LOGIN,
          element: (
            <AuthLayout>
              <Login />
            </AuthLayout>
          )
        },
        {
          path: PATH.REGISTER,
          element: (
            <AuthLayout>
              <Register />
            </AuthLayout>
          )
        }
      ]
    },
    // ADMIN AND SELLER ROUTES
    {
      path: '/',
      element: <AdminAndSellerRoute />,
      children: [
        {
          path: PATH.DASHBOARD,
          element: (
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          )
        },
        {
          path: PATH.DASHBOARD_USER,
          element: (
            <DashboardLayout>
              <DashboardUser />
            </DashboardLayout>
          )
        },
        {
          path: PATH.DASHBOARD_CATEGORY,
          element: (
            <DashboardLayout>
              <DashboardCategory />
            </DashboardLayout>
          )
        },
        {
          path: PATH.DASHBOARD_CATEGORY_CREATE,
          element: (
            <DashboardLayout>
              <DashboardCategoryCreate />
            </DashboardLayout>
          )
        },
        {
          path: PATH.DASHBOARD_CATEGORY_UPDATE,
          element: (
            <DashboardLayout>
              <DashboardCategoryCreate />
            </DashboardLayout>
          )
        },
        {
          path: PATH.DASHBOARD_BRAND,
          element: (
            <DashboardLayout>
              <DashboardBrand />
            </DashboardLayout>
          )
        },
        {
          path: PATH.DASHBOARD_BRAND_CREATE,
          element: (
            <DashboardLayout>
              <DashboardBrandCreate />
            </DashboardLayout>
          )
        },
        {
          path: PATH.DASHBOARD_BRAND_UPDATE,
          element: (
            <DashboardLayout>
              <DashboardBrandCreate />
            </DashboardLayout>
          )
        },
        {
          path: PATH.DASHBOARD_PRODUCT,
          element: (
            <DashboardLayout>
              <DashboardProduct />
            </DashboardLayout>
          )
        },
        {
          path: PATH.DASHBOARD_PRODUCT_CREATE,
          element: (
            <DashboardLayout>
              <DashboardProductCreate />
            </DashboardLayout>
          )
        },
        {
          path: PATH.DASHBOARD_PRODUCT_UPDATE,
          element: (
            <DashboardLayout>
              <DashboardProductCreate />
            </DashboardLayout>
          )
        },
        {
          path: PATH.DASHBOARD_BLOG,
          element: (
            <DashboardLayout>
              <DashboardBlog />
            </DashboardLayout>
          )
        },
        {
          path: PATH.DASHBOARD_BLOG_CREATE,
          element: (
            <DashboardLayout>
              <DashboardBlogCreate />
            </DashboardLayout>
          )
        },
        {
          path: PATH.DASHBOARD_BLOG_UPDATE,
          element: (
            <DashboardLayout>
              <DashboardBlogCreate />
            </DashboardLayout>
          )
        }
      ]
    }
  ]);
  return element;
};

export default useElement;
