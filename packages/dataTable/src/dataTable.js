// import moduleName from 'vxe-table/packages/table'
import 'vxe-table/lib/index.css'
import utils from '../../utils'
import {Table} from 'vxe-table'
import {DataForm} from '../../dataForm'
import config from '../conf'

const tablePropKeys = Object.keys(Table.props)

function renderHeadSearch(searchConfig,h,_vm){
  const { onSearchSubmit }=_vm
  let form = h(
    'data-form',
    {
      ref:"headSearch",
      props:{
        ...searchConfig
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

function renderButton(item,h,hasDropdown){
  const { name,icon,disabled,code,on }=item;
  console.log('disabled',disabled);

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
  const { headToolbar }=_vm
  if (!headToolbar) {
    return false
  }
  const headToolbarProps = {
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
  // 渲染头部搜索表单
  if (headToolbar.searchConfig) {
    // const searchForm = renderHeadSearch(headToolbar.searchConfig,h);
    headToolbarProps.scopedSlots.tools = ()=>{
      return renderHeadSearch(headToolbar.searchConfig,h,_vm)
    }
  }
  
  return h(
    'vxe-toolbar',
    headToolbarProps,
    []
  )
}

export default {
  name: 'DataTable',
  components: {
    DataForm
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
      const { $listeners,$scopedSlots,tableExtendProps,handleTableQuery }=this
      const propsData =this.$options.propsData
      const props = Object.assign({}, tableExtendProps)
      Object.assign(props, {
        props:{
          ...propsData,
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
    }
  },
  created () {
  },
  mounted () {
    
  },
  beforeDestroy () {
    
  },
  destroyed () {
  },
  methods:{
    onSearchSubmit(values){
      console.log(values);
      this.$refs.dataGrid.commitProxy('reload')
    },
    handleTableQuery(arr){
      console.log(arr);
      const { headToolbar,pagerConfig } = this;
      // 头部搜索表单数据
      let headSearchFormData = {}
      if (headToolbar && headToolbar.searchConfig && headToolbar.searchConfig.items) {
        const headSearchForm = this.$refs.headSearch;
        headSearchFormData = headSearchForm.getData();
      }
      // 分页参数
      let pageData = {};
      if (pagerConfig && arr.page) {
        const currentPageField = pagerConfig.props && pagerConfig.props.currentPage?pagerConfig.props.currentPage:config.pagerConfig.props.currentPage;
        pageData[currentPageField]=arr.page.currentPage;

        const pageSizeField = pagerConfig.props && pagerConfig.props.pageSize?pagerConfig.props.pageSize:config.pagerConfig.props.pageSize;
        pageData[pageSizeField]=arr.page.pageSize;
      }

      const json = {
        ...headSearchFormData,
        ...pageData
      }
      console.log(json);
      return json
    }
  },
  render (h) {
    const { tableProps }=this
      // tableProps.scopedSlots.toolbar = ()=>{
      //   return headSearch;
      // }

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