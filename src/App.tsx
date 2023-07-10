import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Fragment, useContext, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';

import { AppContext } from './contexts/app.context';
import useElement from './hooks/useElement';
import { localStorageEventTarget } from './utils/auth';

const App = () => {
  const element = useElement();
  const { reset } = useContext(AppContext);

  useEffect(() => {
    localStorageEventTarget.addEventListener('clearLS', reset);
    return () => {
      localStorageEventTarget.removeEventListener('clearLS', reset);
    };
  }, [reset]);

  return (
    <Fragment>
      {element}
      <ReactQueryDevtools />
      <ToastContainer autoClose={2000} position='top-center' />
    </Fragment>
  );
};

export default App;
