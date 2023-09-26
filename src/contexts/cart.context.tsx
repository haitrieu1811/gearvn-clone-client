import { useQuery } from '@tanstack/react-query';
import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from 'react';

import useAddress from 'src/hooks/useAddress';
import useCart from 'src/hooks/useCart';
import { Address } from 'src/types/address.type';
import { Purchase } from 'src/types/purchase.type';
import { AppContext } from './app.context';

interface CartContext {
  cartList: Purchase[];
  cartSize: number;
  voucherCode: string;
  setVoucherCode: Dispatch<SetStateAction<string>>;
  totalReduced: number;
  setTotalReduced: Dispatch<SetStateAction<number>>;
  isUsingVoucher: boolean;
  setIsUsingVoucher: Dispatch<SetStateAction<boolean>>;
  getCartQuery: ReturnType<typeof useQuery> | undefined;
  defaultAddress?: Address;
  totalPayment: number;
}

const initCartContext: CartContext = {
  cartList: [],
  cartSize: 0,
  voucherCode: '',
  setVoucherCode: () => null,
  totalReduced: 0,
  setTotalReduced: () => null,
  isUsingVoucher: false,
  setIsUsingVoucher: () => null,
  getCartQuery: undefined,
  defaultAddress: undefined,
  totalPayment: 0
};

export const CartContext = createContext<CartContext>(initCartContext);

const CartProvider = ({ children }: { children: ReactNode }) => {
  const { cartList, cartSize, getCartQuery } = useCart();
  const { defaultAddress } = useAddress();
  const [voucherCode, setVoucherCode] = useState<string>(initCartContext.voucherCode);
  const [totalReduced, setTotalReduced] = useState<number>(initCartContext.totalReduced);
  const [isUsingVoucher, setIsUsingVoucher] = useState<boolean>(initCartContext.isUsingVoucher);
  const { cartTotal } = useContext(AppContext);
  const totalPayment = cartTotal - totalReduced > 0 ? cartTotal - totalReduced : 0;

  return (
    <CartContext.Provider
      value={{
        defaultAddress,
        cartList,
        cartSize,
        voucherCode,
        setVoucherCode,
        totalReduced,
        setTotalReduced,
        isUsingVoucher,
        setIsUsingVoucher,
        getCartQuery,
        totalPayment
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
