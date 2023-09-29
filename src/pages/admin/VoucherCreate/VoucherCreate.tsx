import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from '@tanstack/react-query';
import isEmpty from 'lodash/isEmpty';
import { useForm } from 'react-hook-form';
import { useMatch, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useMemo, useEffect } from 'react';

import voucherApi from 'src/apis/voucher.api';
import Button from 'src/components/Button';
import FloatLoading from 'src/components/FloatLoading';
import Input from 'src/components/Input';
import { VoucherDiscountUnit } from 'src/constants/enum';
import { ErrorResponse } from 'src/types/utils.type';
import { VoucherSchema, voucherSchema } from 'src/utils/rules';
import { generateRandomString, isEntityError } from 'src/utils/utils';
import PATH from 'src/constants/path';

type FormData = VoucherSchema & { name: string; description: string };

const VoucherCreate = () => {
  const { voucher_id } = useParams();
  const isUpdateMode = !!useMatch(PATH.DASHBOARD_VOUCHER_UPDATE);

  // Form
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(voucherSchema as any),
    defaultValues: {
      discount_unit: String(VoucherDiscountUnit.Price),
      discount: '',
      code: '',
      description: '',
      name: ''
    }
  });

  // Query: Lấy thông tin voucher
  const getVoucherQuery = useQuery({
    queryKey: ['voucher', voucher_id],
    queryFn: () => voucherApi.getVoucherById(voucher_id as string),
    enabled: !!voucher_id
  });

  // Voucher
  const voucher = useMemo(() => getVoucherQuery.data?.data.data.voucher, [getVoucherQuery.data?.data.data.voucher]);

  // Set giá trị cho form (ở trạng thái update)
  useEffect(() => {
    if (!voucher) return;
    setValue('discount_unit', String(voucher.discount_unit));
    setValue('discount', String(voucher.discount));
    setValue('code', voucher.code);
    setValue('description', voucher.description);
    setValue('name', voucher.name);
  }, [voucher, setValue]);

  // Mutation: Tạo voucher
  const createVoucherMutation = useMutation({
    mutationFn: voucherApi.createVoucher,
    onSuccess: (data) => {
      toast.success(data.data.message);
      reset();
    },
    onError: (error) => {
      if (isEntityError<ErrorResponse<{ [key in keyof FormData]: string }>>(error)) {
        const formErrors = error.response?.data.data;
        if (!isEmpty(formErrors)) {
          Object.keys(formErrors).forEach((key) => {
            setError(key as keyof FormData, {
              type: 'Server',
              message: formErrors[key as keyof FormData]
            });
          });
        }
      }
    }
  });

  // Mutation: Cập nhật voucher
  const updateVoucherMutation = useMutation({
    mutationFn: voucherApi.updateVoucher,
    onSuccess: (data) => {
      toast.success(data.data.message);
    },
    onError: (error) => {
      if (isEntityError<ErrorResponse<{ [key in keyof FormData]: string }>>(error)) {
        const formErrors = error.response?.data.data;
        if (!isEmpty(formErrors)) {
          Object.keys(formErrors).forEach((key) => {
            setError(key as keyof FormData, {
              type: 'Server',
              message: formErrors[key as keyof FormData]
            });
          });
        }
      }
    }
  });

  // Tạo code voucher ngẫu nhiên
  const generateRandomCode = () => {
    const code = generateRandomString(12);
    setValue('code', code);
  };

  // Xử lý submit form
  const onSubmit = handleSubmit((data) => {
    const body = {
      ...data,
      discount: Number(data.discount),
      discount_unit: Number(data.discount_unit)
    };
    if (!isUpdateMode) {
      createVoucherMutation.mutate(body);
    } else {
      updateVoucherMutation.mutate({
        body,
        voucherId: voucher_id as string
      });
    }
  });

  return (
    <div className='px-6'>
      <h1 className='text-2xl font-semibold mb-10'>{!isUpdateMode ? 'Tạo voucher' : 'Cập nhật voucher'}</h1>
      <form onSubmit={onSubmit}>
        {/* Đơn vị giảm */}
        <div>
          <label className='mb-3 inline-block font-semibold'>Đơn vị giảm</label>
          <select
            className='block w-full outline-none border border-[#CFCFCF] rounded px-3 py-2'
            {...register('discount_unit')}
          >
            <option value={VoucherDiscountUnit.Price} selected>
              Giảm theo số tiền (VNĐ)
            </option>
            <option value={VoucherDiscountUnit.Percentage}>Giảm theo phần trăm (%)</option>
          </select>
        </div>

        {/* Giảm */}
        <div className='mt-6'>
          <label htmlFor='discount' className='mb-3 inline-block font-semibold'>
            Giảm (VNĐ/%)
          </label>
          <Input
            type='text'
            name='discount'
            id='discount'
            register={register}
            errorMessage={errors.discount?.message}
          />
        </div>

        {/* Code */}
        <div className='mt-6'>
          <div className='flex items-center mb-3'>
            <label htmlFor='code' className='font-semibold'>
              Voucher code
            </label>
            <button
              type='button'
              onClick={generateRandomCode}
              className='ml-3 border px-4 py-1 rounded bg-slate-100 text-sm font-semibold'
            >
              Random code
            </button>
          </div>
          <Input type='text' name='code' id='code' register={register} errorMessage={errors.code?.message} />
        </div>

        {/* Tên */}
        <div className='mt-6'>
          <label htmlFor='name' className='mb-3 inline-block font-semibold'>
            Tên voucher
          </label>
          <Input type='text' name='name' id='name' register={register} />
        </div>

        {/* Mô tả */}
        <div className='mt-6'>
          <label htmlFor='description' className='mb-3 inline-block font-semibold'>
            Mô tả
          </label>
          <Input type='text' name='description' id='description' register={register} />
        </div>

        <Button classNameWrapper='mt-10'>{!isUpdateMode ? 'Tạo voucher' : 'Cập nhật voucher'}</Button>
      </form>

      {/* Loading */}
      <FloatLoading isLoading={createVoucherMutation.isLoading || updateVoucherMutation.isLoading} />
    </div>
  );
};

export default VoucherCreate;
