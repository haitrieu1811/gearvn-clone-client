import { useMutation, useQueryClient } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import { ChangeEvent, useRef } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import purchaseApi from 'src/apis/purchase.api';
import PATH from 'src/constants/path';
import { Purchase } from 'src/types/purchase.type';
import { formatCurrency, generateNameId, getImageUrl } from 'src/utils/utils';
import QuantityController from '../QuantityController';

interface CartItemProps {
  data: Purchase;
  handleChangeQuantity: ({ purchaseId, value }: { purchaseId: string; value: number }) => void;
  handleTypeQuantity: ({ purchaseId, value }: { purchaseId: string; value: number }) => void;
  chooseToCheckout: ({ purchaseId, e }: { purchaseId: string; e: ChangeEvent<HTMLInputElement> }) => void;
  disabled: boolean;
  checked: boolean;
}

const CartItem = ({
  data,
  handleChangeQuantity,
  handleTypeQuantity,
  chooseToCheckout,
  disabled,
  checked
}: CartItemProps) => {
  const queryClient = useQueryClient();
  const checkBoxRef = useRef<HTMLInputElement>(null);

  // Xóa sản phẩm khỏi giỏ hàng
  const deletePurchaseMutation = useMutation({
    mutationFn: purchaseApi.delete,
    onSuccess: (data) => {
      toast.success(data.data.message);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });

  // Xóa sản phẩm khỏi giỏ hàng
  const handleDelete = (purchaseId: string) => {
    deletePurchaseMutation.mutate([purchaseId]);
  };

  // Chọn sản phẩm để mua
  const chooseToBuy = () => {
    if (checkBoxRef) checkBoxRef.current?.click();
  };

  return (
    <div>
      <input
        ref={checkBoxRef}
        type='checkbox'
        checked={checked}
        onChange={(e) => chooseToCheckout({ purchaseId: data._id, e })}
        className='peer appearance-none absolute'
      />
      <div className='flex justify-between p-2 md:p-6 mb-2 peer-checked:bg-slate-100 cursor-pointer'>
        <div className='w-[70px] md:w-[90px]'>
          <div className='border border-[#ececec] rounded-sm'>
            <Link
              to={`${PATH.PRODUCT_DETAIL_WITHOUT_ID}/${generateNameId({
                name: data.product.name_vi,
                id: data.product._id
              })}`}
            >
              <img
                src={getImageUrl(data.product.thumbnail)}
                alt={data.product.name_vi}
                className='w-[60px] h-[60px] md:w-[90px] md:h-[90px] object-cover'
              />
            </Link>
          </div>
          <div className='flex justify-center items-center mt-3'>
            <button onClick={chooseToBuy} className='text-[#6D6E72] text-xs font-medium'>
              {!checked ? 'Chọn' : 'Bỏ chọn'}
            </button>
            <div className='w-[1px] h-3 bg-slate-400 mx-[6px]' />
            <button onClick={() => handleDelete(data._id)} className='text-[#6D6E72] text-xs font-medium'>
              Xóa
            </button>
          </div>
        </div>
        <div className='flex-1 flex justify-between items-start pl-4'>
          <Link
            to={`${PATH.PRODUCT_DETAIL_WITHOUT_ID}/${generateNameId({
              name: data.product.name_vi,
              id: data.product._id
            })}`}
            className='pr-5 font-semibold line-clamp-3 md:line-clamp-2 text-xs md:text-base'
          >
            {data.product.name_vi}
          </Link>
          <div className='flex flex-col items-end'>
            <div className='text-primary font-semibold text-sm md:text-lg'>
              {formatCurrency(data.product.price_after_discount * data.buy_count)}₫
            </div>
            <div className='text-[#6D6E72] text-xs'>{formatCurrency(data.product.price_after_discount)}₫</div>
            <div className='mt-4'>
              <QuantityController
                value={data.buy_count}
                onDecrease={(value) => handleChangeQuantity({ purchaseId: data._id, value })}
                onIncrease={(value) => handleChangeQuantity({ purchaseId: data._id, value })}
                onType={(value) => handleTypeQuantity({ purchaseId: data._id, value })}
                onFocusOut={(value) =>
                  handleChangeQuantity({
                    purchaseId: data._id,
                    value
                  })
                }
                disabled={disabled}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

CartItem.propTypes = {
  data: PropTypes.object.isRequired,
  handleChangeQuantity: PropTypes.func.isRequired,
  handleTypeQuantity: PropTypes.func.isRequired,
  chooseToCheckout: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  checked: PropTypes.bool.isRequired
};

export default CartItem;
