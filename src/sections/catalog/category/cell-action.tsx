import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

import Iconify from '../../../components/iconify';
import { Category } from '../../../type/category';
import { useBoolean } from '../../../hooks/use-boolean';
import { ConfirmDialog } from '../../../components/custom-dialog';
import CategoryQuickNewEditForm from './category-quick-new-edit-form';

interface CellActionProps {
  currentCategory: Category;
  onDelete: (id: string) => void;
  onEdit: (id: string, newCategory: Category) => void;
}

export default function CellAction({ currentCategory, onDelete, onEdit }: CellActionProps) {

  const quickEditCategory = useBoolean();
  const confirm = useBoolean();

  return (
    <>
      <Tooltip title="Quick Edit" placement="top" arrow>
        <IconButton color={quickEditCategory.value ? 'inherit' : 'default'} onClick={quickEditCategory.onTrue}>
          <Iconify icon="solar:pen-bold" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete" placement="top" arrow>
        <IconButton color={confirm.value ? 'inherit' : 'default'} onClick={confirm.onTrue}>
          <Iconify icon="solar:trash-bin-trash-bold" />
        </IconButton>
      </Tooltip>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={() => {
            onDelete(currentCategory.id!);
            confirm.onFalse();
          }}>
            Delete
          </Button>
        }
      />
      <CategoryQuickNewEditForm open={quickEditCategory.value}
                                onClose={quickEditCategory.onFalse}
                                currentCategory={currentCategory}
                                onEdit={onEdit} />
    </>
  );
}
