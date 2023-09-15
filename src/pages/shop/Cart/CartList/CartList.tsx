import { useMutation } from '@tanstack/react-query';
import { produce } from 'immer';
import keyBy from 'lodash/keyBy';
import { ChangeEvent, Fragment, useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import classNames from 'classnames';
import purchaseApi from 'src/apis/purchase.api';
import Button from 'src/components/Button';
import CartItem from 'src/components/CartItem';
import Loading from 'src/components/Loading';
import PATH from 'src/constants/path';
import { AppContext } from 'src/contexts/app.context';
import { formatCurrency } from 'src/utils/utils';
import { CartContext } from '../Cart';

const CartList = () => {
  const location = useLocation();
  const { extendedCartList, setExtendedCartList } = useContext(AppContext);
  const { total, cartList, isLoadingGetCartList, checkedCartList, refetchCartList } = useContext(CartContext);

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

  // Xóa location state khi component unmount
  useEffect(() => {
    return () => {
      history.replaceState(null, '');
    };
  }, []);

  // Mutation: Cập nhật số lượng
  const updatePurchaseMutation = useMutation({
    mutationFn: purchaseApi.update,
    onSuccess: () => {
      refetchCartList();
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

  return (
    <Fragment>
      {/* Giỏ hàng khi có sản phẩm */}
      {extendedCartList && extendedCartList.length > 0 && !isLoadingGetCartList && (
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
                checked={cartItem.checked || false}
              />
            ))}
          </div>
          {/* Thông tin thanh toán */}
          <div className='px-4 py-6 md:p-6 bg-white border-t border-[#cfcfcf]'>
            <div className='flex justify-between items-center mb-2'>
              <div className='text-sm md:text-base font-semibold'>Phí vận chuyển:</div>
              <div className='text-sm md:text-base font-semibold'>Miễn phí</div>
            </div>
            <div className='flex justify-between items-center mb-6'>
              <div className='text-base md:text-lg font-semibold'>Tổng tiền:</div>
              <div className='text-lg md:text-2xl text-primary font-semibold'>{formatCurrency(total as number)}₫</div>
            </div>
            <Link
              to={PATH.CART_CHECKOUT_INFO}
              className={classNames('', {
                'pointer-events-none opacity-70': checkedCartList.length <= 0
              })}
            >
              <Button>Đặt hàng ngay</Button>
            </Link>
          </div>
        </Fragment>
      )}

      {/* Giỏ hàng trống */}
      {extendedCartList && extendedCartList.length <= 0 && !isLoadingGetCartList && (
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

      {/* Loading */}
      {isLoadingGetCartList && (
        <div className='min-h-[300px] bg-white rounded flex justify-center items-center'>
          <Loading />
        </div>
      )}
    </Fragment>
  );
};

export default CartList;
