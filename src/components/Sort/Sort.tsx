import Tippy from '@tippyjs/react/headless';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';

import UseQueryParams from 'src/hooks/useQueryParams';
import { CaretDownIcon, SortIcon } from '../Icons';

type SortBy = 'price' | 'price_after_discount' | 'created_at';
type OrderBy = 'asc' | 'desc';

interface SortItem {
  sortBy: SortBy;
  orderBy: OrderBy;
  name: string;
}

interface SortProps {
  data: SortItem[];
}

const Sort = ({ data }: SortProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = UseQueryParams();
  const [currentSort, setCurrentSort] = useState<SortItem>(data[0]);

  // Tiến hành lọc
  const handleSort = (sort: SortItem) => {
    navigate({
      pathname: location.pathname,
      search: createSearchParams({
        ...queryParams,
        sortBy: sort.sortBy,
        orderBy: sort.orderBy
      }).toString()
    });
    setCurrentSort(sort);
  };

  // Render ra các item sort
  const renderSort = () => {
    return (
      <div className='bg-white rounded border shadow w-[170px]'>
        {data &&
          data.length > 0 &&
          data.map((item, index) => (
            <button
              key={index}
              className={classNames('py-[7px] px-4 text-sm block w-full text-left hover:bg-[#E7F2FF]', {
                'font-semibold': currentSort.orderBy === item.orderBy && currentSort.sortBy === item.sortBy
              })}
              onClick={() => handleSort(item)}
            >
              {item.name}
            </button>
          ))}
      </div>
    );
  };

  return (
    <Tippy render={renderSort} trigger='click' interactive placement='bottom-end' offset={[0, 4]}>
      <button className='flex items-center border border-[#CFCFCF] text-[13px] rounded py-[5px] px-3'>
        <SortIcon className='w-5 h-5 mr-[5px]' />
        <span>
          <span className='mr-1'>Xếp theo:</span> <span className='font-semibold'>{currentSort.name}</span>
        </span>
        <CaretDownIcon className='w-2 h-2 fill-black ml-2' />
      </button>
    </Tippy>
  );
};

Sort.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      orderBy: PropTypes.string.isRequired,
      sortBy: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired
};

export default Sort;
