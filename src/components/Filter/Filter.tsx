import Tippy from '@tippyjs/react/headless';
import classNames from 'classnames';
import omit from 'lodash/omit';
import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';

import UseQueryParams from 'src/hooks/useQueryParams';
import { CaretDownIcon } from '../Icons';

interface FilterItem {
  value: string;
  text: string;
}

interface FilterProps {
  data: FilterItem[];
  label: string;
  queryName: string;
}

const Filter = ({ data, label, queryName }: FilterProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = UseQueryParams();
  const defaultValue = useMemo(
    () => (queryName in queryParams ? queryParams[queryName].split('-') : []),
    [queryParams]
  );
  const [isActive, setIsActive] = useState<boolean>(false);
  const [choosenValue, setChoosenValue] = useState<string[]>(defaultValue);
  const isChoosen = useMemo(() => choosenValue.length > 0, [choosenValue]);

  // Xử lý khi mở
  const onShow = () => {
    setIsActive(true);
  };

  // Xử lý khi đóng
  const onHide = () => {
    !isChoosen && setIsActive(false);
  };

  // Chọn một giá trị filter
  const handleChoose = (value: string) => {
    let newChoosenValue: string[];
    if (!choosenValue.includes(value)) newChoosenValue = [...choosenValue, value];
    else newChoosenValue = choosenValue.filter((item) => item !== value);
    setChoosenValue(newChoosenValue);
  };

  // Bỏ chọn
  const handleUnChoose = () => {
    isChoosen && setChoosenValue([]);
    navigate({
      pathname: location.pathname,
      search: createSearchParams(omit(queryParams, [queryName])).toString()
    });
  };

  // Xem kết quả
  const handleSeeResult = () => {
    if (choosenValue.length > 0) {
      const queryValue = choosenValue.join('-');
      navigate({
        pathname: location.pathname,
        search: createSearchParams({
          ...queryParams,
          [queryName]: queryValue
        }).toString()
      });
    }
  };

  const render = () => {
    return (
      <div className='rounded shadow-3xl bg-white relative before:absolute before:left-6 before:bottom-full before:border-[11px] before:border-transparent before:border-b-white'>
        <div className='first:-ml-2 p-4'>
          {data.map((item) => (
            <button
              key={item.value}
              className={classNames('border text-sm rounded p-2 ml-2', {
                'border-[#1982F9] text-[#1982F9]': choosenValue.includes(item.value),
                'border-[#cfcfcf] hover:border-[#1982F9] hover:text-[#1982F9]': !choosenValue.includes(item.value)
              })}
              onClick={() => handleChoose(item.value)}
            >
              {item.text}
            </button>
          ))}
        </div>
        <div className='border-t p-4 flex justify-center'>
          <button
            className={classNames('py-[6px] px-10 border border-primary rounded text-sm text-primary', {
              'pointer-events-none': !isChoosen,
              'opacity-50': !isChoosen
            })}
            onClick={handleUnChoose}
          >
            Bỏ chọn
          </button>
          <button
            className={classNames('py-[6px] px-10 rounded text-sm text-white bg-[#1982F9] ml-3', {
              'pointer-events-none': !isChoosen,
              'opacity-50': !isChoosen
            })}
            onClick={handleSeeResult}
          >
            Xem kết quả
          </button>
        </div>
      </div>
    );
  };

  return (
    <Tippy
      render={render}
      trigger='click'
      interactive
      placement='bottom-start'
      offset={[0, 11]}
      onShow={onShow}
      onHide={onHide}
    >
      <button
        className={classNames('px-[10px] py-2 border flex justify-between items-center rounded', {
          'border-[#1982F9]': isActive,
          'border-[#cfcfcf]': !isActive
        })}
      >
        <span
          className={classNames('text-sm', {
            'text-[#1982F9]': isChoosen,
            'text-[#111111]': !isChoosen
          })}
        >
          {label}
        </span>
        <CaretDownIcon
          className={classNames('w-2 h-2 fill-[#111111] ml-2', {
            'fill-[#1982F9]': isChoosen,
            'fill-[#111111]': !isChoosen
          })}
        />
      </button>
    </Tippy>
  );
};

Filter.propTypes = {
  label: PropTypes.string.isRequired,
  queryName: PropTypes.string.isRequired
};

export default Filter;
