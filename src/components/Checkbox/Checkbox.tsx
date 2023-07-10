import { InputHTMLAttributes } from 'react';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {}

const Checkbox = ({ ...rest }: CheckboxProps) => {
  return <input type='checkbox' {...rest} className='w-5 h-5 border cursor-pointer accent-primary' />;
};

export default Checkbox;
