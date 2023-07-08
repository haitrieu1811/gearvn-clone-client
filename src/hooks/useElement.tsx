import { lazy, Suspense, useContext } from 'react';
import { Outlet, useRoutes, Navigate } from 'react-router-dom';

import PATH from 'src/constants/path';
import { AppContext } from 'src/contexts/app.context';
const MainLayout = lazy(() => import('src/layouts/MainLayout'));
const AuthLayout = lazy(() => import('src/layouts/AuthLayout'));
const OnlyContent = lazy(() => import('src/layouts/OnlyContent'));
const Home = lazy(() => import('src/pages/Home'));
const Login = lazy(() => import('src/pages/Login'));
const Register = lazy(() => import('src/pages/Register'));
const Profile = lazy(() => import('src/pages/Profile'));
const NotFound = lazy(() => import('src/pages/NotFound'));

const ProtectedRoute = () => {
  const { isAuthenticated } = useContext(AppContext);
  return isAuthenticated ? <Outlet /> : <Navigate to={PATH.LOGIN} />;
};

const RejectedRoute = () => {
  const { isAuthenticated } = useContext(AppContext);
  return !isAuthenticated ? <Outlet /> : <Navigate to={PATH.HOME} />;
};

const useElement = () => {
  const element = useRoutes([
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
    }
  ]);
  return element;
};

export default useElement;
