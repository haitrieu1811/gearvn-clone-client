import Tippy from '@tippyjs/react/headless';
import { ReactNode } from 'react';
import PropTypes from 'prop-types';

import { EllipsisHorizontalIcon } from '../Icons';

interface MenuItem {
  icon?: ReactNode;
  label: string;
  onClick: () => void;
}

interface ContextMenuProps {
  items: MenuItem[];
  wrapperClassName?: string;
}

const ContextMenu = ({ items, wrapperClassName }: ContextMenuProps) => {
  // Render menu items
  const renderItems = () => (
    <div className='bg-white rounded-lg shadow-2xl border py-2'>
      {items.map((item, index) => (
        <div
          key={index}
          onClick={item.onClick}
          aria-hidden='true'
          role='button'
          tabIndex={0}
          className='flex items-center pl-4 pr-14 py-2 hover:bg-slate-100/50'
        >
          {item.icon && <div className='w-4 h-4 mr-3'>{item.icon}</div>}
          <div className='text-sm text-slate-700'>{item.label}</div>
        </div>
      ))}
    </div>
  );

  return (
    <div className={wrapperClassName}>
      <Tippy interactive={true} trigger='click' placement='bottom-end' offset={[0, 0]} render={renderItems}>
        <button className='w-8 h-8 flex justify-center items-center rounded-full border border-transparent active:bg-slate-100/80 active:border-[#fcfcfc]'>
          <EllipsisHorizontalIcon className='w-5 h-5' />
        </button>
      </Tippy>
    </div>
  );
};

ContextMenu.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.node,
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired
    }).isRequired
  ),
  wrapperClassName: PropTypes.string
};

export default ContextMenu;
