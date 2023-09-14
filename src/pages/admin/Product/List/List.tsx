import { useMutation, useQuery } from '@tanstack/react-query';
import { produce } from 'immer';
import isUndefined from 'lodash/isUndefined';
import keyBy from 'lodash/keyBy';
import omitBy from 'lodash/omitBy';
import moment from 'moment';
import { ChangeEvent, Fragment, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import productApi from 'src/apis/product.api';
import Checkbox from 'src/components/Checkbox';
import ContextMenu from 'src/components/ContextMenu';
import { PencilIcon, TrashIcon } from 'src/components/Icons';
import Modal from 'src/components/Modal/Modal';
import Table from 'src/components/Table';
import PATH from 'src/constants/path';
import { AppContext } from 'src/contexts/app.context';
import useDebounce from 'src/hooks/useDebounce';
import UseQueryParams from 'src/hooks/useQueryParams';
import { GetProductsRequestParams } from 'src/types/product.type';
import { convertMomentFromNowToVietnamese, formatCurrency } from 'src/utils/utils';

type QueryConfig = {
  [key in keyof GetProductsRequestParams]: string;
};

const List = () => {
  const navigate = useNavigate();
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [keywordSearch, setKeywordSearch] = useState<string>('');
  const keywordSearchDebounce = useDebounce(keywordSearch, 1000);
  const { extendedProducts, setExtendedProducts } = useContext(AppContext);
  const queryParams: QueryConfig = UseQueryParams();
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || 1,
      limit: queryParams.limit || 20,
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
      <Table
        tableName='Danh sách sản phẩm'
        addNewPath={PATH.DASHBOARD_PRODUCT_CREATE}
        data={extendedProducts}
        totalRows={total || 0}
        columns={[
          {
            field: 'checkbox',
            headerName: <Checkbox onChange={handleCheckAll} checked={isAllChecked} />,
            width: 5
          },
          {
            field: 'productName',
            headerName: 'Tên sản phẩm',
            width: 30
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
            headerName: '',
            width: 5
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
            createdAt: convertMomentFromNowToVietnamese(moment(product.created_at).fromNow()),
            updatedAt: convertMomentFromNowToVietnamese(moment(product.updated_at).fromNow()),
            actions: (
              <ContextMenu
                items={[
                  {
                    icon: <PencilIcon className='w-4 h-4 mr-3' />,
                    label: 'Cập nhật sản phẩm',
                    onClick: () => navigate(`${PATH.DASHBOARD_PRODUCT_UPDATE_WITHOUT_ID}/${product._id}`)
                  },
                  {
                    icon: <TrashIcon className='w-4 h-4 mr-3' />,
                    label: 'Xóa sản phẩm',
                    onClick: () => startDelete(product._id)
                  }
                ]}
              />
            )
          })) || []
        }
        pageSize={pageSize || 0}
        isLoading={getProductsQuery.isLoading}
        onSearch={(value) => setKeywordSearch(value)}
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
      <Modal name='Xác nhận xóa sản phẩm' isVisible={isOpenModal} onCancel={stopDelete} onOk={handleDelete}>
        <div className='text-center leading-loose'>
          <div>
            {currentId
              ? 'Bạn có chắc muốn xóa sản phẩm này?'
              : `Bạn có chắc muốn xóa ${checkedProducts.length} sản phẩm đã chọn?`}
          </div>
          <div className='font-medium text-red-500 underline mt-2'>
            Sản phẩm sẽ bị xóa vĩnh viễn và không thể khôi phục.
          </div>
        </div>
      </Modal>
    </Fragment>
  );
};

export default List;
