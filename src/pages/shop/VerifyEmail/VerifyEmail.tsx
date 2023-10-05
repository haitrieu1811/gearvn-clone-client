import { useMutation } from '@tanstack/react-query';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import userApi from 'src/apis/user.api';
import PATH from 'src/constants/path';
import { AppContext } from 'src/contexts/app.context';
import useQueryParams from 'src/hooks/useQueryParams';
import { OnlyMessageResponse } from 'src/types/utils.type';
import { isUnauthorizedError } from 'src/utils/utils';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const searchParams = useQueryParams();
  const { token } = searchParams;
  const [message, setMessage] = useState('');
  const { setIsAuthenticated } = useContext(AppContext);

  // Xác thực token
  const verifyEmailMutation = useMutation({
    mutationFn: userApi.verifyEmail,
    onSuccess: (data) => {
      toast.success(data.data.message);
      setIsAuthenticated(true);
      navigate(PATH.HOME);
    },
    onError: (error) => {
      if (isUnauthorizedError<OnlyMessageResponse>(error)) {
        setMessage(error.response?.data.message as string);
      }
    }
  });

  // Xác thực token khi component mount
  useEffect(() => {
    if (token) verifyEmailMutation.mutate({ email_verify_token: token });
  }, [token]);

  return (
    <div className='container py-[100px] my-4 flex justify-center items-center bg-white rounded-sm shadow-sm'>
      <span className='text-xl font-medium uppercase'>{message}</span>
    </div>
  );
};

export default VerifyEmail;
