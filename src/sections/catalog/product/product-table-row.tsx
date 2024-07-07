import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { Product } from '../../../type/product';
import Iconify from '../../../components/iconify';
import { useBoolean } from '../../../hooks/use-boolean';
import { ConfirmDialog } from '../../../components/custom-dialog';

type Props = {
  row: Product;
  onEditRow: (id: string) => void;
  onDeleteRow: (id: string) => Promise<void>;
};

export function ProductTableRow({ row, onEditRow, onDeleteRow }: Props) {
  const {
    id,
    name,
    manufacturer,
    useDefaultSkuInInventory,
  } = row;

  const confirm = useBoolean();
  return (
    <>
      <TableRow hover>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{name}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{manufacturer}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {useDefaultSkuInInventory ? <Iconify icon="mdi:tick" /> : <Iconify icon="mdi:close" />}
        </TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <Tooltip title="Edit" placement="top" arrow>
            <IconButton onClick={() => onEditRow(`${id}`)}>
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
    </>
  );
}
