import DataGrid, { Column } from 'react-data-grid';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useSnackbar } from 'src/components/snackbar';

import CellAction from '../cell-action';
import { paths } from '../../../../routes/paths';
import Iconify from '../../../../components/iconify';
import { Category } from '../../../../type/category';
import axios, { endpoints } from '../../../../utils/axios';
import { useBoolean } from '../../../../hooks/use-boolean';
import { CellExpander, CellNoExpander } from '../cell-expander';
import { useSettingsContext } from '../../../../components/settings';
import CategoryQuickNewEditForm from '../category-quick-new-edit-form';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';

// const DELIMITER = '/' as const;

// type Action = | { type: 'setCategoryListData', categoryData: Category[] }
//   | { type: 'toggleSubRow' | 'deleteRow', id: string }

const fetchCategoryListData = async (parentCategory?: Category) => {
  const url = parentCategory ? `${endpoints.category}/${parentCategory?.id}/subcategories` : `${endpoints.category}/subcategories`;
  return axios.get<Category []>(url).then(({ data }) => data.map((item) => ({
    ...item,
    isExpanded: false,
    childrenFetched: false,
    parentCategory: parentCategory ? { ...parentCategory, subCategories: undefined } : undefined,
  })));
};

export default function CategoryListView() {

  const settings = useSettingsContext();
  
  const { enqueueSnackbar } = useSnackbar();

  const quickNewCategory = useBoolean();

  const [tableTreeData, setTableTreeData] = useState<Category[]>([]);

  const hasChildren = (category: Category) => category.descendantCount > 0;

  const loadChildren = useCallback((row: Category) => {
    const { id, depth, childrenFetched } = row;
    // 已经加载过了，或者是第三级分类无需处理,因为默认最多三级分类
    if (!hasChildren(row) || childrenFetched || depth === 2) {
      return;
    }
    fetchCategoryListData(row).then(subCategories => {
      const newTableTreeData = [...tableTreeData];
      const rowIndex = newTableTreeData.findIndex((node) => node.id === id);
      newTableTreeData[rowIndex] = { ...row, isExpanded: true, childrenFetched: true, subCategories };
      newTableTreeData.splice(rowIndex + 1, 0, ...subCategories);
      setTableTreeData(newTableTreeData);
    });
  }, [tableTreeData]);

  useEffect(() => {
    fetchCategoryListData().then(categories => {
      setTableTreeData(categories);
    });
  }, []);

  const handleAddCategory = useCallback((newCategory: Category) => {
    axios.post(endpoints.category, newCategory).then(() => {
      fetchCategoryListData().then(categories => setTableTreeData(categories));
      enqueueSnackbar('Create success!');
    });
  }, [enqueueSnackbar]);

  const handleEditCategory = useCallback((id: string, newCategory: Category) => {
    axios.put(`${endpoints.category}/${id}`, newCategory).then(() => {
      fetchCategoryListData().then(categories => setTableTreeData(categories));
      enqueueSnackbar('Update success!');
    });
  }, [enqueueSnackbar]);

  const handleDeleteCategory = useCallback((id: string) => {
    axios.delete(`${endpoints.category}/${id}`).then(() => {
      fetchCategoryListData().then(categories => setTableTreeData(categories));
      enqueueSnackbar('Delete success!');
    });
  }, [enqueueSnackbar]);
  // const setDefaultExpandNode = ()=>{};
  const handleToggle = useCallback((id: string) => {
    const rowIndex = tableTreeData.findIndex((r) => r.id === id)!;
    const row = tableTreeData[rowIndex];
    const { subCategories, childrenFetched, isExpanded, fullPath: parentFullPath } = row;
    if (childrenFetched) {
      const newTableTreeData = [...tableTreeData];
      newTableTreeData[rowIndex] = { ...row, isExpanded: !isExpanded };
      const childrenNodeLength = newTableTreeData.filter((currentNode) => currentNode.fullPath.includes(parentFullPath) && isExpanded).length - 1;
      if (isExpanded) {
        newTableTreeData.splice(rowIndex + 1, childrenNodeLength);
      } else {
        newTableTreeData.splice(rowIndex + 1, 0, ...subCategories!);
      }
      setTableTreeData(newTableTreeData);
    } else {
      loadChildren(row);
    }
  }, [loadChildren, tableTreeData]);

  const columns = useMemo((): readonly Column<Category>[] => [
    {
      key: 'name',
      name: 'Name',
      frozen: true,
      renderCell({ row }) {
        const hasSubCategories = row.descendantCount > 0;
        return (
          <div style={{
            display: 'flex',
            justifyContent: 'left',
            alignItems: 'center',
            height: '100%',
            marginInlineStart: `${(row.depth) * 26}px`,
          }}>
            {hasSubCategories ? (
              <CellExpander
                expanded={row.isExpanded === true}
                onCellExpand={async () => {
                  handleToggle(row.id!);
                }}
              />
            ) : <CellNoExpander />}
            <div>
              <Typography variant="body2">
                {row.name}
              </Typography>
            </div>
          </div>
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
                                            onAdd={handleAddCategory}
                                            onEdit={handleEditCategory}
                                            onDelete={handleDeleteCategory}
      />),
    },
  ], [handleAddCategory, handleDeleteCategory, handleEditCategory, handleToggle]);

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
            startIcon={<Iconify icon="mdi:add" />}
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
        <DataGrid columns={columns} rows={tableTreeData} direction="ltr" />
        <CategoryQuickNewEditForm open={quickNewCategory.value}
                                  onClose={quickNewCategory.onFalse}
                                  onAdd={handleAddCategory}
        />

      </Card>

    </Container>
  );
}
