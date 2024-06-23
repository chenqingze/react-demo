import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useEffect, useCallback } from 'react';

import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { Category } from '../../../type/category';
import RHFSwitch from '../../../components/hook-form/rhf-switch';
import FormProvider, { RHFEditor, RHFUpload, RHFTextField } from '../../../components/hook-form';


type Props = {
  open: boolean;
  onClose: VoidFunction;
  currentCategory?: Category;
  parentCategory?: Category;
  onAdd?: (newCategory: Category) => Promise<void>;
  onEdit?: (id: string, newCategory: Category) => Promise<void>;
};

export default function CategoryQuickNewEditForm({
                                                   open,
                                                   onClose,
                                                   currentCategory,
                                                   parentCategory,
                                                   onAdd,
                                                   onEdit,
                                                 }: Props) {

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
    getValues,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentCategory) {
      reset(currentCategory);
    }
    setValue('parentId', parentCategory?.id || '');
  }, [currentCategory, parentCategory, reset, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    console.log('submit', data);
    try {
      if (currentCategory && onEdit) {
        await onEdit(currentCategory.id!, data as Category);
      } else if (onAdd) {
        await onAdd(data as Category);
      } else {
        console.error('something went wrong');
      }
      reset();
      onClose();
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
          <Stack spacing={2} sx={{ p: 3 }}>
            <RHFTextField name="name" label="Category Name" />
            <TextField defaultValue={currentCategory?.parentCategory?.name || parentCategory?.name || ''}
                       label="Praent Category" disabled />
            <Stack spacing={1}>
              <Typography variant="subtitle2">Cover Image</Typography>
              <RHFUpload
                name="imageUrl"
                maxSize={3145728}
                onDrop={handleUploadImage}
                onDelete={() => setValue('imageUrl', undefined)}
              />
            </Stack>
            <Stack spacing={1}>
              <Typography variant="subtitle2">Description</Typography>
              <RHFEditor simple name="description" />
            </Stack>

          </Stack>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'space-between', alignItems: 'center', mx: '24px' }}>
          <RHFSwitch name="visible" label="Visible" />
          <Stack spacing={2} flexDirection="row">
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}
                           onClick={() => console.log(isSubmitting, getValues())}>
              {currentCategory ? 'Update' : 'Save'}
            </LoadingButton>
          </Stack>

        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
