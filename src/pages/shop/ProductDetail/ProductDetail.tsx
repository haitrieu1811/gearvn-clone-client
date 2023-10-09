import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import classNames from 'classnames';
import DOMPurify from 'dompurify';
import { convert } from 'html-to-text';
import { Fragment, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import blogApi from 'src/apis/blog.api';
import productApi from 'src/apis/product.api';
import purchaseApi from 'src/apis/purchase.api';
import userApi from 'src/apis/user.api';
import { ChevronDownIcon, StarIcon } from 'src/components/Icons';
import Loading from 'src/components/Loading';
import ProductRating from 'src/components/ProductRating';
import ProductReviews from 'src/components/ProductReviews';
import QuantityController from 'src/components/QuantityController';
import SendReview from 'src/components/SendReview';
import PATH from 'src/constants/path';
import { AppContext } from 'src/contexts/app.context';
import { formatCurrency, generateNameId, getIdFromNameId, getImageUrl, rateSale } from 'src/utils/utils';
import SliderImages from './SliderImages';

const ProductDetail = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { name_id } = useParams();
  const productId = getIdFromNameId(name_id as string);
  const { isAuthenticated } = useContext(AppContext);
  const [isMounted, setIsMounted] = useState(false);
  const [buyCount, setBuyCount] = useState<number>(1);
  const [readMore, setReadMore] = useState<boolean>(false);
  const reviewsRef = useRef<HTMLDivElement>(null);

  // Đánh dấu đã mount component
  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  // Thêm vào lịch sử xem sản phẩm
  const addViewedProductMutation = useMutation(userApi.addViewedProduct);

  // Thêm vào lịch sử xem sản phẩm
  useEffect(() => {
    if (isMounted && productId && isAuthenticated) {
      addViewedProductMutation.mutateAsync({ product_id: productId });
    }
  }, [isMounted, productId]);

  // Query: Lấy thông tin chi tiết sản phẩm
  const getProductQuery = useQuery({
    queryKey: ['product', productId],
    queryFn: () => productApi.getDetail(productId),
    enabled: !!productId
  });

  // Thông tin sản phẩm
  const product = useMemo(() => getProductQuery.data?.data.data.product, [getProductQuery.data?.data.data.product]);

  // Thay đổi số lượng mua
  const handleChangeBuyCount = (value: number) => {
    setBuyCount(value);
  };

  // Mutation: Thêm vào giỏ hàng
  const addToCartMutation = useMutation({
    mutationFn: purchaseApi.addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
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
  const buyNow = async () => {
    if (!product) return;
    const res = await addToCartMutation.mutateAsync({ productId: product._id, buyCount });
    navigate(PATH.CART_LIST, { state: { cartItemId: res.data.data.purchase_id } });
  };

  // Danh sách blog
  const getBlogsQuery = useQuery({
    queryKey: ['product_detail_blogs'],
    queryFn: () => blogApi.getList({ limit: '5' }),
    staleTime: Infinity
  });

  // Danh sách blog
  const blogs = useMemo(() => getBlogsQuery.data?.data.data.blogs || [], [getBlogsQuery.data?.data.data.blogs]);

  // Cuộn đến phần đánh giá
  const handleSeeReviews = () => {
    if (!reviewsRef.current) return;
    reviewsRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Fragment>
      {product && (
        <Helmet>
          <title>{product.name_vi}</title>
          <meta
            name='description'
            content={convert(product.description, {
              limits: {
                maxInputLength: 150
              }
            })}
          />
          <meta property='og:title' content={product.name_vi} />
          <meta
            property='og:description'
            content={convert(product.description, {
              limits: {
                maxInputLength: 150
              }
            })}
          />
          <meta property='og:image' content={getImageUrl(product.thumbnail || '')} />
          <meta property='og:url' content={window.location.href} />
          <meta property='og:site_name' content={product.name_vi} />
          <meta property='og:type' content='website' />
        </Helmet>
      )}

      <div className='lg:container my-2 lg:my-4'>
        {/* Thông tin chi tiết sản phẩm */}
        {product && !getProductQuery.isLoading && !getProductQuery.isLoading && (
          <Fragment>
            {/* Thông tin và hình ảnh sản phẩm */}
            <div className='flex bg-white rounded flex-wrap lg:flex-nowrap'>
              {/* Hình ảnh sản phẩm */}
              <div className='px-2 lg:p-6 w-full lg:w-[420px]'>
                <SliderImages images={product.images || []} />
              </div>
              {/* Thông tin sản phẩm */}
              <div className='flex-1 p-2 py-6 lg:p-6 lg:border-l'>
                <h1 className='font-semibold text-xl md:text-2xl mb-2'>{product.name_vi}</h1>
                <div className='flex items-center mb-4'>
                  <div className='flex items-center mr-4'>
                    <span className='text-[#ff8a00] font-semibold mr-[2px]'>
                      {product.rating_score ? product.rating_score.toFixed(1) : 0}
                    </span>
                    <StarIcon className='w-3 h-3 text-[#ff8a00]' />
                  </div>
                  <button type='button' className='text-[#1982F9] text-sm md:text-base' onClick={handleSeeReviews}>
                    Xem đánh giá
                  </button>
                </div>
                <div className='flex items-center mt-4'>
                  <div className='text-primary font-semibold text-2xl md:text-[32px]'>
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
                {/* Nếu còn sản phẩm */}
                {product.available_count > 0 && (
                  <Fragment>
                    {/* Số lượng mua */}
                    <div className='my-8 flex items-center'>
                      <div className='font-medium mr-6 text-sm md:text-base'>Số lượng:</div>
                      <QuantityController
                        value={buyCount}
                        max={product.available_count}
                        onType={handleChangeBuyCount}
                        onDecrease={handleChangeBuyCount}
                        onIncrease={handleChangeBuyCount}
                      />
                      <div className='ml-6 text-slate-500 text-sm md:text-base'>
                        {product.available_count} sản phẩm có sẵn
                      </div>
                    </div>
                    {/* Thêm vào giỏ hàng, mua ngay */}
                    <div className='flex mt-4'>
                      <button
                        onClick={addToCart}
                        className='border border-primary rounded text-primary text-base md:text-lg px-2 md:px-6 py-2 bg-primary/10 hover:opacity-90 flex-1 lg:flex-none'
                      >
                        Thêm vào giỏ hàng
                      </button>
                      <button
                        onClick={buyNow}
                        className='border border-primary rounded text-white text-base md:text-lg px-2 md:px-6 py-2 bg-primary ml-2 md:ml-4 hover:opacity-90 flex-1 lg:flex-none'
                      >
                        Mua ngay
                      </button>
                    </div>
                  </Fragment>
                )}
                {/* Hết sản phẩm */}
                {product.available_count <= 0 && (
                  <div className='mt-4 cursor-not-allowed'>
                    <button
                      type='button'
                      className='w-full md:w-[400px] h-10 md:h-[50px] flex justify-center items-center bg-[#BCBEC2] text-white text-base md:text-lg font-semibold uppercase rounded pointer-events-none'
                    >
                      Hết hàng
                    </button>
                  </div>
                )}
                <div
                  className='mt-6 text-[#333333] text-sm md:text-base leading-loose md:leading-loose'
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(product.general_info)
                  }}
                />
              </div>
            </div>
            {/* Mô tả sản phẩm và tin tức */}
            <div className='flex items-start flex-wrap lg:flex-nowrap mt-4'>
              {/* Mô tả sản phẩm */}
              <div className='relative w-full lg:w-auto lg:flex-1 bg-white rounded'>
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
                      className='px-2 lg:px-6 text-[#111111] text-sm leading-loose md:text-lg'
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
                  <span className='font-medium text-[#1982F9] mr-2 text-sm md:text-base'>
                    {!readMore ? 'Đọc tiếp bài viết' : 'Thu gọn bài viết'}
                  </span>
                  <ChevronDownIcon
                    className={classNames('w-[10px] h-[10px] stroke-[#1982F9] stroke-[3]', {
                      'rotate-180': readMore
                    })}
                  />
                </div>
              </div>
              {/* Tin tức */}
              {blogs.length > 0 && (
                <div className='bg-white rounded mt-2 lg:mt-0 lg:ml-4 w-full lg:w-[40%]'>
                  <h2 className='font-semibold text-xl md:text-2xl py-4 px-2 lg:px-6'>Tin tức về sản phẩm</h2>
                  <div className='px-2 lg:px-6 pb-2'>
                    {blogs.map((blog) => (
                      <div key={blog._id} className='flex mb-4'>
                        <Link
                          to={`${PATH.BLOG_DETAIL_WITHOUT_ID}/${generateNameId({
                            name: blog.name_vi,
                            id: blog._id
                          })}`}
                          className='flex-shrink-0'
                        >
                          <img
                            src={getImageUrl(blog.thumbnail)}
                            alt={blog.name_vi}
                            className='w-[88px] h-[50px] object-cover rounded'
                          />
                        </Link>
                        <Link
                          to={`${PATH.BLOG_DETAIL_WITHOUT_ID}/${generateNameId({
                            name: blog.name_vi,
                            id: blog._id
                          })}`}
                          className='flex-1 ml-4'
                        >
                          <span className='line-clamp-2 text-sm md:text-base'>{blog.name_vi}</span>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* Đánh giá và nhận xét */}
            <div ref={reviewsRef} className='bg-white rounded-sm mt-4'>
              <div className='p-[10px] lg:p-6'>
                <h2 className='text-base lg:text-2xl font-semibold text-[#333333]'>
                  Đánh giá & Nhận xét {product.name_vi}
                </h2>
              </div>
              <div className='px-[10px] pb-[10px] lg:px-6 lg:pb-6'>
                {/* Chỉ số đánh giá */}
                <div className='pb-6 mb-6 border-b'>
                  <ProductRating
                    ratingCount={product.rating_count}
                    ratingScore={product.rating_score || 0}
                    data={[
                      product.rating_five_count,
                      product.rating_four_count,
                      product.rating_three_count,
                      product.rating_two_count,
                      product.rating_one_count
                    ]}
                  />
                </div>
                {/* Danh sách đánh giá */}
                <div className='w-full md:w-2/3'>
                  <ProductReviews productId={productId} />
                </div>
                {/* Thêm đánh giá */}
                <div className='mt-4'>
                  <SendReview product={product} />
                </div>
              </div>
            </div>
          </Fragment>
        )}

        {/* Loading */}
        {(getProductQuery.isLoading || getBlogsQuery.isLoading) && (
          <div className='min-h-[300px] flex justify-center items-center bg-white rounded'>
            <Loading />
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default ProductDetail;
