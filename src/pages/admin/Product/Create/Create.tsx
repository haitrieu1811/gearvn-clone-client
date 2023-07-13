import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Input from 'src/components/Input';
import MarkdownEditor from 'src/components/MarkdownEditor/MarkdownEditor';
import Select from 'src/components/Select';
import Button from 'src/components/Button';
import InputFile from 'src/components/InputFile';
import { useMemo, useState } from 'react';
import { PhotoIcon } from 'src/components/Icons';
import mediaApi from 'src/apis/media.api';
import { CreateProductSchema, createProductSchema } from 'src/utils/rules';

type FormData = CreateProductSchema;

const Create = () => {
  const [thumbnailFile, setThumbnailFile] = useState<File>();

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(createProductSchema)
  });

  const previewThumbnail = useMemo(() => (thumbnailFile ? URL.createObjectURL(thumbnailFile) : ''), [thumbnailFile]);

  const handleThumbnailChange = (file?: File) => {
    console.log('handleThumbnailChange', file);
    setThumbnailFile(file);
  };

  const changeGeneralInfo = (html: string) => {
    console.log('>>> changeGeneralInfo', html);
  };

  const changeSpecifications = (html: string) => {
    console.log('>>> changeSpecifications', html);
  };

  const changeDescription = (html: string) => {
    console.log('>>> changeDescription', html);
  };

  const uploadImageMutation = useMutation({
    mutationFn: mediaApi.uploadImage
  });

  const onSubmit = handleSubmit(async (data) => {
    console.log('data', data);

    let thumbnail = '';
    if (thumbnailFile) {
      const form = new FormData();
      form.append('image', thumbnailFile);
      await uploadImageMutation.mutateAsync(form, {
        onSuccess: (data) => {
          thumbnail = data.data.data.medias[0].name;
          console.log('>>> thumbnail', thumbnail);
        }
      });
    }
  });

  console.log(errors);

  return (
    <div>
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
                register={register}
              />
              <p className='text-sm text-red-500 mt-2 font-medium'>{errors.thumbnail?.message}</p>
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
                className='border rounded-sm py-2 px-1 w-full outline-none'
                {...register('brand_id', {
                  required: true
                })}
              >
                <option value='' selected>
                  Chọn nhãn hiệu
                </option>
                <option value='64ae64393ff83b13949af3bd'>Acer</option>
                <option value='64ae64393ff83b13949af3bd'>Dell</option>
                <option value='64ae64393ff83b13949af3bd'>Apple</option>
              </select>
              <p className='text-sm text-red-500 mt-2 font-medium'>{errors.brand_id?.message}</p>
            </div>
            <div className='col-span-6'>
              <label className='font-medium text-sm mb-2 ml-1 block'>Danh mục:</label>
              <Select
                size='Medium'
                label='Danh mục'
                options={[
                  {
                    value: 'Laptop',
                    text: 'Laptop'
                  },
                  {
                    value: 'Điện thoại',
                    text: 'Điện thoại'
                  },
                  {
                    value: 'PC Gaming',
                    text: 'PC Gaming'
                  }
                ]}
              />
            </div>
          </div>
          <div className='mt-8'>
            <label className='font-medium text-sm mb-2 ml-1 block'>Thông tin chung:</label>
            <MarkdownEditor onChange={changeGeneralInfo} placeholder='Thông tin chung' className='h-[200px]' />
          </div>
          <div className='mt-8'>
            <label className='font-medium text-sm mb-2 ml-1 block'>Thông số kĩ thuật:</label>
            <MarkdownEditor onChange={changeSpecifications} placeholder='Thông số kỹ thuật' className='h-[200px]' />
          </div>
          <div className='mt-8'>
            <label className='font-medium text-sm mb-2 ml-1 block'>Mô tả sản phẩm:</label>
            <MarkdownEditor onChange={changeDescription} placeholder='Mô tả sản phẩm' className='h-[500px]' />
          </div>
          <div className='w-[120px] mt-6'>
            <Button>Tạo sản phẩm</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Create;
