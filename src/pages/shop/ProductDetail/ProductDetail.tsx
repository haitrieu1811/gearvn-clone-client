import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import classNames from 'classnames';
import DOMPurify from 'dompurify';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import blogApi from 'src/apis/blog.api';

import productApi from 'src/apis/product.api';
import purchaseApi from 'src/apis/purchase.api';
import userApi from 'src/apis/user.api';
import { ChevronDownIcon } from 'src/components/Icons';
import Loading from 'src/components/Loading';
import QuantityController from 'src/components/QuantityController';
import PATH from 'src/constants/path';
import { formatCurrency, generateNameId, getIdFromNameId, getImageUrl, rateSale } from 'src/utils/utils';
import SliderImages from './SliderImages';

const ProductDetail = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { name_id } = useParams();
  const productId = getIdFromNameId(name_id as string);

  const [isMounted, setIsMounted] = useState(false);
  const [buyCount, setBuyCount] = useState<number>(1);
  const [readMore, setReadMore] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  // Thêm vào lịch sử xem sản phẩm
  const addViewedProductMutation = useMutation(userApi.addViewedProduct);
  useEffect(() => {
    if (isMounted && productId) {
      addViewedProductMutation.mutateAsync({ product_id: productId });
    }
  }, [isMounted, productId]);

  // Lấy thông tin chi tiết sản phẩm
  const getProductQuery = useQuery({
    queryKey: ['product', productId],
    queryFn: () => productApi.getDetail(productId),
    enabled: Boolean(productId)
  });

  const product = useMemo(() => getProductQuery.data?.data.data.product, [getProductQuery.data?.data.data.product]);

  // Thay đổi số lượng mua
  const handleChangeBuyCount = (value: number) => {
    setBuyCount(value);
  };

  // Thêm vào giỏ hàng
  const addToCartMutation = useMutation({
    mutationFn: purchaseApi.addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart_list'] });
    }
  });

  // Xử lý thêm vào giỏ hàng
  const addToCart = async () => {
    await addToCartMutation.mutateAsync(
      { buyCount, productId },
      {
        onSuccess: (data) => {
          toast.success(data.data.message);
        }
      }
    );
    setBuyCount(1);
  };

  // Mua ngay
  const buyNow = () => {
    if (product) {
      addToCartMutation.mutate(
        { productId: product._id, buyCount },
        {
          onSuccess: (data) => {
            navigate(PATH.CART, { state: { cartItemId: data.data.data.purchase._id } });
          }
        }
      );
    }
  };

  // Danh sách blog
  const getBlogsQuery = useQuery({
    queryKey: ['blogs'],
    queryFn: () => blogApi.getList({ limit: '5' })
  });

  const blogs = useMemo(() => getBlogsQuery.data?.data.data.blogs, [getBlogsQuery.data?.data.data.blogs]);

  return (
    <div className='my-2 lg:my-4'>
      {/* Thông tin chi tiết sản phẩm */}
      {product && !getProductQuery.isLoading && (
        <div className='lg:container'>
          {/* Hình ảnh, thông tin */}
          <div className='flex bg-white rounded flex-wrap lg:flex-nowrap'>
            {/* Hình ảnh sản phẩm */}
            <div className='px-2 lg:p-6 w-full lg:w-[420px]'>
              <SliderImages product={product} />
            </div>
            {/* Thông tin sản phẩm */}
            <div className='flex-1 p-2 py-6 lg:p-6 lg:border-l'>
              <h1 className='font-semibold text-[20px] md:text-2xl'>{product.name_vi}</h1>
              <div className='flex items-center mt-4'>
                <div className='text-primary font-semibold text-[20px] md:text-[32px]'>
                  {formatCurrency(product.price_after_discount)}₫
                </div>
                {product.price > product.price_after_discount && (
                  <div className='text-base md:text-lg ml-3 line-through text-[#6D6E72]'>
                    {formatCurrency(product.price)}₫
                  </div>
                )}
                {rateSale(product.price, product.price_after_discount) > 0 && (
                  <span className='text-[12px] py-[3px] px-2 ml-3 text-primary border border-primary rounded-sm whitespace-nowrap'>
                    -{rateSale(product.price, product.price_after_discount)}%
                  </span>
                )}
              </div>
              <div className='my-8 flex items-center'>
                <div className='font-medium mr-6 text-sm md:text-base'>Số lượng:</div>
                <QuantityController
                  value={buyCount}
                  max={100}
                  onType={handleChangeBuyCount}
                  onDecrease={handleChangeBuyCount}
                  onIncrease={handleChangeBuyCount}
                />
                <div className='ml-6 text-slate-500 text-sm md:text-base'>100 sản phẩm có sẵn</div>
              </div>
              <div className='flex mt-4'>
                <button
                  onClick={addToCart}
                  className='border border-primary rounded text-primary text-base md:text-lg px-2 md:px-6 py-2 bg-primary/10 hover:opacity-80 flex-1 lg:flex-none'
                >
                  Thêm vào giỏ hàng
                </button>
                <button
                  onClick={buyNow}
                  className='border border-primary rounded text-white text-base md:text-lg px-2 md:px-6 py-2 bg-primary ml-2 md:ml-4 hover:opacity-80 flex-1 lg:flex-none'
                >
                  Mua ngay
                </button>
              </div>
              <div
                className='mt-6 text-[#333333] leading-loose'
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(product.general_info)
                }}
              />
            </div>
          </div>
          {/* Mô tả sản phẩm, blogs */}
          <div className='flex items-start flex-wrap lg:flex-nowrap mt-4'>
            <div className='relative w-full lg:w-auto lg:flex-1 bg-white rounded'>
              {/* Mô tả sản phẩm */}
              <div
                className={classNames('pb-20', {
                  [`h-[402px] overflow-y-hidden`]: !readMore,
                  'h-auto': readMore
                })}
              >
                <h2 className='font-semibold text-xl md:text-2xl py-4 px-2 lg:px-6'>Mô tả sản phẩm</h2>
                <div className='text__content'>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(product.description)
                    }}
                    className='px-2 lg:px-6 text-[#111111] text-lg'
                  />
                </div>
              </div>
              {/* Thu gọn, mở rộng bài viết */}
              <div
                tabIndex={0}
                aria-hidden='true'
                role='button'
                className={classNames(
                  'flex justify-center items-center py-[15px] select-none absolute bottom-0 left-0 right-0 bg-white',
                  {
                    'before:absolute before:bottom-full before:left-0 before:w-full before:h-[200%] before:pointer-events-none before:bg-gradient-to-b before:from-[#ffffff00] before:to-[#ffffff]':
                      !readMore
                  }
                )}
                onClick={() => setReadMore((prevState) => !prevState)}
              >
                <span className='font-medium text-[#1982F9] mr-2'>
                  {!readMore ? 'Đọc tiếp bài viết' : 'Thu gọn bài viết'}
                </span>
                <ChevronDownIcon
                  className={classNames('w-[10px] h-[10px] stroke-[#1982F9] stroke-[3]', {
                    'rotate-180': readMore
                  })}
                />
              </div>
            </div>
            {/* Tin tức về sản phẩm */}
            {blogs && blogs.length > 0 && (
              <div className='bg-white rounded mt-2 lg:mt-0 lg:ml-4 w-full lg:w-[40%]'>
                <h2 className='font-semibold text-xl md:text-2xl py-4 px-2 lg:px-6'>Tin tức về sản phẩm</h2>
                <div className='px-2 lg:px-6 pb-2'>
                  {blogs.map((blog) => (
                    <div key={blog._id} className='flex mb-4'>
                      <Link
                        to={`${PATH.BLOG_DETAIL_WITHOUT_ID}/${generateNameId({ name: blog.name_vi, id: blog._id })}`}
                        className='flex-shrink-0'
                      >
                        <img
                          src={getImageUrl(blog.thumbnail)}
                          alt={blog.name_vi}
                          className='w-[88px] h-[50px] object-cover rounded'
                        />
                      </Link>
                      <Link
                        to={`${PATH.BLOG_DETAIL_WITHOUT_ID}/${generateNameId({ name: blog.name_vi, id: blog._id })}`}
                        className='flex-1 ml-4 line-clamp-2'
                      >
                        {blog.name_vi}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Loading */}
      {getProductQuery.isLoading && (
        <div className='bg-white min-h-screen rounded shadow-sm flex justify-center pt-[50px]'>
          <Loading className='w-12 h-12' />
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
