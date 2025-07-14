import cell from "./src/cell";
import cellGroup from "./src/cellGroup";

cell.install = function(Vue) {
  Vue.component(cell.name, cell);
  Vue.component(cellGroup.name, cellGroup);
};
cell.Group = cellGroup;
export const Cell = cell;
export default cell;
