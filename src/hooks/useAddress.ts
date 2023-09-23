import { useMutation, useQuery } from '@tanstack/react-query';
import { useContext, useMemo } from 'react';

import addressApi from 'src/apis/address.api';
import { AppContext } from 'src/contexts/app.context';

const useAddress = () => {
  const { profile } = useContext(AppContext);

  // Query: Lấy danh sách địa chỉ
  const getAddressesQuery = useQuery({
    queryKey: ['addresses', profile?._id],
    queryFn: () => addressApi.getAddresses(),
    enabled: !!profile?._id
  });

  // Mutation: Xóa địa chỉ
  const deleteAddressMutation = useMutation(addressApi.deleteAddress);

  // Mutation: Thiết lập địa chỉ mặc định
  const setDefaultAddressMutation = useMutation({
    mutationFn: addressApi.setDefaultAddress,
    onSuccess: () => {
      getAddressesQuery?.refetch();
    }
  });

  // Danh sách địa chỉ
  const addresses = useMemo(
    () => getAddressesQuery.data?.data.data.addresses || [],
    [getAddressesQuery.data?.data.data.addresses]
  );

  // Địa chỉ mặc định
  const defaultAddress = useMemo(() => addresses?.find((address) => address.is_default), [addresses]);

  return {
    getAddressesQuery,
    deleteAddressMutation,
    setDefaultAddressMutation,
    addresses,
    defaultAddress
  };
};

export default useAddress;
