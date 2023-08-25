import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import addressApi from 'src/apis/address.api';
import { AddressType } from 'src/constants/enum';
import { OnlyMessageResponse } from 'src/types/utils.type';
import { AddAddressSchema, addAddressSchema } from 'src/utils/rules';
import { isAxiosError } from 'src/utils/utils';
import Button from '../Button';
import Input from '../Input';

type FormData = AddAddressSchema;

interface CreateAddressProps {
  onSuccess?: () => void;
  currentId?: string | null;
}

const CreateAddress = ({ onSuccess, currentId = null }: CreateAddressProps) => {
  // Lấy địa chỉ
  const getAddressQuery = useQuery({
    queryKey: ['address', currentId],
    queryFn: () => addressApi.getAddress(currentId as string),
    enabled: Boolean(currentId)
  });

  // Địa chỉ
  const address = useMemo(() => getAddressQuery.data?.data.data.address, [getAddressQuery.data?.data.data.address]);

  // Form
  const {
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(addAddressSchema)
  });

  // Set giá trị cho form
  useEffect(() => {
    if (address) {
      setValue('district', address.district);
      setValue('province', address.province);
      setValue('ward', address.ward);
      setValue('street', address.street);
      setValue('type', address.type);
    }
  }, [address, setValue]);

  // Loại địa chỉ
  const type = watch('type');

  // Thêm địa chỉ
  const addAddressMutation = useMutation({
    mutationFn: addressApi.addAddress,
    onSuccess: (data) => {
      toast.success(data.data.message);
      onSuccess && onSuccess();
      reset();
    },
    onError: (error) => {
      if (isAxiosError<OnlyMessageResponse>(error)) {
        toast.error(error.response?.data.message);
      }
    }
  });

  // Cập nhật địa chỉ
  const updateAddressMutation = useMutation({
    mutationFn: addressApi.updateAddress,
    onSuccess: (data) => {
      toast.success(data.data.message);
      onSuccess && onSuccess();
    }
  });

  // Submit
  const onSubmit = handleSubmit((data) => {
    if (!Boolean(currentId)) {
      addAddressMutation.mutate(data);
    } else {
      if (address) {
        updateAddressMutation.mutate({
          body: data,
          address_id: address._id
        });
      }
    }
  });

  return (
    <form onSubmit={onSubmit}>
      <div className='px-3'>
        <h3 className='text-sm md:text-base font-medium mb-2'>Địa chỉ</h3>
        <div className='grid grid-cols-12 gap-3 mb-4'>
          <div className='col-span-6'>
            <Input
              type='text'
              placeholder='Tỉnh/thành phố'
              name='province'
              register={register}
              errorMessage={errors.province?.message}
            />
          </div>
          <div className='col-span-6'>
            <Input
              type='text'
              placeholder='Quận/huyện'
              name='district'
              register={register}
              errorMessage={errors.district?.message}
            />
          </div>
          <div className='col-span-6'>
            <Input
              type='text'
              placeholder='Phường/xã'
              name='ward'
              register={register}
              errorMessage={errors.ward?.message}
            />
          </div>
          <div className='col-span-6'>
            <Input
              type='text'
              placeholder='Số nhà/tên đường'
              name='street'
              register={register}
              errorMessage={errors.street?.message}
            />
          </div>
        </div>
        <h3 className='text-sm md:text-base font-medium mb-2'>Loại địa chỉ</h3>
        <div className='mt-4 flex'>
          <div>
            <input
              type='radio'
              id='office'
              className='peer appearance-none'
              checked={address ? AddressType.Office === Number(type) : undefined}
              value={AddressType.Office}
              {...register('type')}
            />
            <label
              htmlFor='office'
              className='border border-[#cfcfcf] rounded py-[6px] md:py-2 px-3 md:px-4 text-sm md:text-base cursor-pointer text-slate-700 peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary peer-checked:font-medium'
            >
              Văn phòng
            </label>
          </div>
          <div className='ml-4'>
            <input
              type='radio'
              id='home'
              className='peer appearance-none'
              checked={address ? AddressType.Home === Number(type) : undefined}
              value={AddressType.Home}
              {...register('type')}
            />
            <label
              htmlFor='home'
              className='border border-[#cfcfcf] rounded py-[6px] md:py-2 px-3 md:px-4 text-sm md:text-base cursor-pointer text-slate-700 peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary peer-checked:font-medium'
            >
              Nhà riêng
            </label>
          </div>
        </div>
        {errors.type?.message && <div className='text-sm text-red-500 mt-4'>{errors.type?.message}</div>}
        <Button
          classNameWrapper='mt-6'
          isLoading={Boolean(currentId) ? updateAddressMutation.isLoading : addAddressMutation.isLoading}
        >
          {Boolean(currentId) ? 'Cập nhật' : 'Thêm mới'}
        </Button>
      </div>
    </form>
  );
};

export default CreateAddress;
