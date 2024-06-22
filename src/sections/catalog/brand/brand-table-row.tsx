import { useCallback } from 'react';

import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import { Brand } from 'src/type/brand';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';

import axios, { endpoints } from '../../../utils/axios';
import BrandQuickNewEditForm from './brand-quick-new-edit-form';


// ----------------------------------------------------------------------

type Props = {
  row: Brand;
  onDelete?: VoidFunction;
  onSave?: VoidFunction;
};

export default function BrandTableRow({ row, onSave, onDelete }: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const { name, logoUrl, visible } = row;

  const confirm = useBoolean();

  const quickEditBrand = useBoolean();

  // const popover = usePopover();

  const handleDeleteBrand = useCallback(async (id: string) => {
    await axios.delete(`${endpoints.brand}/${id}`);
    if (onDelete) {
      onDelete();
    }
    enqueueSnackbar('Delete success!');
  }, [enqueueSnackbar, onDelete]);

  return (
    <>
      <TableRow hover>
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={name} src={logoUrl} sx={{ mr: 2 }} />
          <ListItemText
            primary={name}
            primaryTypographyProps={{ typography: 'body2' }}
          />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{visible ? '是' : '否'}</TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <Tooltip title="Quick Edit" placement="top" arrow>
            <IconButton color={quickEditBrand.value ? 'inherit' : 'default'} onClick={quickEditBrand.onTrue}>
              <Iconify icon="mdi:edit" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete" placement="top" arrow>
            <IconButton color={confirm.value ? 'inherit' : 'default'} onClick={confirm.onTrue}>
              <Iconify icon="mdi:trash-can-outline" />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>

      <BrandQuickNewEditForm currentBrand={row} open={quickEditBrand.value} onClose={quickEditBrand.onFalse}
                             onSave={onSave} />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={() => handleDeleteBrand(row.id!)}>
            Delete
          </Button>
        }
      />
    </>
  );
}
