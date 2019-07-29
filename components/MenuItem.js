let menu_item_template = /*template*/`
<g @mouseenter="scaleUp()" @mouseleave="scaleDown()" style="cursor: pointer;pointer-events: fill;">
    <use :href="getRef()" :x="x" :y="y"></use>
    <text :x="x+200" :y="y+80"
        font-family="Badaboom"
        font-size="80"
        :id="id"
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
            tweenIn: null,
            tweenOut: null
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
        this.tweenIn = KUTE.to('#' + this.id, {scale: 1.1}, {duration: 200});
        this.tweenOut = KUTE.to('#' + this.id, {scale: 1}, {duration: 200});
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
            // if (this.enableSelect) {
            //     console.log("Clicked on: " + this.id);
                
            //     if (this.select) {
            //         this.deselectLight(this.id);
            //     } else {
            //         this.selectLight(this.id);
            //     }
            // }
        },
        scaleUp() {
            console.log("Mouse Over");
            this.tweenOut.stop();
            this.tweenIn.start();
        },
        scaleDown() {
            console.log("Mouse Leave");
            this.tweenIn.stop();
            this.tweenOut.start();
        }
    }
};
