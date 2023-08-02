import { useMutation, useQuery } from '@tanstack/react-query';
import { produce } from 'immer';
import keyBy from 'lodash/keyBy';
import { ChangeEvent, Fragment, useContext, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

import purchaseApi from 'src/apis/purchase.api';
import Button from 'src/components/Button';
import CartItem from 'src/components/CartItem';
import { ChevronLeftIcon } from 'src/components/Icons';
import Loading from 'src/components/Loading';
import PATH from 'src/constants/path';
import { AppContext } from 'src/contexts/app.context';
import { formatCurrency } from 'src/utils/utils';

const Cart = () => {
  const location = useLocation();

  const getCartListQuery = useQuery({
    queryKey: ['cart_list'],
    queryFn: () => purchaseApi.getCart()
  });

  const { extendedCartList, setExtendedCartList, profile } = useContext(AppContext);

  const cartList = useMemo(
    () => getCartListQuery.data?.data.data.cart_list,
    [getCartListQuery.data?.data.data.cart_list]
  );
  const checkedCartList = useMemo(() => extendedCartList.filter((cartItem) => cartItem.checked), [extendedCartList]);
  const total = useMemo(
    () =>
      checkedCartList?.reduce((acc, cartItem) => acc + cartItem.buy_count * cartItem.product.price_after_discount, 0),
    [checkedCartList]
  );
  const address = useMemo(() => profile?.addresses.find((address) => address.isDefault), [profile]);

  // Đặt giá trị cho cart list mở rộng
  useEffect(() => {
    if (cartList) {
      setExtendedCartList((prevState) => {
        const extendedCartListObj = keyBy(prevState, '_id');
        return cartList.map((cartItem) => {
          const isBuyNow = location.state && (location.state as { cartItemId: string }).cartItemId === cartItem._id;
          return {
            ...cartItem,
            checked: Boolean(extendedCartListObj[cartItem._id]?.checked) || isBuyNow,
            disabled: false
          };
        });
      });
    }
  }, [cartList]);

  useEffect(() => {
    return () => {
      history.replaceState(null, '');
    };
  }, []);

  const updatePurchaseMutation = useMutation({
    mutationFn: purchaseApi.update,
    onSuccess: () => {
      getCartListQuery.refetch();
    }
  });

  // Thay đổi số lượng
  const handleChangeQuantity = ({ cartItemIndex, value }: { cartItemIndex: number; value: number }) => {
    const cartItem = extendedCartList[cartItemIndex];
    setExtendedCartList(
      produce((draft) => {
        draft[cartItemIndex].disabled = true;
      })
    );
    updatePurchaseMutation.mutate({ purchaseId: cartItem._id, buyCount: value });
  };

  // Nhập số lượng
  const handleTypeQuantity = ({ cartItemIndex, value }: { cartItemIndex: number; value: number }) => {
    setExtendedCartList(
      produce((draft) => {
        draft[cartItemIndex].buy_count = value;
      })
    );
  };

  // Check một sản phẩm
  const handleCheck = ({ cartItemIndex, e }: { cartItemIndex: number; e: ChangeEvent<HTMLInputElement> }) => {
    setExtendedCartList(
      produce((draft) => {
        draft[cartItemIndex].checked = e.target.checked;
      })
    );
  };

  // Thanh toán
  const checkoutMutation = useMutation({
    mutationFn: purchaseApi.checkout,
    onSuccess: (data) => {
      toast.success(data.data.message);
      getCartListQuery.refetch();
    }
  });
  const checkout = () => {
    if (address) {
      const purchaseIds = checkedCartList.map((purchase) => purchase._id);
      checkoutMutation.mutate({ address, purchaseIds });
    } else {
      toast.error('Hãy tạo một địa chỉ trong tài khoản của bạn');
    }
  };

  return (
    <div className='mb-2 md:mb-4'>
      <div className='md:container flex justify-center'>
        <div className='w-[600px]'>
          <Link to={PATH.HOME} className='flex items-center text-[#1982F9] p-4'>
            <ChevronLeftIcon className='w-3 h-3 md:w-4 md:h-4' />{' '}
            <span className='font-medium ml-[5px] text-sm md:text-base'>Mua thêm sản phẩm khác</span>
          </Link>
          <div className='rounded bg-white shadow-sm'>
            {/* Giỏ hàng */}
            {extendedCartList && extendedCartList.length > 0 && !getCartListQuery.isLoading && (
              <Fragment>
                {/* Danh sách sản phẩm mua */}
                <div className='p-2 pb-0'>
                  {extendedCartList.map((cartItem, index) => (
                    <CartItem
                      key={cartItem._id}
                      index={index}
                      data={cartItem}
                      handleChangeQuantity={handleChangeQuantity}
                      handleTypeQuantity={handleTypeQuantity}
                      handleCheck={handleCheck}
                      disabled={cartItem.disabled}
                      checked={cartItem.checked}
                    />
                  ))}
                </div>
                {/* Thông tin thanh toán */}
                <div className='px-4 py-6 md:p-6 sticky bottom-0 bg-white border-t border-[#cfcfcf]'>
                  <div className='flex justify-between items-center mb-2'>
                    <div className='text-sm md:text-base font-semibold'>Phí vận chuyển:</div>
                    <div className='text-sm md:text-base font-semibold'>Miễn phí</div>
                  </div>
                  <div className='flex justify-between items-center mb-6'>
                    <div className='text-base md:text-lg font-semibold'>Tổng tiền:</div>
                    <div className='text-lg md:text-2xl text-primary font-semibold'>
                      {formatCurrency(total as number)}₫
                    </div>
                  </div>
                  <Button
                    disabled={checkedCartList.length <= 0}
                    isLoading={checkoutMutation.isLoading}
                    onClick={checkout}
                  >
                    Đặt hàng ngay
                  </Button>
                </div>
              </Fragment>
            )}
            {/* Giỏ hàng trống */}
            {extendedCartList && extendedCartList.length <= 0 && !getCartListQuery.isLoading && (
              <div className='flex flex-col items-center py-6'>
                <div className='text-sm text-center'>Giỏ hàng của bạn đang trống</div>
                <Link
                  to={PATH.PRODUCT}
                  className='py-2 px-6 border border-[#1982F9] rounded my-4 text-[#1982F9] uppercase text-sm font-semibold'
                >
                  Tiếp tục mua hàng
                </Link>
              </div>
            )}
            {/* Tải trang */}
            {getCartListQuery.isLoading && <Loading />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
