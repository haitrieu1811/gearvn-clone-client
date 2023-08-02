import { useMutation, useQuery } from '@tanstack/react-query';
import { produce } from 'immer';
import isUndefined from 'lodash/isUndefined';
import keyBy from 'lodash/keyBy';
import omitBy from 'lodash/omitBy';
import moment from 'moment';
import { ChangeEvent, useContext, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import brandApi from 'src/apis/brand.api';
import categoryApi from 'src/apis/category.api';

import productApi from 'src/apis/product.api';
import Checkbox from 'src/components/Checkbox';
import Filter from 'src/components/Filter';
import { PlusIcon } from 'src/components/Icons';
import Modal from 'src/components/Modal';
import Sort from 'src/components/Sort';
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
      limit: queryParams.limit || 10,
      sortBy: queryParams.sortBy,
      orderBy: queryParams.orderBy,
      category: queryParams.category,
      brand: queryParams.brand
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
  const total = useMemo(
    () => getProductsQuery.data?.data.data.pagination.total,
    [getProductsQuery.data?.data.data.pagination.total]
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

  const getBrandsQuery = useQuery({
    queryKey: ['brands'],
    queryFn: () => brandApi.getList()
  });

  const getCategoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getList()
  });

  const brands = useMemo(() => getBrandsQuery.data?.data.data.brands, [getBrandsQuery.data?.data.data.brands]);
  const categories = useMemo(
    () => getCategoriesQuery.data?.data.data.categories,
    [getCategoriesQuery.data?.data.data.categories]
  );

  return (
    <div>
      <div className='p-6 flex justify-between items-center'>
        <div>
          <h2 className='text-2xl font-bold'>Danh sách sản phẩm</h2>
          <div className='text-slate-500 text-sm mt-1'>(Có {total} sản phẩm)</div>
        </div>
        <Link
          to={PATH.DASHBOARD_PRODUCT_CREATE}
          className='bg-blue-500 text-white text-sm rounded p-2 flex items-center'
        >
          <PlusIcon className='w-4 h-4 mr-2 stroke-[3]' />
          Tạo mới
        </Link>
      </div>
      <div className='p-6 bg-white rounded flex justify-between items-center'>
        <div className='flex items-center'>
          {categories && (
            <Filter
              queryName='category'
              label='Danh mục sản phẩm'
              data={categories.map((category) => ({
                value: category._id,
                text: category.name_vi
              }))}
            />
          )}
          <div className='mx-1' />
          {brands && brands.length > 0 && (
            <Filter
              queryName='brand'
              label='Nhãn hiệu'
              data={brands.map((brand) => ({
                value: brand._id,
                text: brand.name
              }))}
            />
          )}
        </div>
        <div>
          <Sort
            data={[
              {
                orderBy: 'desc',
                sortBy: 'created_at',
                name: 'Nổi bật'
              },
              {
                orderBy: 'desc',
                sortBy: 'price_after_discount',
                name: 'Giá giảm dần'
              },
              {
                orderBy: 'asc',
                sortBy: 'price_after_discount',
                name: 'Giá tăng dần'
              }
            ]}
          />
        </div>
      </div>
      <Table
        initialData={products || []}
        checkedData={checkedProducts}
        columns={[5, 1, 1, 1, 1, 1, 1, 1]}
        head={[
          <div className='flex items-center'>
            <Checkbox checked={isAllChecked} onChange={handleCheckAll} /> <span className='ml-6'>Tên sản phẩm</span>
          </div>,
          'Giá gốc',
          'Giá sau khi giảm',
          'Danh mục',
          'Nhãn hiệu',
          'Tạo lúc',
          'Cập nhật',
          'Thao tác'
        ]}
        body={extendedProducts.map((product, index) => [
          <div className='flex items-center'>
            <Checkbox checked={product.checked} onChange={handleCheckOne(index)} />{' '}
            <span className='ml-6'>{product.name_vi}</span>
          </div>,
          formatCurrency(product.price),
          formatCurrency(product.price_after_discount),
          product.category?.name_vi,
          product.brand?.name,
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
