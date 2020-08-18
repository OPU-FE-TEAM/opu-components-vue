
import draggable from "vuedraggable";


export default {
    name:"columns-nested",
    components: {
        draggable
    },
    props:{
        columns:{
            type:Array,
            required: true,
        }
    },
    data() {
        return {
        }
    },
    computed:{
    },
    created() {
    },
    methods: {
    },
    render(h) {
        const { columns }=this
        return h(
                "draggable",
                {
                    props:{
                        tag:"ul",
                        list:columns,
                        group:"people"
                    }
                },
                [
                    // renderColumnsList(columns,h,this)
                ]
            )
    },
}