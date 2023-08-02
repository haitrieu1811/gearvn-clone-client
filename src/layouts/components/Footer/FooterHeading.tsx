import PropTypes from 'prop-types';

const FooterHeading = ({ name, className }: { name: string; className?: string }) => {
  return <h3 className={`font-semibold text-sm uppercase mb-2 text-[#111111] ${className}`}>{name}</h3>;
};

FooterHeading.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string
};

export default FooterHeading;
