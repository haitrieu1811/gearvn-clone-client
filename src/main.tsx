import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';
import AppProvider from './contexts/app.context.tsx';
import './i18n/i18n.ts';
import './index.css';
import Loading from './components/Loading/Loading.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Suspense
        fallback={
          <div className='min-h-screen bg-white flex justify-center items-center'>
            <Loading />
          </div>
        }
      >
        <HelmetProvider>
          <AppProvider>
            <ErrorBoundary>
              <ScrollToTop>
                <App />
              </ScrollToTop>
            </ErrorBoundary>
          </AppProvider>
        </HelmetProvider>
      </Suspense>
    </BrowserRouter>
  </QueryClientProvider>
  // </React.StrictMode>
);
