import TableCell from '@mui/material/TableCell';
import { TextFieldProps } from '@mui/material/TextField';
import { TableCellProps } from '@mui/material/TableCell/TableCell';

import { RHFTextField } from '../../../components/hook-form';

type EditTableCellProps = TableCellProps & TextFieldProps & {
  name: string,
  helperText?: string;
  isEditMode?: boolean,
  value?: string;
  tableCellProps?: TableCellProps,
  textFieldProps?: TextFieldProps,
};

export default function RHFEditableTableCell({
                                               isEditMode = true,
                                               name,
                                               value,
                                               tableCellProps,
                                               textFieldProps,
                                               ...other
                                             }: EditTableCellProps): JSX.Element {

  return (
    <TableCell {...tableCellProps}>
      {isEditMode
        ?
        (<RHFTextField name={name}  {...textFieldProps} {...other} />)
        : (value)}
    </TableCell>
  );
};
