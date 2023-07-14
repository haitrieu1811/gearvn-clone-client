import { Fragment, TextareaHTMLAttributes } from 'react';
import { UseFormRegister } from 'react-hook-form';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  register?: UseFormRegister<any>;
  errorMesssage?: string;
}

const Textarea = ({ register, errorMesssage, ...rest }: TextareaProps) => {
  const { name } = rest;
  const _register = name && register ? { ...register(name) } : {};
  return (
    <Fragment>
      <textarea rows={10} {..._register} className='outline-none border rounded resize-none w-full p-4'></textarea>
      {errorMesssage && <p className='text-sm text-red-500 mt-2 font-medium'>{errorMesssage}</p>}
    </Fragment>
  );
};

export default Textarea;
