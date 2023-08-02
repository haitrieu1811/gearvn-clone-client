import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { TruckIcon } from 'src/components/Icons';
import ProductItem from 'src/components/ProductItem';
import { Product } from 'src/types/product.type';

interface ProductSectionProps {
  headingTitle: string;
  data: Product[];
  subLinks?: {
    to: string;
    name: string;
  }[];
  viewAllTo?: string;
}

const ProductSection = ({ headingTitle, data, subLinks, viewAllTo }: ProductSectionProps) => {
  return (
    <div className='bg-white rounded shadow-sm'>
      {/* heading */}
      <div className='overflow-x-auto max-w-full'>
        <div className='py-3 px-2 md:px-6 flex justify-between w-[1200px] lg:w-auto'>
          <div className='flex items-center'>
            <h2 className='text-lg md:text-2xl font-semibold'>{headingTitle}</h2>
            <div className='w-[1px] h-3 md:h-[22px] bg-[#333333] mx-3 md:mx-[21px]' />
            <div className='flex items-center'>
              <TruckIcon className='w-[22px] h-[14px] mr-[9px]' />
              <span className='text-base md:text-lg font-semibold'>Miễn phí giao hàng</span>
            </div>
          </div>
          <div>
            {subLinks &&
              subLinks.length > 0 &&
              subLinks.map((link, index) => (
                <Link key={index} to={link.to} className='px-4 py-[5px] text-sm md:text-lg hover:underline'>
                  {link.name}
                </Link>
              ))}
            {viewAllTo && (
              <Link to={viewAllTo} className='text-[#1982F9] text-sm md:text-lg ml-5 hover:text-primary'>
                Xem tất cả
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      {data && data.length > 0 && (
        <div className='grid grid-cols-12 lg:grid-cols-10 gap-2 px-[6px] py-2'>
          {data.map((product) => (
            <div key={product._id} className='col-span-6 md:col-span-4 lg:col-span-2'>
              <ProductItem data={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

ProductSection.propTypes = {
  headingTitle: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  subLinks: PropTypes.arrayOf(
    PropTypes.shape({
      to: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })
  ),
  viewAllTo: PropTypes.string
};

export default ProductSection;
