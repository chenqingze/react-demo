import React, { useRef, useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import {
  GridApi,
  GridColDef,
  DataGridPro,
  GridRowsProp,
  useGridApiRef,
  GridRowIdGetter,
  DataGridProProps,
  GridEventListener,
  GridRowModelUpdate,
  GridActionsCellItem,
  GridRenderCellParams,
  GridToolbarContainer,
  GridGroupingColDefOverride,
} from '@mui/x-data-grid-pro';

import { GroupingCellWithLazyLoading } from 'src/components/data-grid';
import { GroupingCellWithLazyLoadingProps } from 'src/components/data-grid/grouping-cell-with-lazy-loading';

import { paths } from '../../../../routes/paths';
import Iconify from '../../../../components/iconify';
import { Category } from '../../../../type/category';
import axios, { endpoints } from '../../../../utils/axios';
import { useBoolean } from '../../../../hooks/use-boolean';
import { useSettingsContext } from '../../../../components/settings';
import CategoryQuickNewEditForm from '../category-quick-new-edit-form';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';


type CategoryRow = Category & { hierarchy: string [], childrenFetched?: boolean, };

const DELIMITER = '/' as const;
const getHierarchy = (fullPath: string) => fullPath.split(DELIMITER) ?? fullPath;

const getRowId: GridRowIdGetter = (row) => {
  if (typeof row?.id === 'string' && row?.id.startsWith('placeholder-children-')) {
    return row.id;
  }
  return row.id;
};

const updateRows = (apiRef: React.MutableRefObject<GridApi>, rows: GridRowModelUpdate[]) => {

  if (!apiRef.current) {
    return;
  }
  const rowsToAdd = [...rows];
  rows.forEach((row) => {
    if (row.descendantCount && row.descendantCount > 0) {
      // Add a placeholder row to make the row expandable
      rowsToAdd.push({
        id: `placeholder-children-${getRowId(row)}`,
        hierarchy: [...row.hierarchy, ''],
      });
    }
  });
  apiRef.current.updateRows(rowsToAdd);
};

const CUSTOM_GROUPING_COL_DEF: GridGroupingColDefOverride = {
  renderCell: (params) => (
    <GroupingCellWithLazyLoading {...(params as GroupingCellWithLazyLoadingProps)} />
  ),
};

export default function CategoryListView() {

  const settings = useSettingsContext();

  const quickNewCategory = useBoolean();
  const quickEditCategory = useBoolean();
  const [currentCategory, setCurrentCategory] = useState<Category>();

  const apiRef = useGridApiRef();

  const initialCategoryRows: GridRowsProp = [];
  const initialCategoryRowsRef = useRef(initialCategoryRows);

  const getTreeDataPath: DataGridProProps['getTreeDataPath'] = (row) => row.hierarchy;
  const getTreeDataPathRef = useRef(getTreeDataPath);


  const columns: GridColDef[] = [
    {
      field: 'imageUrl', headerName: 'Image', editable: true, minWidth: 200,
      renderCell: (params: GridRenderCellParams<any, string>) => (
        <Avatar alt={params.value} src={params.value || '/favicon/apple-touch-icon.png'} />),
    },
    { field: 'name', headerName: 'Category Name', editable: true, minWidth: 150 },
    {
      field: 'visible',
      headerName: 'Visibility',
      editable: true,
      type: 'boolean',
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      flex: 1,
      cellClassName: 'actions',
      getActions: ({ id, row }) => [
        <GridActionsCellItem
          icon={<Iconify icon="solar:pen-bold" />}
          label="Edit"
          className="textPrimary"
          onClick={() => {
            setCurrentCategory({ ...row });
            quickEditCategory.onTrue();
          }}
          color="inherit"
        />,
        <GridActionsCellItem
          icon={<Iconify icon="solar:trash-bin-trash-bold" />}
          label="Delete"
          onClick={async () => {
            await axios.delete(`${endpoints.category}/${id}`);
            apiRef.current.updateRows([{ id, _action: 'delete' }]);
          }}
          color="inherit"
        />,
      ],
    },
  ];

  const fetchCategoryListData = async (parentCategoryId?: string) => {
    const url = parentCategoryId ? `${endpoints.category}/${parentCategoryId}/subcategories` : `${endpoints.category}/subcategories`;
    return axios.get<Category []>(url).then(({ data }) => data.map(category => ({
      ...category,
      hierarchy: getHierarchy(category.fullPath),
    })));
  };

  useEffect(() => {
    fetchCategoryListData().then(categoryRows => {
      updateRows(apiRef, categoryRows);
    });

    const handleRowExpansionChange: GridEventListener<'rowExpansionChange'> = async (node) => {
      const row = apiRef.current.getRow(node.id) as CategoryRow | null;

      if (!node.childrenExpanded || !row || row.childrenFetched) {
        return;
      }

      const subcategories = await fetchCategoryListData(row.id);
      updateRows(apiRef, [
        ...subcategories,
        { ...row, childrenFetched: true },
        { id: `placeholder-children-${node.id}`, _action: 'delete' },
      ]);
    };

    return apiRef.current.subscribeEvent('rowExpansionChange', handleRowExpansionChange);
  }, [apiRef]);

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
        <DataGridPro
          treeData
          apiRef={apiRef}
          rows={initialCategoryRowsRef.current}
          columns={columns}
          getTreeDataPath={getTreeDataPathRef.current}
          groupingColDef={CUSTOM_GROUPING_COL_DEF}
          getRowId={getRowId}
          slots={{
            toolbar: () => (
              <GridToolbarContainer>
                <Button color="primary" startIcon={<Iconify icon="material-symbols:add" />}
                        onClick={quickNewCategory.onTrue}>
                  Add Category
                </Button>
              </GridToolbarContainer>),
          }}
          disableRowSelectionOnClick
          disableMultipleRowSelection
          disableChildrenFiltering
        />
        <CategoryQuickNewEditForm open={quickNewCategory.value}
                                  onClose={quickNewCategory.onFalse}
                                  onSave={fetchCategoryListData} />
        <CategoryQuickNewEditForm open={quickEditCategory.value}
                                  onClose={quickEditCategory.onFalse}
                                  currentCategory={currentCategory}
                                  onSave={fetchCategoryListData} />
      </Card>

    </Container>
  );
}
