import { useMutation, useQuery } from '@tanstack/react-query';
import Tippy from '@tippyjs/react/headless';
import { FormEvent, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, createSearchParams, useNavigate } from 'react-router-dom';

import authApi from 'src/apis/auth.api';
import productApi from 'src/apis/product.api';
import purchaseApi from 'src/apis/purchase.api';
import logo from 'src/assets/images/logo-white.svg';
import {
  BarIcon,
  CartIcon,
  ChartPieIcon,
  HandIcon,
  HotlineIcon,
  LocationIcon,
  LogoutIcon,
  PurchaseIcon,
  SearchIcon,
  UserIcon,
  ViewedIcon
} from 'src/components/Icons';
import Loading from 'src/components/Loading';
import Wrapper from 'src/components/Wrapper';
import { UserRole } from 'src/constants/enum';
import PATH from 'src/constants/path';
import { AppContext } from 'src/contexts/app.context';
import useDebounce from 'src/hooks/useDebounce';
import { formatCurrency, generateNameId, getImageUrl } from 'src/utils/utils';
import HeaderAction from './HeaderAction';

const SEARCH_RESULT_LIMIT = 5;

const Header = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('pages');

  const { isAuthenticated, setIsAuthenticated, profile, setProfile } = useContext(AppContext);
  const [keywordSearch, setKeywordSearch] = useState<string>('');
  const [showSearchResult, setShowSearchResult] = useState<boolean>(false);
  const KeywordSearchDebounce = useDebounce(keywordSearch, 1500);

  // Render menu của người dùng
  const renderUserMenu = () => {
    return (
      <Wrapper arrow>
        {!isAuthenticated ? (
          <div className='p-5 min-w-[300px]'>
            <div className='flex mb-4'>
              <HandIcon className='w-5 h-5' />
              <span className='ml-3 text-sm font-medium'>{t('register_login.please_login')}</span>
            </div>
            <div className='flex'>
              <Link
                to={PATH.LOGIN}
                className='flex-1 bg-black text-white rounded flex justify-center items-center text-sm px-5 py-1'
              >
                {t('register_login.login')}
              </Link>
              <Link
                to={PATH.REGISTER}
                className='flex-1 text-black border-[2px] border-black rounded flex justify-center items-center text-sm px-5 py-1 ml-2'
              >
                {t('register_login.register')}
              </Link>
            </div>
          </div>
        ) : (
          <div className='min-w-[300px]'>
            <Link to={PATH.ACCOUNT_PROFILE} className='px-5 py-4 flex hover:underline border-b'>
              <HandIcon className='w-5 h-5' />
              <span className='ml-4 text-sm font-semibold capitalize'>
                Xin chào, {profile?.fullName ? profile.fullName : profile?.email.split('@')[0]}
              </span>
            </Link>
            {profile?.role !== UserRole.Customer && (
              <Link to={PATH.DASHBOARD} className='px-5 py-3 flex hover:underline'>
                <ChartPieIcon className='w-5 h-5' />
                <span className='ml-4 text-sm'>Dashboard</span>
              </Link>
            )}
            <Link to={PATH.ACCOUNT_ORDER} className='px-5 py-3 flex hover:underline'>
              <PurchaseIcon className='w-5 h-5 fill-black' />
              <span className='ml-4 text-sm'>Đơn hàng của tôi</span>
            </Link>
            <Link to={PATH.ACCOUNT_VIEWED_PRODUCT} className='px-5 py-3 flex hover:underline border-b'>
              <ViewedIcon className='w-5 h-5' />
              <span className='ml-4 text-sm'>Đã xem gần đây</span>
            </Link>
            <button onClick={logout} className='px-5 py-3 flex hover:underline w-full'>
              <LogoutIcon className='w-5 h-5' />
              <span className='ml-4 text-sm'>Đăng xuất</span>
            </button>
          </div>
        )}
      </Wrapper>
    );
  };

  // Đăng xuất
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      setIsAuthenticated(false);
      setProfile(null);
    }
  });
  const logout = () => {
    logoutMutation.mutate();
  };

  // Số lượng giỏ hàng
  const getCartListQuery = useQuery({
    queryKey: ['cart_list'],
    queryFn: () => purchaseApi.getCart()
  });
  const cartSize = useMemo(
    () => getCartListQuery.data?.data.data.cart_size,
    [getCartListQuery.data?.data.data.cart_size]
  );

  // Chuyển hướng đến trang tìm kiếm
  const redirectToSearchPage = (e?: FormEvent<HTMLFormElement>) => {
    e && e.preventDefault();
    navigate({
      pathname: PATH.SEARCH,
      search: createSearchParams({
        name: keywordSearch
      }).toString()
    });
    setKeywordSearch('');
  };

  // Kết quả tìm kiếm
  const getProductsQuery = useQuery({
    queryKey: ['products', KeywordSearchDebounce],
    queryFn: () => productApi.getList({ name: KeywordSearchDebounce })
  });
  const searchResult = useMemo(
    () => getProductsQuery.data?.data.data.products,
    [getProductsQuery.data?.data.data.products]
  );
  const searchResultCount = useMemo(
    () => getProductsQuery.data?.data.data.pagination.total,
    [getProductsQuery.data?.data.data.pagination.total]
  );

  // Render kết quả tìm kiếm
  const renderSearchResult = () => (
    <Wrapper>
      <div className='w-[328px] px-4'>
        {/* Hiển thị khi có dữ liệu */}
        {searchResult &&
          searchResult.length > 0 &&
          !getProductsQuery.isLoading &&
          searchResult.slice(0, SEARCH_RESULT_LIMIT).map((product) => (
            <div key={product._id} className='flex justify-between items-center py-3 border-b'>
              <div className='flex-1'>
                <Link
                  to={`${PATH.PRODUCT_DETAIL_WITHOUT_ID}/${generateNameId({ name: product.name_vi, id: product._id })}`}
                  className='text-[13px] text-[#111111] hover:text-primary line-clamp-1'
                >
                  {product.name_vi}
                </Link>
                <div className='flex items-center mt-[5px]'>
                  <div className='text-primary font-medium text-xs'>
                    {formatCurrency(product.price_after_discount)}₫
                  </div>
                  {product.price > product.price_after_discount && (
                    <div className='ml-[7px] text-[11px] text-[#797979] line-through'>
                      {formatCurrency(product.price)}₫
                    </div>
                  )}
                </div>
              </div>
              <Link
                to={`${PATH.PRODUCT_DETAIL_WITHOUT_ID}/${generateNameId({ name: product.name_vi, id: product._id })}`}
                className='border rounded-sm'
              >
                <img
                  src={getImageUrl(product.thumbnail)}
                  alt={product.name_vi}
                  className='w-[38px] h-[38px] object-cover'
                />
              </Link>
            </div>
          ))}
        {searchResultCount !== undefined && searchResultCount > 5 && (
          <button
            onClick={() => redirectToSearchPage()}
            className='block py-[10px] text-[13px] text-[#111111] text-center w-full hover:text-primary'
          >
            Xem thêm {searchResultCount - SEARCH_RESULT_LIMIT} sản phẩm
          </button>
        )}

        {/* Hiển thị khi không có dữ liệu */}
        {searchResult && searchResult.length <= 0 && !getProductsQuery.isLoading && (
          <div className='text-sm text-center text-[#111111] py-4'>Không có sản phẩm nào...</div>
        )}

        {/* Loading */}
        {getProductsQuery.isLoading && (
          <div className='flex justify-center py-10'>
            <Loading className='w-6 h-6' />
          </div>
        )}
      </div>
    </Wrapper>
  );

  return (
    <header className='sticky top-0 left-0 right-0 z-[99999]'>
      <div className='bg-primary'>
        <nav className='container py-4 flex justify-between'>
          {/* Logo */}
          <Link to={PATH.HOME} className='flex items-center'>
            <img src={logo} alt='Logo' className='w-[140px]' />
          </Link>
          {/* Danh mục */}
          <div className='ml-4 h-[42px] bg-[#BE1529] px-2 py-1 flex items-center justify-center rounded cursor-pointer font-semibold'>
            <BarIcon />
            <span className='text-white text-sm ml-3'>Danh mục</span>
          </div>
          {/* Tìm kiếm */}
          <Tippy
            interactive
            visible={KeywordSearchDebounce.length > 0 && showSearchResult}
            placement='bottom-end'
            offset={[0, 2]}
            render={renderSearchResult}
            onClickOutside={() => setShowSearchResult(false)}
            zIndex={9999999}
          >
            <form className='relative flex-1 ml-2' onSubmit={redirectToSearchPage}>
              <input
                type='text'
                placeholder='Bạn cần tìm gì?'
                value={keywordSearch}
                onChange={(e) => setKeywordSearch(e.target.value)}
                onFocus={() => setShowSearchResult(true)}
                className='w-full h-full py-2 pl-[15px] pr-[50px] rounded outline-none text-[15px]'
              />
              <button className='absolute top-0 right-0 h-full w-9 flex justify-center items-center'>
                <SearchIcon className='fill-white w-4 h-4' />
              </button>
            </form>
          </Tippy>
          {/* Header actions */}
          <div className='flex items-center'>
            <HeaderAction icon={<HotlineIcon className='w-[18px]' />} textAbove='Hotline' textBelow='1800.6975' />
            <HeaderAction icon={<LocationIcon className='w-[18px]' />} textAbove='Hệ thống' textBelow='Showroom' />
            <Link to={PATH.ACCOUNT_ORDER}>
              <HeaderAction
                icon={<PurchaseIcon className='w-[18px] fill-white' />}
                textAbove='Tra cứu'
                textBelow='đơn hàng'
              />
            </Link>
            <Link to={PATH.CART}>
              <HeaderAction
                icon={
                  <div className='relative'>
                    <CartIcon className='w-[18px]' />
                    <span className='absolute -top-2 -right-2 bg-[#FDD835] text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold border-[2px] border-white'>
                      {cartSize || 0}
                    </span>
                  </div>
                }
                textAbove='Giỏ'
                textBelow='hàng'
              />
            </Link>
          </div>
          {/* Tài khoản */}
          <Tippy placement='bottom-end' render={renderUserMenu} offset={[0, 15]} interactive>
            <div className='h-[42px] bg-[#BE1529] flex items-center justify-center p-2 rounded cursor-pointer ml-4'>
              <UserIcon className='w-5 h-5 flex-shrink-0 stroke-white' />
              {!isAuthenticated ? (
                <span className='text-[13px] text-white ml-3 leading-tight font-semibold'>
                  <div>Đăng</div>
                  <div>nhập</div>
                </span>
              ) : (
                <span className='text-[13px] text-white ml-3 leading-tight font-semibold'>
                  <div>Xin chào</div>
                  <div className='capitalize'>
                    {profile?.fullName ? profile.fullName : profile?.email.split('@')[0]}
                  </div>
                </span>
              )}
            </div>
          </Tippy>
        </nav>
      </div>
    </header>
  );
};

export default Header;
