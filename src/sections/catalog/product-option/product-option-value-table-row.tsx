import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { ProductOptionValue } from 'src/type/product-option';

import Iconify from '../../../components/iconify';
import { useBoolean } from '../../../hooks/use-boolean';
import RHFEditableTableCell from './rhf-editable-table-cell';
import { ConfirmDialog } from '../../../components/custom-dialog';

type Props = {
  row: ProductOptionValue;
  index: number;
  onEditRow?: (index: number, productOptionValue: ProductOptionValue) => void;
  onDeleteRow: (index: number, id: string) => void;
};

export function ProductOptionValueTableRow({ row, index, onEditRow, onDeleteRow }: Props) {

  const { id, displayOrder } = row;

  const confirm = useBoolean();

  return (<>
    <TableRow hover>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{id}</TableCell>
      <RHFEditableTableCell sx={{ whiteSpace: 'nowrap' }}
                            name={`allowedValues.${index}.attributeValue`}
                            textFieldProps={{ size: 'small' }}

      />
      <RHFEditableTableCell sx={{ whiteSpace: 'nowrap' }}
                            name={`allowedValues.${index}.priceAdjustment`}
                            textFieldProps={{ size: 'small' }}
      />
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{displayOrder}</TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <Tooltip title="Delete" placement="top" arrow>
          <IconButton color="error" onClick={confirm.onTrue}>
            <Iconify icon="mdi:trash-can-outline" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>

    <ConfirmDialog
      open={confirm.value}
      onClose={confirm.onFalse}
      title="Delete"
      content="Are you sure want to delete?"
      action={
        <Button variant="contained" color="error" onClick={() => onDeleteRow(index, id!)}>
          Delete
        </Button>
      }
    />
  </>);
}
