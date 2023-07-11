import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Link, createSearchParams } from 'react-router-dom';

import { ChevronLeft, ChevronRight } from '../Icons';

const RANGE = 2;

const Pagination = ({ pageSize, queryConfig, path }: { pageSize: number; queryConfig: any; path: string }) => {
  const page = Number(queryConfig.page);

  const renderPagination = () => {
    let dotBefore = false;
    let dotAfter = false;

    const renderDotBefore = (index: number) => {
      if (!dotBefore) {
        dotBefore = true;
        return (
          <span
            key={index}
            className='w-8 h-8 mx-1 rounded-md flex justify-center items-center font-medium text-[15px]'
          >
            ...
          </span>
        );
      }
    };

    const renderDotAfter = (index: number) => {
      if (!dotAfter) {
        dotAfter = true;
        return (
          <span
            key={index}
            className='w-8 h-8 mx-1 rounded-md flex justify-center items-center font-medium text-[15px]'
          >
            ...
          </span>
        );
      }
    };

    return Array(pageSize)
      .fill(0)
      .map((_, index) => {
        const pageNumber = index + 1;
        const isActive = pageNumber === page;

        if (page <= RANGE * 2 + 1 && pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
          return renderDotAfter(index);
        } else if (page > RANGE * 2 + 1 && page < pageSize - RANGE * 2) {
          if (pageNumber < page - RANGE && pageNumber > RANGE) {
            return renderDotBefore(index);
          } else if (pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
            return renderDotAfter(index);
          }
        } else if (page >= pageSize - RANGE * 2 && pageNumber > RANGE && pageNumber < page - RANGE) {
          return renderDotBefore(index);
        }

        return (
          <Link
            to={{
              pathname: path,
              search: createSearchParams({
                ...queryConfig,
                page: pageNumber.toString()
              }).toString()
            }}
            key={index}
            className={classNames('w-8 h-8 mx-1 rounded-md flex justify-center items-center font-medium text-[15px]', {
              'bg-primary text-white pointer-events-none': isActive,
              'bg-white': !isActive
            })}
          >
            {pageNumber}
          </Link>
        );
      });
  };

  return (
    <div className='flex flex-wrap items-center justify-end text-xl font-light'>
      {page === 1 ? (
        <span className='w-8 h-8 mx-1 rounded-md flex justify-center items-center font-medium text-[15px] cursor-not-allowed'>
          <ChevronLeft className='w-4 h-4' />
        </span>
      ) : (
        <Link
          to={{
            search: createSearchParams({
              ...queryConfig,
              page: (page - 1).toString()
            }).toString()
          }}
          className='w-8 h-8 mx-1 rounded-md flex justify-center items-center font-medium text-[15px]'
        >
          <ChevronLeft className='w-4 h-4' />
        </Link>
      )}

      {renderPagination()}

      {page === pageSize ? (
        <span className='w-8 h-8 mx-1 rounded-md flex justify-center items-center font-medium text-[15px] cursor-not-allowed'>
          <ChevronRight className='w-4 h-4' />
        </span>
      ) : (
        <Link
          to={{
            search: createSearchParams({
              ...queryConfig,
              page: (page + 1).toString()
            }).toString()
          }}
          className='w-8 h-8 mx-1 rounded-md flex justify-center items-center font-medium text-[15px]'
        >
          <ChevronRight className='w-4 h-4' />
        </Link>
      )}
    </div>
  );
};

Pagination.propTypes = {
  pageSize: PropTypes.number.isRequired,
  path: PropTypes.string.isRequired
};

export default Pagination;
