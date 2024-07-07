import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Grid from '@mui/material/Unstable_Grid2';

import { useSnackbar } from 'src/components/snackbar';

import { paths } from '../../../routes/paths';
import { Product } from '../../../type/product';
import { useRouter } from '../../../routes/hooks';
import FormProvider, { RHFEditor, RHFTextField, RHFUpload } from '../../../components/hook-form';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

type Props = {
  currentProduct?: Product;
};

export default function ProductNewEditForm({ currentProduct }: Props) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string(),
    longDescription: Yup.string(),
    imageUrls: Yup.array(),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentProduct?.name || '',
      description: currentProduct?.description || '',
      longDescription: currentProduct?.longDescription || '',
      imageUrls: currentProduct?.imageUrls || [],
    }),
    [currentProduct],
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentProduct) {
      reset(defaultValues);
    }
  }, [currentProduct, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      enqueueSnackbar(currentProduct ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.catalog.product.root);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });
  const renderGeneral = (
    <Grid xs={12} md={8}>
      <Card>
        <Stack spacing={3} sx={{ p: 3 }}>
          <RHFTextField name="name" label="Product Name" />

          <RHFTextField name="subDescription" label="Sub Description" multiline rows={4} />

          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Content</Typography>
            <RHFEditor simple name="description" />
          </Stack>

          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Images</Typography>
            <RHFUpload
              multiple
              thumbnail
              name="images"
              maxSize={3145728}
              onDrop={handleDrop}
              onRemove={handleRemoveFile}
              onRemoveAll={handleRemoveAllFiles}
              onUpload={() => console.info('ON UPLOAD')}
            />
          </Stack>
        </Stack>
      </Card>
    </Grid>
  );
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderGeneral}

        {renderPricing}

        {renderOption}

        {renderActions}
      </Grid>
    </FormProvider>
  );
}
