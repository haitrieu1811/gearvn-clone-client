import { useState, ChangeEvent, FocusEvent } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import InputNumber from '../InputNumber';
import { InputNumberProps } from '../InputNumber/InputNumber';
import { MinusIcon, PlusIcon } from '../Icons';

interface QuantityControllerProps extends InputNumberProps {
  max?: number;
  onDecrease?: (value: number) => void;
  onIncrease?: (value: number) => void;
  onType?: (value: number) => void;
  onFocusOut?: (value: number) => void;
  disabled?: boolean;
}

const QuantityController = ({
  value,
  max,
  onDecrease,
  onIncrease,
  onType,
  onFocusOut,
  disabled
}: QuantityControllerProps) => {
  const [localValue, setLocalValue] = useState<number>(Number(value || 0));

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let _value = Number(e.target.value);
    if (max && _value > max) {
      _value = max;
    } else if (_value < 1) {
      _value = 1;
    }
    onType && onType(_value);
    setLocalValue(_value);
  };

  const handleDecrease = () => {
    let _value = Number(value || localValue) - 1;
    if (_value < 1) {
      _value = 1;
    }
    onDecrease && onDecrease(_value);
    setLocalValue(_value);
  };

  const handleIncrease = () => {
    let _value = Number(value || localValue) + 1;
    if (max && _value > max) {
      _value = max;
    }
    onIncrease && onIncrease(_value);
    setLocalValue(_value);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement, Element>) => {
    onFocusOut && onFocusOut(Number(e.target.value));
  };

  return (
    <div
      className={classNames('flex', {
        'pointer-events-none opacity-50': disabled
      })}
    >
      <button
        onClick={handleDecrease}
        className='border border-[#cfcfcf] rounded-tl rounded-bl w-8 flex justify-center items-center active:bg-slate-50 text-slate-700 bg-white'
      >
        <MinusIcon className='w-4 h-4' />
      </button>
      <InputNumber value={value || localValue} onChange={handleChange} onBlur={handleBlur} />
      <button
        onClick={handleIncrease}
        className='border border-[#cfcfcf] rounded-tr rounded-br w-8 flex justify-center items-center active:bg-slate-50 text-slate-700 bg-white'
      >
        <PlusIcon className='w-4 h-4' />
      </button>
    </div>
  );
};

QuantityController.propTypes = {
  value: PropTypes.number,
  max: PropTypes.number,
  onDecrease: PropTypes.func,
  onIncrease: PropTypes.func,
  onType: PropTypes.func,
  onFocusOut: PropTypes.func,
  disabled: PropTypes.bool
};

export default QuantityController;
