import { yupResolver } from '@hookform/resolvers/yup';
import { useQuery } from '@tanstack/react-query';
import { createContext, useContext, useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Link, Outlet, useMatch, useNavigate } from 'react-router-dom';

import { Helmet } from 'react-helmet-async';
import addressApi from 'src/apis/address.api';
import purchaseApi from 'src/apis/purchase.api';
import { ChevronLeftIcon } from 'src/components/Icons';
import { Gender, PaymentMethod, ReceiveMethod } from 'src/constants/enum';
import PATH from 'src/constants/path';
import { AppContext, ExtendedPurchase } from 'src/contexts/app.context';
import { Address } from 'src/types/address.type';
import { Purchase } from 'src/types/purchase.type';
import { PaymentOrderSchema, paymentOrderSchema } from 'src/utils/rules';
import PaymentProgress from './PaymentProgress';

interface CartContext {
  total: number;
  cartList: Purchase[];
  checkedCartList: ExtendedPurchase[];
  address?: Address;
  isLoadingGetCartList: boolean;
  refetchCartList: () => void;
}

const initCartContext: CartContext = {
  total: 0,
  cartList: [],
  checkedCartList: [],
  address: undefined,
  isLoadingGetCartList: false,
  refetchCartList: () => null
};

export const CartContext = createContext<CartContext>(initCartContext);

const Cart = () => {
  const navigate = useNavigate();
  const isCartListPage = !!useMatch(PATH.CART_LIST);
  const { extendedCartList, profile } = useContext(AppContext);

  // Query: Lấy danh sách sản phẩm trong giỏ hàng
  const getCartListQuery = useQuery({
    queryKey: ['cart_list'],
    queryFn: () => purchaseApi.getCart()
  });

  // Query: Lấy danh sách địa chỉ
  const getAddressesQuery = useQuery({
    queryKey: ['addresses'],
    queryFn: () => addressApi.getAddresses()
  });

  // Lấy danh sách sản phẩm đã chọn trong giỏ hàng
  const checkedCartList = useMemo(() => extendedCartList.filter((cartItem) => cartItem.checked), [extendedCartList]);

  // Tính tổng tiền
  const total = useMemo(
    () =>
      checkedCartList?.reduce((acc, cartItem) => acc + cartItem.buy_count * cartItem.product.price_after_discount, 0),
    [checkedCartList]
  );

  // Lấy danh sách sản phẩm trong giỏ hàng
  const cartList = useMemo(
    () => getCartListQuery.data?.data.data.cart_list,
    [getCartListQuery.data?.data.data.cart_list]
  );

  // Lấy danh sách địa chỉ
  const addresses = useMemo(
    () => getAddressesQuery.data?.data.data.addresses,
    [getAddressesQuery.data?.data.data.addresses]
  );

  // Lấy địa chỉ mặc định
  const address = useMemo(() => addresses?.find((address) => address.is_default), [addresses]);

  // Nếu không có sản phẩm nào trong giỏ hàng thì chuyển về trang danh sách sản phẩm
  useEffect(() => {
    if (total <= 0) navigate(PATH.CART_LIST);
  }, [total]);

  // Form
  const methods = useForm<PaymentOrderSchema>({
    defaultValues: {
      customer_gender: profile?.gender ? String(profile?.gender) : String(Gender.Male),
      customer_name: profile?.fullname ? profile?.fullname : '',
      customer_phone: profile?.phone_number,
      province: '',
      district: '',
      ward: '',
      street: '',
      receive_method: ReceiveMethod.AtHome,
      note: '',
      payment_method: PaymentMethod.Cash
    },
    resolver: yupResolver(paymentOrderSchema as any)
  });

  useEffect(() => {
    if (address) {
      methods.setValue('province', address.province);
      methods.setValue('district', address.district);
      methods.setValue('ward', address.ward);
      methods.setValue('street', address.street);
    }
  }, [address]);

  return (
    <FormProvider {...methods}>
      <Helmet>
        <title>Giỏ hàng của bạn</title>
        <meta
          name='description'
          content='Mua sắm đồ công nghệ chính hãng với giá tốt nhất tại Gearvn-clone. Chúng tôi cung cấp đa dạng các sản phẩm công nghệ từ các thương hiệu nổi tiếng như Apple, Samsung, Huawei, Xiaomi,...'
        />
        <meta property='og:title' content='Giỏ hàng của bạn' />
        <meta
          property='og:description'
          content='Mua sắm đồ công nghệ chính hãng với giá tốt nhất tại Gearvn-clone. Chúng tôi cung cấp đa dạng các sản phẩm công nghệ từ các thương hiệu nổi tiếng như Apple, Samsung, Huawei, Xiaomi,...'
        />
        <meta
          property='og:image'
          content='https://gearvn-clone-ap-southeast-1.s3.ap-southeast-1.amazonaws.com/images/af998ec412e68932c8a77ba00.jpg'
        />
        <meta property='og:url' content={window.location.href} />
        <meta property='og:site_name' content='Giỏ hàng của bạn' />
        <meta property='og:type' content='website' />
      </Helmet>
      <CartContext.Provider
        value={{
          total,
          cartList: cartList || [],
          isLoadingGetCartList: getCartListQuery.isLoading,
          checkedCartList,
          address,
          refetchCartList: getCartListQuery.refetch
        }}
      >
        <div className='mb-2 md:mb-4'>
          <div className='md:container flex justify-center'>
            <div className='w-[600px]'>
              {isCartListPage && (
                <Link to={PATH.HOME} className='flex items-center text-[#1982F9] p-4'>
                  <ChevronLeftIcon className='w-3 h-3 md:w-4 md:h-4' />{' '}
                  <span className='font-medium ml-[5px] text-sm md:text-base'>Mua thêm sản phẩm khác</span>
                </Link>
              )}
              {!isCartListPage && (
                <button className='flex items-center text-[#1982F9] p-4' onClick={() => navigate(-1)}>
                  <ChevronLeftIcon className='w-3 h-3 md:w-4 md:h-4' />{' '}
                  <span className='font-medium ml-[5px] text-sm md:text-base'>Trở về</span>
                </button>
              )}
              <div className='rounded bg-white shadow-sm'>
                <PaymentProgress />
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </CartContext.Provider>
    </FormProvider>
  );
};

export default Cart;
