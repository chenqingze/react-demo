/* const processRowUpdate = async (newRow: GridRowModel, originalRow: GridRowModel) => {
  let responseRow;
  if (newRow.id.includes('new')) {
    const { data } = await axios.post(endpoints.category, { ...newRow, id: undefined });
    responseRow = data;
    apiRef.current.updateRows([{ id: newRow.id, _action: 'delete' }]);
  } else {
    const { data } = await axios.put(`${endpoints.category}/${newRow.id}`, newRow);
    responseRow = data;
  }
  apiRef.current.updateRows([{ ...responseRow, hierarchy: getHierarchy(responseRow.fullPath) }]);
  return responseRow;
};
const handleAddCategory = (apiRef: React.MutableRefObject<GridApi>, rowSelectionModel: GridRowSelectionModel) => {
  console.log(rowSelectionModel);
  let selectedRow;
  if (rowSelectionModel && rowSelectionModel.length > 0) {
    selectedRow = apiRef.current.getSelectedRows().get(rowSelectionModel.at(0)!);
    console.log(selectedRow);
  }
  const tempId = `new-${new Date().getTime().toString()}`;
  apiRef.current.updateRows([{
    id: `${tempId}`,
    name: '',
    visible: true,
    imageUrl: '',
    hierarchy: selectedRow ? [...selectedRow.hierarchy, tempId] : [tempId],
  }]);
};
*/
