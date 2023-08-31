import { Gender, UserRole } from 'src/constants/enum';
import { OptionsSelect } from 'src/components/Select/Select';

export const GENDERS = [
  {
    value: Gender.Male,
    text: 'Nam'
  },
  {
    value: Gender.Female,
    text: 'Nữ'
  },
  {
    value: Gender.Other,
    text: 'Khác'
  }
];

export const ROLES = [
  {
    value: UserRole.Customer,
    text: 'Khách hàng'
  },
  {
    value: UserRole.Seller,
    text: 'Nhân viên'
  }
];

export const LIMIT_OPTIONS: OptionsSelect[] = [
  {
    value: '10',
    text: '10 bản ghi'
  },
  {
    value: '20',
    text: '20 bản ghi'
  },
  {
    value: '30',
    text: '30 bản ghi'
  }
];
