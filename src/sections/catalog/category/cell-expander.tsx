import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

import Iconify from 'src/components/iconify';

const CellWrapper = styled('div')`
  /* needed on chrome */
  float: left;

  display: table;
  height: 100%; /* 使用 'height' 而不是 'block-size'，因为 'block-size' 不是所有浏览器都支持 */
`;

interface CellExpanderProps {
  expanded: boolean;
  onCellExpand: () => void;
}

function CellExpander({ expanded, onCellExpand }: CellExpanderProps) {

  return (
    <CellWrapper>
      <IconButton onClick={onCellExpand} aria-label={expanded ? 'Collapse' : 'Expand'}>
        {expanded ? <Iconify icon="mdi:minus-box" /> : <Iconify icon="mdi:add-box" />}
      </IconButton>
    </CellWrapper>
  );
}


function CellNoExpander() {
  return (
    <CellWrapper>
      <IconButton>
        <Iconify icon="mdi:close-box-outline" />
      </IconButton>
    </CellWrapper>
  );
}

export { CellExpander, CellNoExpander };
