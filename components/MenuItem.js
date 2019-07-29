let menu_item_template = /*template*/`
<g @clicked="clicked()" style="cursor: pointer; pointer-events: fill;" :id="id">
    <use :href="getRef()" :x="x" :y="y" style="color: transparent;"></use>
    <text :x="x+160" :y="y+80"
        font-family="Badaboom"
        :font-size="fontSize"
        class="menuTitle">
        {{title}}
  </text>
</g>
`;

MenuItem = {
    name: 'menu-item',
   template: menu_item_template,
    props: {
        title: {
            type: String,
            default: "default"
        },
        x: {
            type: Number,
            default: 0
        },
        y: {
            type: Number,
            default: 0
        },
        id: {
            type: String,
            default: "default"
        },
        link: {
            type: String,
            default: "default"
        }
    },
    data() {
        return {
            fontSize: 80
        }
    },
    //====================================================================================================================
    computed: {

    },
    //====================================================================================================================
    created() {
        // this.$eventHub.$on('setLight', l => {
        //     if ((l.group == this.group) || (l.id == this.id)) {
        //         this.on = Api.isLightOn(l.d.brightness);
        //     }
        // });

      
    },
    //====================================================================================================================
    mounted: function() {
        let el = d3.selectAll('#' + this.id);
        el.on("mouseenter", function(d){
            d3.select(this).select('text').transition()
            .duration(200)
            .attr("font-size", "100");

            d3.select(this).select('use').style("color", "grey");
        });

        el.on("mouseleave", function(d){
            d3.select(this).select('text').transition()
            .duration(200)
            .attr("font-size", "80");

            d3.select(this).select('use').style("color", "transparent");
        });
    },
    //====================================================================================================================
    beforeDestroy() {
      //  this.$eventHub.$off('setLight');
    },
    //====================================================================================================================
    methods: {
        getRef() {
            return '#' + this.id;
        },
        clicked() {
            console.log("Clicked!");
            // if (this.enableSelect) {
            //     console.log("Clicked on: " + this.id);
                
            //     if (this.select) {
            //         this.deselectLight(this.id);
            //     } else {
            //         this.selectLight(this.id);
            //     }
            // }
        }
    }
};
