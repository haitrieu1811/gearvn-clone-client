import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import isEmpty from 'lodash/isEmpty';

import Button from 'src/components/Button';
import Input from 'src/components/Input';
import PATH from 'src/constants/path';
import { ForgotPasswordSchema, forgotPasswordSchema } from 'src/utils/rules';
import userApi from 'src/apis/user.api';
import { isEntityError } from 'src/utils/utils';
import { ErrorResponse } from 'src/types/utils.type';
import { Helmet } from 'react-helmet-async';

type FormData = ForgotPasswordSchema;

const ForgotPassword = () => {
  // Form
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setError
  } = useForm<FormData>({
    defaultValues: {
      email: ''
    },
    resolver: yupResolver(forgotPasswordSchema)
  });

  // Mutation: Quên mật khẩu
  const forgotPasswordMutation = useMutation({
    mutationFn: userApi.forgotPassword,
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

  // Submit form
  const onSubmit = handleSubmit((data) => {
    forgotPasswordMutation.mutate(data);
  });

  return (
    <div className='container bg-white shadow-sm rounded-sm my-3'>
      <Helmet>
        <title>Quên mật khẩu</title>
        <meta
          name='description'
          content='Mua sắm đồ công nghệ chính hãng với giá tốt nhất tại Gearvn-clone. Chúng tôi cung cấp đa dạng các sản phẩm công nghệ từ các thương hiệu nổi tiếng như Apple, Samsung, Huawei, Xiaomi,...'
        />
        <meta property='og:title' content='Quên mật khẩu' />
        <meta
          property='og:description'
          content='Mua sắm đồ công nghệ chính hãng với giá tốt nhất tại Gearvn-clone. Chúng tôi cung cấp đa dạng các sản phẩm công nghệ từ các thương hiệu nổi tiếng như Apple, Samsung, Huawei, Xiaomi,...'
        />
        <meta
          property='og:image'
          content='https://gearvn-clone-ap-southeast-1.s3.ap-southeast-1.amazonaws.com/images/af998ec412e68932c8a77ba00.jpg'
        />
        <meta property='og:url' content={window.location.href} />
        <meta property='og:site_name' content='Quên mật khẩu' />
        <meta property='og:type' content='website' />
      </Helmet>

      <div className='flex justify-center items-center py-10'>
        <div className='w-[450px] max-w-[90%]'>
          <form onSubmit={onSubmit}>
            <h1 className='font-semibold text-xl md:text-2xl mb-6'>Quên mật khẩu</h1>
            <Input
              type='text'
              placeholder='Email'
              classNameWrapper='mb-4'
              name='email'
              register={register}
              errorMessage={errors.email?.message}
            />
            <Button isLoading={forgotPasswordMutation.isLoading}>Khôi phục</Button>
            <p className='text-center mt-6'>
              <span className='text-slate-500 text-sm md:text-base'>Bạn đã nhớ mật khẩu?</span>{' '}
              <Link to={PATH.LOGIN} className='text-blue-600 text-sm md:text-base'>
                Trở về đăng nhập
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
