import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import PATH from 'src/constants/path';

interface FooterLinkProps {
  to?: string;
  name: string;
}

const FooterLink = ({ to = PATH.HOME, name }: FooterLinkProps) => {
  return (
    <Link to={to} className='text-xs md:text-sm hover:underline hover:text-primary'>
      {name}
    </Link>
  );
};

FooterLink.propTypes = {
  to: PropTypes.string,
  name: PropTypes.string.isRequired
};

export default FooterLink;
