import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
import PATH from 'src/constants/path';
import FooterHeading from '../FooterHeading';

interface LinkItem {
  path?: string;
  name: string;
}

interface FooterListProps {
  heading: string;
  data: LinkItem[];
}

const FooterList = ({ heading, data }: FooterListProps) => {
  return (
    <div className='lg:col-span-2 col-span-12 mt-2 md:mt-4 lg:mt-0'>
      <FooterHeading name={heading} />
      <ul className='md:leading-loose'>
        {data.map((item, index) => (
          <li key={index}>
            <Link to={PATH.HOME} className='text-xs md:text-sm hover:underline hover:text-primary'>
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

FooterList.propTypes = {
  heading: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired
};

export default FooterList;
