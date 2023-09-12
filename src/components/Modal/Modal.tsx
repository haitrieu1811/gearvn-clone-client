import PropTypes from 'prop-types';
import { Fragment, ReactNode } from 'react';
import { createPortal } from 'react-dom';

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
  modalHeader?: boolean;
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
  cancelButton = true,
  modalHeader = true
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
        <div className='flex justify-center items-center fixed inset-0 z-[99999999] duration-300'>
          <div className='bg-black/30 fixed inset-0' onClick={handleCancel} />
          <div className='bg-white z-10 max-w-[90%] duration-300'>
            {/* Head */}
            {modalHeader && (
              <div className='flex justify-between items-center px-3 py-2 border-b rounded-tl-md rounded-tr-md'>
                <h2 className='font-semibold text-sm md:text-base'>{name && name}</h2>
                <button className='p-1 rounded hover:bg-slate-100/80' onClick={handleCancel}>
                  <CloseIcon className='w-4 h-4 md:w-5 md:h-5' />
                </button>
              </div>
            )}
            {/* Body */}
            <div>{children}</div>
            {/* Foot */}
            {(cancelButton || okButton) && (
              <div className='flex justify-end p-3 border-t rounded-bl-md rounded-br-md'>
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
  name: PropTypes.string,
  children: PropTypes.node.isRequired,
  okText: PropTypes.string,
  cancelText: PropTypes.string,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  okButton: PropTypes.bool,
  cancelButton: PropTypes.bool,
  modalHeader: PropTypes.bool
};

export default Modal;
