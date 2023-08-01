import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import isEmpty from 'lodash/isEmpty';
import isUndefined from 'lodash/isUndefined';
import omitBy from 'lodash/omitBy';
import { useContext, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import mediaApi from 'src/apis/media.api';
import userApi from 'src/apis/user.api';
import Button from 'src/components/Button';
import DateSelect from 'src/components/DateSelect';
import Input from 'src/components/Input';
import Loading from 'src/components/Loading';
import { Gender } from 'src/constants/enum';
import { AppContext } from 'src/contexts/app.context';
import { ErrorResponse } from 'src/types/utils.type';
import { UpdateMeSchema, updateMeSchema } from 'src/utils/rules';
import { isEntityError } from 'src/utils/utils';
import { AccountContext } from '../Account';

type FormData = UpdateMeSchema;

const Profile = () => {
  const { setProfile } = useContext(AppContext);
  const { avatarFile, setAvatarFile, me, getMeQuery } = useContext(AccountContext);

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
      getMeQuery && getMeQuery.refetch();
      setProfile(data.data.data.user);
      setAvatarFile(null);
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

  // Upload hình ảnh
  const updateImageMutation = useMutation(mediaApi.uploadImage);

  // Submit form
  const onSubmit = handleSubmit(async (data) => {
    let avatar: string | undefined = undefined;
    if (avatarFile) {
      const form = new FormData();
      form.append('image', avatarFile[0]);
      const res = await updateImageMutation.mutateAsync(form);
      avatar = res.data.data.medias[0].name;
    }
    const body = omitBy(
      {
        ...data,
        gender: Number(data.gender),
        date_of_birth: data.date_of_birth?.toISOString(),
        avatar
      },
      isUndefined
    );
    updateMeMutation.mutate(body);
  });

  return (
    <div className='bg-white rounded shadow-sm'>
      {/* Thông tin tài khoản */}
      {me && getMeQuery && !getMeQuery.isLoading && (
        <form onSubmit={onSubmit}>
          <h2 className='py-4 px-6 text-2xl font-semibold'>Thông tin tài khoản</h2>
          <div className='px-2 md:px-4 py-4 lg:pl-6 lg:pr-[290px]'>
            {/* Họ tên */}
            <div className='grid grid-cols-12 gap-4 md:gap-6'>
              <div className='col-span-4 flex items-center justify-end text-sm md:text-base'>
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
              <div className='col-span-4 flex items-center justify-end text-sm md:text-base'>
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
              <div className='col-span-4 flex items-center justify-end text-sm md:text-base'>
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
              <div className='col-span-4 flex items-center justify-end text-sm md:text-base'>
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
              <div className='col-span-4 flex items-center justify-end text-sm md:text-base'>
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
        </form>
      )}
      {/* Tải trang */}
      {getMeQuery && getMeQuery.isLoading && (
        <div className='py-[150px] flex justify-center'>
          <Loading className='w-12 h-12' />
        </div>
      )}
    </div>
  );
};

export default Profile;
