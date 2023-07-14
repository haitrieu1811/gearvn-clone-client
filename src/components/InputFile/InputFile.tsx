import { ChangeEvent, ReactNode, useRef, Fragment } from 'react';
import { UseFormRegister } from 'react-hook-form';
import { toast } from 'react-toastify';

interface InputFileProps {
  icon?: ReactNode;
  buttonName?: string;
  onChange?: (file?: File) => void;
  name?: string;
  register?: UseFormRegister<any>;
  errorMessage?: string;
}

const InputFile = ({ icon, buttonName = 'Chọn file', name, register, errorMessage, onChange }: InputFileProps) => {
  const _register = name && register ? { ...register(name) } : {};
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleUpload = () => {
    inputFileRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = e.target.files?.[0];
    if (fileFromLocal && fileFromLocal.size >= 1048576) {
      toast.error('Dung lượng file tối đa 1MB');
    } else {
      onChange && onChange(fileFromLocal);
    }
  };

  return (
    <Fragment>
      <input
        hidden
        {..._register}
        ref={inputFileRef}
        type='file'
        accept='.jpg,.jpeg,.png'
        onChange={handleFileChange}
        onClick={(e) => ((e.target as any).value = null)}
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
