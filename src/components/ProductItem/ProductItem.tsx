import { Link } from 'react-router-dom';

import PATH from 'src/constants/path';
import { Product } from 'src/types/product.type';
import { formatCurrency, generateNameId, getImageUrl, rateSale } from 'src/utils/utils';

interface ProductItemProps {
  data: Product;
}

const ProductItem = ({ data }: ProductItemProps) => {
  return (
    <div className='border rounded shadow-sm min-h-[290px] lg:min-h-[350px]'>
      {/* Ảnh đại diện */}
      <Link
        to={`${PATH.PRODUCT_DETAIL_WITHOUT_ID}/${generateNameId({ name: data.name_vi, id: data._id })}`}
        className='p-[10px] block'
      >
        <img
          src={getImageUrl(data.thumbnail)}
          alt={data.name_vi}
          className='h-[150px] lg:h-[210px] w-full object-cover'
        />
      </Link>
      {/* Thông tin */}
      <div className='p-4 pt-[6px]'>
        <div className='mb-[10px]'>
          <Link
            to={`${PATH.PRODUCT_DETAIL_WITHOUT_ID}/${generateNameId({ name: data.name_vi, id: data._id })}`}
            className='text-[#333333] text-sm font-semibold line-clamp-2'
          >
            {data.name_vi}
          </Link>
        </div>
        {data.price > data.price_after_discount && (
          <div className='text-[#6D6E72] text-[13px] line-through'>{formatCurrency(data.price)}₫</div>
        )}
        <div className='flex items-center'>
          <div className='text-primary text-sm md:text-base font-semibold'>
            {formatCurrency(data.price_after_discount)}₫
          </div>
          {rateSale(data.price, data.price_after_discount) > 0 && (
            <span className='border rounded-sm border-primary px-1 bg-[#FFEDED] text-[10px] md:text-[13px] text-primary ml-[10px] font-medium'>
              -{rateSale(data.price, data.price_after_discount)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
