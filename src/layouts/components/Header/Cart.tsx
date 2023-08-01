import { CartIcon } from 'src/components/Icons';

const Cart = ({ cartSize }: { cartSize: number }) => {
  return (
    <div className='relative'>
      <CartIcon className='w-[18px]' />
      <span className='absolute -top-2 -right-2 bg-[#FDD835] text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold border-[2px] border-white'>
        {cartSize}
      </span>
    </div>
  );
};

export default Cart;
