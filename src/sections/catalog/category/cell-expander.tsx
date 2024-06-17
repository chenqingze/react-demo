import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

import Iconify from 'src/components/iconify';

const CellExpandWrapper = styled('div')`
  /* needed on chrome */
  float: left;

  display: table;
  height: 100%; /* 使用 'height' 而不是 'block-size'，因为 'block-size' 不是所有浏览器都支持 */

  > span {
    display: table-cell;
    vertical-align: middle;
    cursor: pointer;
  }
`;

interface CellExpanderProps {
  expanded: boolean;
  onCellExpand: () => void;
}

export default function CellExpander({ expanded, onCellExpand }: CellExpanderProps) {

  return (
    <CellExpandWrapper>
      <IconButton onClick={onCellExpand} aria-label={expanded ? 'Collapse' : 'Expand'}>
        {expanded ? <Iconify icon="mdi:minus-box" /> : <Iconify icon="mdi:add-box" />}
      </IconButton>
    </CellExpandWrapper>
  );
}
