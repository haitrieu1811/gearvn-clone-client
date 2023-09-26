import { useMutation } from '@tanstack/react-query';
import { useContext } from 'react';
import { useFormContext } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { toast } from 'react-toastify';
import purchaseApi from 'src/apis/purchase.api';
import voucherApi from 'src/apis/voucher.api';
import CODImage from 'src/assets/images/COD.webp';
import Button from 'src/components/Button/Button';
import { PaymentMethod } from 'src/constants/enum';
import PATH from 'src/constants/path';
import { AppContext } from 'src/contexts/app.context';
import { CartContext } from 'src/contexts/cart.context';
import { PaymentOrderSchema } from 'src/utils/rules';
import socket from 'src/utils/socket';
import { formatCurrency } from 'src/utils/utils';

const CheckoutProcess = () => {
  const navigate = useNavigate();
  const { handleSubmit, watch, getValues } = useFormContext<PaymentOrderSchema>();
  const { profile, cartTotal, checkedCartList } = useContext(AppContext);
  const { getCartQuery, totalReduced, voucherCode, totalPayment } = useContext(CartContext);

  const payment_method = watch('payment_method');

  // Mutation: Thanh toán
  const checkoutMutation = useMutation({
    mutationFn: purchaseApi.checkout,
    onSuccess: (data) => {
      getCartQuery?.refetch();
      toast.success(data.data.message);
      navigate(PATH.CART_CHECKOUT_SUCCESS, {
        state: {
          order_id: data.data.data.order_id
        }
      });
      socket.emit('new_order', {
        payload: {
          sender: profile,
          title: 'Có đơn hàng mới',
          content: `<strong>${getValues(
            'customer_name'
          )}</strong> vừa đặt hàng với tổng đơn là <strong>${formatCurrency(cartTotal as number)}₫</strong>`
        }
      });
      !!voucherCode && useVoucherMutation.mutate(voucherCode);
    }
  });

  // Mutation: Sử dụng voucher
  const useVoucherMutation = useMutation(voucherApi.useVoucher);

  // Xử lý submit form (đặt hàng)
  const onSubmit = handleSubmit((data) => {
    const purchases = checkedCartList.map((cartItem) => cartItem._id);
    const totalItems = checkedCartList.reduce((acc, cartItem) => acc + cartItem.buy_count, 0);
    const body = {
      ...data,
      purchases,
      customer_gender: Number(data.customer_gender),
      total_amount_before_discount: cartTotal,
      total_amount: totalPayment,
      total_amount_reduced: totalReduced,
      total_items: totalItems
    };
    checkoutMutation.mutate(body as any);
  });

  return (
    <form onSubmit={onSubmit}>
      <div className='p-6'>
        <h3 className='mb-2 font-semibold text-2xl'>Thông tin đặt hàng</h3>
        <div>
          <div className='mt-4 flex'>
            <div className='font-semibold basis-1/3'>Khách hàng</div>
            <div className='flex-1'>{getValues('customer_name')}</div>
          </div>
          <div className='mt-4 flex'>
            <div className='font-semibold basis-1/3'>Số điện thoại</div>
            <div className='flex-1'>{getValues('customer_phone')}</div>
          </div>
          <div className='mt-4 flex'>
            <div className='font-semibold basis-1/3'>Địa chỉ nhận hàng</div>
            <div className='flex-1 capitalize'>
              {getValues('street')}, {getValues('ward')}, {getValues('district')}, {getValues('province')}
            </div>
          </div>
          <div className='mt-4 flex'>
            <div className='font-semibold basis-1/3'>Voucher</div>
            <div className='flex-1 text-primary font-semibold'>-{formatCurrency(totalReduced)}₫</div>
          </div>
          <div className='mt-4 flex'>
            <div className='font-semibold basis-1/3'> Phí vận chuyển</div>
            <div className='flex-1 text-primary font-semibold'>Miễn phí</div>
          </div>
          <div className='mt-4 flex'>
            <div className='font-semibold basis-1/3'>Tổng tiền</div>
            <div className='flex-1 text-primary font-semibold'>{formatCurrency(totalPayment)}₫</div>
          </div>
        </div>
      </div>
      <div className='py-6 mx-6 border-t border-b'>
        <h3 className='mb-4 font-semibold text-2xl'>Chọn hình thức thanh toán</h3>
        <div className='flex items-center my-3'>
          <input
            type='radio'
            name='payment_method'
            id='cash'
            className='mr-5 w-4 h-4'
            value={PaymentMethod.Cash}
            checked={PaymentMethod.Cash === Number(payment_method)}
          />
          <img src={CODImage} alt='' className='w-6 h-6' />
          <label htmlFor='cash' className='ml-5'>
            Thanh toán khi giao hàng (COD)
          </label>
        </div>
      </div>
      {/* Thông tin thanh toán */}
      <div className='px-4 py-6 md:p-6 bg-white'>
        <div className='flex justify-between items-center mb-6'>
          <div className='text-base md:text-lg font-semibold'>Tổng tiền:</div>
          <div className='text-lg md:text-2xl text-primary font-semibold'>{formatCurrency(totalPayment)}₫</div>
        </div>
        <Button disabled={checkedCartList.length <= 0} isLoading={checkoutMutation.isLoading}>
          Thanh toán ngay
        </Button>
      </div>
    </form>
  );
};

export default CheckoutProcess;
