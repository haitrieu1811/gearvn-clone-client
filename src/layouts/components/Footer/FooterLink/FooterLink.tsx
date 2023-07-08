import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import PATH from 'src/constants/path';

const FooterLink = ({ to = PATH.HOME, name }: { to?: string; name: string }) => {
  return (
    <Link to={to} className='text-sm hover:underline hover:text-primary'>
      {name}
    </Link>
  );
};

FooterLink.propTypes = {
  to: PropTypes.string,
  name: PropTypes.string.isRequired
};

export default FooterLink;
