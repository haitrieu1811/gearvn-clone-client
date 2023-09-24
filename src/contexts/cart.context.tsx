import { useQuery } from '@tanstack/react-query';
import { ReactNode, createContext } from 'react';

import useAddress from 'src/hooks/useAddress';
import useCart from 'src/hooks/useCart';
import { Address } from 'src/types/address.type';
import { Purchase } from 'src/types/purchase.type';

interface CartContext {
  cartList: Purchase[];
  cartSize: number;
  getCartQuery: ReturnType<typeof useQuery> | undefined;
  defaultAddress?: Address;
}

const initCartContext: CartContext = {
  cartList: [],
  cartSize: 0,
  getCartQuery: undefined,
  defaultAddress: undefined
};

export const CartContext = createContext<CartContext>(initCartContext);

const CartProvider = ({ children }: { children: ReactNode }) => {
  const { cartList, cartSize, getCartQuery } = useCart();
  const { defaultAddress } = useAddress();
  return (
    <CartContext.Provider
      value={{
        defaultAddress,
        cartList,
        cartSize,
        getCartQuery
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
