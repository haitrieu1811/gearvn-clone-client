import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Fragment, useContext, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';

import favicon from './assets/images/favicon.ico';
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
      <Helmet>
        <link rel='icon' href={favicon} />
      </Helmet>
      {element}
      <ReactQueryDevtools />
      <ToastContainer autoClose={1500} position='top-center' style={{ zIndex: 999999999999 }} />
    </Fragment>
  );
};

export default App;
