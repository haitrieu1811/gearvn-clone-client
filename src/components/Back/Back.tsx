import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon } from '../Icons';

const Back = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <button className='flex justify-center items-center p-2 rounded hover:bg-slate-50' onClick={handleBack}>
      <ChevronLeftIcon className='w-4 h-4 stroke-blue-500' />
      <span className='text-sm font-semibold text-blue-500 ml-2'>Quay lại</span>
    </button>
  );
};

export default Back;
