import { useMutation, useQuery } from '@tanstack/react-query';
import { produce } from 'immer';
import isUndefined from 'lodash/isUndefined';
import keyBy from 'lodash/keyBy';
import omitBy from 'lodash/omitBy';
import moment from 'moment';
import { ChangeEvent, Fragment, useContext, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import brandApi from 'src/apis/brand.api';
import categoryApi from 'src/apis/category.api';
import productApi from 'src/apis/product.api';
import Checkbox from 'src/components/Checkbox';
import Filter from 'src/components/Filter';
import { PlusIcon } from 'src/components/Icons';
import Modal from 'src/components/Modal/Modal';
import Sort from 'src/components/Sort';
import Table from 'src/components/Table';
import TableAction from 'src/components/Table/TableAction';
import PATH from 'src/constants/path';
import { AppContext } from 'src/contexts/app.context';
import useDebounce from 'src/hooks/useDebounce';
import UseQueryParams from 'src/hooks/useQueryParams';
import { GetProductsRequestParams } from 'src/types/product.type';
import { formatCurrency } from 'src/utils/utils';

type QueryConfig = {
  [key in keyof GetProductsRequestParams]: string;
};

const List = () => {
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [keywordSearch, setKeywordSearch] = useState<string>('');
  const keywordSearchDebounce = useDebounce(keywordSearch, 1000);
  const { extendedProducts, setExtendedProducts } = useContext(AppContext);
  const queryParams: QueryConfig = UseQueryParams();
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || 1,
      limit: queryParams.limit || 10,
      sortBy: queryParams.sortBy,
      orderBy: queryParams.orderBy,
      category: queryParams.category,
      brand: queryParams.brand,
      name: keywordSearchDebounce
    },
    isUndefined
  );

  // Lấy danh sách sản phẩm
  const getProductsQuery = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => productApi.getList(queryConfig),
    keepPreviousData: true
  });

  // Xóa sản phẩm
  const deleteProductMutation = useMutation({
    mutationFn: productApi.delete,
    onSuccess: (data) => {
      toast.success(data.data.message);
      getProductsQuery.refetch();
      setIsOpenModal(false);
    }
  });

  // Lấy danh sách sản phẩm
  const products = useMemo(
    () => getProductsQuery.data?.data.data.products,
    [getProductsQuery.data?.data.data.products]
  );
  // Lấy tổng số sản phẩm
  const total = useMemo(
    () => getProductsQuery.data?.data.data.pagination.total,
    [getProductsQuery.data?.data.data.pagination.total]
  );
  // Lấy tổng số trang
  const pageSize = useMemo(
    () => getProductsQuery.data?.data.data.pagination.page_size,
    [getProductsQuery.data?.data.data.pagination.page_size]
  );
  // Lấy danh sách sản phẩm được check
  const checkedProducts = useMemo(() => extendedProducts.filter((product) => product.checked), [extendedProducts]);
  // Kiểm tra tất cả sản phẩm đã check hay chưa
  const isAllChecked = useMemo(() => extendedProducts.every((product) => product.checked), [checkedProducts]);

  // Cập nhật danh sách sản phẩm
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

  // Check 1 sản phẩm
  const handleCheckOne = (productIndex: number) => (e: ChangeEvent<HTMLInputElement>) => {
    setExtendedProducts(
      produce((draft) => {
        draft[productIndex].checked = e.target.checked;
      })
    );
  };

  // Check tất cả sản phẩm
  const handleCheckAll = () => {
    setExtendedProducts((prevState) =>
      prevState.map((product) => ({
        ...product,
        checked: !isAllChecked
      }))
    );
  };

  // Lấy danh sách nhãn hiệu
  const getBrandsQuery = useQuery({
    queryKey: ['brands'],
    queryFn: () => brandApi.getList()
  });

  // Lấy danh sách danh mục
  const getCategoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getList()
  });

  // Danh sách nhãn hiệu
  const brands = useMemo(() => getBrandsQuery.data?.data.data.brands, [getBrandsQuery.data?.data.data.brands]);
  // Danh sách danh mục
  const categories = useMemo(
    () => getCategoriesQuery.data?.data.data.categories,
    [getCategoriesQuery.data?.data.data.categories]
  );

  // Bắt đầu xóa
  const startDelete = (productId?: string) => {
    setIsOpenModal(true);
    productId && setCurrentId(productId);
  };

  // Dừng xóa
  const stopDelete = () => {
    setIsOpenModal(false);
    currentId && setCurrentId(null);
  };

  // Xác nhận xóa
  const handleDelete = () => {
    if (currentId) deleteProductMutation.mutate([currentId]);
    else deleteProductMutation.mutate(checkedProducts.map((product) => product._id));
  };

  return (
    <Fragment>
      <div className='px-8 py-3 mb-4 flex justify-between items-center bg-white'>
        <div className='flex items-center'>
          <h2 className='text-2xl font-bold mr-4'>Danh sách sản phẩm</h2>
          <div className='text-slate-500 text-sm'>(Có {total} sản phẩm)</div>
        </div>
        <Link
          to={PATH.DASHBOARD_PRODUCT_CREATE}
          className='bg-blue-700 text-white text-sm rounded p-2 flex items-center'
        >
          <PlusIcon className='w-4 h-4 mr-2 stroke-[3]' />
          Tạo mới
        </Link>
      </div>
      <div className='p-4 pb-10 bg-white rounded flex justify-between items-center'>
        <div className='flex'>
          <div className='mr-2 relative'>
            <input
              type='text'
              className='border border-[#cfcfcf] rounded outline-none pl-3 pr-5 text-sm h-full'
              placeholder='Từ khóa tìm kiếm'
              onChange={(e) => setKeywordSearch(e.target.value)}
            />
          </div>
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
        data={extendedProducts}
        columns={[
          {
            field: 'checkbox',
            headerName: <Checkbox onChange={handleCheckAll} checked={isAllChecked} />,
            width: 5
          },
          {
            field: 'productName',
            headerName: 'Tên sản phẩm',
            width: 25
          },
          {
            field: 'price',
            headerName: 'Giá gốc',
            width: 10
          },
          {
            field: 'priceAfterDiscount',
            headerName: 'Giảm còn',
            width: 10
          },
          {
            field: 'category',
            headerName: 'Danh mục',
            width: 10
          },
          {
            field: 'brand',
            headerName: 'Nhãn hiệu',
            width: 10
          },
          {
            field: 'createdAt',
            headerName: 'Tạo lúc',
            width: 10
          },
          {
            field: 'updatedAt',
            headerName: 'Cập nhật',
            width: 10
          },
          {
            field: 'actions',
            headerName: 'Thao tác',
            width: 10
          }
        ]}
        rows={
          extendedProducts?.map((product, index) => ({
            checkbox: <Checkbox onChange={handleCheckOne(index)} checked={product.checked} />,
            productName: product.name_vi,
            price: formatCurrency(product.price),
            priceAfterDiscount: formatCurrency(product.price_after_discount),
            category: product.category?.name_vi as string,
            brand: product.brand?.name as string,
            createdAt: moment(product.created_at).fromNow(),
            updatedAt: moment(product.updated_at).fromNow(),
            actions: (
              <TableAction
                editPath={`${PATH.DASHBOARD_PRODUCT_UPDATE_WITHOUT_ID}/${product._id}`}
                deleteMethod={() => startDelete(product._id)}
              />
            )
          })) || []
        }
        pageSize={pageSize || 0}
        isLoading={getProductsQuery.isLoading}
        tableFootLeft={
          checkedProducts.length > 0 && (
            <button
              className='font-medium text-sm text-white bg-red-600/90 rounded py-1 px-4 mr-4 hover:bg-red-600'
              onClick={() => startDelete()}
            >
              Xóa {checkedProducts.length} mục đã chọn
            </button>
          )
        }
      />
      {/* Modal */}
      <Modal isVisible={isOpenModal} onCancel={stopDelete} onOk={handleDelete}>
        {currentId
          ? 'Bạn có chắc muốn xóa sản phẩm này'
          : `Bạn có chắc muốn xóa ${checkedProducts.length} sản phẩm đã chọn`}
      </Modal>
    </Fragment>
  );
};

export default List;
