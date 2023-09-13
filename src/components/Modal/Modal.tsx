import PropTypes from 'prop-types';
import { Fragment, ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { CloseIcon, ExclamationCircleIcon } from '../Icons';

interface ModalProps {
  isVisible: boolean;
  icon?: ReactNode;
  name?: string;
  closeButton?: boolean;
  children: ReactNode;
  okText?: string;
  cancelText?: string;
  onOk?: () => void;
  onCancel?: () => void;
  okButton?: boolean;
  cancelButton?: boolean;
  paddingBody?: boolean;
}

const Modal = ({
  isVisible,
  icon = <ExclamationCircleIcon className='w-5 h-5 mr-3 text-red-600 stroke-[2]' />,
  name,
  closeButton = true,
  children,
  okText = 'Xác nhận',
  cancelText = 'Hủy bỏ',
  onOk,
  onCancel,
  okButton = true,
  cancelButton = true,
  paddingBody = true
}: ModalProps) => {
  // Xử lý khi nhấn nút xác nhận
  const handleOk = () => {
    onOk && onOk();
  };

  // Xử lý khi nhấn nút hủy bỏ
  const handleCancel = () => {
    onCancel && onCancel();
  };

  return createPortal(
    <Fragment>
      {isVisible && (
        <div className='flex justify-center items-center fixed inset-0 z-[99999999]'>
          <div className='bg-slate-900/50 fixed inset-0 backdrop-blur-sm' onClick={handleCancel} />
          <div className='z-10 max-w-[90%]'>
            {/* Head */}
            {(name || icon || closeButton) && (
              <div className='flex justify-between items-center p-3 rounded-t-lg bg-white'>
                <div className='ml-3 flex items-center'>
                  {icon && icon} <span className='font-semibold text-slate-900 line-clamp-1'>{name && name}</span>
                </div>
                {closeButton && (
                  <button className='p-1 ml-6 rounded hover:bg-slate-100/80' onClick={handleCancel}>
                    <CloseIcon className='w-5 h-5' />
                  </button>
                )}
              </div>
            )}
            {/* Body */}
            <div className={paddingBody ? 'p-6 bg-white' : 'bg-white'}>{children}</div>
            {/* Foot */}
            {(cancelButton || okButton) && (
              <div className='flex justify-end flex-wrap p-4 rounded-b-lg bg-white'>
                {cancelButton && (
                  <button
                    className='py-2 px-4 w-full md:w-auto text-sm rounded bg-slate-100 hover:bg-slate-50 font-semibold'
                    onClick={handleCancel}
                  >
                    {cancelText}
                  </button>
                )}
                {okButton && (
                  <button
                    className='py-2 px-4 w-full md:w-auto text-sm rounded text-white bg-blue-600 hover:bg-blue-500 font-semibold md:ml-2 mt-2 md:mt-0'
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
  icon: PropTypes.node,
  name: PropTypes.string,
  closeButton: PropTypes.bool,
  children: PropTypes.node.isRequired,
  okText: PropTypes.string,
  cancelText: PropTypes.string,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  okButton: PropTypes.bool,
  cancelButton: PropTypes.bool,
  paddingBody: PropTypes.bool
};

export default Modal;
