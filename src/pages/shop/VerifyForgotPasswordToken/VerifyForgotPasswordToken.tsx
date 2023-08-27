import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import userApi from 'src/apis/user.api';
import PATH from 'src/constants/path';
import UseQueryParams from 'src/hooks/useQueryParams';
import { OnlyMessageResponse } from 'src/types/utils.type';
import { isUnauthorizedError } from 'src/utils/utils';

const VerifyResetPasswordToken = () => {
  const navigate = useNavigate();
  const searchParams = UseQueryParams();
  const { token } = searchParams;
  const [message, setMessage] = useState('');

  // Xác thực token
  const verifyForgotPasswordTokenMutation = useMutation({
    mutationFn: userApi.verifyForgotPasswordToken,
    onSuccess: () => {
      navigate(PATH.RESET_PASSWORD, { state: { token } });
    },
    onError: (error) => {
      if (isUnauthorizedError<OnlyMessageResponse>(error)) {
        setMessage(error.response?.data.message as string);
      }
    }
  });

  // Xác thực token khi component mount
  useEffect(() => {
    if (token) verifyForgotPasswordTokenMutation.mutate({ forgot_password_token: token });
  }, [token]);

  return (
    <div className='container py-[100px] my-4 flex justify-center items-center bg-white rounded-sm shadow-sm'>
      <span className='text-xl font-medium uppercase'>{message}</span>
    </div>
  );
};

export default VerifyResetPasswordToken;
