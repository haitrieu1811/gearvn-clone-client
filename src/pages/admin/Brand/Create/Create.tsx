import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from '@tanstack/react-query';
import isEmpty from 'lodash/isEmpty';
import { Fragment, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useMatch, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import brandApi from 'src/apis/brand.api';
import Back from 'src/components/Back';
import Button from 'src/components/Button';
import Input from 'src/components/Input';
import PATH from 'src/constants/path';
import { ErrorResponse } from 'src/types/utils.type';
import { CreateBrandSchema, createBrandSchema } from 'src/utils/rules';
import { isEntityError } from 'src/utils/utils';

type FormData = CreateBrandSchema;

const Create = () => {
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

  const onSubmit = handleSubmit((data) => {
    if (!isUpdateMode) {
      createBrandMutation.mutate(data);
    } else {
      updateBrandMutation.mutate({ body: data, brandId: brand_id as string });
    }
  });

  return (
    <Fragment>
      <Back />
      <div className='bg-white rounded-lg p-6 shadow-sm w-1/2'>
        <h2 className='text-2xl font-semibold'>{!isUpdateMode ? 'Tạo mới nhãn hiệu' : 'Cập nhật nhãn hiệu'}</h2>
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
