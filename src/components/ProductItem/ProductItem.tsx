import { Link } from 'react-router-dom';

import PATH from 'src/constants/path';
import { Product } from 'src/types/product.type';
import { formatCurrency, generateNameId, getImageUrl, rateSale } from 'src/utils/utils';

interface ProductItemProps {
  data: Product;
}

const ProductItem = ({ data }: ProductItemProps) => {
  return (
    <div className='border rounded shadow-sm'>
      <Link
        to={`${PATH.PRODUCT_DETAIL_WITHOUT_ID}/${generateNameId({ name: data.name_vi, id: data._id })}`}
        className='p-[10px]'
      >
        <img src={getImageUrl(data.thumbnail)} alt={data.name_vi} className='h-[210px] w-full object-cover' />
      </Link>
      <div className='p-4 pt-[6px]'>
        <div className='min-h-[40px] mb-[10px]'>
          <Link
            to={`${PATH.PRODUCT_DETAIL_WITHOUT_ID}/${generateNameId({ name: data.name_vi, id: data._id })}`}
            className='text-[#333333] text-sm font-semibold line-clamp-2'
          >
            {data.name_vi}
          </Link>
        </div>
        <div className='text-[#6D6E72] text-[13px] line-through'>{formatCurrency(data.price)}đ</div>
        <div className='flex items-center'>
          <div className='text-primary font-bold'>{formatCurrency(data.price_after_discount)}đ</div>
          <span className='border rounded-sm border-primary px-1 bg-[#FFEDED] text-[13px] text-primary ml-[10px] font-medium'>
            -{rateSale(data.price, data.price_after_discount)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
