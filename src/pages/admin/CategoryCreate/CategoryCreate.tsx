import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from '@tanstack/react-query';
import isEmpty from 'lodash/isEmpty';
import { Fragment, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useMatch, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import categoryApi from 'src/apis/category.api';
import Button from 'src/components/Button';
import Input from 'src/components/Input';
import PATH from 'src/constants/path';
import { ErrorResponse } from 'src/types/utils.type';
import { CreateCategorySchema, createCategorySchema } from 'src/utils/rules';
import { isEntityError } from 'src/utils/utils';

type FormData = CreateCategorySchema;

const Create = () => {
  const match = useMatch(PATH.DASHBOARD_CATEGORY_UPDATE);
  const isUpdateMode = Boolean(match);
  const { category_id } = useParams();

  // Query: lấy thông tin danh mục
  const getCategoryQuery = useQuery({
    queryKey: ['category', category_id],
    queryFn: () => categoryApi.getOne(category_id as string),
    enabled: !!category_id
  });

  // Thông tin danh mục
  const category = useMemo(() => getCategoryQuery.data?.data.data.category, [getCategoryQuery.data]);

  // Form
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(createCategorySchema),
    defaultValues: {
      name_vi: '',
      name_en: ''
    }
  });

  // Set giá trị cho form khi ở chế độ cập nhật
  useEffect(() => {
    if (category) {
      setValue('name_vi', category.name_vi);
      setValue('name_en', category.name_en);
    }
  }, [category, setValue]);

  // Mutation: Tạo mới danh mục
  const createCategoryMutation = useMutation({
    mutationFn: categoryApi.create,
    onSuccess: () => {
      toast.success('Tạo mới danh mục thành công');
      reset();
    },
    onError: (error) => {
      if (isEntityError<ErrorResponse<{ name_vi: string; name_en: string }>>(error)) {
        const formError = error.response?.data.data;
        if (!isEmpty(formError)) {
          Object.keys(formError).map((key) => {
            setError(key as keyof FormData, {
              message: formError[key as keyof FormData],
              type: 'Server'
            });
          });
        }
      }
    }
  });

  // Mutation: Cập nhật danh mục
  const updateCategoryMutation = useMutation({
    mutationFn: categoryApi.update,
    onSuccess: (data) => {
      toast.success(data.data.message);
      getCategoryQuery.refetch();
    }
  });

  // Submit form
  const onSubmit = handleSubmit((data) => {
    if (!isUpdateMode) createCategoryMutation.mutate(data);
    else updateCategoryMutation.mutate({ body: data, categoryId: category_id as string });
  });

  return (
    <Fragment>
      <div className='p-6 w-1/2'>
        <h2 className='text-2xl font-semibold'>{!isUpdateMode ? 'Tạo mới danh mục' : 'Cập nhật danh mục'}</h2>
        <form onSubmit={onSubmit}>
          <Input
            type='text'
            name='name_vi'
            placeholder='Tên tiếng Việt'
            classNameWrapper='mt-6'
            register={register}
            errorMessage={errors.name_vi?.message}
          />
          <Input
            type='text'
            name='name_en'
            placeholder='Tên tiếng Anh'
            classNameWrapper='mt-6'
            register={register}
            errorMessage={errors.name_en?.message}
          />
          <Button
            isLoading={!isUpdateMode ? createCategoryMutation.isLoading : updateCategoryMutation.isLoading}
            classNameWrapper='mt-6'
          >
            {!isUpdateMode ? 'Tạo mới' : 'Cập nhật'}
          </Button>
        </form>
      </div>
    </Fragment>
  );
};

export default Create;
