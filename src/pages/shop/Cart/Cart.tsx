import { yupResolver } from '@hookform/resolvers/yup';
import { useQuery } from '@tanstack/react-query';
import { createContext, useContext, useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Link, Outlet, useMatch, useNavigate } from 'react-router-dom';

import purchaseApi from 'src/apis/purchase.api';
import { ChevronLeftIcon } from 'src/components/Icons';
import { Gender, PaymentMethod, ReceiveMethod } from 'src/constants/enum';
import PATH from 'src/constants/path';
import { AppContext, ExtendedPurchase } from 'src/contexts/app.context';
import { Purchase } from 'src/types/purchase.type';
import { Address } from 'src/types/user.type';
import { PaymentOrderSchema, paymentOrderSchema } from 'src/utils/rules';
import PaymentProgress from './PaymentProgress/PaymentProgress';

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
  const isCartListPage = Boolean(useMatch(PATH.CART_LIST));
  const { extendedCartList, profile } = useContext(AppContext);

  const getCartListQuery = useQuery({
    queryKey: ['cart_list'],
    queryFn: () => purchaseApi.getCart()
  });

  const checkedCartList = useMemo(() => extendedCartList.filter((cartItem) => cartItem.checked), [extendedCartList]);
  const total = useMemo(
    () =>
      checkedCartList?.reduce((acc, cartItem) => acc + cartItem.buy_count * cartItem.product.price_after_discount, 0),
    [checkedCartList]
  );
  const cartList = useMemo(
    () => getCartListQuery.data?.data.data.cart_list,
    [getCartListQuery.data?.data.data.cart_list]
  );
  const address = useMemo(() => profile?.addresses.find((address) => address.isDefault), [profile]);

  useEffect(() => {
    if (total <= 0) {
      navigate(PATH.CART_LIST);
    }
  }, [total]);

  const methods = useForm<PaymentOrderSchema>({
    defaultValues: {
      customer_gender: profile?.gender ? String(profile?.gender) : String(Gender.Male),
      customer_name: profile?.fullName ? profile?.fullName : '',
      customer_phone: profile?.phoneNumber,
      province: address?.province,
      district: address?.district,
      ward: address?.ward,
      street: address?.street,
      receive_method: ReceiveMethod.AtHome,
      note: '',
      payment_method: PaymentMethod.Cash
    },
    resolver: yupResolver(paymentOrderSchema as any)
  });

  return (
    <FormProvider {...methods}>
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
