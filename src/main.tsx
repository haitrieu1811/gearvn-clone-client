import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';
import AppProvider from './contexts/app.context.tsx';
import CartProvider from './contexts/cart.context.tsx';
import ChatProvider from './contexts/chat.context.tsx';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <HelmetProvider>
        <AppProvider>
          <ChatProvider>
            <CartProvider>
              <ErrorBoundary>
                <ScrollToTop>
                  <App />
                </ScrollToTop>
              </ErrorBoundary>
            </CartProvider>
          </ChatProvider>
        </AppProvider>
      </HelmetProvider>
    </BrowserRouter>
  </QueryClientProvider>
);
