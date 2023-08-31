import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import isEmpty from 'lodash/isEmpty';
import { Fragment, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import userApi from 'src/apis/user.api';
import Button from 'src/components/Button/Button';
import Input from 'src/components/Input/Input';
import PATH from 'src/constants/path';
import { ErrorResponse } from 'src/types/utils.type';
import { ResetPasswordSchema, resetPasswordSchema } from 'src/utils/rules';
import { isEntityError } from 'src/utils/utils';

type FormData = ResetPasswordSchema;

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Kiểm tra xem có token trong location state hay không (nếu không có thì redirect về trang chủ)
  useEffect(() => {
    if (!location.state || !location.state.token) {
      navigate(PATH.HOME);
    }
  });

  // Xóa location state khi component unmount
  useEffect(() => {
    return () => {
      history.replaceState(null, '');
    };
  }, []);

  // Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset
  } = useForm<FormData>({
    defaultValues: {
      password: '',
      confirm_password: ''
    },
    resolver: yupResolver(resetPasswordSchema)
  });

  // Đặt lại mật khẩu
  const resetPasswordMutation = useMutation({
    mutationFn: userApi.resetPassword,
    onSuccess: (data) => {
      toast.success(data.data.message);
      reset();
      setTimeout(() => {
        window.location.reload();
      }, 3000);
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

  // Submit form
  const onSubmit = handleSubmit((data) => {
    if (location.state && location.state.token) {
      resetPasswordMutation.mutate({
        ...data,
        forgot_password_token: location.state.token
      });
    }
  });

  return (
    <Fragment>
      {location.state && location.state.token && (
        <div className='container bg-white shadow-sm rounded-sm my-3'>
          <Helmet>
            <title>Khôi phục mật khẩu</title>
            <meta
              name='description'
              content='Mua sắm đồ công nghệ chính hãng với giá tốt nhất tại Gearvn-clone. Chúng tôi cung cấp đa dạng các sản phẩm công nghệ từ các thương hiệu nổi tiếng như Apple, Samsung, Huawei, Xiaomi,...'
            />
            <meta property='og:title' content='Khôi phục mật khẩu' />
            <meta
              property='og:description'
              content='Mua sắm đồ công nghệ chính hãng với giá tốt nhất tại Gearvn-clone. Chúng tôi cung cấp đa dạng các sản phẩm công nghệ từ các thương hiệu nổi tiếng như Apple, Samsung, Huawei, Xiaomi,...'
            />
            <meta
              property='og:image'
              content='https://gearvn-clone-ap-southeast-1.s3.ap-southeast-1.amazonaws.com/images/af998ec412e68932c8a77ba00.jpg'
            />
            <meta property='og:url' content={window.location.href} />
            <meta property='og:site_name' content='Khôi phục mật khẩu' />
            <meta property='og:type' content='website' />
          </Helmet>
          <div className='flex justify-center items-center py-10'>
            <div className='w-[450px] max-w-[90%]'>
              <form onSubmit={onSubmit}>
                <h1 className='font-semibold text-2xl mb-6'>Phục hồi mật khẩu</h1>
                <Input
                  type='password'
                  placeholder='Mật khẩu'
                  classNameWrapper='mb-4'
                  name='password'
                  register={register}
                  errorMessage={errors.password?.message}
                />
                <Input
                  type='password'
                  placeholder='Nhập lại mật khẩu'
                  classNameWrapper='mb-4'
                  name='confirm_password'
                  register={register}
                  errorMessage={errors.confirm_password?.message}
                />
                <Button isLoading={resetPasswordMutation.isLoading}>Lưu</Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default ResetPassword;
