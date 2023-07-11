import { InputHTMLAttributes } from 'react';
import { TickIcon } from '../Icons';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {}

const Checkbox = ({ ...rest }: CheckboxProps) => {
  return (
    <div className='relative border border-slate-400/50 rounded-sm w-4 h-4 flex justify-center items-center'>
      <input type='checkbox' {...rest} className='peer appearance-none w-full h-full cursor-pointer' />
      <TickIcon className='w-4 h-4 stroke-primary absolute opacity-0 pointer-events-none peer-checked:opacity-100' />
    </div>
  );
};

export default Checkbox;
