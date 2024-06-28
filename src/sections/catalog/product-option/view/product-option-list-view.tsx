import { useState, useEffect, useCallback, ChangeEvent } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

import { useRouter } from 'src/routes/hooks';

import { ProductOption } from 'src/type/product-option';

import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { emptyRows, TableNoData, TableEmptyRows, TablePaginationCustom } from 'src/components/table';

import Page from '../../../../type/page';
import { paths } from '../../../../routes/paths';
import Iconify from '../../../../components/iconify';
import axios, { endpoints } from '../../../../utils/axios';
import { RouterLink } from '../../../../routes/components';
import ProductOptionTableRow from '../product-option-table-row';
import { useSettingsContext } from '../../../../components/settings';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';

export default function ProductOptionListView() {
  const settings = useSettingsContext();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [tablePage, setTablePage] = useState<Page<ProductOption>>({
    content: [],
    page: {
      size: 5,
      number: 0,
      totalElements: 0,
      totalPages: 0,
    },
  });

  const fetchProductOptionListData = useCallback((pageNumber = 0, pageSize = 10) => axios.get(endpoints.productOption, {
    params: {
      pageNumber,
      pageSize,
    },
  })
    .then(({ data: { content, page: { size, number, totalElements, totalPages } } }) => setTablePage({
      content,
      page: {
        size: Number(size),
        number: Number(number),
        totalElements: Number(totalElements),
        totalPages: Number(totalPages),
      },
    }))
    .catch(error => console.error('Error fetching data:', error)), []);

  useEffect(() => {
    fetchProductOptionListData();
  }, [fetchProductOptionListData]);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    fetchProductOptionListData(newPage, tablePage.page.size);
  }, [fetchProductOptionListData, tablePage.page.size]);

  const onChangeRowsPerPage = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const rowsPerPage = parseInt(event.target.value, 10);
    fetchProductOptionListData(0, rowsPerPage);
  }, [fetchProductOptionListData]);
  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.catalog.productOption.edit(id));
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
            name: 'Product Option',
            href: paths.dashboard.catalog.productOption.root,
          },
          { name: 'List' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.catalog.productOption.new}
            variant="contained"
            startIcon={<Iconify icon="mdi:add" />}
          >
            New Product Option
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
                <TableCell>Type</TableCell>
                <TableCell>AttributeName</TableCell>
                <TableCell>label</TableCell>
                <TableCell>Required</TableCell>
                <TableCell>Use In Sku Generation</TableCell>
                <TableCell>Display Order</TableCell>
                <TableCell>Action</TableCell>
              </TableHead>

              <TableBody>
                {tablePage.content.map((row) => (
                  <ProductOptionTableRow
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

    </Container>
  );
}
