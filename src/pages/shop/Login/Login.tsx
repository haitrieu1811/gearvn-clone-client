import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import isEmpty from 'lodash/isEmpty';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import authApi from 'src/apis/auth.api';
import Button from 'src/components/Button';
import Input from 'src/components/Input';
import PATH from 'src/constants/path';
import { AppContext } from 'src/contexts/app.context';
import { ErrorResponse } from 'src/types/utils.type';
import { LoginSchema, loginSchema } from 'src/utils/rules';
import { isEntityError } from 'src/utils/utils';

type FormData = LoginSchema;

const Login = () => {
  const { t } = useTranslation('pages');
  const { setIsAuthenticated, setProfile } = useContext(AppContext);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema)
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setIsAuthenticated(true);
      setProfile(data.data.data.user);
      toast.success('Đăng nhập thành công');
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

  const onSubmit = handleSubmit((data) => {
    loginMutation.mutate(data);
  });

  return (
    <div className='bg-primary'>
      <div className='container py-10 md:py-24'>
        <div className='grid grid-cols-12'>
          <div className='bg-white p-7 md:p-10 lg:col-start-9 lg:col-span-4 rounded col-span-12 col-start-1 md:col-span-8 md:col-start-3 shadow-sm'>
            <h2 className='text-2xl capitalize mb-5'>{t('register_login.login')}</h2>
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
              <Button classNameWrapper='mt-4' isLoading={loginMutation.isLoading}>
                {t('register_login.login')}
              </Button>
            </form>
            <div className='mt-4 text-center'>
              <span className='text-gray-500'>{t('register_login.dont_have_account')}</span>{' '}
              <Link to={PATH.REGISTER} className='text-blue-700 font-medium'>
                {t('register_login.register')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
