import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from '@tanstack/react-query';
import isEmpty from 'lodash/isEmpty';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useMatch, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import blogApi from 'src/apis/blog.api';
import mediaApi from 'src/apis/media.api';
import Back from 'src/components/Back';
import Button from 'src/components/Button';
import { CloudArrowUpIcon, PhotoIcon } from 'src/components/Icons';
import Input from 'src/components/Input';
import InputFile from 'src/components/InputFile';
import TextEditor from 'src/components/TextEditor';
import PATH from 'src/constants/path';
import { ErrorResponse } from 'src/types/utils.type';
import { CreateBlogSchema, createBlogSchema } from 'src/utils/rules';
import FloatLoading from 'src/components/FloatLoading';
import { getImageUrl, htmlToMarkdown, isEntityError } from 'src/utils/utils';

type FormData = CreateBlogSchema;

const Create = () => {
  const { blog_id } = useParams();
  const isMatch = useMatch(PATH.DASHBOARD_BLOG_UPDATE);
  const isUpdateMode = Boolean(isMatch);
  const [thumbnailFile, setThumbnailFile] = useState<File[] | null>(null);
  const [contentVi, setContentVi] = useState<string>('');
  const [contentEn, setContentEn] = useState<string>('');

  // Form
  const {
    register,
    control,
    setValue,
    handleSubmit,
    setError,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(createBlogSchema),
    defaultValues: {
      name_vi: '',
      name_en: '',
      content_vi: '',
      content_en: ''
    }
  });

  // Lấy thông tin blog cũ
  const getBlogQuery = useQuery({
    queryKey: ['blog', blog_id],
    queryFn: () => blogApi.getDetail(blog_id as string),
    enabled: Boolean(blog_id)
  });

  // Tạo mới blog
  const createBlogMutation = useMutation({
    mutationFn: blogApi.create,
    onSuccess: (data) => {
      toast.success(data.data.message);
      thumbnailFile && setThumbnailFile(null);
      setContentVi('');
      setContentEn('');
      reset();
    },
    onError: (error) => {
      if (isEntityError<ErrorResponse<{ [key in keyof FormData]: string }>>(error)) {
        const formError = error.response?.data.data;
        if (!isEmpty(formError)) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormData, {
              message: formError[key as keyof FormData],
              type: 'Server'
            });
          });
        }
      }
    }
  });

  // Cập nhật blog cũ
  const updateBlogMutation = useMutation({
    mutationFn: blogApi.update,
    onSuccess: (data) => {
      toast.success(data.data.message);
      getBlogQuery.refetch();
    },
    onError: (error) => {
      if (isEntityError<ErrorResponse<{ [key in keyof FormData]: string }>>(error)) {
        const formError = error.response?.data.data;
        if (!isEmpty(formError)) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormData, {
              message: formError[key as keyof FormData],
              type: 'Server'
            });
          });
        }
      }
    }
  });

  // Upload ảnh
  const uploadImageMutation = useMutation(mediaApi.uploadImage);

  // Xử lý khi thay đổi thumbnail
  const handleThumbnailChange = (files?: File[]) => {
    setThumbnailFile(files || null);
  };

  // Lấy thông tin blog cũ
  const blog = useMemo(() => getBlogQuery.data?.data.data.blog, [getBlogQuery.data?.data.data.blog]);
  // Ảnh đại diện
  const previewThumbnail = useMemo(() => (thumbnailFile ? URL.createObjectURL(thumbnailFile[0]) : ''), [thumbnailFile]);

  // Set giá trị cho form
  useEffect(() => {
    if (blog) {
      setValue('name_vi', blog.name_vi);
      setValue('name_en', blog.name_en);
      setValue('content_vi', blog.content_vi);
      setValue('content_en', blog.content_en);
      setContentVi(htmlToMarkdown(blog.content_vi));
      setContentEn(htmlToMarkdown(blog.content_en));
    }
  }, [blog]);

  // Xử lý khi thay đổi nội dung
  const changeContentVi = ({ html, text }: { html: string; text: string }) => {
    setValue('content_vi', html);
    setContentVi(text);
  };

  // Xử lý khi thay đổi nội dung
  const changeContentEn = ({ html, text }: { html: string; text: string }) => {
    setValue('content_en', html);
    setContentEn(text);
  };

  // Xử lý khi submit form
  const onSubmit = handleSubmit(async (data) => {
    let thumbnail = blog && blog.thumbnail ? blog.thumbnail : '';
    if (thumbnailFile) {
      const form = new FormData();
      form.append('image', thumbnailFile[0]);
      const res = await uploadImageMutation.mutateAsync(form);
      thumbnail = res.data.data.medias[0].name;
    }
    const body = {
      ...data,
      thumbnail
    };
    if (!isUpdateMode) {
      createBlogMutation.mutate(body);
    } else {
      updateBlogMutation.mutate({ body, blogId: blog_id as string });
    }
  });

  return (
    <Fragment>
      <Back />
      <div className='bg-white rounded-lg shadow-sm p-6'>
        <h2 className='text-2xl font-semibold mb-6'>{!isUpdateMode ? 'Tạo bài viết mới' : 'Cập nhật bài viết'}</h2>
        <form onSubmit={onSubmit}>
          <div className='grid grid-cols-12 gap-10'>
            <div className='col-span-8'>
              <div>
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
              <div className='mt-6'>
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
              <div className='mt-6'>
                <label htmlFor='content_vi' className='font-medium text-sm mb-2 ml-1 block'>
                  Nội dung tiếng Việt:
                </label>
                <Controller
                  control={control}
                  name='content_vi'
                  render={({ field }) => (
                    <TextEditor
                      placeholder='Nội dung tiếng Việt'
                      name={field.name}
                      value={contentVi}
                      errorMessage={errors.content_vi?.message}
                      onChange={changeContentVi}
                    />
                  )}
                />
              </div>
              <div className='mt-6'>
                <label htmlFor='content_en' className='font-medium text-sm mb-2 ml-1 block'>
                  Nội dung tiếng Anh:
                </label>
                <Controller
                  control={control}
                  name='name_en'
                  render={({ field }) => (
                    <TextEditor
                      placeholder='Nội dung tiếng Anh'
                      name={field.name}
                      value={contentEn}
                      errorMessage={errors.content_en?.message}
                      onChange={changeContentEn}
                    />
                  )}
                />
              </div>
            </div>
            <div className='col-span-4'>
              {/* Thumbnail */}
              <div className=''>
                {!previewThumbnail && !blog?.thumbnail ? (
                  <div className='flex justify-center items-center min-h-[240px] mb-3 rounded bg-slate-100'>
                    <CloudArrowUpIcon className='w-10 h-10' />
                  </div>
                ) : (
                  <img
                    src={previewThumbnail || getImageUrl(blog?.thumbnail as string)}
                    alt='Thumbnail'
                    className='w-full max-h-[240px] mb-3 rounded object-cover'
                  />
                )}
                <InputFile onChange={handleThumbnailChange} name='thumbnail'>
                  <button
                    type='button'
                    className='bg-slate-50 border rounded-sm w-full py-2 text-sm font-medium flex justify-center items-center'
                  >
                    <PhotoIcon className='w-4 h-4 mr-2' />
                    <span>{!isUpdateMode ? 'Tải ảnh đại diện bài viết' : 'Cập nhật ảnh đại diện mới'}</span>
                  </button>
                </InputFile>
              </div>
            </div>
          </div>
          <div className='py-6 sticky bottom-0 bg-white'>
            <Button>{!isUpdateMode ? 'Tạo bài viết' : 'Cập nhật bài viết'}</Button>
          </div>
        </form>
      </div>
      <FloatLoading
        isLoading={createBlogMutation.isLoading || updateBlogMutation.isLoading || uploadImageMutation.isLoading}
      />
    </Fragment>
  );
};

export default Create;
