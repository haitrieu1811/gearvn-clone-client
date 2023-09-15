import toArray from 'lodash/toArray';
import PropTypes from 'prop-types';
import { ChangeEvent, Fragment, ReactNode, useRef } from 'react';
import { toast } from 'react-toastify';

interface InputFileProps {
  children: ReactNode;
  onChange?: (file?: File[]) => void;
  multiple?: boolean;
  maxFileSize?: number;
}

const InputFile = ({ children, onChange, multiple = false, maxFileSize = 300 * 1024 }: InputFileProps) => {
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleUpload = () => {
    inputFileRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const filesFromLocal = e.target.files;
    const _filesFromLocal = toArray(filesFromLocal);
    const isSizeValid = _filesFromLocal.every((file) => file.size < maxFileSize);
    const isValidFiles = _filesFromLocal.filter((file) => file.size < maxFileSize);
    if (!isSizeValid) toast.error(`Dung lượng file tối đa ${maxFileSize / 1024}KB`);
    onChange && onChange(isValidFiles);
  };

  return (
    <Fragment>
      <input
        hidden
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
    </Fragment>
  );
};

InputFile.propTypes = {
  children: PropTypes.node,
  onChange: PropTypes.func,
  multiple: PropTypes.bool,
  maxFileSize: PropTypes.number
};

export default InputFile;
