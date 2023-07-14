import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useMemo, useState } from 'react';
import isEmpty from 'lodash/isEmpty';

import mediaApi from 'src/apis/media.api';
import productApi from 'src/apis/product.api';
import Button from 'src/components/Button';
import { PhotoIcon } from 'src/components/Icons';
import Input from 'src/components/Input';
import InputFile from 'src/components/InputFile';
import Textarea from 'src/components/Textarea';
import { CreateProductSchema, createProductSchema } from 'src/utils/rules';
import { isEntityError } from 'src/utils/utils';
import { ErrorResponse } from 'src/types/utils.type';

type FormData = CreateProductSchema;

const Create = () => {
  const [thumbnailFile, setThumbnailFile] = useState<File>();

  const {
    handleSubmit,
    register,
    setError,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(createProductSchema)
  });

  const previewThumbnail = useMemo(() => (thumbnailFile ? URL.createObjectURL(thumbnailFile) : ''), [thumbnailFile]);

  const handleThumbnailChange = (file?: File) => {
    setThumbnailFile(file);
  };

  const uploadImageMutation = useMutation(mediaApi.uploadImage);

  const createProductMutation = useMutation({
    mutationFn: productApi.create,
    onSuccess: (data) => {
      toast.success(data.data.message);
      reset();
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
        <div className='grid grid-cols-12 gap-6'>
          <div className='col-span-6'>
            {previewThumbnail && (
              <img src={previewThumbnail} alt='' className='w-[100px] h-[100px] rounded-sm object-cover' />
            )}
            <label className='font-medium text-sm mb-2 ml-1 block'>Ảnh đại diện sản phẩm:</label>
            <InputFile
              icon={<PhotoIcon className='w-4 h-4 mr-2' />}
              buttonName='Chọn ảnh'
              onChange={handleThumbnailChange}
              name='thumbnail'
            />
          </div>
          <div className='col-span-6'></div>
        </div>
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
            <select
              defaultValue=''
              className='border rounded-sm py-2 px-1 w-full outline-none text-sm'
              {...register('brand_id', {
                required: true
              })}
            >
              <option value=''>Chọn nhãn hiệu</option>
              <option value='64ae64393ff83b13949af3bd'>Samsung</option>
              <option value='64ae64393ff83b13949af3bd'>Dell</option>
              <option value='64ae64393ff83b13949af3bd'>Apple</option>
            </select>
            <p className='text-sm text-red-500 mt-2 font-medium'>{errors.brand_id?.message}</p>
          </div>
          <div className='col-span-6'>
            <label className='font-medium text-sm mb-2 ml-1 block'>Danh mục:</label>
            <select
              defaultValue=''
              className='border rounded-sm py-2 px-1 w-full outline-none text-sm'
              {...register('category_id', {
                required: true
              })}
            >
              <option value=''>Chọn danh mục</option>
              <option value='64afbb1839753e4263bc467e'>Laptop</option>
              <option value='64afbb1839753e4263bc467e'>PC Gaming</option>
              <option value='64afbb1839753e4263bc467e'>Bàn phím</option>
            </select>
            <p className='text-sm text-red-500 mt-2 font-medium'>{errors.category_id?.message}</p>
          </div>
        </div>
        <div className='mt-8'>
          <label className='font-medium text-sm mb-2 ml-1 block'>Thông tin chung:</label>
          <Textarea name='general_info' register={register} errorMesssage={errors.general_info?.message} />
        </div>
        <div className='mt-8'>
          <label className='font-medium text-sm mb-2 ml-1 block'>Thông số kĩ thuật:</label>
          <Textarea name='specifications' register={register} errorMesssage={errors.specifications?.message} />
        </div>
        <div className='mt-8'>
          <label className='font-medium text-sm mb-2 ml-1 block'>Mô tả sản phẩm:</label>
          <Textarea name='description' register={register} errorMesssage={errors.description?.message} />
        </div>
        <div className='py-6 sticky bottom-0 bg-white'>
          <Button isLoading={createProductMutation.isLoading}>Tạo sản phẩm</Button>
        </div>
      </form>
    </div>
  );
};

export default Create;
