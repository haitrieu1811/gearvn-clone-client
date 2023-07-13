import { Fragment } from 'react';

import Loading from 'src/components/Loading';
import Pagination from 'src/components/Pagination';
import Select from 'src/components/Select';
import { OptionsSelect } from 'src/components/Select/Select';

interface TableProps {
  columns: number[];
  head: any[];
  body: any[];
  initialData: any[];
  checkedData?: any[];
  classNameWrapper?: string;
  startDelete?: () => void;
  pagination?: {
    pageSize: number;
  };
  selectLimit?: {
    options: OptionsSelect[];
    defaultValue: string;
    handleChangeLimit: (limit: string) => void;
  };
  isLoading?: boolean;
}

const Table = ({
  columns,
  head,
  body,
  initialData,
  checkedData,
  classNameWrapper,
  startDelete,
  pagination,
  selectLimit,
  isLoading
}: TableProps) => {
  return (
    <Fragment>
      {initialData && initialData.length > 0 && (
        <div className={`bg-white rounded-lg shadow-sm overflow-hidden ${classNameWrapper || ''}`}>
          <div className='grid grid-cols-12 gap-6 font-semibold py-3 px-8 border-b text-sm'>
            {columns.map((column, index) => (
              <div key={index} className={`flex items-center2 col-span-${column}`}>
                {head[index]}
              </div>
            ))}
          </div>
          {body.map((item, index) => (
            <div
              key={index}
              className='grid grid-cols-12 gap-6 py-2 px-8 border-b border-b-slate-100 text-slate-500 text-sm hover:bg-slate-100/50 cursor-pointer'
            >
              {columns.map((column, _index) => (
                <div key={_index} className={`col-span-${column} flex items-center`}>
                  {item[_index]}
                </div>
              ))}
            </div>
          ))}
          <div className={'sticky bottom-0 bg-white py-4 px-5 flex justify-between items-center'}>
            <div className='flex items-center'>
              {checkedData && checkedData.length > 0 && (
                <button
                  className='font-medium text-sm'
                  onClick={() => {
                    startDelete && startDelete();
                  }}
                >
                  Xóa {checkedData.length} mục đã chọn
                </button>
              )}
            </div>
            <div className='flex items-center'>
              {selectLimit && (
                <Select
                  options={selectLimit.options}
                  defaultValue={selectLimit.defaultValue}
                  onChange={selectLimit.handleChangeLimit}
                  classNameWrapper='mr-2'
                />
              )}
              {pagination && <Pagination pageSize={pagination.pageSize as number} />}
            </div>
          </div>
        </div>
      )}
      {initialData && initialData.length <= 0 && <div className='font-medium'>Chưa có bản ghi nào</div>}
      {isLoading && (
        <div className='flex justify-center items-center mt-10'>
          <Loading />
        </div>
      )}
    </Fragment>
  );
};

export default Table;