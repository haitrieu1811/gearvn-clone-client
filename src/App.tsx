import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Fragment, useContext, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';

import { AppContext } from './contexts/app.context';
import { ChatContext } from './contexts/chat.context';
import useElement from './hooks/useElement';
import { localStorageEventTarget } from './utils/auth';

const App = () => {
  const element = useElement();
  const { resetAuth } = useContext(AppContext);
  const { resetChat } = useContext(ChatContext);

  // Xóa dữ liệu đăng nhập khi đăng xuất
  useEffect(() => {
    localStorageEventTarget.addEventListener('clearLS', resetAuth);
    return () => {
      localStorageEventTarget.removeEventListener('clearLS', resetAuth);
    };
  }, [resetAuth]);

  // Xóa dữ liệu chat khi đăng xuất
  useEffect(() => {
    localStorageEventTarget.addEventListener('clearChat', resetChat);
    return () => {
      localStorageEventTarget.removeEventListener('clearChat', resetChat);
    };
  }, [resetChat]);

  return (
    <Fragment>
      {element}
      <ReactQueryDevtools />
      <ToastContainer autoClose={1500} position='top-center' style={{ zIndex: 999999999999 }} />
    </Fragment>
  );
};

export default App;
