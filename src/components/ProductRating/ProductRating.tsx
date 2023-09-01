import { Fragment } from 'react';
import PropTypes from 'prop-types';

import { StarIcon } from '../Icons';

interface ProductRatingProps {
  ratingScore: number;
  ratingCount: number;
  data: number[]; // Số lượng đánh giá theo số sao (5, 4, 3, 2, 1)
}

const ProductRating = ({ ratingScore, ratingCount, data }: ProductRatingProps) => {
  return (
    <Fragment>
      <div className='flex items-center flex-col px-12'>
        <div className='text-[36px] font-semibold text-primary mb-[10px]'>{ratingScore || 0}/5</div>
        <div className='flex items-center'>
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <StarIcon key={index} className='text-[#fdd835] w-4 h-4' />
            ))}
        </div>
        <div className='mt-2 text-sm'>
          <span className='font-bold'>({ratingCount})</span> đánh giá & nhận xét
        </div>
      </div>
      <div>
        {data.map((item, index) => {
          const percent = item > 0 ? (item / ratingCount) * 100 : 0;
          const _index = 5 - index;
          return (
            <div key={index} className='flex items-center mt-3'>
              <span className='flex items-center'>
                <span className='text-sm mr-[6px]'>{_index}</span>
                <StarIcon className='text-[#fdd835] w-4 h-4' />
              </span>
              <div className='w-[360px] h-3 bg-[#ECECEC] rounded-[30px] ml-[17px] mr-16 relative overflow-hidden'>
                <div className='absolute rounded-[30px] inset-0 bg-[#24b400]' style={{ width: `${percent}%` }} />
              </div>
              <span className='text-sm'>{item} đánh giá</span>
            </div>
          );
        })}
      </div>
    </Fragment>
  );
};

ProductRating.propTypes = {
  ratingScore: PropTypes.number.isRequired,
  ratingCount: PropTypes.number.isRequired,
  data: PropTypes.array.isRequired
};

export default ProductRating;
