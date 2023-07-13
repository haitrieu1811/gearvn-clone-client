const PATH = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  DASHBOARD: '/dashboard',
  DASHBOARD_USER: '/dashboard/user',
  DASHBOARD_CATEGORY: '/dashboard/category',
  DASHBOARD_CATEGORY_CREATE: '/dashboard/category/create',
  DASHBOARD_CATEGORY_UPDATE: '/dashboard/category/update/:category_id',
  DASHBOARD_CATEGORY_UPDATE_WITHOUT_ID: '/dashboard/category/update',
  DASHBOARD_BRAND: '/dashboard/brand',
  DASHBOARD_BRAND_CREATE: '/dashboard/brand/create',
  DASHBOARD_BRAND_UPDATE: '/dashboard/brand/update/:brand_id',
  DASHBOARD_BRAND_UPDATE_WITHOUT_ID: '/dashboard/brand/update',
  DASHBOARD_PRODUCT: '/dashboard/product',
  DASHBOARD_PRODUCT_CREATE: '/dashboard/product/create',
  DASHBOARD_PRODUCT_UPDATE: '/dashboard/product/update/:product_id',
  DASHBOARD_PRODUCT_UPDATE_WITHOUT_ID: '/dashboard/product/update',
  NOT_FOUND: '*'
} as const;

export default PATH;
