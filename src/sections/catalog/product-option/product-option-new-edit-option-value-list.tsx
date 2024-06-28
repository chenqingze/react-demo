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

import { useBoolean } from '../../../hooks/use-boolean';
import { TableNoData } from '../../../components/table';
import Scrollbar from '../../../components/scrollbar/scrollbar';
import { ProductOptionValueTableRow } from './product-option-value-table-row';
import ProductOptionValueQuickNewEditForm from './product-option-value-quick-new-edit-form';

export function ProductOptionNewEditOptionValueList() {

  const quickNewProductOptionValue = useBoolean();

  const { control } = useFormContext<ProductOption>();
  const { fields: rows, remove, update, append } = useFieldArray<ProductOption, 'allowedValues'>({
    control,
    name: 'allowedValues',
  });

  const getIndexByRowId = useCallback((id: string | number) => rows ? rows.findIndex((r) => r.id === id) : -1, [rows]);

  const handleEditProductOptionValue = useCallback((id: string, data: ProductOptionValue) => {
    const index = getIndexByRowId(id);
    update(index, data);
  }, [getIndexByRowId, update]);

  const handleAddProductOptionValue = useCallback((data: ProductOptionValue) => {
    append(data);
  }, [append]);

  const handleDeleteProductOptionValue = useCallback((id: string) => {
    const index = getIndexByRowId(id);
    remove(index);
    console.info('DELETE', id);
  }, [getIndexByRowId, remove]);

  return (<>
    <CardHeader title="Option Values"
                sx={{ mb: 3 }}
                action={
                  <Button
                    variant="outlined"
                    size="small"
                    color="primary"
                    startIcon={<Iconify icon="mdi:add" />}
                    onClick={quickNewProductOptionValue.onTrue}
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
              (row) =>
                (<ProductOptionValueTableRow row={row} key={row.id}
                                             onEditRow={handleEditProductOptionValue}
                                             onDeleteRow={handleDeleteProductOptionValue} />),
            )}
            <TableNoData notFound={!rows.length} />
          </TableBody>
        </Table>
      </Scrollbar>
    </TableContainer>}
    <ProductOptionValueQuickNewEditForm open={quickNewProductOptionValue.value}
                                        onClose={quickNewProductOptionValue.onFalse}
                                        onAdd={handleAddProductOptionValue} />
  </>);
}
