import PropTypes from 'prop-types';
import { Fragment, ReactNode } from 'react';

const OnlyContent = ({ children }: { children: ReactNode }) => {
  return <Fragment>{children}</Fragment>;
};

OnlyContent.propTypes = {
  children: PropTypes.node.isRequired
};

export default OnlyContent;
