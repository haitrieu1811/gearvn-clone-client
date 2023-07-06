import { lazy, Suspense } from 'react';
import { useRoutes } from 'react-router-dom';

import { HOME_PATH, LOGIN_PATH, REGISTER_PATH } from 'src/constants/path';
const MainLayout = lazy(() => import('src/layouts/MainLayout'));
const AuthLayout = lazy(() => import('src/layouts/AuthLayout'));
const Home = lazy(() => import('src/pages/Home'));
const Login = lazy(() => import('src/pages/Login'));
const Register = lazy(() => import('src/pages/Register'));

const useElement = () => {
  const element = useRoutes([
    {
      path: HOME_PATH,
      element: (
        <Suspense>
          <MainLayout>
            <Home />
          </MainLayout>
        </Suspense>
      )
    },
    {
      path: LOGIN_PATH,
      element: (
        <Suspense>
          <AuthLayout>
            <Login />
          </AuthLayout>
        </Suspense>
      )
    },
    {
      path: REGISTER_PATH,
      element: (
        <Suspense>
          <AuthLayout>
            <Register />
          </AuthLayout>
        </Suspense>
      )
    }
  ]);
  return element;
};

export default useElement;
