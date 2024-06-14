import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { styled, unstable_composeClasses as composeClasses } from '@mui/material';
import {
  GridGroupNode,
  useGridRootProps,
  DataGridProProps,
  useGridApiContext,
  GridRenderCellParams,
  getDataGridUtilityClass,
} from '@mui/x-data-grid-pro';

export interface GroupingCellWithLazyLoadingProps
  extends GridRenderCellParams<any, any, any, GridGroupNode> {
  hideDescendantCount?: boolean;
}

export default function GroupingCellWithLazyLoading(props: GroupingCellWithLazyLoadingProps) {

  const { id, rowNode, row, hideDescendantCount, formattedValue } = props;

  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();
  const classes = useUtilityClasses({ classes: rootProps.classes });

  const isLoading = rowNode.childrenExpanded ? !row.childrenFetched : false;

  const Icon = rowNode.childrenExpanded
    ? rootProps.slots.treeDataCollapseIcon
    : rootProps.slots.treeDataExpandIcon;

  const handleClick: IconButtonProps['onClick'] = () => {
    apiRef.current.setRowChildrenExpansion(id, !rowNode.childrenExpanded);
  };

  return (
    <Box className={classes.root} sx={{ ml: rowNode.depth * 2 }}>
      <div className={classes.toggle}>
        {row.descendantCount > 0 &&
          (isLoading ? (
            <LoadingContainer>
              <CircularProgress size="1rem" color="inherit" />
            </LoadingContainer>
          ) : (
            <IconButton
              size="small"
              onClick={handleClick}
              tabIndex={-1}
              aria-label={
                rowNode.childrenExpanded
                  ? apiRef.current.getLocaleText('treeDataCollapse')
                  : apiRef.current.getLocaleText('treeDataExpand')
              }
            >
              <Icon fontSize="inherit" />
            </IconButton>
          ))}
      </div>
      <span>
        {formattedValue === undefined ? rowNode.groupingKey : formattedValue}
        {!hideDescendantCount && row.descendantCount > 0
          ? ` (${row.descendantCount})`
          : ''}
      </span>
    </Box>
  );
}

const useUtilityClasses = (ownerState: { classes: DataGridProProps['classes'] }) => {

  const { classes } = ownerState;

  const slots = {
    root: ['treeDataGroupingCell'],
    toggle: ['treeDataGroupingCellToggle'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const LoadingContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
});

