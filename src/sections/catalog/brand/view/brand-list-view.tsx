import { useState, useEffect } from 'react';

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
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useTable, emptyRows, TableNoData, TableEmptyRows, TablePaginationCustom } from 'src/components/table';

import BrandTableRow from '../brand-table-row';
import axios, { endpoints } from '../../../../utils/axios';
import { useBoolean } from '../../../../hooks/use-boolean';
import BrandQuickNewEditForm from '../brand-quick-new-edit-form';

export default function BrandListView() {

  const settings = useSettingsContext();

  const quickNewBrand = useBoolean();

  const table = useTable({ defaultRowsPerPage: 10 });

  const [brandListData, setBrandListData] = useState<Brand[]>([]);

  const fetchBrandListData = (pageNumber = 0, pageSize = 10) => axios.get(`${endpoints.brand}`, {
    params: {
      pageNumber,
      pageSize,
    },
  })
    .then(({ data }) => setBrandListData(data.content))
    .catch(error => console.error('Error fetching data:', error));

  useEffect(() => {
    fetchBrandListData();
  }, []);


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
                {brandListData.map(
                  (row) =>
                    (<BrandTableRow row={row} key={row.id}
                                    onSave={fetchBrandListData}
                                    onDelete={fetchBrandListData} />),
                )}
                <TableEmptyRows
                  height={table.dense ? 56 : 56 + 20}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, brandListData.length)}
                />
                <TableNoData notFound={!brandListData.length} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
        <TablePaginationCustom
          count={brandListData.length}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          // dense={table.dense}
          // onChangeDense={table.onChangeDense}
        />
        <BrandQuickNewEditForm open={quickNewBrand.value} onClose={quickNewBrand.onFalse} onSave={fetchBrandListData} />

      </Card>
    </Container>
  );
}
