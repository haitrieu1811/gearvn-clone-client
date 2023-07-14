import { lazy, Suspense, useContext } from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';
import { UserRole } from 'src/constants/enum';

import PATH from 'src/constants/path';
import { AppContext } from 'src/contexts/app.context';

import MainLayout from 'src/layouts/MainLayout/MainLayout';
import AuthLayout from 'src/layouts/AuthLayout/AuthLayout';
import DashboardLayout from 'src/layouts/DashboardLayout/DashboardLayout';

import Home from 'src/pages/shop/Home/Home';
import Login from 'src/pages/shop/Login/Login';
import Register from 'src/pages/shop/Register/Register';
import Profile from 'src/pages/shop/Profile/Profile';
import NotFound from 'src/pages/shop/NotFound/NotFound';
import Dashboard from 'src/pages/admin/Dashboard/Dashboard';
import DashboardUser from 'src/pages/admin/User';
import DashboardCategory from 'src/pages/admin/Category/List';
import DashboardCategoryCreate from 'src/pages/admin/Category/Create';
import DashboardBrand from 'src/pages/admin/Brand/List';
import DashboardBrandCreate from 'src/pages/admin/Brand/Create';
import DashboardProduct from 'src/pages/admin/Product/List';
import DashboardProductCreate from 'src/pages/admin/Product/Create';

// const MainLayout = lazy(() => import('src/layouts/MainLayout'));
// const AuthLayout = lazy(() => import('src/layouts/AuthLayout'));
// const DashboardLayout = lazy(() => import('src/layouts/DashboardLayout'));

// const Home = lazy(() => import('src/pages/shop/Home'));
// const Login = lazy(() => import('src/pages/shop/Login'));
// const Register = lazy(() => import('src/pages/shop/Register'));
// const Profile = lazy(() => import('src/pages/shop/Profile'));
// const NotFound = lazy(() => import('src/pages/shop/NotFound'));
// const Dashboard = lazy(() => import('src/pages/admin/Dashboard'));
// const DashboardUser = lazy(() => import('src/pages/admin/User'));
// const DashboardCategory = lazy(() => import('src/pages/admin/Category/List'));
// const DashboardCategoryCreate = lazy(() => import('src/pages/admin/Category/Create'));
// const DashboardBrand = lazy(() => import('src/pages/admin/Brand/List'));
// const DashboardBrandCreate = lazy(() => import('src/pages/admin/Brand/Create'));
// const DashboardProduct = lazy(() => import('src/pages/admin/Product/List'));
// const DashboardProductCreate = lazy(() => import('src/pages/admin/Product/Create'));

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
        <Suspense>
          <MainLayout>
            <Home />
          </MainLayout>
        </Suspense>
      )
    },
    {
      path: PATH.NOT_FOUND,
      element: (
        <Suspense>
          <MainLayout>
            <NotFound />
          </MainLayout>
        </Suspense>
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
            <Suspense>
              <MainLayout>
                <Profile />
              </MainLayout>
            </Suspense>
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
            <Suspense>
              <AuthLayout>
                <Login />
              </AuthLayout>
            </Suspense>
          )
        },
        {
          path: PATH.REGISTER,
          element: (
            <Suspense>
              <AuthLayout>
                <Register />
              </AuthLayout>
            </Suspense>
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
            <Suspense>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </Suspense>
          )
        },
        {
          path: PATH.DASHBOARD_USER,
          element: (
            <Suspense>
              <DashboardLayout>
                <DashboardUser />
              </DashboardLayout>
            </Suspense>
          )
        },
        {
          path: PATH.DASHBOARD_CATEGORY,
          element: (
            <Suspense>
              <DashboardLayout>
                <DashboardCategory />
              </DashboardLayout>
            </Suspense>
          )
        },
        {
          path: PATH.DASHBOARD_CATEGORY_CREATE,
          element: (
            <Suspense>
              <DashboardLayout>
                <DashboardCategoryCreate />
              </DashboardLayout>
            </Suspense>
          )
        },
        {
          path: PATH.DASHBOARD_CATEGORY_UPDATE,
          element: (
            <Suspense>
              <DashboardLayout>
                <DashboardCategoryCreate />
              </DashboardLayout>
            </Suspense>
          )
        },
        {
          path: PATH.DASHBOARD_BRAND,
          element: (
            <Suspense>
              <DashboardLayout>
                <DashboardBrand />
              </DashboardLayout>
            </Suspense>
          )
        },
        {
          path: PATH.DASHBOARD_BRAND_CREATE,
          element: (
            <Suspense>
              <DashboardLayout>
                <DashboardBrandCreate />
              </DashboardLayout>
            </Suspense>
          )
        },
        {
          path: PATH.DASHBOARD_BRAND_UPDATE,
          element: (
            <Suspense>
              <DashboardLayout>
                <DashboardBrandCreate />
              </DashboardLayout>
            </Suspense>
          )
        },
        {
          path: PATH.DASHBOARD_PRODUCT,
          element: (
            <Suspense>
              <DashboardLayout>
                <DashboardProduct />
              </DashboardLayout>
            </Suspense>
          )
        },
        {
          path: PATH.DASHBOARD_PRODUCT_CREATE,
          element: (
            <Suspense>
              <DashboardLayout>
                <DashboardProductCreate />
              </DashboardLayout>
            </Suspense>
          )
        },
        {
          path: PATH.DASHBOARD_PRODUCT_UPDATE,
          element: (
            <Suspense>
              <DashboardLayout>
                <DashboardBrandCreate />
              </DashboardLayout>
            </Suspense>
          )
        }
      ]
    }
  ]);
  return element;
};

export default useElement;
