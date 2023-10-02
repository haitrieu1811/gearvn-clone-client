import PropTypes from 'prop-types';

import FooterHeading from '../Heading/Heading';
import FooterLink from '../Link/Link';

interface LinkItem {
  name: string;
}

interface ListProps {
  heading: string;
  data: LinkItem[];
}

const List = ({ heading, data }: ListProps) => {
  return (
    <div className='lg:col-span-2 col-span-12 mt-2 md:mt-4 lg:mt-0'>
      <FooterHeading name={heading} />
      <ul className='md:leading-loose'>
        {data.map((item, index) => (
          <li key={index}>
            <FooterLink name={item.name} />
          </li>
        ))}
      </ul>
    </div>
  );
};

List.propTypes = {
  heading: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired
};

export default List;
