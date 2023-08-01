import Tippy from '@tippyjs/react/headless';
import { useState, useMemo, FormEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate, createSearchParams } from 'react-router-dom';

import { SearchIcon } from 'src/components/Icons';
import useDebounce from 'src/hooks/useDebounce';
import Wrapper from 'src/components/Wrapper';
import productApi from 'src/apis/product.api';
import { generateNameId } from 'src/utils/utils';
import { formatCurrency, getImageUrl } from 'src/utils/utils';
import PATH from 'src/constants/path';
import Loading from 'src/components/Loading';

const SEARCH_RESULT_LIMIT = 5;

const Search = () => {
  const navigate = useNavigate();
  const [keywordSearch, setKeywordSearch] = useState<string>('');
  const [showSearchResult, setShowSearchResult] = useState<boolean>(false);
  const KeywordSearchDebounce = useDebounce(keywordSearch, 1500);

  // Kết quả tìm kiếm
  const getProductsQuery = useQuery({
    queryKey: ['products', KeywordSearchDebounce],
    queryFn: () => productApi.getList({ name: KeywordSearchDebounce })
  });
  const searchResult = useMemo(
    () => getProductsQuery.data?.data.data.products,
    [getProductsQuery.data?.data.data.products]
  );
  const searchResultCount = useMemo(
    () => getProductsQuery.data?.data.data.pagination.total,
    [getProductsQuery.data?.data.data.pagination.total]
  );

  // Render kết quả tìm kiếm
  const renderSearchResult = () => (
    <Wrapper>
      <div className='w-full md:w-[315px] px-4'>
        {/* Hiển thị khi có dữ liệu */}
        {searchResult &&
          searchResult.length > 0 &&
          !getProductsQuery.isLoading &&
          searchResult.slice(0, SEARCH_RESULT_LIMIT).map((product) => (
            <div key={product._id} className='flex justify-between items-center py-3 border-b'>
              <div className='flex-1 pr-4'>
                <Link
                  to={`${PATH.PRODUCT_DETAIL_WITHOUT_ID}/${generateNameId({ name: product.name_vi, id: product._id })}`}
                  className='text-[13px] text-[#111111] hover:text-primary line-clamp-1'
                >
                  {product.name_vi}
                </Link>
                <div className='flex items-center mt-[5px]'>
                  <div className='text-primary font-medium text-xs'>
                    {formatCurrency(product.price_after_discount)}₫
                  </div>
                  {product.price > product.price_after_discount && (
                    <div className='ml-[7px] text-[11px] text-[#797979] line-through'>
                      {formatCurrency(product.price)}₫
                    </div>
                  )}
                </div>
              </div>
              <Link
                to={`${PATH.PRODUCT_DETAIL_WITHOUT_ID}/${generateNameId({ name: product.name_vi, id: product._id })}`}
                className='border rounded-sm'
              >
                <img
                  src={getImageUrl(product.thumbnail)}
                  alt={product.name_vi}
                  className='w-[38px] h-[38px] object-cover'
                />
              </Link>
            </div>
          ))}
        {searchResultCount !== undefined && searchResultCount > 5 && (
          <button
            onClick={() => redirectToSearchPage()}
            className='block py-[10px] text-[13px] text-[#111111] text-center w-full hover:text-primary'
          >
            Xem thêm {searchResultCount - SEARCH_RESULT_LIMIT} sản phẩm
          </button>
        )}
        {/* Hiển thị khi không có dữ liệu */}
        {searchResult && searchResult.length <= 0 && !getProductsQuery.isLoading && (
          <div className='text-sm text-center text-[#111111] py-4'>Không có sản phẩm nào...</div>
        )}
        {/* Loading */}
        {getProductsQuery.isLoading && (
          <div className='flex justify-center py-10'>
            <Loading className='w-6 h-6' />
          </div>
        )}
      </div>
    </Wrapper>
  );

  // Chuyển hướng đến trang tìm kiếm
  const redirectToSearchPage = (e?: FormEvent<HTMLFormElement>) => {
    e && e.preventDefault();
    navigate({
      pathname: PATH.SEARCH,
      search: createSearchParams({
        name: keywordSearch
      }).toString()
    });
    setKeywordSearch('');
  };

  return (
    <Tippy
      interactive
      visible={KeywordSearchDebounce.length > 0 && showSearchResult}
      placement='bottom-end'
      offset={[0, 3]}
      render={renderSearchResult}
      onClickOutside={() => setShowSearchResult(false)}
      zIndex={9999999}
    >
      <form className='relative flex-1 md:w-[315px] ml-2' onSubmit={redirectToSearchPage}>
        <input
          type='text'
          placeholder='Bạn cần tìm gì?'
          value={keywordSearch}
          onChange={(e) => setKeywordSearch(e.target.value)}
          onFocus={() => setShowSearchResult(true)}
          className='w-full h-full py-2 pl-[15px] pr-[50px] rounded outline-none text-[15px]'
        />
        <button className='absolute top-0 right-0 h-full w-9 flex justify-center items-center'>
          <SearchIcon className='fill-white w-4 h-4' />
        </button>
      </form>
    </Tippy>
  );
};

export default Search;
