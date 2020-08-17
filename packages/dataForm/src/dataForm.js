import utils from '../../utils'

import Form from "ant-design-vue/es/form";
import "ant-design-vue/lib/form/style/css";
import inputs from './index'
import config from '../conf'


// 回车跳转下一个focus
function nextItemFocus(item,_vm){
  const { enterToNextItemFocusList,setFieldFocus }=_vm;
  const fieldIndex = enterToNextItemFocusList.indexOf(item.field);
  if (fieldIndex>-1 && fieldIndex < enterToNextItemFocusList.length-1) {
    const nextField = enterToNextItemFocusList[fieldIndex+1];
    setFieldFocus(nextField)
  }
}

// 处理表单项的可选数据结构为 antd所需的
function handleItemPropsOptions(props){
  const { options, valueField,labelField }=props;
  if (valueField || labelField) {
    const cloneOptions = utils.clone(options);
    return cloneOptions.map(item=>{
      if (valueField) {
        item.value = item[valueField];
      }
      if (labelField) {
        item.label = item[labelField];
      }
      return item;
    })
  }
  return options;
}



// 请求表单项可选数据
const fetchItemPropsOptionsApiList = async function(list,_vm){
  const { setFieldsOptions,onOptionsAllLoad,onOptionsLoadBefore } = _vm
  if (onOptionsLoadBefore) {
    const beforeRes = onOptionsLoadBefore(list)
    if (beforeRes === false) {
      return false;
    }else if(beforeRes){
      list = beforeRes;
    }
  }
  let promises = list.map(item => {
    const {api,param} = item;
    return api(param)
  });
  Promise.all(promises)
  .then((res) => {
    let json = {}
    list.forEach((item,index) => {
      const {field,valueField,labelField,fields}=item;
      const itemData = res[index];
      if (fields && fields.length) {
        // 统一请求可选数据 赋值到指定字段的处理
        fields.forEach(element => {
          for (const key in element.param) {
            if (element.param[key] && itemData[element.param[key]]) {
              json[element.field] =handleItemPropsOptions({
                options:itemData[element.param[key]],
                valueField:element.valueField,
                labelField:element.labelField
              });
            }
          }
        });
      }else{
        // 字段单独配置api的可选数据的处理
        const options = handleItemPropsOptions({
          options:res[index],
          valueField,
          labelField
        });
        json[field] = options

      }
    });
    if (onOptionsAllLoad) {
      const onLoadRes = onOptionsAllLoad(json);
      if (onLoadRes) {
        json = onLoadRes
      }
    }
    setFieldsOptions(json)
  })
  .catch(() => {
  })
}

// 处理统一请求可选数据的请求
function handeUnifyApiGetOptions(unifyList,optionsApiList,_vm){
  const { fieldsOptionsApi } = _vm
  // 处理同一请求参数
  const json = {};
  let fields=[]
  unifyList.map(item=>{
    const {param,valueField,labelField}=item.itemRender.props;
    fields.push({
      field:item.field,
      valueField,
      labelField,
      param
    })
    for (const key in param) {
      if (json[key] && utils.isArray(json[key])) {
        json[key].push(param[key]);
      }else if(json[key] && !utils.isArray(json[key])){
        json[key] = [json[key],param[key]]
      }else{
        json[key] = param[key]
      }
    }
  })
  const unifyApi = fieldsOptionsApi?fieldsOptionsApi:config.fieldsOptionsApi
  if (unifyApi) {
    optionsApiList.push({
      api:fieldsOptionsApi?fieldsOptionsApi:config.fieldsOptionsApi,
      param:json,
      fields
    })
  }
  fetchItemPropsOptionsApiList(optionsApiList,_vm)
}

// 渲染标题
function renderItemTitle(item,h,_vm){
  const { titleColon,titleWidth } = _vm
  //是否必填
  let isRequired = false;
  if (item.option && item.option.rules && item.option.rules.length) {
    for (let i = 0; i < item.option.rules.length; i++) {
      const rulesItem = item.option.rules[i];
      if (rulesItem.required) {
        isRequired = true;
        break;
      }
    }
  }
  //标题内容
  let titleText = "";
  if (typeof item.title === "function") {
    titleText = [item.title()];
  } else {
    titleText = item.title;
  }
  let titleWidthStr=item.titleWidth || item.titleWidth===0?item.titleWidth:titleWidth;
  if (utils.isNumber(titleWidthStr)) {
    titleWidthStr=`${titleWidthStr}px`;
  }
  return h(
    "div",
    {
      class: [
        "data-form-item-title",
        { colon: item.colon===false?item.colon:titleColon },
        { required: isRequired }
      ],
      style: {
        width: titleWidthStr
      }
    },
    titleText
  );
}

// 渲染input表单项
function renderItemInput(item,h,_vm){
  const { $slots,$scopedSlots,readonly,onButtonClick }=_vm;
  const vDecorator = [item.field];
  if (item.option) {
    vDecorator.push(item.option);
  }
 const props={
   props:{},
    ...item.itemRender,
    ref: "input_" + item.field,
    directives: [
      {
        name: "decorator",
        value: vDecorator
      }
    ]
 }

 // 只读
 if (readonly) {
   if (props.props) {
     props.props.disabled=true;
     props.props.placeholder=null
   }else{
    props.props={
      disabled:true,
      placeholder:""
    };
   }
 }else{
   // TODO 切换只读的处理
  // if (props.props && props.props.disabled !==true) {
  //   props.props.disabled=false;
  // }
 }
 let inputDom = "";
  if (item.itemRender && item.itemRender.slot) {
    // 插槽
    if ($slots[item.itemRender.slot]) {
      inputDom = $slots[item.itemRender.slot];
    }else if ($scopedSlots[item.itemRender.slot]) {
      props.scopedSlots= {
        default: $scopedSlots[item.itemRender.slot]
      },
      inputDom = h(
        "a-scopedSlots",
        props
      );
    }
  }else if(item.itemRender && item.itemRender.customRender){
    // 自定义渲染内容
    if (item.itemRender && item.itemRender.props) {
      props.props['customRender'] = item.itemRender.customRender
    }else{
      props.props = {
        customRender:item.itemRender.customRender
      }
    }
    inputDom = h(
      "a-customRender",
      props
    );
  }else{
    
    
    // 根据name渲染组件
    const renderName = item.itemRender && item.itemRender.name?`a-${item.itemRender.name}`:'a-input';
    if (renderName === "a-buttons") {
      if (props.props) {
        props.props.itemClick = onButtonClick
      }else{
        props.props={
          itemClick:onButtonClick
        }
      }
     
    }
    inputDom = h(
      renderName,
      props
    );
  }

  return inputDom
}

// 渲染每个表单项内容
function renderItemContent(item,h,_vm){
  const { titleWidth } = _vm
  return h(
    "div",
    {
      style:{width:titleWidth},
      class:"data-form-item-content"
    },
    [
      renderItemInput(item,h,_vm)
    ]
  )
}

// 渲染items
function renderItems (h, _vm) {
  const { itemsOptions,$slots,layout,colspan,$scopedSlots,focusItemTypes } = _vm;
  return itemsOptions ? itemsOptions.map(item => {

    const formItemProps = {
      key:item.field,
      props: item,
      style:{},
      scopedSlots: {},
    }

    let formItemContent=""
    if (item.slot && $slots[item.slot]) {
      // 插槽
      formItemContent = $slots[item.slot];
    }else if (item.slot && $scopedSlots[item.slot]) {
      // 作用域插槽
      const vDecorator = [item.field];
      if (item.option) {
        vDecorator.push(item.option);
      }
      formItemContent = h(
        "a-scopedSlots",
        {
          scopedSlots: {
            default: $scopedSlots[item.slot]
          },
          directives: [
            {
              name: "decorator",
              value: vDecorator
            }
          ]
        }
      );
    }else if(item.type === "hidden"){
      formItemContent =[
        renderItemContent(item,h,_vm)
      ]
      formItemProps.style["display"] = "none";
    }else{
      formItemProps.scopedSlots.label= ()=>{
        return renderItemTitle(item,h,_vm)
      }
      formItemContent =[
        renderItemContent(item,h,_vm)
      ]
    }
    if (layout === "grid") {
      // grid模式下每个单元格所占格
      if (item.colspan && item.colspan > 1) {
        formItemProps.style["gridColumn"] = "span " + item.colspan;
      }
      if (item.rowspan && item.rowspan > 1) {
        formItemProps.style["gridRow"] = "span " + item.rowspan;
      }
    } else if(layout === "flex"){
      // 当flex模式下的宽度
      const colWidth = 100/colspan;
      if (item.width) {
        formItemProps.style["width"]=item.width
      }else if(item.colspan && item.colspan > 1){
        formItemProps.style["width"]=`${colWidth*item.colspan}%`
      }else{
        formItemProps.style["width"]=`${colWidth}%`
      }
    }

    let wrapperProps={
      class:["data-form-item-wrapper",item.align],
      on:{}
    }
    if (item.itemRender && focusItemTypes.includes(item.itemRender.name) && item.itemRender.name!=='textarea') {
      wrapperProps.on.keydown = e=>{
        const {keyCode}=e;
        if (keyCode === 13) {
          e.preventDefault();
          nextItemFocus(item,_vm)
        }
      }
    }


    return  h(
      'a-form-item', 
      formItemProps,
      [
        h(
          "div",
          wrapperProps,
          [formItemContent]
        )
      ]
    );
  }) : []
}

export default {
    name: 'DataForm',
    components:{
      ...inputs,
      [Form.name]:Form,
      [Form.Item.name]:Form.Item
    },
    props: {
      // 表单内容
      items:{
        type:Array,
        default:()=>[]
      },
      // 布局，'horizontal'|'vertical'|'inline'|'grid'|'flex'
      layout:{
        type:String,
        default:"grid"
      },
     
      // grid、flex布局时的列数
      colspan:{
        type:Number,
        default:1
      },
      // 是否只读
      readonly:{
        type: Boolean,
        default: false
      },
      // 尺寸
      size:{
        type:String,
        default:"small"
      },
      // 所有项的标题对齐方式
      titleAlign:{
        type:String,
        default:"right"
      },
      // 所有项的标题宽度
      titleWidth:{
        type:[String,Number],
        default:100
      },
      // 是否显示标题冒号
      titleColon:{
        type:Boolean,
        default:true
      },
      // 是否显示必填字段的红色星号
      titleAsterisk:{
        type:Boolean,
        default:true
      },
      // 是否加载中
      loading: {
        type: Boolean,
        default: false
      },
      // 可选数据全部请求完后回调
      onOptionsAllLoad:{
        type:Function,
        default:()=>{}
      },
      // 可选数据请求前回调
      onOptionsLoadBefore:{
        type:Function,
        default:()=>{}
      },
      // 渲染的按钮buttons，action 按钮点击时触发
      onButtonActionClick:{
        type:Function,
        default:()=>{}
      }
      
    },
    data () {
      return {
        form: this.$form.createForm(this),
        itemsOptions:[],
        // 支持回车活动焦点的组件
        focusItemTypes:[
          'input',
          'password',
          'number',
          'select',
          'datePicker',
          'monthPicker',
          'weekPicker',
          'rangePicker',
          'cascader',
          'treeSelect',
          'textarea'
        ]
      }
    },
    computed: {
      // 回车跳转下一个表单项获得焦点的字段列表
      enterToNextItemFocusList(){
        return this.items.map(item=>{
          if (item.itemRender &&  
              this.focusItemTypes.includes(item.itemRender.name) &&
              (item.itemRender.props && item.itemRender.props.disabled !==true || !item.itemRender.props)
              ) {
            // 可获得焦点的组件
            return item.field;
          }
          return ""
        }).filter(p=>p!=='')
      }
    },
    watch: {
      items(items){
        this.cloneItems(items)
      }
    },
    created() {
      this.cloneItems(this.items)
    },
    methods:{
      cloneItems(items){
        const clone = utils.clone(items);
        const getItemPropsOptionsApiList = [];
        const unifyApiGetOptions = [];
        const data = clone.map(item=>{
          // 处理可选数据
          if (item.itemRender && item.itemRender.props && item.itemRender.props.options) {
            const options = handleItemPropsOptions(item.itemRender.props);
            item.itemRender.props.options=options
          } else if(item.itemRender && item.itemRender.props && item.itemRender.props.api){
            getItemPropsOptionsApiList.push({
              field:item.field,
              api:item.itemRender.props.api,
              valueField:item.itemRender.props.valueField,
              labelField:item.itemRender.props.labelField,
              param:item.itemRender.props.param,
            })
          } else if(item.itemRender && item.itemRender.props && item.itemRender.props.param && !item.itemRender.props.api){
            unifyApiGetOptions.push(item)
          }
          return item;
        })
        if (unifyApiGetOptions.length) {
          handeUnifyApiGetOptions(unifyApiGetOptions,getItemPropsOptionsApiList,this)
        }else if (getItemPropsOptionsApiList.length) {
          fetchItemPropsOptionsApiList(getItemPropsOptionsApiList,this)
        }
        this.itemsOptions = data;
      },
      // 获取表单数据，不验证
      getData(){
        const values = this.form.getFieldsValue();
        return values;
      },
      // 设置表单值
      setData(values){
        const { items }=this
        // 过滤掉formitems未定义的字段
        const formFields = items.map(item => item.field);
        let formData = {};
        for (const key in values) {
          if (formFields.includes(key)) {
            formData[key] = values[key];
          }
        }
        this.form.setFieldsValue(formData);
      },
      // 校验并获取一组输入域的值
      validateFields(fields) {
        return new Promise((resolve, reject) => {
          this.form.validateFields(fields, (err, values) => {
            if (!err) {
              let json = {
                ...values
              };
              json = this.formatSubmitValues(json)
              resolve(json);
            } else {
              reject();
            }
          });
        });
      },
      // 格式化提交数据，上传对象转成url
      formatSubmitValues(values){
        const {items}=this;
        items.forEach(item => {
          // 将上传组件的对象值转换成url字符串
          if (item.itemRender && item.itemRender.name==="upload" && values[item.field]) {
            const value = values[item.field];
            if (value.fileList && value.fileList.length) {
              const list = value.fileList.map(p=>{
                if (p.url) {
                  return p.url
                }else if (p.response) {
                  const responseUrlField = item.itemRender.props && item.itemRender.props.responseUrlField?item.itemRender.props.responseUrlField:"data";
                  const url = utils.getObjData(responseUrlField,p.response)
                  if (url) {
                    return url
                  }
                  return p
                }else if(p.status !=="done"){
                  return ""
                }
                return p;
              }).filter(p=>p!=="");
              values[item.field] = list && list.length?list:undefined;
            }else if(value.fileList && value.fileList.length===0){
              values[item.field] = undefined
            }
          }

        });
        return values;
      },
      // 提交
      onSubmit(e){
        if (e) {
          e.preventDefault();
        }
        this.form.validateFields((err, values) => {
          if (!err) {
            let json = {
              ...values
            };
            json = this.formatSubmitValues(json)
            this.$emit("submit",json)
          }
        });
      },
      // 重置
      onReset(){

      },
      // 设置字段获得焦点
      setFieldFocus(field){
        const refName = `input_${field}`;
        const item = this.$refs[refName]
        if (item && item.focus) {
          item.focus()
        }
      },
      // 设置一组字段的options数据
      setFieldsOptions(data){
        const formData = {};
        for (const key in data) {
          const options = data[key];
          const item = this.itemsOptions.find(p=>p.field === key);
          if (item && item.itemRender && item.itemRender.props) {
            if (item.itemRender.name === "checkboxGroup") {
              formData[key]=[];
            }else{
              formData[key]="";
            }
            if (item.itemRender.props.name === "treeSelect") {
              item.itemRender.props.treeData = options
            }else{
              item.itemRender.props.options = options
            }
          } 
        }
        // 清除赋值字段的值
        this.setData(formData)
      },
      // 设置下拉框默认值，从下拉数据中获得默认选项,names = 指定要设置默认的字段，为空则设置全部
      setFieldsOptionsDefaultValues(fields = [], defaultData = {}) {
        const formData={};
        this.itemsOptions.forEach(item => {
          if (item && 
              item.itemRender && 
              item.itemRender.props && 
              item.itemRender.props.options &&
              ((fields.length && fields.includes(item.field)) || fields.length === 0)
            ) {
            const defaultKey = item.itemRender.props.defaultField?item.itemRender.props.defaultField:'default';
            const valueField = item.itemRender.props.valueField?item.itemRender.props.valueField:'id';
            const defaultValue = item.itemRender.props.options.map(p=>{
              if (p[defaultKey]) {
                return p[valueField]
              }
              return ""
            }).filter(p=>p!=="");
            if (defaultValue.length) {
              const valueArrayTypes =['checkboxGroup','radioGroup'];
              let value = defaultValue;
              if (!valueArrayTypes.includes(item.itemRender.name) && defaultValue.length === 1) {
                value = defaultValue[0]
              }
              formData[item.field] = value;
            }
          }
        });
        const json = {
          ...defaultData,
          ...formData
        }
        this.setData(json)
      },
      // 渲染的按钮点击事件
      onButtonClick(action){
        const { onSubmit,onReset,onButtonActionClick }=this;
        switch (action) {
          case "submit":
            onSubmit()
            break;
          case "reset":
            onReset()
            break;
          default:
            onButtonActionClick && onButtonActionClick(action)
            break;
        }
      }
    },
    render (h) {
      const { form,$slots,layout,colspan,readonly,onSubmit } = this
      // ant design form的layout属性
      const antdLayouts=['horizontal','vertical','inline']
      // form表单的参数
      const formProps={
        props:{
          form:form,
          layout:antdLayouts.includes(layout)?layout:null
        },
        class:["data-form",layout],
        style:{},
        on:{
          submit:onSubmit
        }
      }
      if (readonly) {
        formProps.class.push("readonly")
      }
      if (layout === "grid") {
        let formColnumStyle = "";
        for (let i = 0; i < colspan; i++) {
          formColnumStyle += " 1fr";
        }
        formProps.style["grid-template-columns"]= formColnumStyle
      }

      
      return h(
        'a-form', 
        formProps, 
        [].concat($slots.default || renderItems(h, this))
      )
    },
  }