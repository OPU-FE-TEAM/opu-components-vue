import Button from "ant-design-vue/lib/button";
import "ant-design-vue/lib/button/style/css";

export default {
    name: 'DataForm',
    components:{
        [Button.name]:Button,
    },
    props: {
        children:{
          type:Array,
          default:()=>[]
        },
    },
    render(h) {
        const {children}=this;
        const buttons = children ? children.map(item=>{
            let buttonText = item.props && item.props.content ?item.props.content:"";
            if (buttonText && typeof buttonText === "function") {
                buttonText = [item.content()];
            }
            return h(
                'a-button', 
                {
                  ...item,
                },
                buttonText
              );
        }):[];
        return h(
            "div",
            {
                class:"data-form-buttons"
            },
            [].concat(buttons)
        )

    },

}