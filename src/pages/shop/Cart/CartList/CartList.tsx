import { useMutation } from '@tanstack/react-query';
import classNames from 'classnames';
import keyBy from 'lodash/keyBy';
import { ChangeEvent, Fragment, useContext, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

import purchaseApi from 'src/apis/purchase.api';
import voucherApi from 'src/apis/voucher.api';
import Button from 'src/components/Button';
import CartItem from 'src/components/CartItem';
import { CaretDownIcon, VoucherIcon } from 'src/components/Icons';
import Input from 'src/components/Input';
import Loading from 'src/components/Loading';
import PATH from 'src/constants/path';
import { AppContext } from 'src/contexts/app.context';
import { CartContext } from 'src/contexts/cart.context';
import { formatCurrency } from 'src/utils/utils';

const CartList = () => {
  const location = useLocation();
  const { extendedCartList, setExtendedCartList, cartTotal, checkedCartList } = useContext(AppContext);
  const {
    getCartQuery,
    cartList,
    voucherCode,
    setVoucherCode,
    totalReduced,
    setTotalReduced,
    isUsingVoucher,
    setIsUsingVoucher,
    totalPayment
  } = useContext(CartContext);

  // Đặt giá trị cho cart (có thêm thuộc tính checked và disabled)
  useEffect(() => {
    if (cartList.length > 0) {
      setExtendedCartList((prevState) => {
        const extendedCartListObj = keyBy(prevState, '_id');
        return cartList.map((cartItem) => {
          const isBuyNow = location.state && (location.state as { cartItemId: string }).cartItemId === cartItem._id;
          return {
            ...cartItem,
            checked: !!extendedCartListObj[cartItem._id]?.checked || !!isBuyNow,
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
      getCartQuery?.refetch();
    }
  });

  // Thay đổi số lượng
  const handleChangeQuantity = useCallback(({ purchaseId, value }: { purchaseId: string; value: number }) => {
    setExtendedCartList((prevState) =>
      prevState.map((cartItem) => {
        if (cartItem._id === purchaseId) {
          return {
            ...cartItem,
            disabled: true
          };
        }
        return cartItem;
      })
    );
    updatePurchaseMutation.mutate({ purchaseId, buyCount: value });
  }, []);

  // Nhập số lượng
  const handleTypeQuantity = useCallback(({ purchaseId, value }: { purchaseId: string; value: number }) => {
    setExtendedCartList((prevState) =>
      prevState.map((cartItem) => {
        if (cartItem._id === purchaseId) {
          return {
            ...cartItem,
            buy_count: value
          };
        }
        return cartItem;
      })
    );
  }, []);

  // Check một sản phẩm
  const chooseToCheckout = useCallback(
    ({ purchaseId, e }: { purchaseId: string; e: ChangeEvent<HTMLInputElement> }) => {
      setExtendedCartList((prevState) => {
        return prevState.map((cartItem) => {
          if (cartItem._id === purchaseId) {
            return {
              ...cartItem,
              checked: e.target.checked
            };
          }
          return cartItem;
        });
      });
    },
    []
  );

  // Mutation: Áp dụng voucher
  const applyVoucherMutation = useMutation({
    mutationFn: voucherApi.applyVoucher,
    onError: () => {
      setTotalReduced(0);
    }
  });

  // Xử lý áp dụng voucher
  const handleUseVoucher = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!voucherCode || cartTotal === 0) return;
    applyVoucherMutation.mutate(
      {
        voucher_code: voucherCode,
        original_price: cartTotal
      },
      {
        onSuccess: (data) => {
          setTotalReduced(data.data.data.total_reduced);
          toast.success(data.data.message);
        }
      }
    );
  };

  // Áp dụng voucher khi giá trị giỏ hàng thay đổi
  useEffect(() => {
    if (!voucherCode || cartTotal === 0) return;
    applyVoucherMutation.mutate(
      {
        voucher_code: voucherCode,
        original_price: cartTotal
      },
      {
        onSuccess: (data) => {
          setTotalReduced(data.data.data.total_reduced);
        }
      }
    );
  }, [cartTotal]);

  return (
    <Fragment>
      {/* Giỏ hàng khi có sản phẩm */}
      {cartList.length > 0 && !getCartQuery?.isLoading && (
        <Fragment>
          {/* Danh sách sản phẩm mua */}
          <div className='px-2 pt-2'>
            {extendedCartList.map((cartItem) => (
              <CartItem
                key={cartItem._id}
                data={cartItem}
                handleChangeQuantity={handleChangeQuantity}
                handleTypeQuantity={handleTypeQuantity}
                chooseToCheckout={chooseToCheckout}
                disabled={cartItem.disabled}
                checked={cartItem.checked || false}
              />
            ))}
          </div>
          {/* Sử dụng voucher */}
          {checkedCartList.length > 0 && (
            <div className='px-6 pb-6'>
              <div className='border-t border-t-[#CFCFCF] pt-6 flex justify-start'>
                {/* Nút sử dụng voucher */}
                <div
                  tabIndex={0}
                  aria-hidden='true'
                  role='buton'
                  onClick={() => setIsUsingVoucher((prevState) => !prevState)}
                  className='flex items-center py-2 px-3 border border-[#CFCFCF] rounded cursor-pointer select-none'
                >
                  <div className='flex items-center'>
                    <VoucherIcon className='w-3 h-3 md:w-4 md:h-4' />
                    <span className='ml-2 text-[#1982F9] text-xs md:text-base'>Sử dụng mã giảm giá</span>
                  </div>
                  <CaretDownIcon
                    className={`fill-[#1982F9] w-2 h-2 md:w-3 md:h-3 ml-2 ${isUsingVoucher && 'rotate-180'}`}
                  />
                </div>
              </div>
              {/* Input voucher */}
              {isUsingVoucher && (
                <form onSubmit={handleUseVoucher}>
                  <div className='flex bg-[#ECECEC] p-2 mt-4'>
                    <Input
                      classNameWrapper='flex-1'
                      placeholder='Nhập mã giảm giá/Phiếu mua hàng'
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value)}
                    />
                    <button
                      type='submit'
                      className='bg-[#1982F9] text-white text-xs md:text-base ml-2 font-semibold px-2 md:px-4 rounded'
                    >
                      Áp dụng
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
          {/* Thông tin thanh toán */}
          <div className='px-4 md:px-6'>
            <div className='border-t border-[#CFCFCF] py-6'>
              <div className='flex justify-between items-center mb-2'>
                <div className='text-sm md:text-base font-semibold'>Phí vận chuyển:</div>
                <div className='text-sm md:text-base font-semibold'>Miễn phí</div>
              </div>
              <div className='flex justify-between items-center mb-2'>
                <div className='text-sm md:text-base font-semibold'>Voucher:</div>
                <div className='text-sm md:text-base font-semibold'>-{`${formatCurrency(totalReduced)}`}₫</div>
              </div>
              <div className='flex justify-between items-center mb-6'>
                <div className='text-base md:text-lg font-semibold'>Tổng tiền:</div>
                <div className='text-lg md:text-2xl text-primary font-semibold'>{formatCurrency(totalPayment)}₫</div>
              </div>
              <div
                className={classNames('', {
                  'cursor-not-allowed': checkedCartList.length === 0
                })}
              >
                <Link
                  to={PATH.CART_CHECKOUT_INFO}
                  className={classNames('', {
                    'pointer-events-none opacity-80': checkedCartList.length === 0
                  })}
                >
                  <Button className='bg-primary px-4 py-2 text-white text-sm md:text-base uppercase rounded hover:bg-primary/90 flex items-center justify-center font-medium select-none w-full'>
                    Đặt hàng ngay
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Fragment>
      )}
      {/* Giỏ hàng trống */}
      {cartList.length === 0 && !getCartQuery?.isLoading && (
        <div className='flex flex-col items-center py-6'>
          <div className='text-sm text-center'>Giỏ hàng của bạn đang trống</div>
          <Link
            to={PATH.PRODUCT}
            className='py-2 px-6 border border-[#1982F9] rounded my-4 text-[#1982F9] uppercase text-xs md:text-sm font-semibold'
          >
            Tiếp tục mua hàng
          </Link>
        </div>
      )}
      {/* Loading */}
      {getCartQuery?.isLoading && (
        <div className='min-h-[300px] bg-white rounded flex justify-center items-center'>
          <Loading />
        </div>
      )}
    </Fragment>
  );
};

export default CartList;
