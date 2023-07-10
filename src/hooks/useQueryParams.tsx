import { useSearchParams } from 'react-router-dom';

const UseQueryParams = () => {
  const [searchParams] = useSearchParams();
  return Object.fromEntries([...searchParams]);
};

export default UseQueryParams;
