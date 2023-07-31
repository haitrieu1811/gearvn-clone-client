import toArray from 'lodash/toArray';
import { ChangeEvent, Fragment, ReactNode, useRef } from 'react';
import { UseFormRegister } from 'react-hook-form';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

interface InputFileProps {
  children: ReactNode;
  onChange?: (file?: File[]) => void;
  name?: string;
  register?: UseFormRegister<any>;
  errorMessage?: string;
  multiple?: boolean;
  maxFileSize?: number;
}

const InputFile = ({
  children,
  name,
  register,
  errorMessage,
  onChange,
  multiple = false,
  maxFileSize = 300 * 1024
}: InputFileProps) => {
  const _register = name && register ? { ...register(name) } : {};
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleUpload = () => {
    inputFileRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const filesFromLocal = e.target.files;
    const _filesFromLocal = toArray(filesFromLocal);
    const isSizeValid = _filesFromLocal.every((file) => file.size < maxFileSize);
    if (!isSizeValid) {
      toast.error(`Dung lượng file tối đa ${maxFileSize / 1024}KB`);
    } else {
      onChange && onChange(_filesFromLocal);
    }
  };

  return (
    <Fragment>
      <input
        hidden
        {..._register}
        ref={inputFileRef}
        type='file'
        accept='.jpg,.jpeg,.png,.webp'
        onChange={handleFileChange}
        onClick={(e) => ((e.target as any).value = null)}
        multiple={multiple}
      />
      <div tabIndex={0} role='button' aria-hidden='true' onClick={handleUpload}>
        {children}
      </div>
      {errorMessage && <p className='text-sm text-red-500 mt-2 font-medium'>{errorMessage}</p>}
    </Fragment>
  );
};

InputFile.propTypes = {
  onChange: PropTypes.func,
  name: PropTypes.string,
  errorMessage: PropTypes.string,
  multiple: PropTypes.bool,
  maxFileSize: PropTypes.number
};

export default InputFile;
