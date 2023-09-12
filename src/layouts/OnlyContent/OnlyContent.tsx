import { Fragment, ReactNode } from 'react';
import PropTypes from 'prop-types';

const OnlyContent = ({ children }: { children: ReactNode }) => {
  return <Fragment>{children}</Fragment>;
};

OnlyContent.propTypes = {
  children: PropTypes.node.isRequired
};

export default OnlyContent;
