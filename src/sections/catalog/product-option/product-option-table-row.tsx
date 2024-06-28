import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import Iconify from '../../../components/iconify';
import { ProductOption } from '../../../type/product-option';
import { ConfirmDialog } from '../../../components/custom-dialog';

type Props = {
  row: ProductOption;
  onEditRow?: (id: string, productOption: ProductOption) => void;
  onDeleteRow: (id: string) => Promise<void>;
};

export default function ProductOptionTableRow({ row, onEditRow, onDeleteRow }: Props) {

  const { id, name, type, attributeName, label, required, useInSkuGeneration, displayOrder } = row;

  const confirm = useBoolean();

  return (
    <>
      <TableRow hover>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{name}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{type}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{attributeName}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{label}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{required ? <Iconify icon="mdi:tick" /> :
          <Iconify icon="mdi:close" />}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{useInSkuGeneration ? <Iconify icon="mdi:tick" /> :
          <Iconify icon="mdi:close" />}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{displayOrder}</TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <Tooltip title="Quick Edit" placement="top" arrow>
            <IconButton component={RouterLink} href={paths.dashboard.catalog.productOption.edit(`${id}`)}>
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
