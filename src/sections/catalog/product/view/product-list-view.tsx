import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import Page from '../../../../type/page';
import { paths } from '../../../../routes/paths';
import { Product } from '../../../../type/product';
import axios, { endpoints } from '../../../../utils/axios';
import { useSettingsContext } from '../../../../components/settings';

export default function ProductListView() {
  // const { enqueueSnackbar } = useSnackbar();

  const confirmRows = useBoolean();

  // const router = useRouter();

  const settings = useSettingsContext();

  const [tablePage, setTablePage] = useState<Page<Product>>({
    content: [],
    page: {
      size: 5,
      number: 0,
      totalElements: 0,
      totalPages: 0,
    },
  });

  const fetchProductListData = useCallback((pageNumber = 0, pageSize = 5) => axios.get(endpoints.product, {
    params: {
      pageNumber,
      pageSize,
    },
  }).then(({ data: { content, page: { size, number, totalElements, totalPages } } }) => setTablePage({
    content,
    page: {
      size: Number(size),
      number: Number(number),
      totalElements: Number(totalElements),
      totalPages: Number(totalPages),
    },
  })).catch(error => console.error('Error fetching data:', error)), []);

  useEffect(() => {
    fetchProductListData();
  }, [fetchProductListData]);
  return (<>
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
            name: 'Product',
            href: paths.dashboard.catalog.product.root,
          },
          { name: 'List' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.catalog.product.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Product
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
        {JSON.stringify(tablePage)}
      </Card>
    </Container>
    <ConfirmDialog
      open={confirmRows.value}
      onClose={confirmRows.onFalse}
      title="Delete"
      content={
        <>
          Are you sure want to delete <strong> selectedRowIds.length </strong> items?
        </>
      }
      action={
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            // handleDeleteRows();
            confirmRows.onFalse();
          }}
        >
          Delete
        </Button>
      }
    />
  </>);
}
