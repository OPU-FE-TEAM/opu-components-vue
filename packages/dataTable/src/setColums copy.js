
import utils from '../../utils'
import draggable from "vuedraggable";

function renderTableHeader(h,_vm){
    const {tableColumns}=_vm;
    tableColumns.map(item=>{
        return h(
            "div",
            {
                class:"table-row"
            },
            [
                h(
                    "div",
                    {
                        class:"table-cell"
                    },
                    item.title
                )
            ]
        )
    })
    
}

function renderColumnsList(columns,h,_vm){
    const { getOpt } = _vm;
    const childrenField = getOpt.childrenField?getOpt.childrenField:"children"
    const columnList = columns.map(item=>{
        if(item[childrenField] && item[childrenField].length){
           const childrenList = renderColumnsList(item[childrenField],h,_vm)
           return h(
                "div",
                {
                    class:"columns-item",
                    key:item.id
                },
                [
                    item.title,
                    h(
                        "draggable",
                        {
                            props:{
                                list:columns,
                                options:{
                                    forceFallback: true
                                }
                            }
                        },
                        [
                            childrenList
                        ]
                        
                   )
                ]
            )
        
        }else{
            return h(
                "div",
                {
                    class:"columns-item",
                    key:item.id
                },
                item.title
            )
        }
    })
    return columnList
}

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
            tableColumns:[
                {
                    field:"name",
                    title:"标题"
                },
                {
                    field:"width",
                    title:"列宽"
                },
                {
                    field:"align",
                    title:"对齐方式"
                },
                {
                    field:"show",
                    title:"显示"
                },
                {
                    field:"freeze",
                    title:"固定"
                }
            ]
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
                console.log(data);
            })
        }
    },
    render(h) {
        const { columns }=this
        console.log(columns);
        return h(
            "div",
            {
                class:"columns-table"
            },
            [
                renderTableHeader(h,this),
                h(
                    "div",
                    {
                        class:"columns-list"
                    },
                    [
                        h(
                            "draggable",
                            {
                                props:{
                                    list:columns,
                                    options:{
                                        forceFallback: true
                                    }
                                }
                            },
                            [
                                renderColumnsList(columns,h,this)
                            ]
                        )
                    ]
                )
            ]
        )
        
    },
}