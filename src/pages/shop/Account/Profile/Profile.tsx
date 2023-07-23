import { yupResolver } from '@hookform/resolvers/yup';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import userApi from 'src/apis/user.api';
import Button from 'src/components/Button';
import DateSelect from 'src/components/DateSelect';
import { UpdateMeSchema, updateMeSchema } from 'src/utils/rules';

type FormData = UpdateMeSchema;

const Profile = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(updateMeSchema)
  });

  const getMeQuery = useQuery({
    queryKey: ['me'],
    queryFn: () => userApi.getMe()
  });

  const me = useMemo(() => getMeQuery.data?.data.data.user, [getMeQuery.data?.data.data.user]);

  useEffect(() => {
    if (me) {
      setValue('fullname', me.fullName);
      setValue('phoneNumber', me.phoneNumber);
      setValue('gender', String(me.gender));
      setValue('date_of_birth', me.date_of_birth);
    }
  }, [me]);

  const onSubmit = handleSubmit(
    (data) => {
      console.log('data', data);
    },
    (error) => {
      console.log('error', error);
    }
  );

  return (
    <form onSubmit={onSubmit}>
      {me && (
        <div className='py-4 pl-6 pr-[290px]'>
          {/* Họ tên */}
          <div className='grid grid-cols-12 gap-6'>
            <div className='col-span-4 flex items-center justify-end'>
              <label htmlFor=''>Họ tên</label>
            </div>
            <div className='col-span-8'>
              <input
                type='text'
                placeholder='Họ tên'
                className='w-full border border-[#CFCFCF] rounded h-10 px-4 outline-none'
                {...register('fullname')}
              />
            </div>
          </div>
          {/* Giới tính */}
          <div className='grid grid-cols-12 gap-6 mt-4'>
            <div className='col-span-4 flex items-center justify-end'>
              <label htmlFor=''>Giới tính</label>
            </div>
            <div className='col-span-8 flex items-center'>
              <div className='flex items-center'>
                <input type='radio' id='male' {...register('gender')} />
                <label htmlFor='male' className='ml-1 select-none'>
                  Nam
                </label>
              </div>
              <div className='flex items-center ml-4'>
                <input type='radio' id='female' {...register('gender')} />
                <label htmlFor='female' className='ml-1 select-none'>
                  Nữ
                </label>
              </div>
            </div>
          </div>
          {/* Số điện thoại */}
          <div className='grid grid-cols-12 gap-6 mt-4'>
            <div className='col-span-4 flex items-center justify-end'>
              <label htmlFor=''>Số điện thoại</label>
            </div>
            <div className='col-span-8'>
              <input
                type='text'
                placeholder='Số điện thoại'
                className='w-full border border-[#CFCFCF] rounded h-10 px-4 outline-none'
                {...register('phoneNumber')}
              />
            </div>
          </div>
          {/* Email */}
          <div className='grid grid-cols-12 gap-6 mt-4'>
            <div className='col-span-4 flex items-center justify-end'>
              <label htmlFor=''>Email</label>
            </div>
            <div className='col-span-8'>
              <input
                type='text'
                placeholder='Email'
                className='w-full border border-[#CFCFCF] rounded h-10 px-4 outline-none bg-slate-100/50 cursor-not-allowed'
                value={me.email}
                disabled
              />
            </div>
          </div>
          {/* Ngày sinh */}
          <div className='grid grid-cols-12 gap-6 mt-4'>
            <div className='col-span-4 flex items-center justify-end'>
              <label htmlFor=''>Ngày sinh</label>
            </div>
            <div className='col-span-8'>
              <DateSelect
                onChange={(date) => {
                  console.log(date);
                }}
              />
            </div>
          </div>
          {/* Lưu thay đổi */}
          <div className='grid grid-cols-12 gap-6 my-4'>
            <div className='col-span-4 flex items-center justify-end'></div>
            <div className='col-span-8'>
              <div className='w-[150px] h-[38px] text-sm'>
                <Button>Lưu thay đổi</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default Profile;
