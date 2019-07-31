let menu_item_template = /*template*/`
<g @click="clicked()" style="cursor: pointer; pointer-events: fill;" @mouseenter="scaleUp($event)" @mouseleave="scaleDown($event)">
    <use :href="getRef()" :x="x" :y="y" width="600"  height="80" style="color: transparent;"></use>
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
        scaleUp(event) {
            d3.select(event.target).select('text').transition()
            .duration(200)
            .attr("font-size", "100");

            d3.select(event.target).select('use').style("color", "grey");
        },
        scaleDown(event) {
            d3.select(event.target).select('text').transition()
            .duration(200)
            .attr("font-size", "80");

            d3.select(event.target).select('use').style("color", "transparent");
        },
        clicked() {
            this.$eventHub.$emit('menuClicked', this.id);
        }
    }
};
