import { useCallback } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import CardHeader from '@mui/material/CardHeader';
import TableContainer from '@mui/material/TableContainer';

import { ProductOption, ProductOptionValue } from 'src/type/product-option';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';

import { TableNoData } from '../../../components/table';
import axios, { endpoints } from '../../../utils/axios';
import Scrollbar from '../../../components/scrollbar/scrollbar';
import { ProductOptionValueTableRow } from './product-option-value-table-row';

export function ProductOptionNewEditOptionValueList() {

  const { control } = useFormContext<ProductOption>();
  const { fields: rows, remove, update, append } = useFieldArray<ProductOption, 'allowedValues', 'optionValueId'>({
    control,
    name: 'allowedValues',
    keyName: 'optionValueId',
  });

  // const getIndexByRowId = useCallback((id: string | number) => rows ? rows.findIndex((r) => r.id === id) : -1, [rows]);

  const { enqueueSnackbar } = useSnackbar();

  const handleEditProductOptionValue = useCallback((index: number, data: ProductOptionValue) => {
    update(index, data);
  }, [update]);

  const handleAddProductOptionValue = useCallback(() => {
    append({ attributeValue: '', displayOrder: 0, priceAdjustment: '' });
  }, [append]);

  const handleDeleteProductOptionValue = useCallback(async (index: number, id: string) => {
    await axios.delete(`${endpoints.productOption}/${index}`);
    remove(index);
    console.info('DELETE');
    enqueueSnackbar('Delete successfully.');
  }, [enqueueSnackbar, remove]);

  return (<>
    <CardHeader title="Option Values"
                sx={{ mb: 3 }}
                action={
                  <Button
                    variant="outlined"
                    size="small"
                    color="primary"
                    startIcon={<Iconify icon="mdi:add" />}
                    onClick={handleAddProductOptionValue}
                  >
                    New Option Value
                  </Button>}
    />
    {!!rows.length && <TableContainer>
      <Scrollbar>
        <Table
          sx={{ minWidth: 750 }}
          aria-labelledby="tableTitle"
          size="medium"
        >
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Attribute Value</TableCell>
              <TableCell>Price Adjustment</TableCell>
              <TableCell>Display Order</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(
              (row, index) =>
                (<ProductOptionValueTableRow key={row.id} row={row} index={index}
                                             onEditRow={handleEditProductOptionValue}
                                             onDeleteRow={handleDeleteProductOptionValue} />),
            )}
            <TableNoData notFound={!rows.length} />
          </TableBody>
        </Table>
      </Scrollbar>
    </TableContainer>}
  </>);
}
