import { ChangeEvent, ReactNode, useRef } from 'react';
import { UseFormRegister } from 'react-hook-form';
import { toast } from 'react-toastify';

interface InputFileProps {
  icon?: ReactNode;
  buttonName?: string;
  onChange?: (file?: File) => void;
  register?: UseFormRegister<any>;
  name?: string;
}

const InputFile = ({ icon, buttonName = 'Chọn file', name, register, onChange }: InputFileProps) => {
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
    <div>
      <input
        hidden
        ref={inputFileRef}
        type='file'
        accept='.jpg,.jpeg,.png'
        onChange={handleFileChange}
        onClick={(e) => ((e.target as any).value = null)}
        {..._register}
      />
      <button
        type='button'
        onClick={handleUpload}
        className='bg-slate-50 border rounded-sm w-full py-2 text-sm font-medium flex justify-center items-center'
      >
        {icon && icon}
        {buttonName}
      </button>
    </div>
  );
};

export default InputFile;