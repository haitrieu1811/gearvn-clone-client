import { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';

import HeaderChat from '../components/HeaderChat';

const ChatLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Helmet>
        <title>Gearvn Clone | Chat</title>
      </Helmet>
      <HeaderChat />
      {children}
    </div>
  );
};

export default ChatLayout;
