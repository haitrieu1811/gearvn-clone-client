import { useMutation, useQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { Fragment, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import addressApi from 'src/apis/address.api';

import Alert from 'src/components/Alert';
import CreateAddress from 'src/components/CreateAddress';
import { EmptyImage, PlusIcon } from 'src/components/Icons';
import Modal from 'src/components/Modal';
import { OnlyMessageResponse } from 'src/types/utils.type';

const Address = () => {
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState<boolean>(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isUpdateMode, setIsUpdateMode] = useState<boolean>(false);

  // Lấy danh sách địa chỉ
  const getAddressesQuery = useQuery({
    queryKey: ['addresses'],
    queryFn: () => addressApi.getAddresses()
  });

  // Danh sách địa chỉ
  const addresses = useMemo(
    () => getAddressesQuery.data?.data.data.addresses,
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
      getAddressesQuery.refetch();
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

  // Thiết lập địa chỉ mặc định
  const setDefaultAddressMutation = useMutation({
    mutationFn: addressApi.setDefaultAddress,
    onSuccess: () => {
      getAddressesQuery.refetch();
    }
  });

  // Xử lý đặt địa chỉ thành mặc định
  const setDefaultAddress = (addressId: string) => {
    setDefaultAddressMutation.mutate(addressId);
  };

  return (
    <div className='bg-white rounded shadow-sm pb-10'>
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
      <div className='py-4 px-4 md:px-6 flex justify-between items-center'>
        <h2 className='text-xl md:text-2xl font-semibold'>Sổ địa chỉ</h2>
        <button
          className='flex items-center bg-[#005EC9] rounded py-[6px] md:py-2 px-2 md:px-3 hover:bg-[#005EC9]/90'
          onClick={startAdd}
        >
          <PlusIcon className='w-3 h-3 stroke-white mr-1' />
          <span className='text-xs md:text-sm text-white'>Thêm địa chỉ mới</span>
        </button>
      </div>
      {/* Khi đã có địa chỉ */}
      {addresses && addresses.length > 0 && !getAddressesQuery.isLoading && (
        <Fragment>
          <div className='px-2 md:px-6 py-4'>
            {addresses.map((address) => (
              <div key={address._id} className='py-3 border-b border-[#cfcfcf] flex justify-between items-center'>
                <div className='flex items-center'>
                  {address.is_default ? (
                    <span className='py-1 px-2 whitespace-nowrap text-xs md:text-sm border border-primary rounded text-primary mr-4'>
                      Mặc định
                    </span>
                  ) : (
                    <button
                      className='mr-4 whitespace-nowrap text-xs md:text-sm border border-[#cfcfcf] rounded py-1 px-1 md:px-2 text-slate-500'
                      onClick={() => setDefaultAddress(address._id)}
                    >
                      Thiết lập mặc định
                    </button>
                  )}
                  <div className='text-slate-700 capitalize text-xs md:text-base'>
                    {address.street}, {address.ward}, {address.district}, {address.province}
                  </div>
                </div>
                <div className='flex items-center ml-2 md:ml-4'>
                  <button className='text-sm font-semibold text-[#005EC9]' onClick={() => startUpdate(address._id)}>
                    Sửa
                  </button>
                  <div className='h-4 w-[1px] bg-slate-300 mx-1' />
                  <button className='text-sm font-semibold text-primary' onClick={() => startDelete(address._id)}>
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
          <Alert>
            Nếu địa chỉ nhận hàng chưa chính xác, vui lòng kiểm tra và cập nhật. Mỗi tài khoản chỉ được tạo tối đa 3 địa
            chỉ
          </Alert>
        </Fragment>
      )}
      {/* Khi chưa có địa chỉ nào */}
      {addresses && addresses.length <= 0 && !getAddressesQuery.isLoading && (
        <div className='flex justify-center items-center flex-col mt-10'>
          <EmptyImage />
          <p className='text-center mt-4'>Chưa có địa chỉ nào</p>
        </div>
      )}
      <Modal
        icon={false}
        name={!isUpdateMode ? 'Thêm địa chỉ' : 'Cập nhật địa chỉ'}
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
                  getAddressesQuery.refetch();
                }
              : () => {
                  stopAdd();
                  getAddressesQuery.refetch();
                }
          }
          currentId={isUpdateMode ? currentId : null}
        />
      </Modal>
      <Modal
        name='Xác nhận xóa địa chỉ'
        isVisible={deleteConfirmModalOpen}
        onCancel={stopDelete}
        onOk={handleDeleteAddress}
      >
        <div className='text-center text-slate-600'>
          <div>Bạn có chắc muốn xóa địa chỉ này</div>
          <div className='my-2'>khỏi danh sách địa chỉ nhận hàng của bạn ?</div>
          <div className='font-semibold text-red-500 underline'>Địa chỉ này sẽ bị xóa vĩnh viễn</div>
        </div>
      </Modal>
    </div>
  );
};

export default Address;
