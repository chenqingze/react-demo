import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import Image from '../../../components/image';
import { Category } from '../../../type/category';
import axios, { endpoints } from '../../../utils/axios';
import { useSnackbar } from '../../../components/snackbar';
import RHFSwitch from '../../../components/hook-form/rhf-switch';
import FormProvider, { RHFUploadBox, RHFTextField } from '../../../components/hook-form';


type Props = {
  open: boolean;
  onClose: VoidFunction;
  currentCategory?: Category;
  onSave?: VoidFunction;
};

export default function CategoryQuickNewEditForm({ currentCategory, open, onClose, onSave }: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const NewCategorySchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string(),
    imageUrl: Yup.string(),
    visible: Yup.boolean(),
    displayOrder: Yup.number(),
    parentId: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentCategory?.name || '',
      description: currentCategory?.description || '',
      imageUrl: currentCategory?.imageUrl || '',
      visible: currentCategory?.visible || true,
      displayOrder: currentCategory?.displayOrder || 0,
      parentId: currentCategory?.parentId || '',
    }),
    [currentCategory],
  );

  const methods = useForm({
    resolver: yupResolver(NewCategorySchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentCategory) {
      reset(currentCategory);
    }
  }, [currentCategory, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentCategory) {
        await axios.put(`${endpoints.category}/${currentCategory.id}`, data);
      } else {
        await axios.post(endpoints.category, data);
      }
      if (onSave) {
        onSave();
      }
      reset();
      onClose();
      enqueueSnackbar(`${currentCategory ? 'Update' : 'Create'} success!`);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });
  const handleUploadImage = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      console.log(newFile);
      if (file) {
        setValue('imageUrl', 'returnUploadUrlValue', { shouldValidate: true });
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
            {currentCategory ? 'Category is waiting for confirmation' : 'Create a new category'}
          </Alert>

          <Box
            rowGap={3}
            columnGap={2}
            display="flex"
            alignItems="center">
            <RHFUploadBox
              name="logoUrl"
              maxSize={3145728}
              placeholder={currentCategory?.imageUrl ? <Image
                alt="image"
                src={currentCategory?.imageUrl}
                sx={{
                  width: 1,
                  height: 1,
                  borderRadius: '50%',
                }}
              /> : undefined}
              onDrop={handleUploadImage}
            />
            <RHFTextField name="name" label="Category Name" />
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <RHFSwitch name="visible" label="Visible" />
          <Stack spacing={2} flexDirection="row">
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {currentCategory ? 'Update' : 'Save'}
            </LoadingButton>
          </Stack>

        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
