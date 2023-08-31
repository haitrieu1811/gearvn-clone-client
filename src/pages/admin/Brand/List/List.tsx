import { useMutation, useQuery } from '@tanstack/react-query';
import { produce } from 'immer';
import isUndefined from 'lodash/isUndefined';
import omitBy from 'lodash/omitBy';
import moment from 'moment';
import { ChangeEvent, Fragment, useContext, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import brandApi from 'src/apis/brand.api';
import Checkbox from 'src/components/Checkbox';
import { SearchIcon } from 'src/components/Icons';
import Modal from 'src/components/Modal';
import Table from 'src/components/Table';
import TableAction from 'src/components/Table/TableAction';
import PATH from 'src/constants/path';
import { AppContext } from 'src/contexts/app.context';
import UseQueryParams from 'src/hooks/useQueryParams';
import { GetBrandsRequestParams } from 'src/types/brand.type';

type QueryConfig = {
  [key in keyof GetBrandsRequestParams]: string;
};

const List = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const { extendedBrands, setExtendedBrands } = useContext(AppContext);
  const queryParams: QueryConfig = UseQueryParams();
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || 1,
      limit: queryParams.limit || 10
    },
    isUndefined
  );

  // Lấy danh sách nhãn hiệu
  const getBrandsQuery = useQuery({
    queryKey: ['brands', queryConfig],
    queryFn: () => brandApi.getList(queryConfig)
  });

  // Xóa nhãn hiệu
  const deleteBrandMutation = useMutation({
    mutationFn: brandApi.delete,
    onSuccess: (data) => {
      toast.success(data.data.message);
      setModalVisible(false);
      getBrandsQuery.refetch();
    }
  });

  // Danh sách nhãn hiệu
  const brands = useMemo(() => getBrandsQuery.data?.data.data.brands, [getBrandsQuery.data?.data.data.brands]);
  // Tổng số nhãn hiệu
  const pageSize = useMemo(
    () => getBrandsQuery.data?.data.data.pagination.page_size,
    [getBrandsQuery.data?.data.data.pagination.page_size]
  );
  // Danh sách nhãn hiệu đã chọn
  const checkedBrands = useMemo(() => extendedBrands.filter((brand) => brand.checked), [extendedBrands]);
  const isAllChecked = extendedBrands.every((brand) => brand.checked);

  // Cập nhật danh sách nhãn hiệu
  useEffect(() => {
    if (brands) {
      setExtendedBrands(() =>
        brands.map((brand) => ({
          ...brand,
          checked: false
        }))
      );
    }
  }, [brands]);

  // Bắt đầu xóa
  const startDelete = (brandId?: string) => {
    setModalVisible(true);
    brandId && setCurrentId(brandId);
  };

  // Dừng xóa
  const stopDelete = () => {
    setModalVisible(false);
    setCurrentId(null);
  };

  // Xác nhận xóa
  const handleDelete = () => {
    if (currentId) deleteBrandMutation.mutate([currentId]);
    else deleteBrandMutation.mutate(checkedBrands.map((brand) => brand._id));
  };

  // Check 1 nhãn hiệu
  const handleCheckOne = (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
    setExtendedBrands(
      produce((draft) => {
        draft[index].checked = e.target.checked;
      })
    );
  };

  // Check tất cả nhãn hiệu
  const handleCheckAll = () => {
    setExtendedBrands((prevState) => prevState.map((brand) => ({ ...brand, checked: !isAllChecked })));
  };

  return (
    <Fragment>
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
          to={PATH.DASHBOARD_BRAND_CREATE}
          className='px-2 py-[6px] rounded bg-blue-600 flex justify-center items-center'
        >
          <span className='text-white text-sm font-medium'>Tạo mới</span>
        </Link>
      </div>
      <Table
        data={extendedBrands}
        columns={[
          {
            headerName: <Checkbox checked={isAllChecked} onChange={handleCheckAll} />,
            field: 'checkbox',
            width: 5
          },
          {
            headerName: 'Nhãn hiệu',
            field: 'name',
            width: 30
          },
          {
            headerName: 'Tạo lúc',
            field: 'createdAt',
            width: 25
          },
          {
            headerName: 'Cập nhật',
            field: 'updatedAt',
            width: 25
          },
          {
            headerName: 'Thao tác',
            field: 'actions',
            width: 15
          }
        ]}
        rows={extendedBrands.map((brand, index) => ({
          checkbox: <Checkbox checked={brand.checked} onChange={handleCheckOne(index)} />,
          name: brand.name,
          createdAt: moment(brand.created_at).fromNow(),
          updatedAt: moment(brand.updated_at).fromNow(),
          actions: (
            <TableAction
              editPath={`${PATH.DASHBOARD_BRAND_UPDATE_WITHOUT_ID}/${brand._id}`}
              deleteMethod={() => startDelete(brand._id)}
            />
          )
        }))}
        pageSize={pageSize || 0}
        isLoading={getBrandsQuery.isLoading}
        tableFootLeft={
          checkedBrands.length > 0 && (
            <button
              className='font-medium text-sm text-white bg-red-600/90 rounded py-1 px-4 mr-4 hover:bg-red-600'
              onClick={() => startDelete()}
            >
              Xóa {checkedBrands.length} mục đã chọn
            </button>
          )
        }
      />
      <Modal isVisible={modalVisible} onOk={handleDelete} onCancel={stopDelete}>
        Bạn có chắc muốn xóa nhãn hiệu này
      </Modal>
    </Fragment>
  );
};

export default List;
