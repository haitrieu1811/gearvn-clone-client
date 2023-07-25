import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useContext, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import userApi from 'src/apis/user.api';
import { AddressType } from 'src/constants/enum';
import { AppContext } from 'src/contexts/app.context';
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
  const { profile, setProfile } = useContext(AppContext);

  const getAddressQuery = useQuery({
    queryKey: ['address', currentId],
    queryFn: () => userApi.getAddress(currentId as string),
    enabled: Boolean(currentId)
  });

  const address = useMemo(() => getAddressQuery.data?.data.data.address, [getAddressQuery.data?.data.data.address]);
  const isDefault = useMemo(() => profile && profile?.addresses.length === 0, [profile]);

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

  useEffect(() => {
    if (address) {
      setValue('district', address.district);
      setValue('province', address.province);
      setValue('ward', address.ward);
      setValue('street', address.street);
      setValue('type', address.type);
    }
  }, [address, setValue]);

  const type = watch('type');

  // Thêm địa chỉ
  const addAddressMutation = useMutation({
    mutationFn: userApi.addAddress,
    onSuccess: (data) => {
      toast.success(data.data.message);
      reset();
      onSuccess && onSuccess();
      setProfile(data.data.data.user);
    },
    onError: (error) => {
      if (isAxiosError<OnlyMessageResponse>(error)) {
        toast.error(error.response?.data.message);
      }
    }
  });

  // Cập nhật địa chỉ
  const updateAddressMutation = useMutation({
    mutationFn: userApi.updateAddress,
    onSuccess: (data) => {
      toast.success(data.data.message);
      setProfile(data.data.data.user);
      onSuccess && onSuccess();
    }
  });

  const onSubmit = handleSubmit((data) => {
    if (!Boolean(currentId)) {
      addAddressMutation.mutate({
        ...data,
        isDefault: isDefault as boolean
      });
    } else {
      if (address) {
        updateAddressMutation.mutate({
          body: {
            ...data,
            isDefault: address.isDefault
          },
          addressId: address._id
        });
      }
    }
  });

  return (
    <form onSubmit={onSubmit}>
      <div className='px-3'>
        <h3 className='font-medium mb-2'>Địa chỉ</h3>
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
        <h3 className='font-medium mb-2'>Loại địa chỉ</h3>
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
              className='border border-[#cfcfcf] rounded py-2 px-4 text-base cursor-pointer text-slate-700 peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary peer-checked:font-medium'
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
              className='border border-[#cfcfcf] rounded py-2 px-4 text-base cursor-pointer text-slate-700 peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary peer-checked:font-medium'
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
