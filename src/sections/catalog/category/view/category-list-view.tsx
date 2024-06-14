import { useEffect } from 'react';

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import {
  GridApi,
  GridColDef,
  DataGridPro,
  useGridApiRef,
  GridRowIdGetter,
  DataGridProProps,
  GridEventListener,
  GridRowModelUpdate,
  GridGroupingColDefOverride,
} from '@mui/x-data-grid-pro';

import { GroupingCellWithLazyLoading } from 'src/components/data-grid';
import { GroupingCellWithLazyLoadingProps } from 'src/components/data-grid/grouping-cell-with-lazy-loading';

import { paths } from '../../../../routes/paths';
import Iconify from '../../../../components/iconify';
import { Category } from '../../../../type/category';
import axios, { endpoints } from '../../../../utils/axios';
import { useSettingsContext } from '../../../../components/settings';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';

type CategoryRow = Category & { childrenFetched?: boolean };

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Category Name', width: 300 },
  { field: 'imageUrl', headerName: 'Image', width: 300 },
  { field: 'visible', headerName: 'Visibility', width: 400 },
];

const getHierarchyArrayBySlash = (fullPath: string) => {
  const parts = fullPath.split('/');
  if (parts[0] === '') {
    parts.shift();
  }
  return parts;
};

const getTreeDataPath: DataGridProProps['getTreeDataPath'] = (row) => row.hierarchy;

const CUSTOM_GROUPING_COL_DEF: GridGroupingColDefOverride = {
  renderCell: (params) => (
    <GroupingCellWithLazyLoading {...(params as GroupingCellWithLazyLoadingProps)} />
  ),
};

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

export default function CategoryListView() {

  const settings = useSettingsContext();

  // const [categoryListData, setCategoryListData] = useState<Category []>([]);

  const fetchCategoryListData = async (parentCategoryId?: string) => {
    const url = parentCategoryId ? `${endpoints.category}/${parentCategoryId}/subcategories` : `${endpoints.category}/subcategories`;
    return axios.get<Category []>(url).then(({ data }) => data.map(category => ({
      ...category,
      hierarchy: getHierarchyArrayBySlash(category.fullPath),
    })));
  };

  const apiRef = useGridApiRef();

  useEffect(() => {
    fetchCategoryListData().then(categories => {
      updateRows(apiRef, categories);
    });

    const handleRowExpansionChange: GridEventListener<'rowExpansionChange'> = async (node) => {
      const row = apiRef.current.getRow(node.id) as CategoryRow | null;
      console.log('==================');
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
          rows={[]}
          columns={columns}
          getTreeDataPath={getTreeDataPath}
          groupingColDef={CUSTOM_GROUPING_COL_DEF}
          getRowId={getRowId}
          disableChildrenFiltering
        />
      </Card>

    </Container>
  );
}
