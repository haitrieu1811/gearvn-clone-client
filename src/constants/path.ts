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
  NOT_FOUND: '*'
} as const;

export default PATH;
