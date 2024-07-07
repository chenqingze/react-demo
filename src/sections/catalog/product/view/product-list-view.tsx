import { useState, useEffect, useCallback, ChangeEvent } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

import { RouterLink } from 'src/routes/components';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import Page from '../../../../type/page';
import { paths } from '../../../../routes/paths';
import { Product } from '../../../../type/product';
import { useRouter } from '../../../../routes/hooks';
import { ProductTableRow } from '../product-table-row';
import axios, { endpoints } from '../../../../utils/axios';
import Scrollbar from '../../../../components/scrollbar/scrollbar';
import { useSettingsContext } from '../../../../components/settings';
import { emptyRows, TableNoData, TableEmptyRows, TablePaginationCustom } from '../../../../components/table';

export default function ProductListView() {

  const { enqueueSnackbar } = useSnackbar();

  const router = useRouter();

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

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    fetchProductListData(newPage, tablePage.page.size);
  }, [fetchProductListData, tablePage.page.size]);

  const onChangeRowsPerPage = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const rowsPerPage = parseInt(event.target.value, 10);
    fetchProductListData(0, rowsPerPage);
  }, [fetchProductListData]);

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.catalog.product.edit(id));
    },
    [router],
  );

  const handleDeleteRow = useCallback(async (id: string) => {
    await axios.delete(`${endpoints.productOption}/${id}`);
    const content = tablePage.content.filter(item => item.id !== id);
    const newTablePage = { ...tablePage, content };
    setTablePage(newTablePage);
    enqueueSnackbar('Delete success!');
  }, [enqueueSnackbar, tablePage]);

  return (<Container
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
      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <Scrollbar>
          <Table sx={{ minWidth: 750 }}>
            <TableHead>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Manufacturer</TableCell>
              <TableCell>Retail Price (MSRP)</TableCell>
              <TableCell>Sale Price</TableCell>
              <TableCell>Action</TableCell>
            </TableHead>

            <TableBody>
              {tablePage.content.map((row) => (
                <ProductTableRow
                  key={row.id}
                  row={row}
                  onEditRow={handleEditRow}
                  onDeleteRow={handleDeleteRow}
                />
              ))}

              <TableEmptyRows
                emptyRows={emptyRows(tablePage.page.number, tablePage.page.size, tablePage.page.totalElements)}
              />
              <TableNoData notFound={!tablePage.page.totalElements} />
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
      <TablePaginationCustom
        count={tablePage.page.totalElements}
        page={tablePage.page.number}
        rowsPerPage={tablePage.page.size}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
        dense={false}
      />
    </Card>
  </Container>);
}
