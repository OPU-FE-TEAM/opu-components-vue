<template>
    <div>
        <DataTable 
         border
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
         
        >
       

        </DataTable>
    </div>
</template>

<script>
// import {utils} from '../../index'

function getData(arr) {
  console.log(arr);

  return new Promise(resolve => {
        setTimeout(() => {
          const size = arr.pageSize?arr.pageSize: 20;
          const pageIndex = arr.pageIndex?arr.pageIndex:1;
          const list = Array.from({ length: size }, (_, key) => ({
            id: key,
            name: `name_${pageIndex}_${key}`
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
                    name: "编辑",
                    key: "edit",
                    icon: "edit"
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
                titleWidth:70,
                on:{
                  submit:(values)=>{
                    console.log(values);
                  },
                },
                items: [
                  { field: 'name', title: '名称',option:{initialValue:555}, itemRender: { name: 'input', props: { placeholder: '请输入名称' } } },
                  { field: 'sex', title: '性别', itemRender: { name: 'select', props: {placeholder: '请选择性别',showSearch:true, defaultField:"isSelected", valueField:"id", labelField:"name", param:{code:"aa"}} } },
                  { colon:false,titleWidth:0,itemRender: { name: 'buttons',props:{ children: [{ props: { 'html-type': 'submit', content: '查询', type: 'primary' } }, { props: { 'html-type': 'reset', content: '重置' } }]} } }
                ]
              },
            },
                pagerConfig: { 
                  pageSize: 20,
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

              
              tablePage: {
                total: 0,
                currentPage: 1,
                pageSize: 10,
                align: 'left',
                pageSizes: [10, 20, 50, 100, 200, 500],
                layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
                perfect: true
              },
              tableColumn: [
                { type: 'checkbox', width: 60 },
                { type: 'seq', title: 'Number', width: 80 },
                { field: 'name', title: 'Name', minWidth: 140, editRender: { name: 'AInput' } },
                // { field: 'age', title: 'InputNumber', width: 160, editRender: { name: 'InputNumber', props: { max: 35, min: 18 } } },
                // { field: 'sex', title: 'Select', width: 140, editRender: { name: 'Select', options: [] } },
                // { field: 'sex2', title: 'Select', width: 140, editRender: { name: 'Select', optionGroups: [], props: { clearable: true } } },
                // { field: 'region', title: 'Cascader', width: 200, editRender: { name: 'Cascader', props: { data: [] } } },
                // { field: 'date', title: 'DatePicker', width: 200, editRender: { name: 'DatePicker', props: { type: 'date', format: 'yyyy/MM/dd' } } },
                // { field: 'date1', title: 'TimePicker', width: 200, editRender: { name: 'TimePicker', props: { type: 'time' } } },
                // { field: 'flag', title: 'iSwitch', width: 100, cellRender: { name: 'iSwitch' } },
                // { field: 'rate', title: 'Rate', width: 200, cellRender: { name: 'Rate' } }
              ],
              tableData: []
        }
    },  
    created() {
        // this.findList()
    },
    methods:{
       findList () {
              // 模拟后台接口
              this.loading = true
              getData({
                  pageIndex:this.tablePage.currentPage,
                  pageSize:this.tablePage.pageSize,
              }).then((res) => {
                this.tableData = res.data
                this.tablePage.total = res.total
                this.loading = false
              }).catch(() => {
                this.loading = false
              })
            },
            searchEvent () {
              this.tablePage.currentPage = 1
              this.findList()
            },
            handlePageChange ({ currentPage, pageSize }) {
              this.tablePage.currentPage = currentPage
              this.tablePage.pageSize = pageSize
              this.findList()
            }
    }
}
</script>

<style lang="css" >

</style>