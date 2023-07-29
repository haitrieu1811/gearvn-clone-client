import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from '@tanstack/react-query';
import isEmpty from 'lodash/isEmpty';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import userApi from 'src/apis/user.api';
import Button from 'src/components/Button';
import DateSelect from 'src/components/DateSelect';
import Input from 'src/components/Input';
import Loading from 'src/components/Loading';
import { Gender } from 'src/constants/enum';
import { ErrorResponse } from 'src/types/utils.type';
import { UpdateMeSchema, updateMeSchema } from 'src/utils/rules';
import { isEntityError } from 'src/utils/utils';

type FormData = UpdateMeSchema;

const Profile = () => {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(updateMeSchema),
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      gender: '0',
      date_of_birth: new Date(1990, 0, 1)
    }
  });

  // Lấy thông tin tài khoản
  const getMeQuery = useQuery({
    queryKey: ['me'],
    queryFn: () => userApi.getMe()
  });

  const me = useMemo(() => getMeQuery.data?.data.data.user, [getMeQuery.data?.data.data.user]);

  // Đặt giá trị mặc định
  useEffect(() => {
    if (me) {
      setValue('fullName', me.fullName);
      setValue('phoneNumber', me.phoneNumber);
      setValue('gender', String(me.gender));
      setValue('date_of_birth', me.date_of_birth ? new Date(me.date_of_birth) : new Date(1990, 0, 1));
    }
  }, [me, setValue]);

  // Cập nhật thông tin tài khoản
  const updateMeMutation = useMutation({
    mutationFn: userApi.updateMe,
    onSuccess: (data) => {
      toast.success(data.data.message);
      getMeQuery.refetch();
    },
    onError: (error) => {
      if (isEntityError<ErrorResponse<{ [key in keyof FormData]: string }>>(error)) {
        const formError = error.response?.data.data;
        if (!isEmpty(formError)) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormData, {
              message: formError[key as keyof FormData]
            });
          });
        }
      }
    }
  });

  // Submit form
  const onSubmit = handleSubmit((data) => {
    const body = {
      ...data,
      gender: Number(data.gender),
      date_of_birth: data.date_of_birth?.toISOString()
    };
    updateMeMutation.mutate(body);
  });

  return (
    <div className='bg-white rounded shadow-sm'>
      <h2 className='py-4 px-6 text-2xl font-semibold'>Thông tin tài khoản</h2>
      {/* Thông tin tài khoản */}
      <form onSubmit={onSubmit}>
        {me && !getMeQuery.isLoading && (
          <div className='py-4 pl-6 pr-[290px]'>
            {/* Họ tên */}
            <div className='grid grid-cols-12 gap-6'>
              <div className='col-span-4 flex items-center justify-end'>
                <label htmlFor='fullName'>Họ tên</label>
              </div>
              <div className='col-span-8'>
                <Input
                  type='text'
                  placeholder='Họ tên'
                  id='fullName'
                  name='fullName'
                  register={register}
                  errorMessage={errors.fullName?.message}
                />
              </div>
            </div>
            {/* Giới tính */}
            <div className='grid grid-cols-12 gap-6 mt-4'>
              <div className='col-span-4 flex items-center justify-end'>
                <label>Giới tính</label>
              </div>
              <div className='col-span-8 flex items-center'>
                <div className='flex items-center'>
                  <input type='radio' id='male' {...register('gender')} value={Gender.Male} />
                  <label htmlFor='male' className='ml-1 select-none'>
                    Nam
                  </label>
                </div>
                <div className='flex items-center ml-4'>
                  <input type='radio' id='female' {...register('gender')} value={Gender.Female} />
                  <label htmlFor='female' className='ml-1 select-none'>
                    Nữ
                  </label>
                </div>
              </div>
            </div>
            {/* Số điện thoại */}
            <div className='grid grid-cols-12 gap-6 mt-4'>
              <div className='col-span-4 flex items-center justify-end'>
                <label htmlFor='phone_number'>Số điện thoại</label>
              </div>
              <div className='col-span-8'>
                <Input
                  type='text'
                  placeholder='Số điện thoại'
                  name='phoneNumber'
                  id='phone_number'
                  register={register}
                  errorMessage={errors.phoneNumber?.message}
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
                <label>Ngày sinh</label>
              </div>
              <div className='col-span-8'>
                <Controller
                  control={control}
                  name='date_of_birth'
                  render={({ field }) => <DateSelect value={field.value} onChange={field.onChange} />}
                />
              </div>
            </div>
            {/* Lưu thay đổi */}
            <div className='grid grid-cols-12 gap-6 my-4'>
              <div className='col-span-4 flex items-center justify-end'></div>
              <div className='col-span-8'>
                <div className='w-[150px] h-[38px] text-sm'>
                  <Button isLoading={updateMeMutation.isLoading}>Lưu thay đổi</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
      {/* Tải trang */}
      {getMeQuery.isLoading && (
        <div className='py-[100px] flex justify-center'>
          <Loading className='w-12 h-12' />
        </div>
      )}
    </div>
  );
};

export default Profile;
