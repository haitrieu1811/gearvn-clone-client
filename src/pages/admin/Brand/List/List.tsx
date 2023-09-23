import { produce } from 'immer';
import moment from 'moment';
import { ChangeEvent, Fragment, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Checkbox from 'src/components/Checkbox';
import ContextMenu from 'src/components/ContextMenu';
import { PencilIcon, TrashIcon } from 'src/components/Icons';
import Modal from 'src/components/Modal';
import Table from 'src/components/Table';
import PATH from 'src/constants/path';
import { AppContext } from 'src/contexts/app.context';
import useBrand from 'src/hooks/useBrand';
import UseQueryParams from 'src/hooks/useQueryParams';
import { PaginationRequestParams } from 'src/types/utils.type';
import { convertMomentFromNowToVietnamese } from 'src/utils/utils';

type QueryConfig = {
  [key in keyof PaginationRequestParams]: string;
};

const List = () => {
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const { extendedBrands, setExtendedBrands } = useContext(AppContext);
  const queryParams: QueryConfig = UseQueryParams();
  const queryConfig: QueryConfig = {
    page: queryParams.page || '1',
    limit: queryParams.limit || '10'
  };
  const { brands, brandsPageSize, getBrandsQuery, deleteBrandMutation } = useBrand(queryConfig);

  // Danh sách nhãn hiệu đã chọn
  const checkedBrands = useMemo(() => extendedBrands.filter((brand) => brand.checked), [extendedBrands]);

  // Kiểm tra tất cả nhãn hiệu đã được check hay chưa
  const isAllChecked = extendedBrands.every((brand) => brand.checked);

  // Cập nhật danh sách nhãn hiệu (có thêm trường checked)
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
    if (currentId) {
      deleteBrandMutation.mutate([currentId], {
        onSuccess: (data) => {
          toast.success(data.data.message);
          setModalVisible(false);
          getBrandsQuery.refetch();
        }
      });
    } else {
      deleteBrandMutation.mutate(
        checkedBrands.map((brand) => brand._id),
        {
          onSuccess: (data) => {
            toast.success(data.data.message);
            setModalVisible(false);
            getBrandsQuery.refetch();
          }
        }
      );
    }
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
      <Table
        tableName='Danh sách nhãn hiệu'
        totalRows={getBrandsQuery.data?.data.data.pagination.total || 0}
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
            headerName: 'Người tạo',
            field: 'authorName',
            width: 15
          },
          {
            headerName: 'Số sản phẩm',
            field: 'productCount',
            width: 15
          },
          {
            headerName: 'Tạo lúc',
            field: 'createdAt',
            width: 15
          },
          {
            headerName: 'Cập nhật',
            field: 'updatedAt',
            width: 15
          },
          {
            headerName: '',
            field: 'actions',
            width: 5
          }
        ]}
        rows={extendedBrands.map((brand, index) => ({
          checkbox: <Checkbox checked={brand.checked} onChange={handleCheckOne(index)} />,
          name: brand.name,
          authorName: brand.author.fullname,
          productCount: `${brand.product_count} sản phẩm`,
          createdAt: convertMomentFromNowToVietnamese(moment(brand.created_at).fromNow()),
          updatedAt: convertMomentFromNowToVietnamese(moment(brand.updated_at).fromNow()),
          actions: (
            <ContextMenu
              items={[
                {
                  icon: <PencilIcon className='w-4 h-4 mr-3' />,
                  label: 'Cập nhật nhãn hiệu',
                  onClick: () => navigate(`${PATH.DASHBOARD_BRAND_UPDATE_WITHOUT_ID}/${brand._id}`)
                },
                {
                  icon: <TrashIcon className='w-4 h-4 mr-3' />,
                  label: 'Xóa nhãn hiệu',
                  onClick: () => startDelete(brand._id)
                }
              ]}
            />
          )
        }))}
        pageSize={brandsPageSize}
        isLoading={getBrandsQuery.isLoading}
        addNewPath={PATH.DASHBOARD_BRAND_CREATE}
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

      <Modal name='Xác nhận xóa nhãn hiệu' isVisible={modalVisible} onOk={handleDelete} onCancel={stopDelete}>
        <div className='text-center leading-loose'>
          <div>Bạn có chắc muốn xóa nhãn hiệu này ?</div>
          <div className='font-medium text-red-500 underline'>
            Nhãn hiệu và những sản phẩm thuộc nhãn hiệu này <br /> sẽ bị xóa vĩnh viễn và không thể khôi phục.
          </div>
        </div>
      </Modal>
    </Fragment>
  );
};

export default List;
