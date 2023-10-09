import { yupResolver } from '@hookform/resolvers/yup';
import { Fragment, useContext, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { FormProvider, useForm } from 'react-hook-form';
import { Link, Outlet, useMatch, useNavigate } from 'react-router-dom';

import { ChevronLeftIcon } from 'src/components/Icons';
import { PaymentMethod, ReceiveMethod } from 'src/constants/enum';
import PATH from 'src/constants/path';
import { AppContext } from 'src/contexts/app.context';
import { CartContext } from 'src/contexts/cart.context';
import { PaymentOrderSchema, paymentOrderSchema } from 'src/utils/rules';
import PaymentProgress from './PaymentProgress';

const Cart = () => {
  const navigate = useNavigate();
  const isCartListPage = !!useMatch(PATH.CART_LIST);
  const { profile, cartTotal } = useContext(AppContext);
  const { defaultAddress } = useContext(CartContext);

  // Nếu không có sản phẩm nào trong giỏ hàng thì chuyển về trang danh sách sản phẩm
  useEffect(() => {
    if (cartTotal <= 0) navigate(PATH.CART_LIST);
  }, [cartTotal]);

  // Form
  const methods = useForm<PaymentOrderSchema>({
    defaultValues: {
      customer_gender: '',
      customer_name: '',
      customer_phone: '',
      province: '',
      district: '',
      ward: '',
      street: '',
      receive_method: String(ReceiveMethod.AtHome),
      note: '',
      payment_method: String(PaymentMethod.Cash)
    },
    resolver: yupResolver(paymentOrderSchema as any)
  });

  // Lấy các method của form
  const { setValue } = methods;

  // Set giá trị mặc định cho form đặt hàng
  useEffect(() => {
    if (defaultAddress) {
      const { province, district, ward, street } = defaultAddress;
      setValue('province', province);
      setValue('district', district);
      setValue('ward', ward);
      setValue('street', street);
    }
    if (profile) {
      const { gender, fullname, phone_number } = profile;
      setValue('customer_gender', String(gender));
      setValue('customer_name', fullname);
      setValue('customer_phone', phone_number);
    }
  }, [defaultAddress]);

  return (
    <Fragment>
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

      <FormProvider {...methods}>
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
      </FormProvider>
    </Fragment>
  );
};

export default Cart;
