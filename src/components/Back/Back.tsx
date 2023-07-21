import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from '../Icons';

const Back = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <button className='flex justify-center items-center mb-4 p-2 rounded hover:bg-slate-200' onClick={handleBack}>
      <ChevronLeft className='w-4 h-4 stroke-blue-600' />
      <span className='text-sm font-semibold text-blue-600 ml-2'>Quay lại</span>
    </button>
  );
};

export default Back;
