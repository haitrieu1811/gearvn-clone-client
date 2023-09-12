import PropTypes from 'prop-types';

interface HeadingProps {
  name: string;
  className?: string;
}

const Heading = ({ name, className }: HeadingProps) => {
  return <h3 className={`font-semibold text-sm uppercase mb-2 text-[#111111] ${className}`}>{name}</h3>;
};

Heading.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string
};

export default Heading;
