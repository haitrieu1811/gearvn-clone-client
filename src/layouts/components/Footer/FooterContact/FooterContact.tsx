import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

interface FooterContactProps {
  field: string;
  to: string;
  time?: string;
}

const FooterContact = ({ field, to, time }: FooterContactProps) => {
  return (
    <Fragment>
      <span className='text-[#111111] w-[25%]'>{field}</span>
      <Link to='tel:18006975' className='text-[#1982F9] font-semibold mr-1'>
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
