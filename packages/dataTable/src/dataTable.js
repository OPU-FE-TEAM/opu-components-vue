
import Vue from "vue";
import 'vxe-table/lib/index.css'
import utils from '../../utils'
import {Table} from 'vxe-table'
import {DataForm} from '../../dataForm'
import config from '../conf'
import SetColums from './setColums'
// import checkbox from "ant-design-vue/lib/checkbox";

const tablePropKeys = Object.keys(Table.props)
const methods = {}
Object.keys(Table.methods).forEach(name => {
  methods[name] = function (...args) {
    return this.$refs.dataGrid && this.$refs.dataGrid[name](...args)
  }
})

// 渲染头部搜索表单
function renderHeadSearch(searchConfig,h,_vm){
  const { onSearchSubmit,onButtonActionClick }=_vm
  const items = searchConfig.items.filter(item=>!item.folding)
  let form = h(
    'data-form',
    {
      ref:"headSearch",
      props:{
        ...searchConfig,
        items,
        onButtonActionClick:onButtonActionClick
      },
      on:{
        ...searchConfig.on,
        submit:onSearchSubmit
      }
    }
  );

  return h(
    'div',
    {
      class:'head-search-form'
    },
    [
      form
    ]
  )
}
// 渲染高级查询窗口
function renderAdvancedSearch(searchConfig,h,_vm){
  const { onSearchSubmit,advancedVisible,onAdvancedcancel,onAdvancedSubmit }=_vm
  const items = searchConfig.items.filter(item=>item.folding!==false)
  const formProps = searchConfig.advancedSearchForm && searchConfig.advancedSearchForm.props?searchConfig.advancedSearchForm.props:{}
  let form = h(
    'data-form',
    {
      ref:"advancedSearch",
      props:{
        ...formProps,
        items,
        layout:searchConfig.foldingLayout?searchConfig.foldingLayout:"flex"
      },
      class:'advanced-search-form',
      on:{
        ...searchConfig.on,
        submit:onSearchSubmit
      }
    }
  );

  const modalProps=searchConfig.advancedSearchModal && searchConfig.advancedSearchModal.props?searchConfig.advancedSearchModal.props:{}

  return h(
    'a-modal',
    {
      ...searchConfig.advancedSearchModal,
      props:{
        ...modalProps,
        title:modalProps.title?modalProps.title:"高级搜索",
        visible:advancedVisible
      },
      on:{
        cancel:onAdvancedcancel,
        ok:onAdvancedSubmit
      },
      class:'advanced-search-modal'
    },
    [
      form
    ]
  )
}

// 渲染设置表头窗口
function renderColumnsModal(setColumns,h,_vm) {
  const { setColumnsVisible,onSetColumnsCancel,setColumnsOpt,onSetColumnsSubmit }=_vm
  const modalProps=setColumns.modal && setColumns.modal.props?setColumns.modal.props:{}

  return h(
    'a-modal',
    {
      props:{
        title:modalProps.title?modalProps.title:"设置表头",
        width:1000,
        ...modalProps,
        visible:setColumnsVisible,
      },
      on:{
        cancel:onSetColumnsCancel,
        ok:onSetColumnsSubmit
      },
      class:'advanced-search-modal'
    },
    [
      h(
        "SetColums",
        {
          ref:"setColumsTable",
          props:{
            option:setColumnsOpt
          }
        }
      )
    ]
  )
}

function renderButton(item,h,hasDropdown){
  const { name,icon,disabled,code,on }=item;

  let iconContent = "";
  if (icon) {
    iconContent = h(
      'a-icon',
      {
        props:{
          type:icon,
        }
      }
    )
  }
  // 下拉按钮
  if (hasDropdown) {
    return h(
      'a-menu-item',
      {
        key:code,
        props:{
          disabled
        },
        on
      },
      [
        iconContent,
        name
      ]
    )
  }
  return h(
    'a-button',
    {
      key:code,
      props:{
        type:item.type,
        disabled
      },
      on
    },
    [
      iconContent,
      name
    ]
  )
}

function renderButtons(buttons,h){
  return buttons ? buttons.map(item => {
    if (Object.prototype.toString.call(item) === "[object Array]") {
      // 数组，渲染按钮组
      const buttonGroups = item.map(p => renderButton(p,h));
      return h(
        'a-button-group',
        {},
        [buttonGroups]
      )
    } else if (item.dropdowns && item.dropdowns.length) {
      const buttonGroups = item.dropdowns.map(p => renderButton(p,h,true));

      const menus = h(
        'a-menu',
        {
          slot:"overlay"
        },
        [buttonGroups]
      )
      return h(
        'a-dropdown',
        {
          props:{
            disabled:item.disabled
          },
          scopedSlots:{
            overlay:()=>{
              return menus
            }
          }
        },
        [
          
          h(
            'a-button',
            {
            },
            [
              item.name,
              h('a-icon',{ props:{type:'down'}}) 
            ]
          )
        ]
      )
     
    } else if (Object.prototype.toString.call(item) === "[object Object]") {
      // 对象，渲染单个按钮
      return renderButton(item,h);
    }
  }):[]
}

function renderHeadToolbar(h,_vm){
  const { headToolbar,$nextTick,$refs,showSetColumns }=_vm
  if (!headToolbar) {
    return false
  }
  const headToolbarProps = {
    ref:"headToolbar",
    props:{},
    class:'head-toolbar',
    scopedSlots:{}
  }
  // 渲染按钮
  if (headToolbar.buttons) {
    const buttons = renderButtons(headToolbar.buttons,h);
    headToolbarProps.scopedSlots.buttons = ()=>{
      return buttons
    }
  }
  let advancedSearch="";
  // 渲染头部搜索表单
  if (headToolbar.searchConfig) {
    headToolbarProps.scopedSlots.tools = ()=>{
      return renderHeadSearch(headToolbar.searchConfig,h,_vm)
    }
    advancedSearch = renderAdvancedSearch(headToolbar.searchConfig,h,_vm)
  }

  // 渲染头部工具
  let setColumnsModal = ""
  if (headToolbar.tools) {
    headToolbarProps.props={
      ...headToolbar.tools
    }
    // 自定义的 setColumns 
    if (headToolbar.tools.setColumns) {
      const buttonProps = headToolbar.tools.setColumns.button && headToolbar.tools.setColumns.button.props?headToolbar.tools.setColumns.button.props:{}
      headToolbarProps.scopedSlots.tools=()=>{
          return h(
            "a-button",
            {
              ...headToolbar.tools.setColumns.button,
              props:{
                circle:true,
                icon:"setting",
                ...buttonProps,
              },
              class:"tool-btn-setcolumns",
              on:{
                click:showSetColumns
              }
            }
          )
        }
        setColumnsModal=renderColumnsModal(headToolbar.tools.setColumns,h,_vm)
    }
    $nextTick(()=>{
      $refs.dataGrid.connect($refs.headToolbar)
    })
  }
  return h(
    "div",
    {
      class:"head-toolbar-box"
    },
    [
      h(
        'vxe-toolbar',
        headToolbarProps,
        []
      ),
      advancedSearch,
      setColumnsModal
    ]
  )

}


export default {
  name: 'DataTable',
  components: {
    DataForm,
    SetColums
  },
  props: {
    ...Table.props,
    columns: Array,
    pagerConfig: [Boolean, Object],
    proxyConfig: Object,
    toolbar: [Boolean, Object],
    formConfig: [Boolean, Object],
    zoomConfig: Object,
    searchConfig:Object,
    headToolbar:Object

  },
  data () {
    return {
      tableColumns:[],
      advancedVisible:false,
      setColumnsVisible:false,
      searchData:{}
    }
  },
  computed: {
    tableExtendProps () {
      const rest = {}
      tablePropKeys.forEach(key => {
        rest[key] = this[key]
      })
      return rest
    },
    tableProps(){
      const { $listeners,$scopedSlots,tableExtendProps,handleTableQuery,tableColumns,renderCheckbox }=this
      const propsData =this.$options.propsData
      const props = Object.assign({}, tableExtendProps)

      const columns = tableColumns.map(item=>{
        if (item.editRender && item.editRender.name && item.editRender.name==="ACheckbox") {
          item.slots={
            default:"a_checkbox"
          }
          $scopedSlots['a_checkbox']=renderCheckbox
        }
        return item;
      })

      Object.assign(props, {
        props:{
          ...propsData,
          columns:columns
        }
      })
      const ons = {}
      utils.each($listeners, (cb, type) => {
        ons[type] = (...args) => {
          this.$emit(type, ...args)
        }
      })
      if (props.props.proxyConfig && props.props.proxyConfig.ajax && props.props.proxyConfig.ajax.query) {
        const query = props.props.proxyConfig.ajax.query;
        props.props.proxyConfig.ajax.query = (arr)=>{
          const json = handleTableQuery(arr);
          if (json === false) {
            return false;
          }else if (json){
            arr=json
          }
          return query(arr)
        }
      }
      props.on = ons;
      props.ref = 'dataGrid'
      props.scopedSlots = $scopedSlots
      return props
    },
    setColumnsOpt(){
      return this.headToolbar && this.headToolbar.tools && this.headToolbar.tools.setColumns?this.headToolbar.tools.setColumns:{}
    }
  },
  created () {
    const { columns }=this
    if (columns && columns.length) {
      this.tableColumns = columns
    }
  },
  mounted () {
    
  },
  beforeDestroy () {
    
  },
  destroyed () {
  },
  methods:{
    ...methods,
    onSearchSubmit(values){
      this.searchData = values;
      this.$refs.dataGrid.commitProxy('reload')
    },
    // 处理调用 proxyConfig.ajax 的query查询方法前处理请求参数
    handleTableQuery(arr){
      const { pagerConfig,searchData } = this;
      // 头部搜索表单数据
      // let headSearchFormData = {}
      // if (headToolbar && headToolbar.searchConfig && headToolbar.searchConfig.items) {
      //   const headSearchForm = this.$refs.headSearch;
      //   headSearchFormData = headSearchForm.getData();
      // }
      // 分页参数
      let pageData = {};
      if (pagerConfig && arr.page) {
        const currentPageField = pagerConfig.props && pagerConfig.props.currentPage?pagerConfig.props.currentPage:config.pagerConfig.props.currentPage;
        pageData[currentPageField]=arr.page.currentPage;

        const pageSizeField = pagerConfig.props && pagerConfig.props.pageSize?pagerConfig.props.pageSize:config.pagerConfig.props.pageSize;
        pageData[pageSizeField]=arr.page.pageSize;
      }

      const json = {
        ...searchData,
        ...pageData
      }
      console.log(json);
      return json
    },
    onButtonActionClick(action){
      console.log(action);
      const {searchData}=this
      if (action === "advancedQuery") {
        // 显示高级查询
        this.advancedVisible=true;
        this.$nextTick(()=>{

          this.$refs.advancedSearch.setData(searchData)
        })
      }
    },
    async onAdvancedSubmit(){
      const { $refs,onAdvancedcancel }=this
      try {
        const values = await $refs.advancedSearch.validateFields();
        //同步值到headform
        const headSearchForm = this.$refs.headSearch;
        headSearchForm.setData(values);
        // reload
        this.searchData = values;
        $refs.dataGrid.commitProxy('reload')
        // cancel
        onAdvancedcancel()
      } catch (error) {
        console.log(error);
      }
    },
    onAdvancedcancel(){
      this.advancedVisible=false
    },
    showSetColumns(e){
      // const {setColumnsOpt}=this

      const toolbar = this.$refs.headToolbar;
      this.setColumnsVisible=true;
      // 获取表头数据
      // if (setColumnsOpt.api && setColumnsOpt.api.get) {
        
      // }


      console.log(e,toolbar);
    },
    onSetColumnsCancel(){
      this.setColumnsVisible=false
    },
    onSetColumnsSubmit(){
      const table = this.$refs.setColumsTable;
      const data = table.getData()
      console.log(data);
    },
    // 渲染ACheckbox编辑组件
    renderCheckbox(scope){
      const vm = new Vue();
      const h = vm.$createElement;
      return h(
        "a-checkbox",
        {
          props:{
            checked:scope.row[scope.column.property]
          },  
          on:{
            input(val){
              scope.row[scope.column.property]=val
            }
          }
        }
      )

    }
  },
  render (h) {
    const { tableProps }=this
      // tableProps.scopedSlots.toolbar = ()=>{
      //   return headSearch;
      // }
      // tableProps.props.columns= handleColumns(tableProps.props.columns,h)
      

    return h(
      'div', 
      {
        class:"data-table"
      }, 
      [
        renderHeadToolbar(h,this),
        h(
          'vxe-grid',
          tableProps,
          
        ),
        
      ]
    );
      
  },
}