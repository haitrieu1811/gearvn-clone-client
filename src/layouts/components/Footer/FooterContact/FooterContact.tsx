import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const FooterContact = ({ field, to, time }: { field: string; to: string; time?: string }) => {
  return (
    <Fragment>
      <span className='text-[#111111] w-[25%]'>{field}</span>
      <Link to='tel:18006975' className='text-[#1982F9] font-bold mr-1'>
        {to}
      </Link>
      <span className='text-[#111111]'>{time}</span>
    </Fragment>
  );
};

FooterContact.propTypes = {
  field: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  time: PropTypes.string
};

export default FooterContact;
