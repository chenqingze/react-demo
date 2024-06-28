import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { ProductOptionValue } from 'src/type/product-option';

import Iconify from '../../../components/iconify';
import { useBoolean } from '../../../hooks/use-boolean';
import { ConfirmDialog } from '../../../components/custom-dialog';
import ProductOptionValueQuickNewEditForm from './product-option-value-quick-new-edit-form';

type Props = {
  row: ProductOptionValue;
  onEditRow?: (id: string, productOptionValue: ProductOptionValue) => void;
  onDeleteRow: (id: string) => void;
};

export function ProductOptionValueTableRow({ row, onEditRow, onDeleteRow }: Props) {

  const { id, attributeValue, priceAdjustment, displayOrder } = row;

  const confirm = useBoolean();

  const quickEditProductOptionValue = useBoolean();


  return (<>
    <TableRow hover>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{id}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{attributeValue}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{priceAdjustment}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{displayOrder}</TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <Tooltip title="Quick Edit" placement="top" arrow>
          <IconButton color={quickEditProductOptionValue.value ? 'inherit' : 'default'}
                      onClick={quickEditProductOptionValue.onTrue}>
            <Iconify icon="mdi:edit" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete" placement="top" arrow>
          <IconButton color="error" onClick={confirm.onTrue}>
            <Iconify icon="mdi:trash-can-outline" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>

    <ProductOptionValueQuickNewEditForm currentProductOptionValue={row}
                                        open={quickEditProductOptionValue.value}
                                        onClose={quickEditProductOptionValue.onFalse}
                                        onEdit={onEditRow} />

    <ConfirmDialog
      open={confirm.value}
      onClose={confirm.onFalse}
      title="Delete"
      content="Are you sure want to delete?"
      action={
        <Button variant="contained" color="error" onClick={() => onDeleteRow(id!)}>
          Delete
        </Button>
      }
    />
  </>);
}
