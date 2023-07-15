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
import { PlusIcon, SearchIcon } from 'src/components/Icons';
import Modal from 'src/components/Modal';
import Table from 'src/components/Table';
import TableAction from 'src/components/Table/TableAction';
import PATH from 'src/constants/path';
import { AppContext } from 'src/contexts/app.context';
import UseQueryParams from 'src/hooks/useQueryParams';
import { GetBrandsRequestParams } from 'src/types/brand.type';
import { LIMIT_OPTIONS } from './constants';

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

  const getBrandsQuery = useQuery({
    queryKey: ['brands', queryConfig],
    queryFn: () => brandApi.getList(queryConfig)
  });

  const deleteBrandMutation = useMutation({
    mutationFn: brandApi.delete,
    onSuccess: (data) => {
      toast.success(data.data.message);
      setModalVisible(false);
      getBrandsQuery.refetch();
    }
  });

  const brands = useMemo(() => getBrandsQuery.data?.data.data.brands, [getBrandsQuery.data?.data.data.brands]);
  const pageSize = useMemo(
    () => getBrandsQuery.data?.data.data.pagination.page_size,
    [getBrandsQuery.data?.data.data.pagination.page_size]
  );
  const checkedBrands = useMemo(() => extendedBrands.filter((brand) => brand.checked), [extendedBrands]);
  const isAllChecked = extendedBrands.every((brand) => brand.checked);

  useEffect(() => {
    if (brands) {
      setExtendedBrands((prevState) =>
        brands.map((brand) => ({
          ...brand,
          checked: false
        }))
      );
    }
  }, [brands]);

  const startDelete = (brandId?: string) => {
    setModalVisible(true);
    brandId && setCurrentId(brandId);
  };

  const stopDelete = () => {
    setModalVisible(false);
    setCurrentId(null);
  };

  const handleDelete = () => {
    if (currentId) deleteBrandMutation.mutate([currentId]);
    else deleteBrandMutation.mutate(checkedBrands.map((brand) => brand._id));
    console.log('>>> checkedBrands', checkedBrands);
  };

  const handleChangeLimit = () => {};

  const handleCheck = (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
    setExtendedBrands(
      produce((draft) => {
        draft[index].checked = e.target.checked;
      })
    );
  };

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
          <PlusIcon className='w-4 h-4 stroke-white mr-2' />
          <span className='text-white text-sm font-medium'>Tạo mới</span>
        </Link>
      </div>
      <Table
        initialData={extendedBrands}
        checkedData={checkedBrands}
        columns={[1, 6, 2, 2, 1]}
        head={[
          <Checkbox checked={isAllChecked} onChange={handleCheckAll} />,
          'Nhãn hiệu',
          'Tạo lúc',
          'Cập nhật',
          'Thao tác'
        ]}
        body={extendedBrands.map((brand, index) => [
          <Checkbox checked={brand.checked} onChange={handleCheck(index)} />,
          brand.name,
          moment(brand.created_at).fromNow(),
          moment(brand.updated_at).fromNow(),
          <TableAction
            editPath={`${PATH.DASHBOARD_BRAND_UPDATE_WITHOUT_ID}/${brand._id}`}
            deleteMethod={() => startDelete(brand._id)}
          />
        ])}
        selectLimit={{
          defaultValue: '10',
          handleChangeLimit,
          options: LIMIT_OPTIONS
        }}
        pagination={{
          pageSize: (pageSize as number) || 10
        }}
        startDelete={startDelete}
      />
      <Modal isVisible={modalVisible} onOk={handleDelete} onCancel={stopDelete}>
        Bạn có chắc muốn xóa nhãn hiệu này
      </Modal>
    </Fragment>
  );
};

export default List;
