import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import fallbackImage from 'src/assets/images/product-fallback.png';
import PATH from 'src/constants/path';
import { Product } from 'src/types/product.type';
import { formatCurrency, generateNameId, rateSale } from 'src/utils/utils';
import Image from '../Image';

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
        <Image
          src={data.thumbnail}
          fallbackImage={fallbackImage}
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
          <div className='text-[#6D6E72] text-xs line-through'>{formatCurrency(data.price)}₫</div>
        )}
        <div className='flex items-center'>
          <div className='text-primary text-sm font-semibold'>{formatCurrency(data.price_after_discount)}₫</div>
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

ProductItem.propTypes = {
  data: PropTypes.object.isRequired
};

export default ProductItem;
