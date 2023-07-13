import { Fragment, useEffect, useMemo } from 'react';
import { useMatch, useNavigate, useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import isEmpty from 'lodash/isEmpty';

import { ChevronLeft } from 'src/components/Icons';
import Input from 'src/components/Input';
import Button from 'src/components/Button';
import PATH from 'src/constants/path';
import { CreateBrandSchema, createBrandSchema } from 'src/utils/rules';
import brandApi from 'src/apis/brand.api';
import { isEntityError } from 'src/utils/utils';
import { ErrorResponse } from 'src/types/utils.type';

type FormData = CreateBrandSchema;

const Create = () => {
  const navigate = useNavigate();
  const { brand_id } = useParams();
  const match = useMatch(PATH.DASHBOARD_BRAND_UPDATE);
  const isUpdateMode = Boolean(match);

  const getBrandQuery = useQuery({
    queryKey: ['brand', brand_id],
    queryFn: () => brandApi.getOne(brand_id as string),
    enabled: Boolean(brand_id)
  });

  const brand = useMemo(() => getBrandQuery.data?.data.data.brand, [getBrandQuery.data?.data.data.brand]);

  const {
    register,
    reset,
    setValue,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(createBrandSchema),
    defaultValues: {
      name: ''
    }
  });

  useEffect(() => {
    if (brand) {
      setValue('name', brand.name);
    }
  }, [brand, setValue]);

  const createBrandMutation = useMutation({
    mutationFn: brandApi.create,
    onSuccess: () => {
      toast.success('Tạo nhãn hiệu thành công');
      reset();
    },
    onError: (error) => {
      if (isEntityError<ErrorResponse<{ name: string }>>(error)) {
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

  const updateBrandMutation = useMutation({
    mutationFn: brandApi.update,
    onSuccess: (data) => {
      toast.success(data.data.message);
      getBrandQuery.refetch();
    },
    onError: (error) => {
      if (isEntityError<ErrorResponse<{ name: string }>>(error)) {
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

  const handleBack = () => {
    navigate(-1);
  };

  const onSubmit = handleSubmit((data) => {
    if (!isUpdateMode) {
      createBrandMutation.mutate(data);
    } else {
      updateBrandMutation.mutate({ body: data, brandId: brand_id as string });
    }
  });

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
            name='name'
            placeholder='Tên nhãn hiệu'
            classNameWrapper='mt-6'
            register={register}
            errorMessage={errors.name?.message}
          />
          <Button
            isLoading={!isUpdateMode ? createBrandMutation.isLoading : updateBrandMutation.isLoading}
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
