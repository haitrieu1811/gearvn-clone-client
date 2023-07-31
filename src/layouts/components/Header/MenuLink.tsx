import PropTypes from 'prop-types';
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { MenuLinkArrowIcon } from 'src/components/Icons';

interface MenuLinkProps {
  to: string;
  icon: ReactNode;
  name: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const MenuLink = ({ to, icon, name, onMouseEnter, onMouseLeave }: MenuLinkProps) => {
  return (
    <Link
      to={to}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className='relative flex justify-between items-center px-4 py-[6px] hover:bg-[#ea1c04] group after:absolute after:left-full after:top-0 after:bottom-0 after:border-[16px] after:border-transparent after:border-l-[#ea1c04] z-10 after:hidden hover:after:block'
    >
      <span className='flex items-center'>
        <div className='w-6 group-hover:stroke-white group-hover:fill-white'>{icon}</div>
        <span className='text-[13px] ml-3 group-hover:text-white'>{name}</span>
      </span>
      <MenuLinkArrowIcon className='w-2 h-2 stroke-black group-hover:stroke-white' />
    </Link>
  );
};

MenuLink.propTypes = {
  to: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};

export default MenuLink;
