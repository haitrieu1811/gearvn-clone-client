import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import isEmpty from 'lodash/isEmpty';
import { useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import authApi from 'src/apis/auth.api';
import Button from 'src/components/Button';
import Input from 'src/components/Input';
import PATH from 'src/constants/path';
import { AppContext } from 'src/contexts/app.context';
import { ErrorResponse } from 'src/types/utils.type';
import { LoginSchema, loginSchema } from 'src/utils/rules';
import { initSocket } from 'src/utils/socket';
import { isEntityError } from 'src/utils/utils';

type FormData = LoginSchema;

const Login = () => {
  const { setIsAuthenticated, setProfile, setSocket } = useContext(AppContext);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema)
  });

  // Mutation: Đăng nhập
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      const { access_token, user } = data.data.data;
      setIsAuthenticated(true);
      setProfile(user);
      toast.success(data.data.message);
      const socket = initSocket(access_token);
      socket.connect();
      setSocket(socket);
    },
    onError: (error) => {
      if (isEntityError<ErrorResponse<FormData>>(error)) {
        const formError = error.response?.data.data;
        if (!isEmpty(formError)) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormData, {
              message: formError[key as keyof FormData],
              type: 'Server'
            });
          });
        }
      }
    }
  });

  // Xử lý submit
  const onSubmit = handleSubmit((data) => {
    loginMutation.mutate(data);
  });

  return (
    <div className='bg-primary'>
      <Helmet>
        <title>Đăng nhập</title>
        <meta
          name='description'
          content='Mua sắm đồ công nghệ chính hãng với giá tốt nhất tại Gearvn-clone. Chúng tôi cung cấp đa dạng các sản phẩm công nghệ từ các thương hiệu nổi tiếng như Apple, Samsung, Huawei, Xiaomi,...'
        />
        <meta property='og:title' content='Đăng nhập' />
        <meta
          property='og:description'
          content='Mua sắm đồ công nghệ chính hãng với giá tốt nhất tại Gearvn-clone. Chúng tôi cung cấp đa dạng các sản phẩm công nghệ từ các thương hiệu nổi tiếng như Apple, Samsung, Huawei, Xiaomi,...'
        />
        <meta
          property='og:image'
          content='https://gearvn-clone-ap-southeast-1.s3.ap-southeast-1.amazonaws.com/images/af998ec412e68932c8a77ba00.jpg'
        />
        <meta property='og:url' content={window.location.href} />
        <meta property='og:site_name' content='Đăng nhập' />
        <meta property='og:type' content='website' />
      </Helmet>

      <div className='container py-10 md:py-24'>
        <div className='grid grid-cols-12'>
          <div className='bg-white p-7 md:p-10 lg:col-start-9 lg:col-span-4 rounded col-span-12 col-start-1 md:col-span-8 md:col-start-3 shadow-sm'>
            <h2 className='text-xl md:text-2xl capitalize mb-5'>Đăng nhập</h2>
            <form onSubmit={onSubmit}>
              <Input
                type='text'
                name='email'
                placeholder='Email'
                register={register}
                errorMessage={errors.email?.message}
              />
              <Input
                type='password'
                name='password'
                placeholder='Mật khẩu'
                register={register}
                errorMessage={errors.password?.message}
                classNameWrapper='mt-4'
              />
              <p className='text-right mt-4'>
                <Link to={PATH.FORGOT_PASSWORD} className='text-sm md:text-[15px] text-slate-400'>
                  Quên mật khẩu?
                </Link>
              </p>
              <Button
                classNameWrapper='mt-4'
                className='bg-primary px-4 py-2 text-white text-sm md:text-base uppercase rounded hover:bg-primary/90 flex items-center justify-center font-medium select-none w-full'
                isLoading={loginMutation.isLoading}
              >
                Đăng nhập
              </Button>
            </form>
            <div className='mt-4 text-center'>
              <span className='text-gray-500 text-sm md:text-base'>Bạn chưa có tài khoản?</span>{' '}
              <Link to={PATH.REGISTER} className='text-blue-700 font-medium text-sm md:text-base'>
                Đăng ký
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
