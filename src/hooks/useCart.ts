import { useQuery } from '@tanstack/react-query';
import { useContext, useMemo } from 'react';

import purchaseApi from 'src/apis/purchase.api';
import { AppContext } from 'src/contexts/app.context';

const useCart = () => {
  const { profile } = useContext(AppContext);

  // Query: Lấy danh sách sản phẩm trong giỏ hàng
  const getCartQuery = useQuery({
    queryKey: ['cart', profile?._id],
    queryFn: () => purchaseApi.getCart(),
    enabled: !!profile?._id
  });

  // Danh sách sản phẩm trong giỏ hàng
  const cartList = useMemo(
    () => getCartQuery.data?.data.data.cart_list || [],
    [getCartQuery.data?.data.data.cart_list]
  );

  // Số lượng sản phẩm trong giỏ hàng
  const cartSize = useMemo(() => getCartQuery.data?.data.data.cart_size || 0, [getCartQuery.data?.data.data.cart_size]);

  return {
    cartList,
    cartSize,
    getCartQuery
  };
};

export default useCart;
