import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

import App from './App.tsx';
import ScrollToTop from './components/ScrollToTop';
import AppProvider from './contexts/app.context.tsx';
import './i18n/i18n.ts';
import './index.css';
import ErrorBoundary from './components/ErrorBoundary';

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
      <HelmetProvider>
        <AppProvider>
          <ErrorBoundary>
            <ScrollToTop>
              <App />
            </ScrollToTop>
          </ErrorBoundary>
        </AppProvider>
      </HelmetProvider>
    </BrowserRouter>
  </QueryClientProvider>
  // </React.StrictMode>
);
