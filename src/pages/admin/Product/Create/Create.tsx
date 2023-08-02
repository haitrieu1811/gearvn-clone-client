import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from '@tanstack/react-query';
import isEmpty from 'lodash/isEmpty';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useMatch, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import brandApi from 'src/apis/brand.api';
import categoryApi from 'src/apis/category.api';
import mediaApi from 'src/apis/media.api';
import productApi from 'src/apis/product.api';
import Back from 'src/components/Back';
import Button from 'src/components/Button';
import { CloseIcon, CloudArrowUpIcon, PhotoIcon } from 'src/components/Icons';
import Input from 'src/components/Input';
import InputFile from 'src/components/InputFile';
import TextEditor from 'src/components/TextEditor/TextEditor';
import PATH from 'src/constants/path';
import { CreateAndUpdateProductBody } from 'src/types/product.type';
import { ErrorResponse } from 'src/types/utils.type';
import { CreateProductSchema, createProductSchema } from 'src/utils/rules';
import { getImageUrl, htmlToMarkdown, isEntityError } from 'src/utils/utils';

type FormData = CreateProductSchema;

const Create = () => {
  const { product_id } = useParams();
  const match = useMatch(PATH.DASHBOARD_PRODUCT_UPDATE);
  const isUpdateMode = Boolean(match);
  const [thumbnailFile, setThumbnailFile] = useState<File[] | null>(null);
  const [imagesFile, setImagesFile] = useState<File[] | null>(null);
  const [generalInfo, setGeneralInfo] = useState<string>('');
  const [specifications, setSpecifications] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  // Lấy danh sách nhãn hiệu sản phẩm
  const getBrandsQuery = useQuery({
    queryKey: ['brands'],
    queryFn: () => brandApi.getList()
  });

  // Lấy danh sách danh mục sản phẩm
  const getCategoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getList()
  });

  // Lấy thông tin chi tiết sản phẩm
  const getProductDetailQuery = useQuery({
    queryKey: ['product', product_id],
    queryFn: () => productApi.getDetail(product_id as string),
    enabled: Boolean(product_id)
  });

  const {
    handleSubmit,
    control,
    register,
    setError,
    setValue,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(createProductSchema),
    defaultValues: {
      brand_id: '',
      category_id: '',
      description: '',
      general_info: '',
      name_en: '',
      name_vi: '',
      price: '',
      price_after_discount: '',
      specifications: ''
    }
  });

  const product = useMemo(
    () => getProductDetailQuery.data?.data.data.product,
    [getProductDetailQuery.data?.data.data.product]
  );
  const previewThumbnail = useMemo(() => (thumbnailFile ? URL.createObjectURL(thumbnailFile[0]) : ''), [thumbnailFile]);
  const previewImages = useMemo(() => imagesFile?.map((file) => (file ? URL.createObjectURL(file) : '')), [imagesFile]);
  const brands = useMemo(() => getBrandsQuery.data?.data.data.brands, [getBrandsQuery.data?.data.data.brands]);
  const categories = useMemo(
    () => getCategoriesQuery.data?.data.data.categories,
    [getCategoriesQuery.data?.data.data.categories]
  );

  // Điền thông tin vào form khi ở chế độ Update
  useEffect(() => {
    if (product) {
      const {
        name_vi,
        name_en,
        general_info,
        description,
        price,
        price_after_discount,
        specifications,
        category_id,
        brand_id
      } = product;
      setValue('brand_id', brand_id as string);
      setValue('category_id', category_id as string);
      setValue('name_en', name_en as string);
      setValue('name_vi', name_vi);
      setValue('price', String(price));
      setValue('price_after_discount', String(price_after_discount));
      setValue('general_info', general_info);
      setValue('specifications', specifications || '');
      setValue('description', description);

      // Giúp hiển thị text ở TextEditor chứ không có giá trị về mặc dữ liệu
      setGeneralInfo(htmlToMarkdown(general_info));
      setSpecifications(htmlToMarkdown(specifications || ''));
      setDescription(htmlToMarkdown(description));
    }
  }, [product, setValue]);

  // Xử lý khi thay đổi ảnh đại diện sản phẩm
  const handleThumbnailChange = (files?: File[]) => {
    setThumbnailFile(files || null);
  };

  // Xử lý khi thay đổi danh sách hình ảnh sản phẩm
  const handleImagesChange = (files?: File[]) => {
    setImagesFile(files || null);
  };

  // Tải lên hình ảnh sản phẩm
  const uploadImageMutation = useMutation(mediaApi.uploadImage);

  // Tạo sản phẩm
  const createProductMutation = useMutation({
    mutationFn: productApi.create,
    onSuccess: (data) => {
      toast.success(data.data.message);
      reset();
      setThumbnailFile(null);
      setImagesFile(null);
      setGeneralInfo('');
      setSpecifications('');
      setDescription('');
    },
    onError: (error) => {
      if (isEntityError<ErrorResponse<{ [key in keyof FormData]: string }>>(error)) {
        const formError = error.response?.data.data;
        if (!isEmpty(formError)) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormData, {
              message: formError[key as keyof FormData]
            });
          });
        }
      }
    }
  });

  // Cập nhật sản phẩm
  const updateProductMutation = useMutation({
    mutationFn: productApi.update,
    onSuccess: (data) => {
      toast.success(data.data.message);
      getProductDetailQuery.refetch();
      setThumbnailFile(null);
      setImagesFile(null);
    }
  });

  // Thêm hình ảnh sản phẩm
  const addImageMutation = useMutation(productApi.addImage);

  // Phương thức xóa hình ảnh sản phẩm
  const deleteImageMutation = useMutation({
    mutationFn: productApi.deleteImage,
    onSuccess: (data) => {
      toast.success(data.data.message);
      getProductDetailQuery.refetch();
    }
  });

  // Tiến hành xóa hình ảnh sản phẩm
  const handleDeleteImage = (mediaId: string) => {
    deleteImageMutation.mutate(mediaId);
  };

  // Cập nhật giá trị thông tin chung
  const changeGeneralInfo = ({ html, text }: { html: string; text: string }) => {
    setValue('general_info', html);
    setGeneralInfo(text);
  };

  // Cập nhật giá trị thông số kỹ thuật
  const changeSpecifications = ({ html, text }: { html: string; text: string }) => {
    setValue('specifications', html);
    setSpecifications(text);
  };

  // Cập nhật giá trị mô tả
  const changeDescription = ({ html, text }: { html: string; text: string }) => {
    setValue('description', html);
    setDescription(text);
  };

  // Xử lý khi submit form
  const onSubmit = handleSubmit(async (data) => {
    let thumbnail = product && product.thumbnail ? product.thumbnail : '';
    let images: string[] = [];
    if (thumbnailFile) {
      const form = new FormData();
      form.append('image', thumbnailFile[0]);
      await uploadImageMutation.mutateAsync(form, {
        onSuccess: (data) => {
          thumbnail = data.data.data.medias[0].name;
        }
      });
    }
    if (imagesFile) {
      const form = new FormData();
      for (const image of imagesFile) {
        form.append('image', image);
      }
      await uploadImageMutation.mutateAsync(form, {
        onSuccess: (data) => {
          const responseImage = data.data.data.medias.map((media) => media.name);
          images = responseImage;
        }
      });
    }
    const body: CreateAndUpdateProductBody = {
      ...data,
      price: Number(data.price),
      price_after_discount: Number(data.price_after_discount),
      thumbnail
    };
    let productId = product_id;
    if (!isUpdateMode) {
      const res = await createProductMutation.mutateAsync(body);
      productId = res.data.data.insertedId;
    } else {
      updateProductMutation.mutate({ body, productId: product_id as string });
    }
    // Thêm hình ảnh vào database
    if (images.length > 0) {
      addImageMutation.mutate({ body: { images }, productId: productId as string });
    }
  });

  return (
    <Fragment>
      <div className='bg-white rounded-lg shadow-sm p-6'>
        <div className='mb-6 flex justify-between items-center'>
          <h2 className='text-2xl font-bold'>{!isUpdateMode ? 'Tạo sản phẩm mới' : 'Cập nhật sản phẩm'}</h2>
          <Back />
        </div>
        <form onSubmit={onSubmit} encType='multipart/form-data'>
          <div className='grid grid-cols-12 gap-10'>
            <div className='col-span-8'>
              <div className='grid grid-cols-12 gap-6 mt-6'>
                {/* Tên tiếng Việt */}
                <div className='col-span-6'>
                  <label htmlFor='name_vi' className='font-medium text-sm mb-2 ml-1 block'>
                    Tên tiếng Việt:
                  </label>
                  <Input
                    type='text'
                    placeholder='Tên tiếng Việt'
                    id='name_vi'
                    name='name_vi'
                    register={register}
                    errorMessage={errors.name_vi?.message}
                  />
                </div>
                {/* Tên tiếng Anh */}
                <div className='col-span-6'>
                  <label htmlFor='name_en' className='font-medium text-sm mb-2 ml-1 block'>
                    Tên tiếng Anh:
                  </label>
                  <Input
                    type='text'
                    placeholder='Tên tiếng Anh'
                    id='name_en'
                    name='name_en'
                    register={register}
                    errorMessage={errors.name_en?.message}
                  />
                </div>
              </div>
              <div className='grid grid-cols-12 gap-6 mt-6'>
                {/* Giá gốc */}
                <div className='col-span-6'>
                  <label htmlFor='price' className='font-medium text-sm mb-2 ml-1 block'>
                    Giá gốc:
                  </label>
                  <Input
                    type='text'
                    placeholder='Giá gốc'
                    id='price'
                    name='price'
                    register={register}
                    errorMessage={errors.price?.message}
                  />
                </div>
                {/* Giá khuyến mãi */}
                <div className='col-span-6'>
                  <label htmlFor='price_after_discount' className='font-medium text-sm mb-2 ml-1 block'>
                    Giá khuyến mãi:
                  </label>
                  <Input
                    type='text'
                    placeholder='Giá khuyến mãi'
                    id='price_after_discount'
                    name='price_after_discount'
                    register={register}
                    errorMessage={errors.price_after_discount?.message}
                  />
                </div>
              </div>
              <div className='grid grid-cols-12 gap-6 mt-6'>
                {/* Nhãn hiệu */}
                <div className='col-span-6'>
                  <label className='font-medium text-sm mb-2 ml-1 block'>Nhãn hiệu:</label>
                  {brands && brands.length > 0 && (
                    <Fragment>
                      <select
                        defaultValue=''
                        className='border rounded-sm py-2 px-1 w-full outline-none text-sm'
                        {...register('brand_id', {
                          required: true
                        })}
                      >
                        <option value=''>Chọn nhãn hiệu</option>
                        {brands.map((brand) => (
                          <option key={brand._id} value={brand._id}>
                            {brand.name}
                          </option>
                        ))}
                      </select>
                      <p className='text-sm text-red-500 mt-2 font-medium'>{errors.brand_id?.message}</p>
                    </Fragment>
                  )}
                </div>
                {/* Danh mục */}
                <div className='col-span-6'>
                  <label className='font-medium text-sm mb-2 ml-1 block'>Danh mục:</label>
                  {categories && categories.length > 0 && (
                    <Fragment>
                      <select
                        defaultValue=''
                        className='border rounded-sm py-2 px-1 w-full outline-none text-sm'
                        {...register('category_id', {
                          required: true
                        })}
                      >
                        <option value=''>Chọn danh mục</option>
                        {categories.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.name_vi}
                          </option>
                        ))}
                      </select>
                      <p className='text-sm text-red-500 mt-2 font-medium'>{errors.category_id?.message}</p>
                    </Fragment>
                  )}
                </div>
              </div>
              {/* Thông tin chung */}
              <div className='mt-6'>
                <label className='font-medium text-sm mb-3 ml-1 block'>Thông tin chung:</label>
                <Controller
                  control={control}
                  name='general_info'
                  render={({ field }) => (
                    <TextEditor
                      name={field.name}
                      value={generalInfo}
                      onChange={changeGeneralInfo}
                      errorMessage={errors.general_info?.message}
                    />
                  )}
                />
              </div>
              {/* Thông số kỹ thuật */}
              <div className='mt-6'>
                <label className='font-medium text-sm mb-3 ml-1 block'>Thông số kỹ thuật:</label>
                <Controller
                  control={control}
                  name='specifications'
                  render={({ field }) => (
                    <TextEditor
                      name={field.name}
                      value={specifications}
                      onChange={changeSpecifications}
                      errorMessage={errors.specifications?.message}
                    />
                  )}
                />
              </div>
              {/* Mô tả */}
              <div className='mt-6'>
                <label className='font-medium text-sm mb-3 ml-1 block'>Mô tả:</label>
                <Controller
                  control={control}
                  name='description'
                  render={({ field }) => (
                    <TextEditor
                      name={field.name}
                      value={description}
                      onChange={changeDescription}
                      errorMessage={errors.description?.message}
                    />
                  )}
                />
              </div>
            </div>
            <div className='col-span-4'>
              {/* Thumbnail */}
              <div className=''>
                {!previewThumbnail && !product?.thumbnail ? (
                  <div className='flex justify-center items-center min-h-[240px] mb-3 rounded bg-slate-100'>
                    <CloudArrowUpIcon className='w-10 h-10' />
                  </div>
                ) : (
                  <img
                    src={previewThumbnail || getImageUrl(product?.thumbnail as string)}
                    alt='Thumbnail'
                    className='w-full max-h-[240px] mb-3 rounded object-cover'
                  />
                )}
                <InputFile onChange={handleThumbnailChange} name='thumbnail'>
                  <button className='bg-slate-50 border rounded-sm w-full py-2 text-sm font-medium flex justify-center items-center'>
                    <PhotoIcon className='w-4 h-4 mr-2' />
                    <span>{!isUpdateMode ? 'Tải ảnh đại diện sản phẩm' : 'Cập nhật ảnh đại diện mới'}</span>
                  </button>
                </InputFile>
              </div>
              {/* Images */}
              <div className='mt-10'>
                {!Boolean(previewImages) && !Boolean(product?.images) ? (
                  <div className='flex justify-center items-center min-h-[240px] mb-3 rounded bg-slate-100'>
                    <CloudArrowUpIcon className='w-10 h-10' />
                  </div>
                ) : (
                  <div className='grid grid-cols-12 mb-3 gap-2'>
                    {product?.images?.map((image, index) => (
                      <div key={index} className='col-span-4 relative group'>
                        <img
                          src={getImageUrl(image.name)}
                          alt='Thumbnail'
                          className='w-full h-[80px] rounded object-cover'
                        />
                        <div
                          className='absolute inset-0 bg-black/20 flex justify-center items-center cursor-pointer opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto duration-200'
                          tabIndex={0}
                          aria-hidden='true'
                          role='button'
                          onClick={() => handleDeleteImage(image._id)}
                        >
                          <CloseIcon className='w-10 h-10 stroke-white' />
                        </div>
                      </div>
                    ))}
                    {previewImages?.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt='Thumbnail'
                        className='col-span-4 w-full h-[80px] rounded object-cover'
                      />
                    ))}
                  </div>
                )}
                <InputFile name='images' onChange={handleImagesChange} multiple>
                  <button className='bg-slate-50 border rounded-sm w-full py-2 text-sm font-medium flex justify-center items-center'>
                    <PhotoIcon className='w-4 h-4 mr-2' />
                    <span>{!isUpdateMode ? 'Tải lên các hình ảnh của sản phẩm' : 'Thêm hình ảnh sản phẩm'}</span>
                  </button>
                </InputFile>
              </div>
            </div>
          </div>
          <div className='py-6 sticky bottom-0 bg-white'>
            <Button isLoading={!isUpdateMode ? createProductMutation.isLoading : updateProductMutation.isLoading}>
              {!isUpdateMode ? 'Tạo sản phẩm' : 'Cập nhật sản phẩm'}
            </Button>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default Create;
