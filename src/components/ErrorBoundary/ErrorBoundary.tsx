import { Component, ErrorInfo, ReactNode } from 'react';
import PATH from 'src/constants/path';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className='h-screen flex justify-center items-center flex-col bg-[#131b2e]'>
          <h1 className='text-[50px] font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent text-center'>
            Sorry.. there was an error
          </h1>
          <a
            href={PATH.HOME}
            className='mt-6 text-white rounded px-4 py-3 font-semibold bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500'
          >
            Back home
          </a>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
