import PropTypes from 'prop-types';

interface FooterHeadingProps {
  name: string;
  className?: string;
}

const FooterHeading = ({ name, className }: FooterHeadingProps) => {
  return <h3 className={`font-semibold text-sm uppercase mb-2 text-[#111111] ${className}`}>{name}</h3>;
};

FooterHeading.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string
};

export default FooterHeading;
