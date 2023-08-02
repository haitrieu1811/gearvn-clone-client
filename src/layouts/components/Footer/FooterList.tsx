import PropTypes from 'prop-types';

import FooterHeading from './FooterHeading';
import FooterLink from './FooterLink';

interface LinkItem {
  name: string;
}

const FooterList = ({ heading, data }: { heading: string; data: LinkItem[] }) => {
  return (
    <div className='lg:col-span-2 col-span-12 mt-4 lg:mt-0'>
      <FooterHeading name={heading} />
      <ul className='leading-loose'>
        {data.map((item, index) => (
          <li key={index}>
            <FooterLink name={item.name} />
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
