import { useState, ChangeEvent, useEffect } from 'react';
import { range } from 'lodash';

interface DateSelectProps {
  onChange?: (date: Date) => void;
  value?: Date;
}

const DateSelect = ({ onChange, value }: DateSelectProps) => {
  const [date, setDate] = useState<{
    date: number;
    month: number;
    year: number;
  }>({
    date: 1,
    month: 0,
    year: 1910
  });

  useEffect(() => {
    if (value) {
      setDate({
        date: value.getDate() || 1,
        month: value.getMonth() || 0,
        year: value.getFullYear() || 1910
      });
    }
  }, [value]);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newDate = {
      ...date,
      [name]: Number(value)
    };
    setDate(newDate);
    onChange && onChange(new Date(newDate.year, newDate.month, newDate.date));
  };

  return (
    <div className='grid grid-cols-12 gap-6'>
      <select
        name='date'
        value={date.date}
        className='col-span-4 border border-[#cfcfcf] rounded h-10 px-4 outline-none text-[#535353]'
        onChange={handleChange}
      >
        <option disabled>Ngày</option>
        {range(1, 32).map((date) => (
          <option key={date} value={date}>
            {date}
          </option>
        ))}
      </select>
      <select
        name='month'
        value={date.month}
        className='col-span-4 border border-[#cfcfcf] rounded h-10 px-4 outline-none text-[#535353]'
        onChange={handleChange}
      >
        <option disabled>Tháng</option>
        {range(0, 12).map((month) => (
          <option key={month} value={month}>
            {month + 1}
          </option>
        ))}
      </select>
      <select
        name='year'
        value={date.year}
        className='col-span-4 border border-[#cfcfcf] rounded h-10 px-4 outline-none text-[#535353]'
        onChange={handleChange}
      >
        <option disabled>Năm</option>
        {range(1910, 2024).map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DateSelect;
