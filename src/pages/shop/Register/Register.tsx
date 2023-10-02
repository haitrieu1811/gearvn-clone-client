import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import isEmpty from 'lodash/isEmpty';
import { Fragment, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import authApi from 'src/apis/auth.api';
import Button from 'src/components/Button';
import Input from 'src/components/Input';
import PATH from 'src/constants/path';
import { AppContext } from 'src/contexts/app.context';
import { ErrorResponse } from 'src/types/utils.type';
import { RegisterSchema, registerSchema } from 'src/utils/rules';
import { isEntityError } from 'src/utils/utils';

type FormData = RegisterSchema;

const Register = () => {
  const { t } = useTranslation('pages');
  const { setIsAuthenticated, setProfile } = useContext(AppContext);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema)
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setIsAuthenticated(true);
      setProfile(data.data.data.user);
    },
    onError: (error) => {
      if (isEntityError<ErrorResponse<Omit<FormData, 'confirm_password'>>>(error)) {
        const formError = error.response?.data.data;
        if (!isEmpty(formError)) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof Omit<FormData, 'confirm_password'>, {
              message: formError[key as keyof Omit<FormData, 'confirm_password'>],
              type: 'Server'
            });
          });
        }
      }
    }
  });

  const onSubmit = handleSubmit((data) => {
    registerMutation.mutate(data);
  });

  return (
    <Fragment>
      <Helmet>
        <title>Đăng ký tài khoản</title>
        <meta
          name='description'
          content='Mua sắm đồ công nghệ chính hãng với giá tốt nhất tại Gearvn-clone. Chúng tôi cung cấp đa dạng các sản phẩm công nghệ từ các thương hiệu nổi tiếng như Apple, Samsung, Huawei, Xiaomi,...'
        />
        <meta property='og:title' content='Đăng ký tài khoản' />
        <meta
          property='og:description'
          content='Mua sắm đồ công nghệ chính hãng với giá tốt nhất tại Gearvn-clone. Chúng tôi cung cấp đa dạng các sản phẩm công nghệ từ các thương hiệu nổi tiếng như Apple, Samsung, Huawei, Xiaomi,...'
        />
        <meta
          property='og:image'
          content='https://gearvn-clone-ap-southeast-1.s3.ap-southeast-1.amazonaws.com/images/af998ec412e68932c8a77ba00.jpg'
        />
        <meta property='og:url' content={window.location.href} />
        <meta property='og:site_name' content='Đăng ký tài khoản' />
        <meta property='og:type' content='website' />
      </Helmet>

      <div className='bg-primary'>
        <div className='container py-10 md:py-24'>
          <div className='grid grid-cols-12'>
            <div className='bg-white p-7 md:p-10 lg:col-start-9 lg:col-span-4 rounded col-span-12 col-start-1 md:col-span-8 md:col-start-3 shadow-sm'>
              <h2 className='text-xl md:text-2xl capitalize mb-5'>{t('register_login.register')}</h2>
              <form onSubmit={onSubmit}>
                <Input
                  type='text'
                  name='email'
                  placeholder={t('register_login.email')}
                  register={register}
                  errorMessage={errors.email?.message}
                />
                <Input
                  type='password'
                  name='password'
                  placeholder={t('register_login.password')}
                  register={register}
                  errorMessage={errors.password?.message}
                  classNameWrapper='mt-4'
                />
                <Input
                  type='password'
                  name='confirm_password'
                  placeholder={t('register_login.confirm_password')}
                  register={register}
                  errorMessage={errors.confirm_password?.message}
                  classNameWrapper='mt-4'
                />
                <Button
                  classNameWrapper='mt-4'
                  className='bg-primary px-4 py-2 text-white text-sm md:text-base uppercase rounded hover:bg-primary/90 flex items-center justify-center font-medium select-none w-full'
                  isLoading={registerMutation.isLoading}
                >
                  {t('register_login.register')}
                </Button>
              </form>
              <div className='mt-4 text-center'>
                <span className='text-gray-500 text-sm md:text-base'>{t('register_login.already_have_account')}</span>{' '}
                <Link to={PATH.LOGIN} className='text-blue-700 font-medium text-sm md:text-base'>
                  {t('register_login.login')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Register;
