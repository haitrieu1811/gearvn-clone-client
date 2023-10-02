import PropTypes from 'prop-types';
import { InputHTMLAttributes, useState } from 'react';
import { UseFormRegister } from 'react-hook-form';

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
  classNameInput = 'outline-none border border-[#CFCFCF] py-2 px-3 md:px-4 block w-full rounded text-sm md:text-base',
  classNameError = 'text-xs md:text-sm text-red-500 mt-2',
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
    if (rest.type === 'password') return openEye ? 'text' : 'password';
    return rest.type;
  };

  return (
    <div className={classNameWrapper}>
      <div className='relative'>
        {openEye && rest.type === 'password' && (
          <EyeIcon
            onClick={toggleEye}
            className='absolute right-2 top-1/2 -translate-y-1/2 stroke-gray-500 cursor-pointer w-5 h-5'
          />
        )}
        {!openEye && rest.type === 'password' && (
          <EyeCloseIcon
            onClick={toggleEye}
            className='absolute right-2 top-1/2 -translate-y-1/2 stroke-gray-500 cursor-pointer w-4 h-4 md:w-5 md:h-5'
          />
        )}
        <input {...rest} type={handleType()} className={classNameInput} {...registerResult} />
      </div>
      {errorMessage && <div className={classNameError}>{errorMessage}</div>}
    </div>
  );
};

Input.propTypes = {
  classNameWrapper: PropTypes.string,
  classNameInput: PropTypes.string,
  classNameError: PropTypes.string,
  errorMessage: PropTypes.string,
  name: PropTypes.string,
  register: PropTypes.func
};

export default Input;
