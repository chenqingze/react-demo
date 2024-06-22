import { useState, useEffect } from 'react';

import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import { ListItemSecondaryAction } from '@mui/material';

import { useSnackbar } from 'src/components/snackbar';

import Iconify from '../../../components/iconify';
import { Category } from '../../../type/category';
import axios, { endpoints } from '../../../utils/axios';

const fetchCategoryListData = async (parentCategoryId?: string) => {
  const url = parentCategoryId ? `${endpoints.category}/${parentCategoryId}/subcategories` : `${endpoints.category}/subcategories`;
  return axios.get<Category []>(url).then(({ data }) => data.map((item) => ({
    ...item,
    childrenFetched: false,
    isExpanded: false,
  })));
};

type TreeSelectProps = {
  data?: Category[];
  value?: string;
  onSelect?: (category: Category) => void;
}

export function CategoryTreeSelect({ data, value = '', onSelect }: TreeSelectProps) {
  const { enqueueSnackbar } = useSnackbar();

  const [treeData, setTreeData] = useState<Category []>(data || []);
  const [selectedValue, setSelectedValue] = useState(value);

  useEffect(() => {
    fetchCategoryListData().then(rootCategories => setTreeData(rootCategories));
  }, []);

  // const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const hasChildren = (category: Category) => category.descendantCount > 0;
  const loadChildren = (category: Category) => {
    const { id, depth, childrenFetched } = category;
    // 已经加载过了，或者是第三级分类无需处理,因为默认最多三级分类
    if (!hasChildren(category) || childrenFetched || depth === 2) {
      return;
    }
    // 查询treeData中的节点并增加subcategories
    const currentNodeRefInTreeNodeIndex = treeData.findIndex(node => node.id === id) as number;
    const currentNodeRefInTreeNode = treeData[currentNodeRefInTreeNodeIndex];
    fetchCategoryListData(id).then(childrenData => {
      // currentNodeRefInTreeNode!.subCategories = childrenData;
      currentNodeRefInTreeNode!.childrenFetched = true;
      currentNodeRefInTreeNode!.isExpanded = true;
      treeData.splice(currentNodeRefInTreeNodeIndex + 1, 0, ...childrenData);
      setTreeData([...treeData]);
    });
  };

  const isParentsExpanded = (id: string): boolean => {
    const node = treeData.find((item) => item.id === id)!;
    if (node?.depth === 0) {
      return true;
    }
    const parentNode = treeData.find((item) => item.id === node!.parentId)!;
    return !!parentNode?.isExpanded && isParentsExpanded(parentNode.id!);
  };

  const handleToggle = (node: Category) => {
    if (hasChildren(node)) {
      if (node.childrenFetched) {
        const currentNodeRefInTreeNode = treeData.find(category => category.id === node.id)!;
        currentNodeRefInTreeNode.isExpanded = !currentNodeRefInTreeNode.isExpanded;
        setTreeData([...treeData]);
      } else {
        loadChildren(node);
      }
    }
  };

  const renderMenuItem = (node: Category) => {
    const { id, name, isExpanded, depth = 0 } = node;
    return (
      <MenuItem
        key={id}
        value={name}
        style={isParentsExpanded(id!) ?
          { paddingLeft: `${depth * 20}px` } :
          { paddingLeft: `${depth * 20}px`, display: 'none' }}
      >
        <ListItemText primary={name} onClick={(event) => {
          if (depth < 2 && onSelect) {
            onSelect(node);
          } else {
            event.stopPropagation();
            event.preventDefault();
            enqueueSnackbar('最多三级分类，不可以选择第三级分类作为子分类!');
          }
        }} />
        {hasChildren(node) && (
          <ListItemSecondaryAction>
            <IconButton
              edge="end"
              aria-label="expand/collapse"
              onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
                handleToggle(node);
              }}>
              {isExpanded ? <Iconify icon="mdi:minus-box" /> : <Iconify icon="mdi:add-box" />}
            </IconButton>
          </ListItemSecondaryAction>
        )}
      </MenuItem>
    );
  };

  return (
    <TextField
      select
      label="Parent Category"
      value={selectedValue}
      SelectProps={{
        onChange: (event) => {
          setSelectedValue(event.target.value as string);
        },
        onClose: (event) => console.log(event),
      }}
    >
      <MenuItem value="">
        <em>None</em>
      </MenuItem>
      {treeData.map(renderMenuItem)}
    </TextField>
  );
}
