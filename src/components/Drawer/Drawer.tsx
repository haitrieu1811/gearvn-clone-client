import classNames from 'classnames';
import PropTypes from 'prop-types';
import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface DrawerProps {
  children: ReactNode;
  isShow: boolean;
  onCancel: () => void;
}

const Drawer = ({ isShow, children, onCancel }: DrawerProps) => {
  return createPortal(
    <div
      onClick={onCancel}
      className={classNames('fixed inset-0 z-[999999] bg-black/50 duration-[400ms]', {
        'opacity-0 pointer-events-none': !isShow,
        'opacity-1 pointer-events-auto': isShow
      })}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={classNames(
          'bg-white fixed top-0 left-0 bottom-0 duration-[400ms] max-w-[80%] max-h-full overflow-y-auto',
          {
            'opacity-0 -translate-x-full': !isShow,
            'opacity-1 translate-x-0': isShow
          }
        )}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

Drawer.propTypes = {
  children: PropTypes.node.isRequired,
  isShow: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default Drawer;
