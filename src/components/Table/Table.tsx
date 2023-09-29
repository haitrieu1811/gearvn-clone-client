import Tippy from '@tippyjs/react/headless';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import {
  ChangeEvent,
  Dispatch,
  Fragment,
  ReactNode,
  SetStateAction,
  memo,
  useCallback,
  useMemo,
  useState
} from 'react';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';

import Loading from 'src/components/Loading';
import Pagination from 'src/components/Pagination';
import {
  ExtendedBlog,
  ExtendedBrand,
  ExtendedCategory,
  ExtendedCustomer,
  ExtendedOrder,
  ExtendedProduct,
  ExtendedPurchase,
  ExtendedVoucher
} from 'src/types/extended.type';
import Checkbox from '../Checkbox';
import ContextMenu from '../ContextMenu';
import { CaretDownIcon, EmptyImage, PencilIcon, TrashIcon } from '../Icons';
import Modal from '../Modal';

type SetData =
  | Dispatch<SetStateAction<ExtendedVoucher[]>>
  | Dispatch<SetStateAction<ExtendedProduct[]>>
  | Dispatch<SetStateAction<ExtendedCategory[]>>
  | Dispatch<SetStateAction<ExtendedBrand[]>>
  | Dispatch<SetStateAction<ExtendedBlog[]>>
  | Dispatch<SetStateAction<ExtendedPurchase[]>>
  | Dispatch<SetStateAction<ExtendedOrder[]>>
  | Dispatch<SetStateAction<ExtendedCustomer[]>>;

interface Columns {
  field: string;
  headerName: string | ReactNode;
  width: number;
}

interface DataSource {
  [key: string]: any;
}

interface TableProps {
  data: any[];
  setData: SetData;
  dataSource: DataSource[];
  columns: Columns[];
  isLoading?: boolean;
  pageSize: number;
  onSearch?: (value: string) => void;
  onDelete?: (ids: string[]) => void;
  updateItemPath?: string;
}

const Table = ({
  pageSize,
  isLoading,
  columns,
  dataSource,
  data,
  onSearch,
  setData,
  onDelete,
  updateItemPath
}: TableProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = queryString.parse(location.search);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [limit, setLimit] = useState<number>(20);

  // Render: Bản ghi mỗi trang
  const renderLimit = () => {
    return (
      <div className='bg-white rounded-sm shadow-2xl border'>
        {[20, 30, 50, 100].map((item) => (
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

  // Kiểm tra tất cả có được chọn hay không
  const isAllChecked = useMemo(() => data.every((item) => item.checked), [data]);

  // Danh sách các mục được chọn
  const checkedData = useMemo(() => data.filter((item) => item.checked), [data]);

  // Xử lý chọn một
  const handleCheckOne = (voucherId: string) => {
    setData(
      data.map((item) => {
        if (item._id === voucherId) {
          return {
            ...item,
            checked: !item.checked
          };
        }
        return item;
      })
    );
  };

  // Xử lý chọn tất cả
  const handleCheckAll = () => {
    setData(
      data.map((item) => ({
        ...item,
        checked: !isAllChecked
      }))
    );
  };

  // Bắt đầu xóa
  const startDelete = (productId?: string) => {
    setIsOpenModal(true);
    productId && setCurrentId(productId);
  };

  // Dừng xóa
  const stopDelete = useCallback(() => {
    setIsOpenModal(false);
    currentId && setCurrentId(null);
  }, [currentId]);

  // Xác nhận xóa
  const handleDelete = useCallback(() => {
    if (!onDelete) return;
    if (currentId) onDelete([currentId]);
    else onDelete(checkedData.map((item) => item._id));
    stopDelete();
  }, [currentId, checkedData, stopDelete]);

  return (
    <Fragment>
      {/* Hiển thị khi có dữ liệu */}
      <div className='bg-white px-4'>
        <div className='flex justify-between items-center mb-3 py-5'>
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
          </div>
        </div>
        {data.length > 0 && !isLoading && (
          <Fragment>
            <table className='w-full'>
              <thead>
                <tr>
                  <td width='5%'>
                    <section className='text-sm font-semibold px-2 py-3'>
                      <Checkbox checked={isAllChecked} onChange={handleCheckAll} />
                    </section>
                  </td>
                  {columns.map((column, index) => (
                    <td key={index} width={`${column.width}%`}>
                      <section className='text-sm font-semibold px-2 py-3'>{column.headerName}</section>
                    </td>
                  ))}
                  <td width='5%' />
                </tr>
              </thead>
              <tbody>
                {dataSource.map((row, index) => (
                  <tr key={index} className='border-t hover:bg-slate-50 hover:cursor-pointer'>
                    <td width='5%'>
                      <section className='text-sm font-semibold px-2 py-3'>
                        <Checkbox checked={row.checked} onChange={() => handleCheckOne(row._id)} />
                      </section>
                    </td>
                    {columns.map((column, _index) => (
                      <td key={_index}>
                        <section className='text-sm text-slate-600 p-2'>
                          <span className='line-clamp-1'>{row[column.field]}</span>
                        </section>
                      </td>
                    ))}
                    <td width='5%'>
                      <ContextMenu
                        items={[
                          {
                            icon: <PencilIcon />,
                            label: 'Cập nhật',
                            onClick: () => navigate(`${updateItemPath}/${row._id}`),
                            enabled: !!updateItemPath
                          },
                          {
                            icon: <TrashIcon />,
                            label: 'Xóa',
                            onClick: () => startDelete(row._id),
                            enabled: !!onDelete
                          }
                        ]}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className={'sticky bottom-0 bg-white py-4 px-5 flex justify-between items-center'}>
              <div className='flex items-center'>
                {checkedData.length > 0 && (
                  <button
                    className='font-medium text-sm text-white bg-red-600/90 rounded py-1 px-4 mr-4 hover:bg-red-600'
                    onClick={() => startDelete()}
                  >
                    Xóa {checkedData.length} mục đã chọn
                  </button>
                )}
              </div>
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
      {data.length === 0 && !isLoading && (
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

      {/* Modal */}
      <Modal name='Xác nhận xóa' isVisible={isOpenModal} onCancel={stopDelete} onOk={handleDelete}>
        <div className='text-center leading-loose'>
          <div>
            {currentId ? 'Bạn có chắc muốn xóa mục này?' : `Bạn có chắc muốn xóa ${checkedData.length} mục đã chọn?`}
          </div>
          <div className='font-medium text-red-500 underline mt-2'>Sẽ bị xóa vĩnh viễn và không thể khôi phục.</div>
        </div>
      </Modal>
    </Fragment>
  );
};

Table.propTypes = {
  data: PropTypes.array.isRequired,
  setData: PropTypes.func.isRequired,
  columns: PropTypes.array.isRequired,
  dataSource: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
  pageSize: PropTypes.number.isRequired,
  onSearch: PropTypes.func,
  onDelete: PropTypes.func,
  updateItemPath: PropTypes.string
};

export default memo(Table);
