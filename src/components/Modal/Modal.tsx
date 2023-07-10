import { createPortal } from 'react-dom';
import { Fragment, ReactNode } from 'react';
import PropTypes from 'prop-types';

import { CloseIcon } from '../Icons';

interface ModalProps {
  isVisible: boolean;
  children: ReactNode;
  okText?: string;
  cancelText?: string;
  onOk?: () => void;
  onCancel?: () => void;
}

const Modal = ({ isVisible, children, okText = 'Ok', cancelText = 'Hủy', onOk, onCancel }: ModalProps) => {
  const handleOk = () => {
    onOk && onOk();
  };

  const handleCancel = () => {
    onCancel && onCancel();
  };

  return createPortal(
    <Fragment>
      {isVisible && (
        <div className='flex justify-center items-center fixed inset-0'>
          <div className='bg-black/30 fixed inset-0'></div>
          <div className='bg-white z-10 rounded-lg'>
            <div className='flex justify-between items-center px-3 py-2 border-b'>
              <div></div>
              <button className='p-1 rounded hover:bg-slate-100/80' onClick={handleCancel}>
                <CloseIcon className='w-5 h-5' />
              </button>
            </div>
            <div className='px-3 py-6 border-b'>{children}</div>
            <div className='flex justify-end p-3'>
              <button
                className='py-2 px-4 rounded text-sm text-white bg-slate-400 hover:bg-slate-400/90'
                onClick={handleCancel}
              >
                {cancelText}
              </button>
              <button
                className='py-2 px-4 rounded text-sm text-white bg-blue-600 ml-2 hover:bg-blue-600/90'
                onClick={handleOk}
              >
                {okText}
              </button>
            </div>
          </div>
        </div>
      )}
    </Fragment>,
    document.body
  );
};

Modal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onOk: PropTypes.func,
  onCancel: PropTypes.func
};

export default Modal;
