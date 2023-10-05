import { useQuery } from '@tanstack/react-query';
import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useMemo, useState } from 'react';

import addressApi from 'src/apis/address.api';
import purchaseApi from 'src/apis/purchase.api';
import { Address } from 'src/types/address.type';
import { Purchase } from 'src/types/purchase.type';
import { AppContext } from './app.context';
import { ExtendedContext } from './extended.context';

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
  const { profile } = useContext(AppContext);
  const { cartTotal } = useContext(ExtendedContext);
  const [voucherCode, setVoucherCode] = useState<string>(initCartContext.voucherCode);
  const [totalReduced, setTotalReduced] = useState<number>(initCartContext.totalReduced);
  const [isUsingVoucher, setIsUsingVoucher] = useState<boolean>(initCartContext.isUsingVoucher);
  const totalPayment = cartTotal - totalReduced > 0 ? cartTotal - totalReduced : 0;

  // Query: Lấy danh sách sản phẩm trong giỏ hàng
  const getCartQuery = useQuery({
    queryKey: ['cart', profile?._id],
    queryFn: () => purchaseApi.getCart(),
    enabled: !!profile?._id
  });

  // Danh sách sản phẩm trong giỏ hàng
  const cartList = useMemo(() => {
    return getCartQuery.data?.data.data.cart_list || [];
  }, [getCartQuery.data?.data.data.cart_list]);

  // Số lượng sản phẩm trong giỏ hàng
  const cartSize = useMemo(() => getCartQuery.data?.data.data.cart_size || 0, [getCartQuery.data?.data.data.cart_size]);

  // Query: Lấy danh sách địa chỉ
  const getAddressesQuery = useQuery({
    queryKey: ['addresses', profile?._id],
    queryFn: () => addressApi.getAddresses(),
    enabled: !!profile?._id,
    staleTime: Infinity
  });

  // Danh sách địa chỉ
  const addresses = useMemo(
    () => getAddressesQuery.data?.data.data.addresses,
    [getAddressesQuery.data?.data.data.addresses]
  );

  // Địa chỉ mặc định
  const defaultAddress = useMemo(() => addresses?.find((address) => address.is_default), [addresses]);

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
