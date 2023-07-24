import { useMutation } from '@tanstack/react-query';
import { Fragment, useContext, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import CreateAddress from 'src/components/CreateAddress';
import { PlusIcon } from 'src/components/Icons';
import Modal from 'src/components/Modal';
import { AppContext } from 'src/contexts/app.context';
import userApi from 'src/apis/user.api';

const Address = () => {
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState<boolean>(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const { profile, setProfile } = useContext(AppContext);

  const addresses = useMemo(() => profile?.addresses, [profile]);
  const defaultAddress = useMemo(() => addresses?.find((address) => address.isDefault), [profile]);

  const startAddAddress = () => {
    setAddModalOpen(true);
  };

  const stopAddAddress = () => {
    setAddModalOpen(false);
  };

  const startDelete = (addressId: string) => {
    setDeleteConfirmModalOpen(true);
    setCurrentId(addressId);
  };

  const stopDelete = () => {
    setDeleteConfirmModalOpen(false);
    currentId && setCurrentId(null);
  };

  // Xóa địa chỉ
  const deleteAddressMutation = useMutation({
    mutationFn: userApi.deleteAddress,
    onSuccess: (data) => {
      toast.success(data.data.message);
      setProfile(data.data.data.user);
      stopDelete();
    }
  });

  const setDefaultAddressMutation = useMutation({
    mutationFn: userApi.setDefaultAddress,
    onSuccess: (data) => {
      setProfile(data.data.data.user);
    }
  });

  // Đặt địa chỉ thành mặc định
  const setDefaultAddress = (addressId: string) => {
    setDefaultAddressMutation.mutate(addressId);
  };

  const handleDeleteAddress = () => {
    if (currentId && currentId !== defaultAddress?._id) {
      deleteAddressMutation.mutate(currentId);
    } else {
      toast.error('Không thể xóa địa chỉ mặc định');
      stopDelete();
    }
  };

  return (
    <Fragment>
      <div className='py-4 px-6 flex justify-between items-center'>
        <h2 className='text-2xl font-semibold'>Sổ địa chỉ</h2>
        <button
          className='flex items-center bg-[#005EC9] rounded py-2 px-3 hover:bg-[#005EC9]/90'
          onClick={startAddAddress}
        >
          <PlusIcon className='w-3 h-3 stroke-white mr-1' />
          <span className='text-sm text-white'>Thêm địa chỉ mới</span>
        </button>
      </div>
      {addresses && addresses.length > 0 && (
        <div className='px-6 py-4'>
          {addresses.map((address) => (
            <div key={address._id} className='py-3 border-b border-[#cfcfcf] flex justify-between items-center'>
              <div className='flex items-center'>
                {address.isDefault ? (
                  <span className='py-1 px-2 text-sm border border-primary rounded text-primary mr-4'>Mặc định</span>
                ) : (
                  <button
                    className='mr-4 text-sm border border-[#cfcfcf] rounded py-1 px-2 text-slate-500'
                    onClick={() => setDefaultAddress(address._id)}
                  >
                    Đặt làm mặc định
                  </button>
                )}
                <div className='text-slate-700 capitalize'>
                  {address.street}, {address.ward}, {address.district}, {address.province}
                </div>
              </div>
              <div className='flex items-center'>
                <button className='text-sm font-semibold text-[#005EC9]'>Sửa</button>
                <div className='h-4 w-[1px] bg-slate-300 mx-[6px]' />
                <button className='text-sm font-semibold text-primary' onClick={() => startDelete(address._id)}>
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className='px-4 py-2 bg-yellow-100 text-sm font-medium inline-block mx-6 rounded'>
        Nếu địa chỉ nhận hàng chưa chính xác, vui lòng kiểm tra và cập nhật. Mỗi tài khoản chỉ được tạo tối đa 3 địa chỉ
      </div>
      <Modal
        name='Thêm địa chỉ'
        isVisible={addModalOpen}
        onCancel={stopAddAddress}
        cancelButton={false}
        okButton={false}
      >
        <CreateAddress onSuccess={stopAddAddress} />
      </Modal>
      <Modal isVisible={deleteConfirmModalOpen} onCancel={stopDelete} onOk={handleDeleteAddress}>
        Bạn có chắc muốn xóa địa chỉ này
      </Modal>
    </Fragment>
  );
};

export default Address;
