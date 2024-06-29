import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import CardHeader from '@mui/material/CardHeader';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { ProductOption, ProductOptionType, PRODUCT_OPTION_TYPES } from 'src/type/product-option';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

import axios, { endpoints } from '../../../utils/axios';
import RHFSwitch from '../../../components/hook-form/rhf-switch';
import { ProductOptionNewEditOptionValueList } from './product-option-new-edit-option-value-list';
// ----------------------------------------------------------------------

type Props = {
  currentProductOption?: ProductOption;
};

export default function ProductOptionNewEditForm({ currentProductOption }: Props) {

  const { enqueueSnackbar } = useSnackbar();

  const router = useRouter();

  const NewProductOptionSchema = Yup.object().shape({
    name: Yup.string(),
    label: Yup.string(),
    attributeName: Yup.string().required('Name is required'),
    required: Yup.boolean(),
    useInSkuGeneration: Yup.boolean(),
    displayOrder: Yup.number().default(0),
    type: Yup.string<ProductOptionType>().nullable(),
    allowedValues: Yup.lazy(() =>
      Yup.array().of(
        Yup.object({
          attributeValue: Yup.string().required('Attribute Value is required'),
          displayOrder: Yup.number(),
          priceAdjustment: Yup.mixed().nullable(),
        }),
      ).default([]),
    ),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentProductOption?.name || '',
      label: currentProductOption?.label || '',
      attributeName: currentProductOption?.attributeName || '',
      required: currentProductOption?.required || true,
      useInSkuGeneration: currentProductOption?.useInSkuGeneration || true,
      displayOrder: currentProductOption?.displayOrder || 0,
      type: currentProductOption?.type || null,
      allowedValues: currentProductOption?.allowedValues || [],
    }),
    [currentProductOption],
  );

  const methods = useForm({
    resolver: yupResolver(NewProductOptionSchema),
    defaultValues,
  });

  const {
    watch,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  console.log(watch());

  useEffect(() => {
    if (currentProductOption) {
      reset(defaultValues);
    }
  }, [currentProductOption, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    try {
      if (currentProductOption) {
        currentProductOption = await axios.put(`${endpoints.productOption}/${currentProductOption.id!}`, data);
      } else {
        currentProductOption = await axios.post(endpoints.productOption, data);
      }
      reset(defaultValues);
      enqueueSnackbar(currentProductOption ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.catalog.productOption.root);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Card>
        <CardHeader title="Product Option" />
        <Box
          rowGap={3}
          columnGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
          }}
          sx={{ p: 3 }}
        >
          <RHFTextField name="name" label="Product Option Name" />
          <RHFTextField name="label" label="Label For Cutomer" />
          <RHFTextField name="attributeName" label="Attribute Name" />
          <RHFTextField select name="type" label="Product Option Type">
            <MenuItem value="">None</MenuItem>
            <Divider sx={{ borderStyle: 'dashed' }} />
            {PRODUCT_OPTION_TYPES.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </RHFTextField>
          <RHFSwitch name="required" label="Required" />
          <RHFSwitch name="useInSkuGeneration" label="Use In Sku Generation" />
        </Box>
        <Divider sx={{ borderStyle: 'dashed' }} />
        <ProductOptionNewEditOptionValueList productOptionId={currentProductOption?.id} />
      </Card>
      <Stack alignItems="flex-end" spacing={2} sx={{ mt: 3 }}>
        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          {!currentProductOption ? 'Create Product Option' : 'Save Changes'}
        </LoadingButton>
      </Stack>

    </FormProvider>
  );
};
