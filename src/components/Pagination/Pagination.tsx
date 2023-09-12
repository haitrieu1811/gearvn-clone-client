import classNames from 'classnames';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { Link, createSearchParams, useLocation } from 'react-router-dom';

import { ChevronLeftIcon, ChevronRightIcon } from '../Icons';

const RANGE = 2;

interface PaginationProps {
  pageSize: number;
  classNameWrapper?: string;
  classNameItem?: string;
  classNameItemActive?: string;
  classNameItemUnActive?: string;
  classNamePrevNext?: string;
  classNameDots?: string;
}

const Pagination = ({
  pageSize,
  classNameWrapper,
  classNameItem = 'w-8 h-8 mx-1 rounded-full flex justify-center items-center font-medium text-[15px] select-none',
  classNameItemActive = 'bg-primary text-white pointer-events-none',
  classNameItemUnActive = 'bg-white',
  classNamePrevNext = 'w-8 h-8 mx-1 rounded-md flex justify-center items-center font-medium text-[15px]',
  classNameDots = 'w-8 h-8 mx-1 rounded-md flex justify-center items-center font-medium text-[15px]'
}: PaginationProps) => {
  const location = useLocation();
  const pathname = location.pathname;
  const queryConfig = queryString.parse(location.search);
  const page = Number(queryConfig.page) || 1;

  const renderPagination = () => {
    let dotBefore = false;
    let dotAfter = false;

    const renderDotBefore = (index: number) => {
      if (!dotBefore) {
        dotBefore = true;
        return (
          <span key={index} className={classNameDots}>
            ...
          </span>
        );
      }
    };

    const renderDotAfter = (index: number) => {
      if (!dotAfter) {
        dotAfter = true;
        return (
          <span key={index} className={classNameDots}>
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
              pathname,
              search: createSearchParams({
                ...queryConfig,
                page: pageNumber.toString()
              }).toString()
            }}
            key={index}
            className={classNames(classNameItem, {
              [classNameItemActive]: isActive,
              [classNameItemUnActive]: !isActive
            })}
          >
            {pageNumber}
          </Link>
        );
      });
  };

  return (
    <div className={classNameWrapper}>
      <div className='flex flex-wrap items-center text-xl font-light'>
        {page === 1 ? (
          <span className={`cursor-not-allowed ${classNamePrevNext}`}>
            <ChevronLeftIcon className='w-4 h-4' />
          </span>
        ) : (
          <Link
            to={{
              search: createSearchParams({
                ...queryConfig,
                page: (page - 1).toString()
              }).toString()
            }}
            className={classNamePrevNext}
          >
            <ChevronLeftIcon className='w-4 h-4' />
          </Link>
        )}

        {renderPagination()}

        {page === pageSize ? (
          <span className={`cursor-not-allowed ${classNamePrevNext}`}>
            <ChevronRightIcon className='w-4 h-4' />
          </span>
        ) : (
          <Link
            to={{
              search: createSearchParams({
                ...queryConfig,
                page: (page + 1).toString()
              }).toString()
            }}
            className={classNamePrevNext}
          >
            <ChevronRightIcon className='w-4 h-4' />
          </Link>
        )}
      </div>
    </div>
  );
};

Pagination.propTypes = {
  pageSize: PropTypes.number.isRequired,
  classNameWrapper: PropTypes.string,
  classNameItem: PropTypes.string,
  classNameItemActive: PropTypes.string,
  classNameItemUnActive: PropTypes.string,
  classNamePrevNext: PropTypes.string,
  classNameDots: PropTypes.string
};

export default Pagination;
