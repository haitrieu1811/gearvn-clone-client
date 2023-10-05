import { Suspense, lazy, useContext } from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';

import { UserRole } from 'src/constants/enum';
import PATH from 'src/constants/path';
import { AppContext } from 'src/contexts/app.context';

const AuthLayout = lazy(() => import('src/layouts/AuthLayout'));
const DashboardLayout = lazy(() => import('src/layouts/DashboardLayout'));
const MainLayout = lazy(() => import('src/layouts/MainLayout'));

const Account = lazy(() => import('src/pages/shop/Account'));
const AccountAddress = lazy(() => import('src/pages/shop/Account/Address'));
const ChangePassword = lazy(() => import('src/pages/shop/Account/ChangePassword'));
const AccountHistoryOrder = lazy(() => import('src/pages/shop/Account/HistoryOrder'));
const OrderDetail = lazy(() => import('src/pages/shop/Account/OrderDetail'));
const AccountProfile = lazy(() => import('src/pages/shop/Account/Profile'));
const AccountViewedProduct = lazy(() => import('src/pages/shop/Account/ViewedProduct'));
const Blog = lazy(() => import('src/pages/shop/Blog'));
const BlogDetail = lazy(() => import('src/pages/shop/BlogDetail'));
const Cart = lazy(() => import('src/pages/shop/Cart'));
const CartList = lazy(() => import('src/pages/shop/Cart/CartList'));
const CheckoutInfo = lazy(() => import('src/pages/shop/Cart/CheckoutInfo'));
const CheckoutProcess = lazy(() => import('src/pages/shop/Cart/CheckoutProcess'));
const CheckoutSuccess = lazy(() => import('src/pages/shop/Cart/CheckoutSuccess'));
const ForgotPassword = lazy(() => import('src/pages/shop/ForgotPassword'));
const Home = lazy(() => import('src/pages/shop/Home'));
const Login = lazy(() => import('src/pages/shop/Login'));
const NotFound = lazy(() => import('src/pages/shop/NotFound'));
const Product = lazy(() => import('src/pages/shop/Product'));
const ProductDetail = lazy(() => import('src/pages/shop/ProductDetail'));
const Register = lazy(() => import('src/pages/shop/Register'));
const ResetPassword = lazy(() => import('src/pages/shop/ResetPassword'));
const Search = lazy(() => import('src/pages/shop/Search'));
const VerifyEmail = lazy(() => import('src/pages/shop/VerifyEmail'));
const VerifyForgotPasswordToken = lazy(() => import('src/pages/shop/VerifyForgotPasswordToken'));

const DashboardVoucherList = lazy(() => import('src/pages/admin/VoucherList'));
const DashboardVoucherCreate = lazy(() => import('src/pages/admin/VoucherCreate'));
const DashboardBlogCreate = lazy(() => import('src/pages/admin/BlogCreate'));
const DashboardBlog = lazy(() => import('src/pages/admin/BlogList'));
const DashboardBrandCreate = lazy(() => import('src/pages/admin/BrandCreate'));
const DashboardBrand = lazy(() => import('src/pages/admin/BrandList'));
const DashboardCategoryCreate = lazy(() => import('src/pages/admin/CategoryCreate'));
const DashboardCategory = lazy(() => import('src/pages/admin/CategoryList'));
const Dashboard = lazy(() => import('src/pages/admin/Dashboard'));
const DashboardOrderDetail = lazy(() => import('src/pages/admin/OrderDetail'));
const DashboardOrderList = lazy(() => import('src/pages/admin/OrderList'));
const DashboardProductCreate = lazy(() => import('src/pages/admin/ProductCreate'));
const DashboardProduct = lazy(() => import('src/pages/admin/ProductList'));
const DashboardCustomer = lazy(() => import('src/pages/admin/CustomerList'));
const DashboardReviewsList = lazy(() => import('src/pages/admin/ReviewList'));

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
        <MainLayout>
          <NotFound />
        </MainLayout>
      )
    },
    {
      path: PATH.PRODUCT,
      element: (
        <Suspense>
          <MainLayout>
            <Product />
          </MainLayout>
        </Suspense>
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
    {
      path: PATH.SEARCH,
      element: (
        <MainLayout>
          <Search />
        </MainLayout>
      )
    },
    {
      path: PATH.VERIFY_EMAIL,
      element: (
        <MainLayout>
          <VerifyEmail />
        </MainLayout>
      )
    },
    // PROTECTED ROUTES
    {
      path: '/',
      element: <ProtectedRoute />,
      children: [
        {
          path: PATH.ACCOUNT,
          element: (
            <MainLayout>
              <Account />
            </MainLayout>
          ),
          children: [
            {
              path: PATH.ACCOUNT_PROFILE,
              element: <AccountProfile />
            },
            {
              path: PATH.ACCOUNT_ORDER,
              element: <AccountHistoryOrder />
            },
            {
              path: PATH.ACCOUNT_ORDER_DETAIL,
              element: <OrderDetail />
            },
            {
              path: PATH.ACCOUNT_VIEWED_PRODUCT,
              element: <AccountViewedProduct />
            },
            {
              path: PATH.ACCOUNT_ADDRESS,
              element: <AccountAddress />
            },
            {
              path: PATH.ACCOUNT_CHANGE_PASSWORD,
              element: <ChangePassword />
            }
          ]
        },
        {
          path: PATH.CART,
          element: (
            <MainLayout>
              <Cart />
            </MainLayout>
          ),
          children: [
            {
              path: PATH.CART_LIST,
              element: <CartList />
            },
            {
              path: PATH.CART_CHECKOUT_INFO,
              element: <CheckoutInfo />
            },
            {
              path: PATH.CART_CHECKOUT_PROCESS,
              element: <CheckoutProcess />
            },
            {
              path: PATH.CART_CHECKOUT_SUCCESS,
              element: <CheckoutSuccess />
            }
          ]
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
        },
        {
          path: PATH.FORGOT_PASSWORD,
          element: (
            <MainLayout>
              <ForgotPassword />
            </MainLayout>
          )
        },
        {
          path: PATH.RESET_PASSWORD,
          element: (
            <MainLayout>
              <ResetPassword />
            </MainLayout>
          )
        },
        {
          path: PATH.VERIFY_RESET_PASSWORD_TOKEN,
          element: (
            <MainLayout>
              <VerifyForgotPasswordToken />
            </MainLayout>
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
              <DashboardCustomer />
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
        },
        {
          path: PATH.DASHBOARD_ORDER,
          element: (
            <DashboardLayout>
              <DashboardOrderList />
            </DashboardLayout>
          )
        },
        {
          path: PATH.DASHBOARD_ORDER_DETAIL,
          element: (
            <DashboardLayout>
              <DashboardOrderDetail />
            </DashboardLayout>
          )
        },
        {
          path: PATH.DASHBOARD_VOUCHER,
          element: (
            <DashboardLayout>
              <DashboardVoucherList />
            </DashboardLayout>
          )
        },
        {
          path: PATH.DASHBOARD_VOUCHER_CREATE,
          element: (
            <DashboardLayout>
              <DashboardVoucherCreate />
            </DashboardLayout>
          )
        },
        {
          path: PATH.DASHBOARD_VOUCHER_UPDATE,
          element: (
            <DashboardLayout>
              <DashboardVoucherCreate />
            </DashboardLayout>
          )
        },
        {
          path: PATH.DASHBOARD_REVIEW_LIST,
          element: (
            <DashboardLayout>
              <DashboardReviewsList />
            </DashboardLayout>
          )
        }
      ]
    }
  ]);
  return element;
};

export default useElement;
