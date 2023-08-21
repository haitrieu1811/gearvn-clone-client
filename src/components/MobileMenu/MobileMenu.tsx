import { useState } from 'react';

import { CloseIcon, LaptopIcon, PcIcon } from 'src/components/Icons';
import PATH from 'src/constants/path';
import MobileMenuItem from './MobileMenuItem';

interface MobileMenuProps {
  onCancel: () => void;
}

const MobileMenu = ({ onCancel }: MobileMenuProps) => {
  const [currParentIndex, setCurrParentIndex] = useState<number | null>(null);
  const [currChildIndex, setCurrChildIndex] = useState<number | null>(null);

  const toggleParent = (index: number) => {
    if (currParentIndex !== index) setCurrParentIndex(index);
    else setCurrParentIndex(null);
  };

  const toggleChild = (index: number) => {
    if (currChildIndex !== index) setCurrChildIndex(index);
    else setCurrChildIndex(null);
  };

  return (
    <div className='w-[320px] max-w-[80vw]'>
      <div className='flex justify-between items-center py-3 px-4 bg-primary sticky top-0'>
        <h2 className='text-sm text-white uppercase font-semibold'>Danh mục sản phẩm</h2>
        <button onClick={onCancel}>
          <CloseIcon className='w-[22px] h-[22px] stroke-white stroke-[3]' />
        </button>
      </div>
      <div>
        <MobileMenuItem
          index={1}
          parentTo={`${PATH.PRODUCT}?category=64afbb1839753e4263bc467e-64bcd8a8ae38e6a282211269`}
          currParentIndex={currParentIndex}
          currChildIndex={currChildIndex}
          keyOfMenu='LAPTOP'
          name='Laptop'
          toggleParent={toggleParent}
          toggleChild={toggleChild}
          icon={<LaptopIcon className='mr-[15px] group-[active]:stroke-primary' />}
        />
        <MobileMenuItem
          index={2}
          parentTo={`${PATH.PRODUCT}?category=64bce8fe3d7142dc614a26c5`}
          currParentIndex={currParentIndex}
          currChildIndex={currChildIndex}
          keyOfMenu='PC_GAMING'
          name='PC gaming'
          toggleParent={toggleParent}
          toggleChild={toggleChild}
          icon={<PcIcon className='mr-[15px] group-[active]:stroke-primary' />}
        />
      </div>
    </div>
  );
};

export default MobileMenu;
