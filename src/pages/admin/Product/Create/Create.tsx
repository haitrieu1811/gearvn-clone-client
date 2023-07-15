import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Fragment, useEffect, useMemo, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import classNames from 'classnames';
import { useMatch, useParams } from 'react-router-dom';

import mediaApi from 'src/apis/media.api';
import productApi from 'src/apis/product.api';
import Button from 'src/components/Button';
import { CloudArrowUpIcon, PhotoIcon } from 'src/components/Icons';
import Input from 'src/components/Input';
import InputFile from 'src/components/InputFile';
import Textarea from 'src/components/Textarea';
import { CreateProductSchema, createProductSchema } from 'src/utils/rules';
import { isEntityError } from 'src/utils/utils';
import { ErrorResponse } from 'src/types/utils.type';
import brandApi from 'src/apis/brand.api';
import categoryApi from 'src/apis/category.api';
import PATH from 'src/constants/path';

type FormData = CreateProductSchema;

const Create = () => {
  const { product_id } = useParams();
  const match = useMatch(PATH.DASHBOARD_PRODUCT_UPDATE);
  const isUpdateMode = Boolean(match);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const getBrandsQuery = useQuery({
    queryKey: ['brands'],
    queryFn: () => brandApi.getList()
  });

  const getCategoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getList()
  });

  const getProductDetailQuery = useQuery({
    queryKey: ['product', product_id],
    queryFn: () => productApi.getDetail(product_id as string),
    enabled: Boolean(product_id)
  });

  const {
    handleSubmit,
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
  const previewThumbnail = useMemo(() => (thumbnailFile ? URL.createObjectURL(thumbnailFile) : ''), [thumbnailFile]);
  const brands = useMemo(() => getBrandsQuery.data?.data.data.brands, [getBrandsQuery.data?.data.data.brands]);
  const categories = useMemo(
    () => getCategoriesQuery.data?.data.data.categories,
    [getCategoriesQuery.data?.data.data.categories]
  );

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
      setValue('description', description);
      setValue('general_info', general_info);
      setValue('name_en', name_en as string);
      setValue('name_vi', name_vi);
      setValue('price', String(price));
      setValue('price_after_discount', String(price_after_discount));
      setValue('specifications', specifications as string);
    }
  }, [product, setValue]);

  const handleThumbnailChange = (file?: File) => {
    setThumbnailFile(file || null);
  };

  const uploadImageMutation = useMutation(mediaApi.uploadImage);

  const createProductMutation = useMutation({
    mutationFn: productApi.create,
    onSuccess: (data) => {
      toast.success(data.data.message);
      reset();
      setThumbnailFile(null);
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

  const onSubmit = handleSubmit(async (data) => {
    let thumbnail = '';
    if (thumbnailFile) {
      const form = new FormData();
      form.append('image', thumbnailFile);
      await uploadImageMutation.mutateAsync(form, {
        onSuccess: (data) => {
          thumbnail = data.data.data.medias[0].name;
        }
      });
    }
    const body = data;
    createProductMutation.mutate({
      ...body,
      price: Number(data.price),
      price_after_discount: Number(data.price_after_discount),
      thumbnail
    });
  });

  return (
    <div className='bg-white rounded-lg shadow-sm p-6'>
      <h2 className='text-2xl font-bold mb-6'>Tạo sản phẩm mới</h2>
      <form onSubmit={onSubmit}>
        <div className='grid grid-cols-12 gap-10'>
          <div className='col-span-8'>
            <div className='grid grid-cols-12 gap-6 mt-6'>
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
            <div className='grid grid-cols-12 gap-6 mt-6'>
              <div className='col-span-6'>
                <label className='font-medium text-sm mb-2 ml-1 block'>Thông tin chung:</label>
                <Textarea name='general_info' register={register} errorMesssage={errors.general_info?.message} />
              </div>
              <div className='col-span-6'>
                <label className='font-medium text-sm mb-2 ml-1 block'>Thông số kĩ thuật:</label>
                <Textarea name='specifications' register={register} errorMesssage={errors.specifications?.message} />
              </div>
            </div>
            <div className='mt-8'>
              <label className='font-medium text-sm mb-2 ml-1 block'>Mô tả sản phẩm:</label>
              <Textarea name='description' register={register} errorMesssage={errors.description?.message} />
            </div>
          </div>
          <div className='col-span-4'>
            <div className=''>
              <div
                className={classNames(
                  'flex justify-center items-center min-h-[140px] mb-3 rounded bg-contain bg-no-repeat bg-center',
                  {
                    'bg-slate-100': Boolean(!previewThumbnail)
                  }
                )}
                style={{
                  backgroundImage: `url(${previewThumbnail})`
                }}
              >
                {!Boolean(previewThumbnail) && <CloudArrowUpIcon className='w-10 h-10' />}
              </div>
              <InputFile
                icon={<PhotoIcon className='w-4 h-4 mr-2' />}
                buttonName='Tải ảnh đại diện sản phẩm'
                onChange={handleThumbnailChange}
                name='thumbnail'
              />
            </div>
          </div>
        </div>
        <div className='py-6 sticky bottom-0 bg-white'>
          <Button isLoading={createProductMutation.isLoading}>Tạo sản phẩm</Button>
        </div>
      </form>
    </div>
  );
};

export default Create;
