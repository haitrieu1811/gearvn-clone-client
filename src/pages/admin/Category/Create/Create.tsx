import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from '@tanstack/react-query';
import isEmpty from 'lodash/isEmpty';
import { Fragment, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useMatch, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import categoryApi from 'src/apis/category.api';
import Button from 'src/components/Button';
import { ChevronLeft } from 'src/components/Icons';
import Input from 'src/components/Input';
import PATH from 'src/constants/path';
import { ErrorResponse } from 'src/types/utils.type';
import { CreateCategorySchema, createCategorySchema } from 'src/utils/rules';
import { isEntityError } from 'src/utils/utils';

type FormData = CreateCategorySchema;

const Create = () => {
  const navigate = useNavigate();
  const match = useMatch(PATH.DASHBOARD_CATEGORY_UPDATE);
  const isUpdateMode = Boolean(match);
  const { category_id } = useParams();

  const getCategoryQuery = useQuery({
    queryKey: ['category', category_id],
    queryFn: () => categoryApi.getOne(category_id as string),
    enabled: Boolean(category_id)
  });

  const category = useMemo(() => getCategoryQuery.data?.data.data.category, [getCategoryQuery.data]);

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

  useEffect(() => {
    if (category) {
      setValue('name_vi', category.name_vi);
      setValue('name_en', category.name_en);
    }
  }, [category, setValue]);

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

  const updateCategoryMutation = useMutation({
    mutationFn: categoryApi.update,
    onSuccess: () => {
      toast.success('Cập nhật danh mục thành công');
      getCategoryQuery.refetch();
    }
  });

  const onSubmit = handleSubmit((data) => {
    if (!isUpdateMode) {
      createCategoryMutation.mutate(data);
    } else {
      updateCategoryMutation.mutate({ body: data, categoryId: category_id as string });
      console.log('updateCategoryMutation');
    }
  });

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Fragment>
      <button className='flex justify-center items-center mb-6 p-2 rounded hover:bg-slate-200' onClick={handleBack}>
        <ChevronLeft className='w-4 h-4 stroke-blue-600' />
        <span className='text-sm font-semibold text-blue-600 ml-2'>Quay lại</span>
      </button>
      <div className='bg-white rounded-lg p-6 shadow-sm w-1/2'>
        <h2 className='text-2xl font-bold'>{!isUpdateMode ? 'Tạo mới danh mục' : 'Cập nhật danh mục'}</h2>
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
