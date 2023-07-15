import { InputHTMLAttributes, useState } from 'react';
import { UseFormRegister } from 'react-hook-form';
import PropTypes from 'prop-types';

import { EyeCloseIcon, EyeIcon } from '../Icons';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  classNameWrapper?: string;
  classNameInput?: string;
  classNameError?: string;
  errorMessage?: string;
  name?: string;
  register?: UseFormRegister<any>;
}

const Input = ({
  classNameWrapper,
  classNameInput = 'outline-none border py-2 px-4 block w-full rounded-sm focus:border-slate-500 text-black text-sm',
  classNameError = 'text-sm text-red-500 mt-2 font-medium',
  errorMessage,
  name,
  register,
  ...rest
}: InputProps) => {
  const [openEye, setOpenEye] = useState<boolean>(false);
  const registerResult = register && name ? { ...register(name) } : {};

  const toggleEye = () => {
    setOpenEye((prevState) => !prevState);
  };

  const handleType = () => {
    if (rest.type === 'password') {
      return openEye ? 'text' : 'password';
    }
    return rest.type;
  };

  return (
    <div className={classNameWrapper}>
      <div className='relative'>
        {openEye && rest.type === 'password' && <EyeIcon onClick={toggleEye} />}
        {!openEye && rest.type === 'password' && <EyeCloseIcon onClick={toggleEye} />}
        <input {...rest} type={handleType()} className={classNameInput} {...registerResult} />
      </div>
      <div className={classNameError}>{errorMessage}</div>
    </div>
  );
};

Input.propTypes = {
  classNameWrapper: PropTypes.string,
  classNameInput: PropTypes.string,
  classNameError: PropTypes.string,
  errorMessage: PropTypes.string,
  name: PropTypes.string
};

export default Input;
