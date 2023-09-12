import classNames from 'classnames';
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { MENU_DATA } from 'src/constants/header';
import PATH from 'src/constants/path';
import { ChevronDownIcon } from '../Icons';

interface MobileMenuItemProps {
  index: number;
  currParentIndex: number | null;
  currChildIndex: number | null;
  toggleParent: (index: number) => void;
  toggleChild: (index: number) => void;
  keyOfMenu: 'LAPTOP' | 'PC_GAMING';
  icon: ReactNode;
  name: string;
  parentTo: string;
}

const MobileMenuItem = ({
  index,
  currParentIndex,
  currChildIndex,
  toggleParent,
  toggleChild,
  keyOfMenu,
  icon,
  name,
  parentTo
}: MobileMenuItemProps) => {
  return (
    <div key={index} className='border-b'>
      <div className='py-3 px-5 flex justify-between items-center' onClick={() => toggleParent(index)}>
        <Link
          to={parentTo}
          className={classNames('flex items-center uppercase text-[13px] text-[#111111]', {
            'groupactive text-primary': currParentIndex === index
          })}
        >
          {icon}
          {name}
        </Link>
        <ChevronDownIcon className='w-3 h-3 stroke-[4]' />
      </div>
      {MENU_DATA[keyOfMenu].map((item, _index) => (
        <div
          key={_index}
          className={classNames('duration-300', {
            hidden: !(index === currParentIndex),
            block: index === currParentIndex
          })}
        >
          <div
            className='flex justify-between items-center pl-[65px] py-3 pr-5 duration-500'
            onClick={() => toggleChild(_index)}
          >
            <Link
              to={PATH.HOME}
              className={classNames('text-[13px]', {
                'text-[#111111]': !(_index === currChildIndex),
                'text-primary': _index === currChildIndex
              })}
            >
              {item.heading}
            </Link>
            <ChevronDownIcon className='w-3 h-3 stroke-[4]' />
          </div>
          <div
            className={classNames('duration-300', {
              hidden: !(index === currParentIndex && _index === currChildIndex),
              block: index === currParentIndex && _index === currChildIndex
            })}
          >
            {item.data.map((item, __index) => (
              <div key={__index} className='pl-20 pr-5'>
                <Link
                  to={item.to}
                  className='py-3 px-4 text-[13px] text-[#111111] block relative before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[6px] before:h-[6px] before:rounded-full before:border before:border-black'
                >
                  {item.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

MobileMenuItem.propTypes = {
  index: PropTypes.number.isRequired,
  currParentIndex: PropTypes.number,
  currChildIndex: PropTypes.number,
  toggleParent: PropTypes.func.isRequired,
  toggleChild: PropTypes.func.isRequired,
  keyOfMenu: PropTypes.oneOf(['LAPTOP', 'PC_GAMING']).isRequired,
  icon: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  parentTo: PropTypes.string.isRequired
};

export default MobileMenuItem;
