import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { yupResolver } from '@hookform/resolvers/yup';
import isEmpty from 'lodash/isEmpty';
import { toast } from 'react-toastify';

import Button from 'src/components/Button';
import Input from 'src/components/Input';
import { ChangePasswordSchema, changePasswordSchema } from 'src/utils/rules';
import userApi from 'src/apis/user.api';
import { isEntityError } from 'src/utils/utils';
import { ErrorResponse } from 'src/types/utils.type';

type FormData = ChangePasswordSchema;

const ChangePassword = () => {
  // Form
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setError
  } = useForm({
    resolver: yupResolver<FormData>(changePasswordSchema),
    defaultValues: {
      old_password: '',
      password: '',
      confirm_password: ''
    }
  });

  // Mutation: Đổi mật khẩu
  const changePasswordMutation = useMutation({
    mutationFn: userApi.changePassword,
    onSuccess: (data) => {
      toast.success(data.data.message);
      reset();
    },
    onError: (error) => {
      if (isEntityError<ErrorResponse<FormData>>(error)) {
        const formError = error.response?.data.data;
        if (!isEmpty(formError)) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormData, {
              type: 'Server',
              message: formError[key as keyof FormData]
            });
          });
        }
      }
    }
  });

  // Xử lý khi submit form
  const onSubmit = handleSubmit((data) => {
    changePasswordMutation.mutate(data);
  });

  return (
    <div className='bg-white rounded shadow-sm'>
      <Helmet>
        <title>Đổi mật khẩu</title>
        <meta
          name='description'
          content='Mua sắm đồ công nghệ chính hãng với giá tốt nhất tại Gearvn-clone. Chúng tôi cung cấp đa dạng các sản phẩm công nghệ từ các thương hiệu nổi tiếng như Apple, Samsung, Huawei, Xiaomi,...'
        />
        <meta property='og:title' content='Đổi mật khẩu' />
        <meta
          property='og:description'
          content='Mua sắm đồ công nghệ chính hãng với giá tốt nhất tại Gearvn-clone. Chúng tôi cung cấp đa dạng các sản phẩm công nghệ từ các thương hiệu nổi tiếng như Apple, Samsung, Huawei, Xiaomi,...'
        />
        <meta
          property='og:image'
          content='https://gearvn-clone-ap-southeast-1.s3.ap-southeast-1.amazonaws.com/images/af998ec412e68932c8a77ba00.jpg'
        />
        <meta property='og:url' content={window.location.href} />
        <meta property='og:site_name' content='Đổi mật khẩu' />
        <meta property='og:type' content='website' />
      </Helmet>

      <form onSubmit={onSubmit}>
        <h2 className='py-4 px-2 md:px-6 text-xl md:text-2xl font-semibold'>Đổi mật khẩu</h2>
        <div className='px-2 md:px-4 py-4 lg:pl-6 lg:pr-[200px] min-h-[340px]'>
          {/* Mật khẩu cũ */}
          <div className='grid grid-cols-12 gap-2 md:gap-6'>
            <div className='col-span-12 md:col-span-4 flex items-center md:justify-end'>
              <label htmlFor='old_password' className='text-sm md:text-base'>
                Mật khẩu cũ
              </label>
            </div>
            <div className='col-span-12 md:col-span-8'>
              <Input
                type='password'
                placeholder='Mật khẩu cũ'
                id='old_password'
                name='old_password'
                register={register}
                errorMessage={errors.old_password?.message}
              />
            </div>
          </div>
          {/* Mật khẩu mới */}
          <div className='grid grid-cols-12 gap-2 md:gap-6 mt-6'>
            <div className='col-span-12 md:col-span-4 flex items-center md:justify-end'>
              <label htmlFor='password' className='text-sm md:text-base'>
                Mật khẩu mới
              </label>
            </div>
            <div className='col-span-12 md:col-span-8'>
              <Input
                type='password'
                placeholder='Mật khẩu mới'
                id='password'
                name='password'
                register={register}
                errorMessage={errors.password?.message}
              />
            </div>
          </div>
          {/* Nhập lại mật khẩu mới */}
          <div className='grid grid-cols-12 gap-2 md:gap-6 mt-6'>
            <div className='col-span-12 md:col-span-4 flex items-center md:justify-end'>
              <label htmlFor='confirm_password' className='text-sm md:text-base'>
                Nhập lại mật khẩu mới
              </label>
            </div>
            <div className='col-span-12 md:col-span-8'>
              <Input
                type='password'
                placeholder='Nhập lại mật khẩu mới'
                id='confirm_password'
                name='confirm_password'
                register={register}
                errorMessage={errors.confirm_password?.message}
              />
            </div>
          </div>
          {/* Lưu thay đổi */}
          <div className='grid grid-cols-12 gap-2 md:gap-6 my-6'>
            <div className='col-span-4 flex items-center justify-end'></div>
            <div className='col-span-12 md:col-span-8'>
              <Button isLoading={changePasswordMutation.isLoading}>Đổi mật khẩu</Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
