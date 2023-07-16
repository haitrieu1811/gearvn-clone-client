import { useMutation, useQuery } from '@tanstack/react-query';
import { produce } from 'immer';
import isUndefined from 'lodash/isUndefined';
import keyBy from 'lodash/keyBy';
import omitBy from 'lodash/omitBy';
import moment from 'moment';
import { ChangeEvent, useContext, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import productApi from 'src/apis/product.api';
import Checkbox from 'src/components/Checkbox';
import { SearchIcon } from 'src/components/Icons';
import Modal from 'src/components/Modal';
import Table from 'src/components/Table';
import TableAction from 'src/components/Table/TableAction';
import PATH from 'src/constants/path';
import { AppContext } from 'src/contexts/app.context';
import UseQueryParams from 'src/hooks/useQueryParams';
import { GetProductsRequestParams } from 'src/types/product.type';
import { formatCurrency } from 'src/utils/utils';

type QueryConfig = {
  [key in keyof GetProductsRequestParams]: string;
};

const List = () => {
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const { extendedProducts, setExtendedProducts } = useContext(AppContext);
  const queryParams: QueryConfig = UseQueryParams();
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || 1,
      limit: queryParams.limit || 10
    },
    isUndefined
  );

  const getProductsQuery = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => productApi.getList(queryConfig),
    keepPreviousData: true
  });

  const deleteProductMutation = useMutation({
    mutationFn: productApi.delete,
    onSuccess: (data) => {
      toast.success(data.data.message);
      getProductsQuery.refetch();
      setIsOpenModal(false);
    }
  });

  const products = useMemo(
    () => getProductsQuery.data?.data.data.products,
    [getProductsQuery.data?.data.data.products]
  );
  const pageSize = useMemo(
    () => getProductsQuery.data?.data.data.pagination.page_size,
    [getProductsQuery.data?.data.data.pagination.page_size]
  );
  const checkedProducts = useMemo(() => extendedProducts.filter((product) => product.checked), [extendedProducts]);
  const isAllChecked = useMemo(() => extendedProducts.every((product) => product.checked), [checkedProducts]);

  useEffect(() => {
    if (products) {
      setExtendedProducts((prevState) => {
        const extendedProductsObj = keyBy(prevState, '_id');
        return products.map((product) => ({
          ...product,
          checked: Boolean(extendedProductsObj[product._id]?.checked)
        }));
      });
    }
  }, [products]);

  const handleCheckOne = (productIndex: number) => (e: ChangeEvent<HTMLInputElement>) => {
    setExtendedProducts(
      produce((draft) => {
        draft[productIndex].checked = e.target.checked;
      })
    );
  };

  const handleCheckAll = () => {
    setExtendedProducts((prevState) =>
      prevState.map((product) => ({
        ...product,
        checked: !isAllChecked
      }))
    );
  };

  const startDelete = (productId?: string) => {
    setIsOpenModal(true);
    productId && setCurrentId(productId);
  };

  const stopDelete = () => {
    setIsOpenModal(false);
    currentId && setCurrentId(null);
  };

  const handleDelete = () => {
    if (currentId) deleteProductMutation.mutate([currentId]);
    else deleteProductMutation.mutate(checkedProducts.map((product) => product._id));
  };

  return (
    <div>
      <div className='flex justify-between items-center mb-4 bg-white py-3 px-4 rounded-lg shadow-sm'>
        <div>
          <div className='relative'>
            <input
              type='text'
              placeholder='Tìm kiếm'
              className='border rounded py-[6px] px-3 text-sm outline-none w-[180px] pr-11 bg-slate-100'
            />
            <button className='absolute top-1/2 -translate-y-1/2 right-0 h-full w-10 flex justify-center items-center'>
              <SearchIcon className='w-4 h-4' />
            </button>
          </div>
        </div>
        <Link
          to={PATH.DASHBOARD_PRODUCT_CREATE}
          className='px-2 py-[6px] rounded bg-blue-600 flex justify-center items-center'
        >
          <span className='text-white text-sm font-medium'>Tạo mới</span>
        </Link>
      </div>

      <Table
        initialData={products || []}
        checkedData={checkedProducts}
        columns={[1, 3, 1, 1, 1, 1, 1, 1, 1, 1]}
        head={[
          <Checkbox checked={isAllChecked} onChange={handleCheckAll} />,
          'Tên sản phẩm',
          'Giá gốc',
          'Giá gốc',
          'Giá sau khi giảm',
          'Danh mục',
          'Nhãn hiệu',
          'Tạo lúc',
          'Cập nhật',
          'Thao tác'
        ]}
        body={extendedProducts.map((product, index) => [
          <Checkbox checked={product.checked} onChange={handleCheckOne(index)} />,
          product.name_vi,
          formatCurrency(product.price),
          formatCurrency(product.price),
          formatCurrency(product.price_after_discount),
          product.category.name_vi,
          product.brand.name,
          moment(product.created_at).fromNow(),
          moment(product.updated_at).fromNow(),
          <TableAction
            editPath={`${PATH.DASHBOARD_PRODUCT_UPDATE_WITHOUT_ID}/${product._id}`}
            deleteMethod={() => startDelete(product._id)}
          />
        ])}
        pagination={{
          pageSize: pageSize || 0
        }}
        startDelete={startDelete}
        isLoading={getProductsQuery.isLoading}
      />
      <Modal isVisible={isOpenModal} onCancel={stopDelete} onOk={handleDelete}>
        {currentId
          ? 'Bạn có chắc muốn xóa sản phẩm này'
          : `Bạn có chắc muốn xóa ${checkedProducts.length} sản phẩm đã chọn`}
      </Modal>
    </div>
  );
};

export default List;
