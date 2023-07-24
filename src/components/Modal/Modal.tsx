import { createPortal } from 'react-dom';
import { Fragment, ReactNode } from 'react';
import PropTypes from 'prop-types';

import { CloseIcon } from '../Icons';

interface ModalProps {
  isVisible: boolean;
  name?: string;
  children: ReactNode;
  okText?: string;
  cancelText?: string;
  onOk?: () => void;
  onCancel?: () => void;
  okButton?: boolean;
  cancelButton?: boolean;
}

const Modal = ({
  isVisible,
  name,
  children,
  okText = 'Ok',
  cancelText = 'Hủy',
  onOk,
  onCancel,
  okButton = true,
  cancelButton = true
}: ModalProps) => {
  const handleOk = () => {
    onOk && onOk();
  };

  const handleCancel = () => {
    onCancel && onCancel();
  };

  return createPortal(
    <Fragment>
      {isVisible && (
        <div className='flex justify-center items-center fixed inset-0 z-[99999999]'>
          <div className='bg-black/30 fixed inset-0' onClick={handleCancel}></div>
          <div className='bg-white z-10 rounded-lg'>
            {/* Head */}
            <div className='flex justify-between items-center px-3 py-2 border-b'>
              <h2 className='font-semibold'>{name && name}</h2>
              <button className='p-1 rounded hover:bg-slate-100/80' onClick={handleCancel}>
                <CloseIcon className='w-5 h-5' />
              </button>
            </div>
            {/* Body */}
            <div className='py-6 px-3 text-[15px]'>{children}</div>
            {/* Foot */}
            {(cancelButton || okButton) && (
              <div className='flex justify-end p-3 border-t'>
                {cancelButton && (
                  <button
                    className='py-2 px-4 rounded text-sm text-white bg-slate-400 hover:bg-slate-400/90 font-medium'
                    onClick={handleCancel}
                  >
                    {cancelText}
                  </button>
                )}
                {okButton && (
                  <button
                    className='py-2 px-4 rounded text-sm text-white bg-blue-600 ml-2 hover:bg-blue-600/90 font-medium'
                    onClick={handleOk}
                  >
                    {okText}
                  </button>
                )}
              </div>
            )}
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
