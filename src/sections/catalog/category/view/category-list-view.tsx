import DataGrid, { Column } from 'react-data-grid';
import { useMemo, useEffect, useReducer, useCallback } from 'react';

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import CellAction from '../cell-action';
import CellExpander from '../cell-expander';
import { paths } from '../../../../routes/paths';
import Iconify from '../../../../components/iconify';
import { Category } from '../../../../type/category';
import axios, { endpoints } from '../../../../utils/axios';
import { useBoolean } from '../../../../hooks/use-boolean';
import { useSnackbar } from '../../../../components/snackbar';
import { useSettingsContext } from '../../../../components/settings';
import CategoryQuickNewEditForm from '../category-quick-new-edit-form';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';

// const DELIMITER = '/' as const;
const toggleSubRow = (rows: Category[], id: string): Category[] => {
  const rowIndex = rows.findIndex((r) => r.id === id);
  const row = rows[rowIndex];
  const subCategories = row.subCategories!;
  const newRows = [...rows];
  newRows[rowIndex] = { ...row, isExpanded: !row.isExpanded };
  if (row.isExpanded) {
    newRows.splice(rowIndex + 1, subCategories.length);
  } else {
    newRows.splice(rowIndex + 1, 0, ...subCategories);
  }
  return newRows;
};

const deleteRow = (rows: Category[], id: string): Category[] => {
  const row = rows.find((r) => r.id === id);
  let newRows;
  // Remove row from flattened rows.
  if (row?.descendantCount && row.descendantCount > 0) {
    newRows = rows.filter((r) => r.id !== id || r.parentId !== id);
  } else {
    newRows = rows.filter((r) => r.id !== id);
  }
  if (row?.parentId) {
    // Remove row from parent row.
    const parentRowIndex = newRows.findIndex((r) => r.id === row.parentId);
    const { subCategories } = newRows[parentRowIndex];
    if (subCategories) {
      const newSubCategories = subCategories.filter((sr) => sr.id !== id);
      newRows[parentRowIndex] = { ...newRows[parentRowIndex], subCategories: newSubCategories };
    }
  }
  return newRows;
};

type Action = | { type: 'setCategoryListData', categoryData: Category[] }
  | { type: 'toggleSubRow' | 'deleteRow', id: string }

const reducer = (rows: Category[], action: Action): Category[] => {
  switch (action.type) {
    case 'setCategoryListData':
      return action.categoryData;
    case 'toggleSubRow':
      return toggleSubRow(rows, action.id);
    case 'deleteRow':
      return deleteRow(rows, action.id);
    default:
      return rows;
  }
};

const fetchCategoryListData = async (parentCategoryId?: string) => {
  const url = parentCategoryId ? `${endpoints.category}/${parentCategoryId}/subcategories` : `${endpoints.category}/subcategories`;
  return axios.get<Category []>(url).then(({ data }) => data.map((item) => ({
    ...item,
    isExpanded: false,
    childrenFetched: false,
  })));
};

export default function CategoryListView() {

  const settings = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const quickNewCategory = useBoolean();
  const [rows, dispatch] = useReducer(reducer, []);

  useEffect(() => {
    fetchCategoryListData().then(categories => {
      dispatch({ type: 'setCategoryListData', categoryData: categories });
    });
  }, []);

  const handleAddCategory = useCallback((newCategory: Category) => {
    axios.post(endpoints.category, newCategory).then(() => {
      console.log('todo:dispatch');
      enqueueSnackbar('Create success!');
    });
  }, [enqueueSnackbar]);

  const handleEditCategory = useCallback((id: string, newCategory: Category) => {
    axios.put(`${endpoints.category}/${id}`, newCategory).then(() => {
      console.log('todo:dispatch');
      enqueueSnackbar('Update success!');
    });
  }, [enqueueSnackbar]);

  const handleDeleteCategory = useCallback((id: string) => {
    axios.delete(`${endpoints.category}/${id}`).then(() => {
      dispatch({ type: 'deleteRow', id });
      enqueueSnackbar('Delete success!');
    });
  }, [enqueueSnackbar]);

  const columns = useMemo((): readonly Column<Category>[] => [
    {
      key: 'name',
      name: 'Name',
      frozen: true,
      renderCell({ row }) {
        const hasSubCategories = row.descendantCount > 0;
        return (
          <>
            {hasSubCategories && (
              <CellExpander
                expanded={row.isExpanded === true}
                onCellExpand={() => {
                  if (row.childrenFetched) {
                    dispatch({ id: row.id!, type: 'toggleSubRow' });
                  } else {
                    fetchCategoryListData(row.id).then((subCategories) => {
                      row.childrenFetched = true;
                      row.subCategories = subCategories;
                      dispatch({ id: row.id!, type: 'toggleSubRow' });
                    });
                  }
                }}
              />
            )}
            <div style={{
              display: 'flex',
              justifyContent: 'left',
              alignItems: 'center',
              height: '100%',
              marginInlineStart: '30px',
            }}>
              <Typography variant="body2" style={{}}>
                {row.name}
              </Typography>
            </div>
          </>
        );
      },
    },
    {
      key: 'imageUrl',
      name: 'Image',
      renderCell: ({ row }) => (<Avatar src={row.imageUrl || '/favicon/apple-touch-icon.png'} />),
    },
    {
      key: 'visible',
      name: 'Visibility',
      renderCell: ({ row }) =>
        row.visible ? <Iconify icon="charm:tick" /> : <Iconify icon="charm:cross" />,
    },
    {
      key: 'action',
      name: 'Action',
      renderCell: ({ row }) => (<CellAction currentCategory={row}
                                            onDelete={handleDeleteCategory}
                                            onEdit={handleEditCategory} />),
    },
  ], [handleDeleteCategory, handleEditCategory]);

  return (
    <Container
      maxWidth={settings.themeStretch ? false : 'lg'}
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CustomBreadcrumbs
        heading="List"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'Category',
            href: paths.dashboard.catalog.category.root,
          },
          { name: 'List' },
        ]}
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => {
              quickNewCategory.onTrue();
            }}
          >
            New Category
          </Button>
        }
        sx={{
          mb: {
            xs: 3,
            md: 5,
          },
        }}
      />
      <Card
        sx={{
          height: { xs: 800, md: 2 },
          flexGrow: { md: 1 },
          display: { md: 'flex' },
          flexDirection: { md: 'column' },
        }}
      >
        <DataGrid columns={columns} rows={rows} direction="ltr" />
        <CategoryQuickNewEditForm open={quickNewCategory.value}
                                  onClose={quickNewCategory.onFalse}
                                  onAdd={handleAddCategory} />

      </Card>

    </Container>
  );
}
