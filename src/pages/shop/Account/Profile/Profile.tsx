import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import isEmpty from 'lodash/isEmpty';
import isUndefined from 'lodash/isUndefined';
import omitBy from 'lodash/omitBy';
import { useContext, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import classNames from 'classnames';

import mediaApi from 'src/apis/media.api';
import userApi from 'src/apis/user.api';
import Alert from 'src/components/Alert';
import Button from 'src/components/Button';
import DateSelect from 'src/components/DateSelect';
import Input from 'src/components/Input';
import Loading from 'src/components/Loading';
import { Gender, UserVerifyStatus } from 'src/constants/enum';
import { AppContext } from 'src/contexts/app.context';
import { ErrorResponse } from 'src/types/utils.type';
import { setProfileToLS } from 'src/utils/auth';
import { UpdateMeSchema, updateMeSchema } from 'src/utils/rules';
import { isEntityError } from 'src/utils/utils';
import { AccountContext } from '../Account';
import FloatLoading from 'src/components/FloatLoading/FloatLoading';

type FormData = UpdateMeSchema;

const Profile = () => {
  const { setProfile } = useContext(AppContext);
  const { avatarFile, setAvatarFile, me, getMeQuery } = useContext(AccountContext);

  // Gửi lại email xác thực
  const resendVerifyEmailMutation = useMutation({
    mutationFn: userApi.resendVerifyEmail,
    onSuccess: (data) => {
      toast.success(data.data.message);
    }
  });

  const resendVerifyEmail = () => {
    resendVerifyEmailMutation.mutate();
  };

  // Form
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
      setProfileToLS(data.data.data.user);
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
          <h2 className='py-4 px-2 md:px-6 text-xl md:text-2xl font-semibold'>Thông tin tài khoản</h2>
          <Alert isVisible={me.verify === UserVerifyStatus.Unverified}>
            Tài khoản của bạn chưa được xác thực vui lòng kiểm tra email để xác thực tài khoản. Nếu bạn chưa nhận được
            email xác thực, vui lòng{' '}
            <button
              type='button'
              className={classNames('font-bold', {
                'pointer-events-none': resendVerifyEmailMutation.isLoading
              })}
              onClick={resendVerifyEmail}
            >
              nhận lại email xác thực
            </button>
            .
          </Alert>
          <FloatLoading isLoading={resendVerifyEmailMutation.isLoading} />
          <div className='px-2 md:px-4 py-4 lg:pl-6 lg:pr-[290px]'>
            {/* Họ tên */}
            <div className='grid grid-cols-12 gap-2 md:gap-6'>
              <div className='col-span-12 md:col-span-4 flex items-center md:justify-end'>
                <label htmlFor='fullName' className='text-sm md:text-base'>
                  Họ tên
                </label>
              </div>
              <div className='col-span-12 md:col-span-8'>
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
            <div className='grid grid-cols-12 gap-2 md:gap-6 mt-4'>
              <div className='col-span-12 md:col-span-4 flex items-center  md:justify-end'>
                <label className='text-sm md:text-base'>Giới tính</label>
              </div>
              <div className='col-span-12 md:col-span-8 flex items-center'>
                <div className='flex items-center'>
                  <input type='radio' id='male' {...register('gender')} value={Gender.Male} />
                  <label htmlFor='male' className='ml-1 select-none text-sm md:text-base'>
                    Nam
                  </label>
                </div>
                <div className='flex items-center ml-4'>
                  <input type='radio' id='female' {...register('gender')} value={Gender.Female} />
                  <label htmlFor='female' className='ml-1 select-none text-sm md:text-base'>
                    Nữ
                  </label>
                </div>
              </div>
            </div>
            {/* Số điện thoại */}
            <div className='grid grid-cols-12 gap-2 md:gap-6 mt-4'>
              <div className='col-span-12 md:col-span-4 flex items-center md:justify-end'>
                <label htmlFor='phone_number' className='text-sm md:text-base'>
                  Số điện thoại
                </label>
              </div>
              <div className='col-span-12 md:col-span-8'>
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
            <div className='grid grid-cols-12 gap-2 md:gap-6 mt-4'>
              <div className='col-span-12 md:col-span-4 flex items-center md:justify-end'>
                <label className='text-sm md:text-base'>Email</label>
              </div>
              <div className='col-span-12 md:col-span-8'>
                <input
                  type='text'
                  placeholder='Email'
                  className='w-full border border-[#CFCFCF] rounded h-10 px-3 md:px-4 outline-none bg-slate-100/50 cursor-not-allowed text-sm md:text-base'
                  value={me.email}
                  disabled
                />
              </div>
            </div>
            {/* Ngày sinh */}
            <div className='grid grid-cols-12 gap-2 md:gap-6 mt-4'>
              <div className='col-span-12 md:col-span-4 flex items-center md:justify-end'>
                <label className='text-sm md:text-base'>Ngày sinh</label>
              </div>
              <div className='col-span-12 md:col-span-8'>
                <Controller
                  control={control}
                  name='date_of_birth'
                  render={({ field }) => <DateSelect value={field.value} onChange={field.onChange} />}
                />
              </div>
            </div>
            {/* Lưu thay đổi */}
            <div className='grid grid-cols-12 gap-2 md:gap-6 my-4'>
              <div className='col-span-4 flex items-center justify-end'></div>
              <div className='col-span-12 md:col-span-8'>
                <div className='w-[120px] h-[28px] md:w-[150px] md:h-[38px] text-xs md:text-sm'>
                  <Button isLoading={updateMeMutation.isLoading}>Lưu thay đổi</Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
      {/* Tải trang */}
      {getMeQuery && getMeQuery.isLoading && <Loading />}
    </div>
  );
};

export default Profile;
