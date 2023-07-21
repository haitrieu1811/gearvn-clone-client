import toArray from 'lodash/toArray';
import { ChangeEvent, Fragment, ReactNode, useRef } from 'react';
import { UseFormRegister } from 'react-hook-form';
import { toast } from 'react-toastify';

interface InputFileProps {
  icon?: ReactNode;
  buttonName?: string;
  onChange?: (file?: File[]) => void;
  name?: string;
  register?: UseFormRegister<any>;
  errorMessage?: string;
  multiple?: boolean;
}

const InputFile = ({
  icon,
  buttonName = 'Chọn file',
  name,
  register,
  errorMessage,
  onChange,
  multiple
}: InputFileProps) => {
  const _register = name && register ? { ...register(name) } : {};
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleUpload = () => {
    inputFileRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const filesFromLocal = e.target.files;
    const _filesFromLocal = toArray(filesFromLocal);
    const isSizeValid = _filesFromLocal.every((file) => file.size < 300 * 1024);

    if (!isSizeValid) {
      toast.error('Dung lượng file tối đa 300KB');
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
      <button
        type='button'
        onClick={handleUpload}
        className='bg-slate-50 border rounded-sm w-full py-2 text-sm font-medium flex justify-center items-center'
      >
        {icon && icon}
        {buttonName}
      </button>
      {errorMessage && <p className='text-sm text-red-500 mt-2 font-medium'>{errorMessage}</p>}
    </Fragment>
  );
};

export default InputFile;
