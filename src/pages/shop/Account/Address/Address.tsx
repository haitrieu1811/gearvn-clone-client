import { useMutation, useQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { Fragment, useContext, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';

import addressApi from 'src/apis/address.api';
import Alert from 'src/components/Alert';
import ContextMenu from 'src/components/ContextMenu';
import CreateAddress from 'src/components/CreateAddress';
import { EmptyImage, PencilIcon, PlusIcon, TrashIcon } from 'src/components/Icons';
import Loading from 'src/components/Loading';
import Modal from 'src/components/Modal';
import { AppContext } from 'src/contexts/app.context';
import { OnlyMessageResponse } from 'src/types/utils.type';

const Address = () => {
  const { profile } = useContext(AppContext);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState<boolean>(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isUpdateMode, setIsUpdateMode] = useState<boolean>(false);

  // Query: Lấy danh sách địa chỉ
  const getAddressesQuery = useQuery({
    queryKey: ['addresses', profile?._id],
    queryFn: () => addressApi.getAddresses(),
    enabled: !!profile?._id
  });

  // Mutation: Thiết lập địa chỉ mặc định
  const setDefaultAddressMutation = useMutation({
    mutationFn: addressApi.setDefaultAddress,
    onSuccess: () => {
      getAddressesQuery?.refetch();
    }
  });

  // Danh sách địa chỉ
  const addresses = useMemo(
    () => getAddressesQuery.data?.data.data.addresses || [],
    [getAddressesQuery.data?.data.data.addresses]
  );

  // Bắt đầu thêm
  const startAdd = () => {
    setAddModalOpen(true);
  };

  // Dừng thêm
  const stopAdd = () => {
    setAddModalOpen(false);
  };

  // Bắt đầu xóa
  const startDelete = (addressId: string) => {
    setDeleteConfirmModalOpen(true);
    setCurrentId(addressId);
  };

  // Dừng xóa
  const stopDelete = () => {
    setDeleteConfirmModalOpen(false);
    currentId && setCurrentId(null);
  };

  // Bắt đầu cập nhật
  const startUpdate = (addressId: string) => {
    setAddModalOpen(true);
    setIsUpdateMode(true);
    setCurrentId(addressId);
  };

  // Dừng cập nhật
  const stopUpdate = () => {
    setAddModalOpen(false);
    setIsUpdateMode(false);
    setCurrentId(null);
  };

  // Xóa địa chỉ
  const deleteAddressMutation = useMutation({
    mutationFn: addressApi.deleteAddress,
    onSuccess: (data) => {
      toast.success(data.data.message);
      getAddressesQuery?.refetch();
      stopDelete();
    },
    onError: (error) => {
      if (isAxiosError<OnlyMessageResponse>(error)) toast.error(error.response?.data.message);
      stopDelete();
    }
  });

  // Xử lý xóa địa chỉ
  const handleDeleteAddress = () => {
    if (currentId) deleteAddressMutation.mutate(currentId);
  };

  // Xử lý đặt địa chỉ thành mặc định
  const setDefaultAddress = (addressId: string) => {
    setDefaultAddressMutation.mutate(addressId, {
      onSuccess: () => {
        getAddressesQuery?.refetch();
      }
    });
  };

  return (
    <Fragment>
      <Helmet>
        <title>Danh sách địa chỉ</title>
        <meta
          name='description'
          content='Danh sách địa chỉ nhận hàng của bạn. Bạn có thể thêm, sửa, xóa địa chỉ tại đây'
        />
        <meta property='og:title' content='Danh sách địa chỉ nhận hàng của bạn' />
        <meta
          property='og:description'
          content='Danh sách địa chỉ nhận hàng của bạn. Bạn có thể thêm, sửa, xóa địa chỉ tại đây'
        />
        <meta property='og:url' content={window.location.href} />
        <meta property='og:site_name' content='Danh sách địa chỉ nhận hàng' />
        <meta property='og:type' content='website' />
      </Helmet>

      <div className='bg-white rounded shadow-sm pb-10'>
        <div className='py-4 px-4 md:px-6 flex justify-between items-center'>
          <h2 className='text-xl md:text-2xl font-semibold'>Sổ địa chỉ</h2>
          <button
            className='flex items-center bg-[#005EC9] rounded py-[6px] md:py-2 px-2 md:px-3 hover:bg-[#005EC9]/90'
            onClick={startAdd}
          >
            <PlusIcon className='w-3 h-3 stroke-white stroke-[3.5] mr-2' />
            <span className='text-sm text-white'>Thêm địa chỉ mới</span>
          </button>
        </div>

        {/* Khi đã có địa chỉ */}
        {addresses && addresses.length > 0 && !getAddressesQuery?.isLoading && (
          <div className='lg:min-h-[280px] flex flex-col justify-between'>
            <div className='px-2 md:px-6 py-4'>
              {addresses.map((address) => (
                <div key={address._id} className='py-3 border-b border-[#cfcfcf] flex justify-between items-center'>
                  <div className='flex items-center'>
                    {address.is_default ? (
                      <span className='py-1 px-2 whitespace-nowrap text-sm border border-primary rounded text-primary mr-4'>
                        Mặc định
                      </span>
                    ) : (
                      <button
                        className='mr-4 whitespace-nowrap text-sm border border-[#cfcfcf] rounded py-1 px-1 md:px-2 text-slate-500'
                        onClick={() => setDefaultAddress(address._id)}
                      >
                        Thiết lập mặc định
                      </button>
                    )}
                    <div className='text-slate-700 capitalize text-sm md:text-base'>
                      {address.street}, {address.ward}, {address.district}, {address.province}
                    </div>
                  </div>
                  <ContextMenu
                    wrapperClassName='ml-4'
                    items={[
                      {
                        icon: <PencilIcon className='w-4 h-4 mr-3' />,
                        label: 'Cập nhật địa chỉ',
                        onClick: () => startUpdate(address._id)
                      },
                      {
                        icon: <TrashIcon className='w-4 h-4 mr-3' />,
                        label: 'Xóa địa chỉ',
                        onClick: () => startDelete(address._id)
                      }
                    ]}
                  />
                </div>
              ))}
            </div>
            <Alert>Nếu địa chỉ nhận hàng chưa chính xác, vui lòng kiểm tra và cập nhật.</Alert>
          </div>
        )}

        {/* Khi chưa có địa chỉ nào */}
        {addresses && addresses.length <= 0 && !getAddressesQuery?.isLoading && (
          <div className='flex justify-center items-center flex-col mt-10'>
            <EmptyImage />
            <p className='text-center mt-4'>Chưa có địa chỉ nào</p>
          </div>
        )}

        {/* Loading */}
        {getAddressesQuery?.isLoading && (
          <div className='min-h-[300px] flex justify-center items-center'>
            <Loading />
          </div>
        )}

        {/* Modal thêm, sửa địa chỉ */}
        <Modal
          icon={false}
          name={!isUpdateMode ? 'THÊM ĐỊA CHỈ' : 'CẬP NHẬT ĐỊA CHỈ'}
          isVisible={addModalOpen}
          onCancel={!isUpdateMode ? stopAdd : stopUpdate}
          cancelButton={false}
          okButton={false}
          paddingBody={false}
        >
          <CreateAddress
            onSuccess={
              isUpdateMode
                ? () => {
                    stopUpdate();
                    getAddressesQuery?.refetch();
                  }
                : () => {
                    stopAdd();
                    getAddressesQuery?.refetch();
                  }
            }
            currentId={isUpdateMode ? currentId : null}
          />
        </Modal>

        {/* Modal xác nhận xóa địa chỉ */}
        <Modal
          name='Xác nhận xóa địa chỉ'
          isVisible={deleteConfirmModalOpen}
          onCancel={stopDelete}
          onOk={handleDeleteAddress}
        >
          <div className='text-center text-slate-600 text-sm md:text-base'>
            <div>Bạn có chắc muốn xóa địa chỉ này</div>
            <div className='my-2'>khỏi danh sách địa chỉ nhận hàng của bạn ?</div>
            <div className='font-semibold text-red-500 underline'>Địa chỉ này sẽ bị xóa vĩnh viễn</div>
          </div>
        </Modal>
      </div>
    </Fragment>
  );
};

export default Address;
