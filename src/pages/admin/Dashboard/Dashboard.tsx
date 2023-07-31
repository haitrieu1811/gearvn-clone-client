import { useQuery } from '@tanstack/react-query';
import { useMemo, Fragment } from 'react';

import userApi from 'src/apis/user.api';
import { ItemIcon } from 'src/components/Icons';
import { QuantityPerCollection } from 'src/types/user.type';

const Dashboard = () => {
  const getQuantityPerCollectionQuery = useQuery({
    queryKey: ['quantity_per_collection'],
    queryFn: () => userApi.getQuantityPerCollection()
  });

  const quantityPerCollection = useMemo(
    () => getQuantityPerCollectionQuery.data?.data.data,
    [getQuantityPerCollectionQuery.data?.data.data]
  );

  console.log(quantityPerCollection);

  return (
    <div>
      {quantityPerCollection && (
        <Fragment>
          <h2 className='font-bold text-2xl mb-4'>Quản lý số lượng</h2>
          <div className='grid grid-cols-12 gap-6'>
            {Object.keys(quantityPerCollection).map((key, index) => (
              <div
                key={index}
                className='col-span-3 flex justify-between items-center bg-white rounded shadow-sm py-4 px-6 border'
              >
                <ItemIcon className='w-10 h-10' />
                <div className='ml-12 text-right'>
                  <h2 className='text-xl mb-2 uppercase'>{key}</h2>
                  <span className='text-3xl font-bold'>
                    {quantityPerCollection[key as keyof QuantityPerCollection]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Fragment>
      )}

      <div className='mt-10'>
        <h2 className='font-bold text-2xl mb-4'>Quản lý đơn hàng</h2>
        <div className='grid grid-cols-12 gap-6'>
          {Array(8)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className='col-span-3 flex justify-between items-center bg-white rounded shadow-sm py-4 px-6 border'
              >
                <ItemIcon className='w-10 h-10' />
                <div className='ml-12 text-right'>
                  <h2 className='text-xl mb-2'>Tổng sản phẩm</h2>
                  <span className='text-3xl font-bold'>100</span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
