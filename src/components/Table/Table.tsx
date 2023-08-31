import Tippy from '@tippyjs/react/headless';
import classNames from 'classnames';
import queryString from 'query-string';
import { Fragment, ReactNode, useState } from 'react';

import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import Loading from 'src/components/Loading';
import Pagination from 'src/components/Pagination';
import { CaretDownIcon, EmptyImage } from '../Icons';

interface Columns {
  field: string;
  headerName: string | ReactNode;
  width: number;
}

interface Rows {
  [key: string]: any;
}

interface TableProps {
  data: any[];
  columns: Columns[];
  rows: Rows[];
  pageSizeOptions?: number[];
  isLoading?: boolean;
  pageSize: number;
  tableFootLeft?: ReactNode | JSX.Element;
}

const Table = ({
  pageSize,
  isLoading,
  pageSizeOptions = [20, 30, 50, 100],
  columns,
  rows,
  data,
  tableFootLeft
}: TableProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = queryString.parse(location.search);

  const [limit, setLimit] = useState<number>(pageSizeOptions[0]);

  const handleChangeLimit = (limit: number) => {
    setLimit(limit);
    navigate({
      pathname: location.pathname,
      search: createSearchParams({
        ...searchParams,
        limit: limit.toString(),
        page: '1'
      }).toString()
    });
  };

  const renderLimit = () => {
    return (
      <div className='bg-white rounded-sm shadow-2xl border'>
        {pageSizeOptions.map((item) => (
          <div
            key={item}
            className={classNames('py-2 pl-3 pr-4 text-sm border-b hover:bg-slate-100', {
              'bg-slate-100 pointer-events-none': item === limit
            })}
            aria-hidden='true'
            role='button'
            tabIndex={0}
            onClick={() => handleChangeLimit(item)}
          >
            {item}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Fragment>
      {/* Hiển thị khi có dữ liệu */}
      {data.length > 0 && !isLoading && (
        <div className='bg-white px-4'>
          <table className='w-full'>
            <thead>
              <tr>
                {columns.map((column, index) => (
                  <td key={index} width={`${column.width}%`}>
                    <section className='text-sm font-semibold px-4 py-2'>{column.headerName}</section>
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index} className='border-t'>
                  {columns.map((column, _index) => (
                    <td key={_index}>
                      <section className='text-sm text-slate-600 px-4 py-2'>{row[column.field]}</section>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className={'sticky bottom-0 bg-white py-4 px-5 flex justify-between items-center'}>
            <div className='flex items-center'>{tableFootLeft}</div>
            <div className='flex items-center'>
              {/* Bản ghi mỗi trang */}
              <div className='flex items-center mr-6'>
                <span className='mr-3 text-slate-700 text-sm'>Bản ghi mỗi trang</span>
                <Tippy interactive placement='bottom-end' offset={[0, 0]} trigger='click' render={renderLimit}>
                  <button className='flex justify-between items-center bg-slate-200/80 w-16 py-1 px-2 rounded'>
                    <span className='mr-2 text-sm font-semibold'>{limit}</span>
                    <CaretDownIcon className='w-3 h-3 fill-black' />
                  </button>
                </Tippy>
              </div>
              {/* Phân trang */}
              <Pagination
                pageSize={pageSize}
                classNameItem='w-8 h-8 flex justify-center items-center text-black rounded-full text-sm font-semibold'
                classNameItemActive='bg-blue-700 text-white'
              />
            </div>
          </div>
        </div>
      )}

      {/* Hiển thị khi không có dữ liệu */}
      {data.length <= 0 && !isLoading && (
        <div className='py-[100px] bg-white shadow-sm flex justify-between items-center flex-col'>
          <EmptyImage />
          <p className='mt-6 text-center text-lg font-medium'>Không có bản ghi nào</p>
        </div>
      )}

      {/* Tải dữ liệu */}
      {isLoading && <Loading />}
    </Fragment>
  );
};

export default Table;
