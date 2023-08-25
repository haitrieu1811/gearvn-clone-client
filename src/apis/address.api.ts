import {
  AddAddressRequestBody,
  GetAddressResponse,
  GetAddressesListResponse,
  UpdateAddressRequestBody
} from 'src/types/user.type';
import { OnlyMessageResponse } from 'src/types/utils.type';
import http from 'src/utils/http';

const addressApi = {
  addAddress(body: AddAddressRequestBody) {
    return http.post<OnlyMessageResponse>('/addresses', body);
  },
  getAddresses() {
    return http.get<GetAddressesListResponse>(`/addresses`);
  },
  getAddress(address_id: string) {
    return http.get<GetAddressResponse>(`/addresses/${address_id}`);
  },
  updateAddress({ body, address_id }: { body: UpdateAddressRequestBody; address_id: string }) {
    return http.put<OnlyMessageResponse>(`/addresses/${address_id}`, body);
  },
  deleteAddress(address_id: string) {
    return http.delete<OnlyMessageResponse>(`/addresses/${address_id}`);
  },
  setDefaultAddress(address_id: string) {
    return http.put<OnlyMessageResponse>(`/addresses/set-default/${address_id}`);
  }
};

export default addressApi;
