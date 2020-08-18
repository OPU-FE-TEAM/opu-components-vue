<template>
    <div>
        <DataTable 
         border
         resizable
          show-overflow
          keep-source
          ref="xGrid"
          height="460"
          :loading="loading"
          :data="tableData"
          :columns="tableColumn"
          :headToolbar="headToolbar"
          :proxy-config="proxyConfig"
          :pager-config="pagerConfig"
          highlight-hover-row
          highlight-current-row
          @current-change="currentChangeEvent"
         
        >
       

        </DataTable>

        <vxe-toolbar
          custom
          print
          ref="xToolbar">
          <template v-slot:tools>
              <vxe-button type="text" icon="vxe-icon--funnel" class="tool-btn"></vxe-button>
          </template>
        </vxe-toolbar>
        <a-button @click="getData">获取数据</a-button>
    </div>
</template>

<script>
// import {utils} from '../../index'

function getData(arr) {
  return new Promise(resolve => {
        setTimeout(() => {
          const size = arr.pageSize?arr.pageSize: 20;
          const pageIndex = arr.pageIndex?arr.pageIndex:1;
          const list = Array.from({ length: size }, (_, key) => ({
            id: key,
            name: `name_${pageIndex}_${key}`,
            checkbox:key<3?true:false,
            checkbox1:key===5?true:false
          }));
          const json = {
            // data: [...list],
            // total: 100
            code:0,
            data:{
              data:[...list],
              total:100
            }
          };
          console.log(json);
          resolve(json);
        }, 500);
      });
}

function getColumns() {
  return new Promise(resolve => {
        setTimeout(() => {
          const list = [
            {
              id:"1",
              title: '基本信息',
              children: [
                { id:"1-1",field: 'name', title: 'Name',width:100,align:"left",show:true,freeze:"left" },
                {
                  title: '其他信息',
                  id:"1-2",
                  children: [
                    { id:"1-2-1",field: 'rate', title: 'Rate',width:100,align:"left",show:true,freeze:"left" },
                    { id:"1-2-2",field: 'age', title: 'Age',width:100,align:"left",show:true,freeze:"left" }
                  ]
                },
                { id:"1-3",field: 'sex', title: 'Sex',width:100,align:"left",show:true,freeze:"left" }
              ]
            },
            { id:"2",field: 'address', title: 'Address',width:100,align:"left",show:true,freeze:"left"  },
            { id:"3",field: 'area', title: 'Area',width:100,align:"left",show:true,freeze:"left"  },
            { id:"4",field: 'city', title: 'City',width:100,align:"left",show:true,freeze:"left"  }
          ];
          const json = {
            // data: [...list],
            // total: 100
            code:0,
            data:{
              data:[...list],
              total:100
            }
          };
          resolve(json);
        }, 500);
      });
}

export default {
    components:{
    },
    data() {
        return {
            loading: false,
            tableForm: {
              data: {
                name: '',
                sex: ''
              },
              items: [
                { field: 'name', title: 'app.body.label.name', itemRender: { name: '$input', props: { placeholder: '请输入名称' } } },
                { field: 'sex', title: '性别', titlePrefix: { message: '帮助信息！！！', icon: 'fa fa-info-circle' }, itemRender: { name: '$select', options: [] } },
                { itemRender: { name: '$buttons', children: [{ props: { type: 'submit', content: '查询', status: 'primary' } }, { props: { type: 'reset', content: '重置' } }] } }
              ]
            },
            
            headToolbar:{
              buttons:[
                {
                  name: "新单",
                  code: "add",
                  icon: "file-add",
                  type: "primary",
                  on:{
                    click:()=>{
                      console.log('add click');
                    }
                  }
                },
                [
                  {
                    name: "获取高亮行",
                    key: "getCurrentRecord",
                    icon: "edit",
                    on:{
                      click:this.getCurrentRecord
                    }
                  },
                  {
                    name: "作废",
                    key: "del",
                    icon: "delete",
                    disabled:true
                  },
                ],
                {
                  name: "更多",
                  code: "more",
                  icon: "file-add",
                  // disabled:true,
                  dropdowns:[
                    {
                      name: "更多1",
                      code: "more1",
                      icon: "delete",
                      disabled:true
                    },
                    {
                      name: "更多2",
                      code: "more2",
                      icon: "delete"
                    }
                  ]
                },
              ],
              searchConfig:{
                layout:"inline",
                titleWidth:"auto",
                // foldingLayout:"flex",
                
                on:{
                  submit:(values)=>{
                    console.log(values);
                  },
                },
                advancedSearchModal:{
                  props:{
                    width:800,
                    title:"高级搜索1"
                  }
                },
                advancedSearchForm:{
                  props:{
                    layout:"flex",
                    colspan:2
                  }
                },
                items: [
                  { field: 'name', title: '名称', itemRender: { name: 'input', props: { placeholder: '请输入名称' } } },
                  { field: 'sex', title: '性别', itemRender: { name: 'select', props: {placeholder: '请选择性别',showSearch:true, defaultField:"isSelected", valueField:"id", labelField:"name", param:{code:"aa"}} } },
                  { field: 'age', title: '年龄',folding:true, itemRender: { name: 'number', props: { placeholder: '请输入年龄' } } },
                  { colon:false,titleWidth:0,folding:false,itemRender: {
                     name: 'buttons',
                     props:{
                       children: [
                         { props: { action: 'submit', content: '查询', type: 'primary' } },
                         { props: { action: 'reset', content: '重置' } }, 
                         { props: { action: 'advancedQuery', content: '高级查询' } }
                        ]} } }
                ]
              },
              tools:{
                import:true,
                custom:true,
                setColumns:{
                  button:{
                    props:{
                      shape:"circle",
                      icon:"setting"
                    },
                    style:{
                      marginRight:'10px'
                    }
                  },
                  proxyConfig:{
                    get:{
                      api:getColumns,
                      param:{ code:"aaa"},
                      dataField:"data.data"
                    },
                  }
                }
              }
            },
            pagerConfig: { 
              pageSize: 10,
              layouts:['PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'Sizes', 'FullJump', 'Total'],
              perfect:true,
              // props:{
              //   pageSize:'size',
              //   currentPage:'pageIndex'
              // }
            },
            proxyConfig: {
              seq: true, // 启用动态序号代理
              sort: true, // 启用排序代理
              filter: true, // 启用筛选代理
              form: true, // 启用表单代理
              props: {
                result: "data.data",
                total: "data.total",
                list:"data.data",
              },
              
              ajax: {
                query: getData
              }
            },
            proxyColumn:{

            },
            tableColumn: [
              { type: 'checkbox', width: 60 },
              { type: 'seq', title: 'Number', width: 80 },
              { field: 'name', title: 'Name', minWidth: 140, editRender: { name: 'AInput' } },
              { field: 'checkbox', title: 'Checkbox', minWidth: 140, editRender: { name: 'ACheckbox' } },
              { field: 'checkbox1', title: 'Checkbox1', minWidth: 140, editRender: { name: 'ACheckbox' } },


            ],
            tableData: []
        }
    },  
    created() {
        // this.findList()
         this.$nextTick(() => {
              // 手动将表格和工具栏进行关联
              this.$refs.xGrid.connect(this.$refs.xToolbar)
            })
    },
    methods:{
       
        searchEvent () {
          this.tablePage.currentPage = 1
          this.findList()
        },
        handlePageChange ({ currentPage, pageSize }) {
          this.tablePage.currentPage = currentPage
          this.tablePage.pageSize = pageSize
          this.findList()
        },
        currentChangeEvent ({ row }) {
          console.log('行选中事件',row)
        },
        getCurrentRecord(){
          const grid = this.$refs.xGrid;
          const row = grid.getCurrentRecord()
          console.log(6666,row);
        },
        getData(){
          const grid = this.$refs.xGrid;
          const data =grid.getData()
          console.log(data);
        }
    }
}
</script>

<style lang="css" >

</style>