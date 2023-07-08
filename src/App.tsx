import { Fragment } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToastContainer } from 'react-toastify';

import useElement from './hooks/useElement';

const App = () => {
  const element = useElement();
  return (
    <Fragment>
      {element}
      <ReactQueryDevtools />
      <ToastContainer autoClose={2000} position='top-center' />
    </Fragment>
  );
};

export default App;
