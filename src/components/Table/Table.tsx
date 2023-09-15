import Tippy from '@tippyjs/react/headless';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { ChangeEvent, Fragment, ReactNode, useState } from 'react';
import { Link, createSearchParams, useLocation, useNavigate } from 'react-router-dom';

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
  onSearch?: (value: string) => void;
  totalRows: number;
  tableName?: string;
  addNewPath?: string;
}

const Table = ({
  pageSize,
  isLoading,
  pageSizeOptions = [20, 30, 50, 100],
  columns,
  rows,
  data,
  tableFootLeft,
  onSearch,
  totalRows,
  tableName,
  addNewPath
}: TableProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = queryString.parse(location.search);
  const [limit, setLimit] = useState<number>(pageSizeOptions[0]);

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

  // Xử lý khi thay đổi số lượng bản ghi mỗi trang
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

  // Xử lý tìm kiếm
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    onSearch && onSearch(value);
  };

  return (
    <Fragment>
      {/* Hiển thị khi có dữ liệu */}
      <div className='bg-white px-4'>
        <div className='flex justify-between items-center mb-3 py-5'>
          <div className='flex items-center'>
            {tableName && <h2 className='text-2xl font-semibold text-slate-900'>{tableName}</h2>}
            <span className='ml-3 text-slate-500'>({totalRows} bản ghi)</span>
          </div>
          <div className='flex'>
            {onSearch && (
              <div className='flex items-center'>
                <label htmlFor='search' className='text-sm text-slate-500 mr-3'>
                  Tìm kiếm
                </label>
                <input
                  type='text'
                  id='search'
                  className='outline-none border rounded px-3 py-1 text-slate-500 text-sm h-full'
                  onChange={handleSearch}
                />
              </div>
            )}
            {addNewPath && (
              <Link
                to={addNewPath}
                className='bg-blue-500 px-4 py-[6px] rounded text-white text-sm flex justify-center items-center font-medium ml-4'
              >
                Thêm mới
              </Link>
            )}
          </div>
        </div>
        {data.length > 0 && !isLoading && (
          <Fragment>
            <table className='w-full'>
              <thead>
                <tr>
                  {columns.map((column, index) => (
                    <td key={index} width={`${column.width}%`}>
                      <section className='text-sm font-semibold px-2 py-3'>{column.headerName}</section>
                    </td>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={index} className='border-t hover:bg-slate-50 hover:cursor-pointer'>
                    {columns.map((column, _index) => (
                      <td key={_index}>
                        <section className='text-sm text-slate-600 p-2'>
                          <span className='line-clamp-1'>{row[column.field]}</span>
                        </section>
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
                  classNameItem='w-8 h-8 rounded-full flex justify-center items-center text-black text-sm'
                  classNameItemActive='bg-blue-600 text-white'
                />
              </div>
            </div>
          </Fragment>
        )}
      </div>

      {/* Hiển thị khi không có dữ liệu */}
      {data.length <= 0 && !isLoading && (
        <div className='py-[100px] bg-white shadow-sm flex justify-between items-center flex-col'>
          <EmptyImage />
          <p className='mt-6 text-center text-lg font-medium'>Không có bản ghi nào</p>
        </div>
      )}

      {/* Tải dữ liệu */}
      {isLoading && (
        <div className='min-h-[500px] bg-white rounded flex justify-center items-center'>
          <Loading />
        </div>
      )}
    </Fragment>
  );
};

Table.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
  pageSizeOptions: PropTypes.array,
  isLoading: PropTypes.bool,
  pageSize: PropTypes.number.isRequired,
  tableFootLeft: PropTypes.node,
  onSearch: PropTypes.func,
  totalRows: PropTypes.number.isRequired,
  tableName: PropTypes.string,
  addNewPath: PropTypes.string
};

export default Table;
