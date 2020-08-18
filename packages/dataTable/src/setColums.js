import Vue from "vue";
import utils from '../../utils'
import draggable from "vuedraggable";
import Sortable from 'sortablejs'
// function renderTableHeader(h,_vm){
//     const {tableColumns}=_vm;
//     tableColumns.map(item=>{
//         return h(
//             "div",
//             {
//                 class:"table-row"
//             },
//             [
//                 h(
//                     "div",
//                     {
//                         class:"table-cell"
//                     },
//                     item.title
//                 )
//             ]
//         )
//     })
    
// }

// function renderColumnsList(columns,h,_vm){
//     const { getOpt } = _vm;
//     const childrenField = getOpt.childrenField?getOpt.childrenField:"children"
//     const columnList = columns.map(item=>{
//         if(item[childrenField] && item[childrenField].length){
//            const childrenList = renderColumnsList(item[childrenField],h,_vm)
//            return h(
//                 "div",
//                 {
//                     class:"columns-item",
//                     key:item.id
//                 },
//                 [
//                     item.title,
//                     h(
//                         "draggable",
//                         {
//                             props:{
//                                 list:columns,
//                                 options:{
//                                     forceFallback: true
//                                 }
//                             }
//                         },
//                         [
//                             childrenList
//                         ]
                        
//                    )
//                 ]
//             )
        
//         }else{
//             return h(
//                 "div",
//                 {
//                     class:"columns-item",
//                     key:item.id
//                 },
//                 item.title
//             )
//         }
//     })
//     return columnList
// }

// function renderTableBtn(h){
//     return h(
//             "span",
//             {
//                 class:"drag-btn"
//             },
//             [
//                 "666"
//             ]
//     )
// }

// function renderShowEdit(scope,h){
//     return h(
//             "a-checkbox",
//             {
//                 props:{
//                     checked:scope.row.show,
//                 },
//                 on:{
//                     input: function (checked) {
//                         console.log(checked);
//                         scope.row.show=checked
//                     }
//                 }
//             },
//     )
// }

export default {
    name:"SetColumns",
    components: {
        draggable
    },
    props:{
        option:{
            type:Object,
            required: true,
        }
    },
    data() {
        return {
            columns:[],
        }
    },
    computed:{
        getOpt(){
            const {option}=this
            return option.proxyConfig && option.proxyConfig.get?option.proxyConfig.get:{}
        }
    },
    created() {
        const {getOpt}=this
        if(getOpt.api){
            this.fetchColumns()
        }
    },
    beforeDestroy () {
        if (this.sortable) {
          this.sortable.destroy()
        }
      },
    methods: {
        fetchColumns(){
            const {getOpt}=this;
            const json = {
                ...getOpt.param
            }
            getOpt.api(json).then(res=>{
                const dataField = getOpt.dataField? getOpt.dataField:"data"
                const data = utils.getObjData(dataField,res);
                this.columns = data
                this.treeDrop()
                console.log(data);
                // 设置显示的行

            })
        },
        treeDrop () {
            this.$nextTick(() => {
              let xTable = this.$refs.table
              this.sortable2 = Sortable.create(xTable.$el.querySelector('.body--wrapper>.vxe-table--body tbody'), {
                handle: '.drag-btn',
                onEnd: ({ item, oldIndex }) => {
                  let options = { children: 'children' }
                  let targetTrElem = item
                  let wrapperElem = targetTrElem.parentNode
                  let prevTrElem = targetTrElem.previousElementSibling
                  let tableTreeData = this.columns
                  let selfRow = xTable.getRowNode(targetTrElem).item
                  let selfNode = utils.findTree(tableTreeData, row => row === selfRow, options)
                  if (prevTrElem) {
                    // 移动到节点
                    let prevRow = xTable.getRowNode(prevTrElem).item
                    let prevNode = utils.findTree(tableTreeData, row => row === prevRow, options)
                    if (utils.findTree(selfRow[options.children], row => prevRow === row, options)) {
                      // 错误的移动
                      let oldTrElem = wrapperElem.children[oldIndex]
                      wrapperElem.insertBefore(targetTrElem, oldTrElem)
                      return this.$XModal.message({ message: '不允许自己给自己拖动！', status: 'error' })
                    }
                    let currRow = selfNode.items.splice(selfNode.index, 1)[0]
                    if (xTable.isTreeExpandByRow(prevRow)) {
                      // 移动到当前的子节点
                      prevRow[options.children].splice(0, 0, currRow)
                    } else {
                        // debugger;
                      // 移动到相邻节点
                      prevNode.items.splice(prevNode.index + (selfNode.index < prevNode.index ? 0 : 1), 0, currRow)
                    }
                  } else {
                    // 移动到第一行
                    var currRow = selfNode.items.splice(selfNode.index, 1)[0]
                    tableTreeData.unshift(currRow)
                  }
                  // 如果变动了树层级，需要刷新数据
                  xTable.syncData()
                }
              })
            })
        },
        renderShowEdit(scope){
            const vm = new Vue();
            const h = vm.$createElement;
            return h(
                "a-checkbox",
                {
                    props:{
                        checked:scope.row.show,
                    },
                    on:{
                        input: function (checked) {
                            scope.row.show=checked
                        }
                    }
                },
            )
        },
        getData(){
            const table = this.$refs.table;
            return table.getTableData()
        }
    },
    render(h) {
        const { columns,renderShowEdit }=this
        const btn = h(
            "span",
            {
                class:"drag-btn"
            },
            [
                h(
                    "i",
                    {
                        class:"vxe-icon--menu"
                    }
                )
            ]
        )
        const tableColumn=[
            {
              width: 60,
              slots: {
                default: "btn_default",
                header: () => {
                  return "排序"
                }
              }
            },
            { field: 'title', title: '默认标题', treeNode: true },
            { field: 'name', title: '显示标题',  editRender: { name: 'AInput' } },
            { field: 'width', title: '列宽' ,editRender: { name: 'AInputNumber' }},
            { field: 'align', title: '对齐方式',editRender: { name: 'ASelect', options: [{label:"居左",value:"left"},{label:"居中",value:"center"},{label:"居右",value:"right"}]} },
            { field: 'show',title: '显示',align:"center", slots: { default: 'show_default' }},
            { field: 'freeze', title: '固定' ,editRender: { name: 'ASelect', options: [{label:"靠左",value:"left"},{label:"居中",value:"center"},{label:"靠右",value:"right"}] }},
        ]

        return h(
            "vxe-grid",
            {
                class:"columns-table",
                ref:"table",
                props:{
                    border:true,
                    rowKey:true,
                    columns:tableColumn,
                    data:columns,
                    treeConfig:{children: 'children'},
                    editConfig:{trigger: 'click', mode: 'row'},
                    checkboxConfig:{checkStrictly: true}
                },
                scopedSlots:{
                    btn_default:()=>{
                        return btn;
                    },
                    show_default:renderShowEdit
                   
                }
            },
            [
               
            ]
        )
        
    },
}