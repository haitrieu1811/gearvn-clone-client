import { ChangeEvent, InputHTMLAttributes, useState, forwardRef, ForwardedRef } from 'react';
import REGEX from 'src/constants/regex';

export interface InputNumberProps extends InputHTMLAttributes<HTMLInputElement> {
  classNameInput?: string;
  errorMessage?: string;
}

const InputNumber = (
  {
    classNameInput = 'outline-none border-t border-b border-[#cfcfcf] w-8 md:w-12 h-8 py-2 text-center text-xs md:text-sm',
    onChange,
    value = '',
    errorMessage,
    ...rest
  }: InputNumberProps,
  ref: ForwardedRef<HTMLInputElement>
) => {
  const [localValue, setLocalValue] = useState<string>(value as string);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (REGEX.NUMBER.test(value)) {
      onChange && onChange(e);
      setLocalValue(value);
    }
  };

  return (
    <div>
      <input
        className={classNameInput}
        onChange={handleChange}
        {...rest}
        value={value === undefined ? localValue : value}
        ref={ref}
      />
      {errorMessage && <div className='text-sm text-red-500'>{errorMessage}</div>}
    </div>
  );
};

export default forwardRef<HTMLInputElement, InputNumberProps>(InputNumber);
