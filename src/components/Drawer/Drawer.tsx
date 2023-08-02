import classNames from 'classnames';
import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface DrawerProps {
  children: ReactNode;
  isShow: boolean;
  onCancel: () => void;
}

const Drawer = ({ isShow, children, onCancel }: DrawerProps) => {
  return createPortal(
    <div className='fixed inset-0 z-[9999999999] pointer-events-none'>
      <div
        tabIndex={0}
        aria-hidden='true'
        role='button'
        className={classNames('fixed inset-0 bg-black/50', {
          'opacity-0 pointer-events-none': !isShow,
          'opacity-100 pointer-events-auto': isShow
        })}
        onClick={onCancel}
      />
      <div
        className={classNames('bg-white absolute top-0 bottom-0 duration-300 max-w-[80%]', {
          'left-0': isShow,
          '-left-full': !isShow
        })}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Drawer;
