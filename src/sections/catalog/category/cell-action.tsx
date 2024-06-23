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
  onAdd: (newCategory: Category) => Promise<void>;
  onEdit: (id: string, newCategory: Category) => Promise<void>;
  onDelete: (id: string) => void;
}

export default function CellAction({ currentCategory, onAdd, onEdit, onDelete }: CellActionProps) {

  const quickAddSubCategory = useBoolean();
  const quickEditCategory = useBoolean();
  const confirm = useBoolean();

  return (
    <>
      <Tooltip title="Quick Add Sub Category" placement="top" arrow>
        <IconButton color={quickAddSubCategory.value ? 'inherit' : 'default'} onClick={quickAddSubCategory.onTrue}
                    disabled={currentCategory.depth > 1}>
          <Iconify icon="mdi:add" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Quick Edit" placement="top" arrow>
        <IconButton color={quickEditCategory.value ? 'inherit' : 'default'} onClick={quickEditCategory.onTrue}>
          <Iconify icon="mdi:edit" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete" placement="top" arrow>
        <IconButton color={confirm.value ? 'inherit' : 'default'} onClick={confirm.onTrue}>
          <Iconify icon="mdi:trash-can-outline" />
        </IconButton>
      </Tooltip>

      <CategoryQuickNewEditForm open={quickAddSubCategory.value}
                                onClose={quickAddSubCategory.onFalse}
                                parentCategory={currentCategory}
                                onAdd={onAdd} />
      <CategoryQuickNewEditForm open={quickEditCategory.value}
                                onClose={quickEditCategory.onFalse}
                                currentCategory={currentCategory}
                                onEdit={onEdit} />
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

    </>
  );
}
