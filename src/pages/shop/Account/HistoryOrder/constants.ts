import { OrderStatus } from 'src/constants/enum';

interface NavLink {
  status: OrderStatus;
  name: string;
}

export const NAV_LINKS: NavLink[] = [
  {
    status: OrderStatus.All,
    name: 'Tất cả'
  },
  {
    status: OrderStatus.New,
    name: 'Mới'
  },
  {
    status: OrderStatus.Processing,
    name: 'Đang xử lý'
  },
  {
    status: OrderStatus.Delivering,
    name: 'Đang vận chuyển'
  },
  {
    status: OrderStatus.Succeed,
    name: 'Hoàn thành'
  },
  {
    status: OrderStatus.Cancelled,
    name: 'Hủy'
  }
];
