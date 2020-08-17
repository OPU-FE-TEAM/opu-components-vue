

export default {
    name: 'scopedSlots',
    components:{
    },
    props: {
        value: [Number, String,Object,Array]
    },
    model: {
        prop: "value",
        event: "update"
      },
    methods: {
        updateValue(value){
            this.$emit("update", value);
            this.$emit("change", value);
        }
    },
    render(h) {
        const {value,$scopedSlots,updateValue}=this
        return h(
            "div",
            {
                class:"data-form-scopedSlots"
            },
            [
                $scopedSlots.default(value,updateValue) 
            ]
        )

    },


}