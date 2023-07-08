import { Fragment, ReactNode } from 'react';

const OnlyContent = ({ children }: { children: ReactNode }) => {
  return <Fragment>{children}</Fragment>;
};

export default OnlyContent;
