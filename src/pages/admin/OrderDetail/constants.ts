import { OrderStatus } from 'src/constants/enum';

export const ORDER_PROGRESS = [
  {
    name: 'Mới',
    value: OrderStatus.New
  },
  {
    name: 'Đang xử lý',
    value: OrderStatus.Processing
  },
  {
    name: 'Đang giao',
    value: OrderStatus.Delivering
  },
  {
    name: 'Thành công',
    value: OrderStatus.Succeed
  },
  {
    name: 'Đã hủy',
    value: OrderStatus.Canceled
  }
] as const;
