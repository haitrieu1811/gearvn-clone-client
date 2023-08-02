import { useMutation } from '@tanstack/react-query';
import { useContext, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import userApi from 'src/apis/user.api';
import CreateAddress from 'src/components/CreateAddress';
import { PlusIcon } from 'src/components/Icons';
import Modal from 'src/components/Modal';
import { AppContext } from 'src/contexts/app.context';

const Address = () => {
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState<boolean>(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isUpdateMode, setIsUpdateMode] = useState<boolean>(false);
  const { profile, setProfile } = useContext(AppContext);

  const addresses = useMemo(() => profile?.addresses, [profile]);
  const defaultAddress = useMemo(() => addresses?.find((address) => address.isDefault), [profile]);

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
    mutationFn: userApi.deleteAddress,
    onSuccess: (data) => {
      toast.success(data.data.message);
      setProfile(data.data.data.user);
      stopDelete();
    }
  });
  const handleDeleteAddress = () => {
    if (currentId && currentId !== defaultAddress?._id) {
      deleteAddressMutation.mutate(currentId);
    } else {
      toast.error('Không thể xóa địa chỉ mặc định');
      stopDelete();
    }
  };

  // Đặt địa chỉ thành mặc định
  const setDefaultAddressMutation = useMutation({
    mutationFn: userApi.setDefaultAddress,
    onSuccess: (data) => {
      setProfile(data.data.data.user);
    }
  });
  const setDefaultAddress = (addressId: string) => {
    setDefaultAddressMutation.mutate(addressId);
  };

  return (
    <div className='bg-white rounded shadow-sm pb-10'>
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
      {addresses && addresses.length > 0 && (
        <div className='px-2 md:px-6 py-4'>
          {addresses.map((address) => (
            <div key={address._id} className='py-3 border-b border-[#cfcfcf] flex justify-between items-center'>
              <div className='flex items-center'>
                {address.isDefault ? (
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
                <button className='text-xs font-semibold text-[#005EC9]' onClick={() => startUpdate(address._id)}>
                  Sửa
                </button>
                <div className='h-4 w-[1px] bg-slate-300 mx-1' />
                <button className='text-xs font-semibold text-primary' onClick={() => startDelete(address._id)}>
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className='px-4 py-2 bg-yellow-100 text-xs md:text-sm font-medium inline-block mx-2 md:mx-6 rounded'>
        Nếu địa chỉ nhận hàng chưa chính xác, vui lòng kiểm tra và cập nhật. Mỗi tài khoản chỉ được tạo tối đa 3 địa chỉ
      </div>
      <Modal
        name={!isUpdateMode ? 'Thêm địa chỉ' : 'Cập nhật địa chỉ'}
        isVisible={addModalOpen}
        onCancel={!isUpdateMode ? stopAdd : stopUpdate}
        cancelButton={false}
        okButton={false}
      >
        <CreateAddress onSuccess={isUpdateMode ? stopUpdate : stopAdd} currentId={isUpdateMode ? currentId : null} />
      </Modal>
      <Modal isVisible={deleteConfirmModalOpen} onCancel={stopDelete} onOk={handleDeleteAddress}>
        Bạn có chắc muốn xóa địa chỉ này
      </Modal>
    </div>
  );
};

export default Address;
