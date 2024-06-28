import { useState, useEffect, useCallback, ChangeEvent } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';

import { Brand } from 'src/type/brand';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { emptyRows, TableNoData, TableEmptyRows, TablePaginationCustom } from 'src/components/table';

import Page from '../../../../type/page';
import BrandTableRow from '../brand-table-row';
import axios, { endpoints } from '../../../../utils/axios';
import { useBoolean } from '../../../../hooks/use-boolean';
import BrandQuickNewEditForm from '../brand-quick-new-edit-form';

export default function BrandListView() {

  const settings = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const quickNewBrand = useBoolean();

  const [tablePage, setTablePage] = useState<Page<Brand>>({
    content: [],
    page: {
      size: 5,
      number: 0,
      totalElements: 0,
      totalPages: 0,
    },
  });

  const fetchBrandListData = useCallback((pageNumber = 0, pageSize = 5) => axios.get(endpoints.brand, {
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
    fetchBrandListData();
  }, [fetchBrandListData]);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    fetchBrandListData(newPage, tablePage.page.size);
  }, [fetchBrandListData, tablePage.page.size]);

  const onChangeRowsPerPage = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const rowsPerPage = parseInt(event.target.value, 10);
    fetchBrandListData(0, rowsPerPage);
  }, [fetchBrandListData]);

  const handleAddBrand = useCallback((brand: Brand) => {
    axios.post(endpoints.brand, brand).then(() => fetchBrandListData(0, tablePage.page.size));
    enqueueSnackbar('Create success!');
  }, [enqueueSnackbar, fetchBrandListData, tablePage.page.size]);

  const handleEditBrand = useCallback(async (id: string, brand: Brand) => {
    axios.put(`${endpoints.brand}/${id}`, brand).then(({ data }) => {
      const editBrandIndex = tablePage.content.findIndex(item => item.id === id);
      const newTablePage = { ...tablePage };
      newTablePage.content[editBrandIndex] = data;
      setTablePage(newTablePage);
    });
    enqueueSnackbar('Update success!');
  }, [enqueueSnackbar, tablePage]);

  const handleDeleteBrand = useCallback(async (id: string) => {
    await axios.delete(`${endpoints.brand}/${id}`);
    const content = tablePage.content.filter(item => item.id !== id);
    const newTablePage = { ...tablePage, content };
    setTablePage(newTablePage);
    enqueueSnackbar('Delete success!');
  }, [enqueueSnackbar, tablePage]);

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
            name: 'Brand',
            href: paths.dashboard.catalog.brand.root,
          },
          { name: 'List' },
        ]}
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon="mdi:add" />}
            onClick={quickNewBrand.onTrue}
          >
            New Brand
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
        <TableContainer>
          <Scrollbar>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size="medium"
            >
              <TableHead>
                <TableRow>
                  <TableCell>Brand</TableCell>
                  <TableCell>Visible</TableCell>
                  <TableCell align="right" />
                </TableRow>
              </TableHead>
              <TableBody>
                {tablePage.content.map(
                  (row) =>
                    (<BrandTableRow row={row} key={row.id}
                                    onEditRow={handleEditBrand}
                                    onDeleteRow={handleDeleteBrand} />),
                )}
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
        <BrandQuickNewEditForm open={quickNewBrand.value} onClose={quickNewBrand.onFalse} onAdd={handleAddBrand} />
      </Card>
    </Container>
  );
}
