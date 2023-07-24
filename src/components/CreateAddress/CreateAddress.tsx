import { yupResolver } from '@hookform/resolvers/yup';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { useMutation } from '@tanstack/react-query';
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
}

const CreateAddress = ({ onSuccess }: CreateAddressProps) => {
  const { setProfile } = useContext(AppContext);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(addAddressSchema)
  });

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

  const onSubmit = handleSubmit((data) => {
    addAddressMutation.mutate(data);
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
              value={AddressType.Office}
              className='peer appearance-none'
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
              value={AddressType.Home}
              className='peer appearance-none'
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
        <Button classNameWrapper='mt-6' isLoading={addAddressMutation.isLoading}>
          Hoàn thành
        </Button>
      </div>
    </form>
  );
};

export default CreateAddress;
