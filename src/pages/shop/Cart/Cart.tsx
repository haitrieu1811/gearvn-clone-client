import { yupResolver } from '@hookform/resolvers/yup';
import { useQuery } from '@tanstack/react-query';
import { createContext, useContext, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Link, Outlet, useMatch, useNavigate } from 'react-router-dom';

import purchaseApi from 'src/apis/purchase.api';
import { CheckoutIcon, CheckoutSuccessIcon, ChevronLeftIcon, InCartIcon, InfoCheckoutIcon } from 'src/components/Icons';
import { Gender, PaymentMethod, ReceiveMethod } from 'src/constants/enum';
import PATH from 'src/constants/path';
import { AppContext, ExtendedPurchase } from 'src/contexts/app.context';
import { Purchase } from 'src/types/purchase.type';
import { Address } from 'src/types/user.type';
import { PaymentOrderSchema, paymentOrderSchema } from 'src/utils/rules';

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

type FormData = PaymentOrderSchema;

const Cart = () => {
  const navigate = useNavigate();
  const isMatch = useMatch(PATH.CART_LIST);
  const isCartListPage = Boolean(isMatch);
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

  const methods = useForm<FormData>({
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
                {/* Tiến trình mua hàng */}
                <div className='p-2'>
                  <div className='bg-[#FFEDED] px-[14px] pt-5 pb-4 flex'>
                    <div className='flex justify-center items-center flex-col flex-1'>
                      <InCartIcon className='w-7 h-7' />
                      <p className='text-primary mt-1'>Giỏ hàng</p>
                    </div>
                    <div className='flex justify-center items-center flex-col flex-1'>
                      <div className='relative before:absolute before:top-1/2 before:right-full before:-translate-y-1/2 before:w-[110px] before:h-[2px] before:border-t before:border-dashed before:border-[#6b6868]'>
                        <InfoCheckoutIcon className='w-7 h-7' />
                      </div>
                      <p className='text-[##535353] mt-1'>Thông tin đặt hàng</p>
                    </div>
                    <div className='flex justify-center items-center flex-col flex-1'>
                      <div className='relative before:absolute before:top-1/2 before:right-full before:-translate-y-1/2 before:w-[110px] before:h-[2px] before:border-t before:border-dashed before:border-[#6b6868]'>
                        <CheckoutIcon className='w-7 h-7' />
                      </div>
                      <p className='text-[##535353] mt-1'>Thanh toán</p>
                    </div>
                    <div className='flex justify-center items-center flex-col flex-1'>
                      <div className='relative before:absolute before:top-1/2 before:right-full before:-translate-y-1/2 before:w-[110px] before:h-[2px] before:border-t before:border-dashed before:border-[#6b6868]'>
                        <CheckoutSuccessIcon className='w-7 h-7' />
                      </div>
                      <p className='text-[##535353] mt-1'>Hoàn tất</p>
                    </div>
                  </div>
                </div>
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
