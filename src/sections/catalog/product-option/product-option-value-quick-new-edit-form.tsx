import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import FormProvider, { RHFTextField } from 'src/components/hook-form';

import RHFSwitch from '../../../components/hook-form/rhf-switch';
import { ProductOptionValue } from '../../../type/product-option';


// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  currentProductOptionValue?: ProductOptionValue;
  onAdd?: (productOptionValue: ProductOptionValue) => void;
  onEdit?: (id: string, productOptionValue: ProductOptionValue) => void;
};

export default function ProductOptionValueQuickNewEditForm({
                                                             currentProductOptionValue,
                                                             open,
                                                             onClose,
                                                             onAdd,
                                                             onEdit,
                                                           }: Props) {

  const NewProductOptionValueSchema = Yup.object().shape({
    attributeValue: Yup.string().required('Attribute Value is required'),
    displayOrder: Yup.number(),
    priceAdjustment: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      attributeValue: currentProductOptionValue?.attributeValue || '',
      displayOrder: currentProductOptionValue?.displayOrder || 0,
      priceAdjustment: currentProductOptionValue?.priceAdjustment || '',
    }),
    [currentProductOptionValue],
  );

  const methods = useForm({
    resolver: yupResolver(NewProductOptionValueSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentProductOptionValue) {
      reset(defaultValues);
    }
  }, [currentProductOptionValue, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data, event) => {
    try {
      if (event) {
        // sometimes not true, e.g. React Native
        if (typeof event.preventDefault === 'function') {
          event.preventDefault();
        }
        if (typeof event.stopPropagation === 'function') {
          // prevent any outer forms from receiving the event too
          event.stopPropagation();
        }
      }

      if (currentProductOptionValue && onEdit) {
        onEdit(currentProductOptionValue.id!, data as ProductOptionValue);
      }
      if (!currentProductOptionValue && onAdd) {
        onAdd(data as ProductOptionValue);
      }
      reset();
      onClose();
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

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
      <FormProvider methods={methods}>
        <DialogTitle>Quick Update</DialogTitle>

        <DialogContent>
          <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
            {currentProductOptionValue ? 'ProductOptionValue is waiting for confirmation' : 'Create a new productOptionValue'}
          </Alert>

          <Stack spacing={3}>
            <RHFTextField name="attributeValue" label="Attribute Value" />
            <RHFTextField name="priceAdjustment" type="number" label="Price Adjustment" />
          </Stack>

        </DialogContent>

        <DialogActions sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <RHFSwitch name="visible" label="Visible" />
          <Stack spacing={2} flexDirection="row">
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <LoadingButton type="button" variant="contained" loading={isSubmitting} onClick={onSubmit}>
              {currentProductOptionValue ? 'Update' : 'Save'}
            </LoadingButton>
          </Stack>

        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
