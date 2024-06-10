import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { Brand } from 'src/type/brand';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFUploadBox } from 'src/components/hook-form';

import Image from '../../../components/image';
import axios, { endpoints } from '../../../utils/axios';
import RHFSwitch from '../../../components/hook-form/rhf-switch';


// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  currentBrand?: Brand;
  onSave?: VoidFunction;
};

export default function BrandQuickNewEditForm({ currentBrand, open, onClose, onSave }: Props) {

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    logoUrl: Yup.string(),
    // logoUrl: Yup.string().required('Logo is required'),
    visible: Yup.boolean(),
    displayOrder: Yup.number(),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentBrand?.name || '',
      logoUrl: currentBrand?.logoUrl || '',
      visible: currentBrand?.visible || true,
      displayOrder: currentBrand?.displayOrder || 0,
    }),
    [currentBrand],
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentBrand) {
      reset(currentBrand);
    }
  }, [currentBrand, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentBrand) {
        await axios.put(`${endpoints.brand}/${currentBrand.id}`, data);
      } else {
        await axios.post(endpoints.brand, data);
      }
      if (onSave) {
        onSave();
      }
      reset();
      onClose();
      enqueueSnackbar(`${currentBrand ? 'Update' : 'Create'} success!`);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const handleDropLogo = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      console.log(newFile);
      if (file) {
        setValue('logoUrl', 'returnUploadUrlValue', { shouldValidate: true });
      }
    },
    [setValue],
  );

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Quick Update</DialogTitle>

        <DialogContent>
          <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
            {currentBrand ? 'Brand is waiting for confirmation' : 'Create a new brand'}
          </Alert>

          <Box
            rowGap={3}
            columnGap={2}
            display="flex"
            alignItems="center">
            <RHFUploadBox
              name="logoUrl"
              maxSize={3145728}
              placeholder={currentBrand?.logoUrl ? <Image
                alt="image"
                src={currentBrand?.logoUrl}
                sx={{
                  width: 1,
                  height: 1,
                  borderRadius: '50%',
                }}
              /> : undefined}
              onDrop={handleDropLogo}
            />
            <RHFTextField name="name" label="Brand Name" />
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <RHFSwitch name="visible" label="Visible" />
          <Stack spacing={2} flexDirection="row">
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {currentBrand ? 'Update' : 'Save'}
            </LoadingButton>
          </Stack>

        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
