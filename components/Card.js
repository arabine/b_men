let card_template = /*template*/`
<svg
    version="1.1"
    viewBox="0 0 100 153"
    height="306"
    width="200"
    :id="getId()"
    :x="xLocal" :y="yLocal"
    style="cursor: pointer;">

    <rect
    ry="4.859446"
    y="0.75757605"
    x="0.75757486"
    height="151.51515"
    width="98.484848"
    id="rect815"
    style="opacity:1;fill:#fffffd;fill-opacity:1;stroke:#000000;stroke-width:1.5151515;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1" />
 <rect
    ry="2.2314641"
    y="18.499718"
    x="5.4880857"
    height="69.575958"
    width="89.023827"
    id="rect815-3"
    style="opacity:1;fill:#fffffd;fill-opacity:1;stroke:#000000;stroke-width:0.97617126;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1" />
 <rect
    ry="1.7438478"
    y="91.993469"
    x="5.4747801"
    height="54.372311"
    width="89.050438"
    id="rect815-3-1"
    style="opacity:1;fill:#fffffd;fill-opacity:1;stroke:#000000;stroke-width:0.8630783;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1" />
 <rect
    ry="1.4388462"
    y="5.3486223"
    x="5.2239523"
    height="9.4813061"
    width="89.552094"
    id="rect815-3-1-5"
    style="opacity:1;fill:#fffffd;fill-opacity:1;stroke:#000000;stroke-width:0.36142254;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1" />
 <path
    d="m 97.283455,137.28648 a 10.773434,10.773434 0 0 1 -9.225252,12.11288 10.773434,10.773434 0 0 1 -12.125054,-9.20924 10.773434,10.773434 0 0 1 9.193216,-12.13721 10.773434,10.773434 0 0 1 12.149344,9.17717"
    id="path4548"
    style="opacity:1;fill:#ffffff;fill-opacity:1;stroke:#000000;stroke-width:0.44904202;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1" />
 <path
    d="m 23.958553,137.28648 a 10.773434,10.773434 0 0 1 -9.225252,12.11288 10.773434,10.773434 0 0 1 -12.1250545,-9.20924 10.773434,10.773434 0 0 1 9.1932155,-12.13721 10.773434,10.773434 0 0 1 12.149344,9.17717"
    id="path4548-4"
    style="opacity:1;fill:#ffffff;fill-opacity:1;stroke:#000000;stroke-width:0.44904202;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1" />
</svg>
`;

Card = {
    name: 'card',
    template: card_template,
    props: {
        x: {
            type: Number,
            default: 0
        },
        y: {
            type: Number,
            default: 0
        },
        id: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            drag: null,
            xLocal: this.x,
            yLocal: this.y,
        }
    },
    //====================================================================================================================
    computed: {

    },
    //====================================================================================================================
    created() {

    },
    //====================================================================================================================
    mounted: function() {
        //this.drag = new Draggable(document.querySelectorAll('.card'));

        // var elem = document.querySelector('.card');
        // this.drag = new Draggabilly( elem, {
        // // options...
        // });

        // this.drag = interact(getId());

        // this.drag.draggable({                        // make the element fire drag events
        //     origin: 'self',                   // (0, 0) will be the element's top-left
        //     inertia: true,                    // start inertial movement if thrown
        //     // modifiers: [
        //     //   interact.modifiers.restrict({
        //     //     restriction: 'self'            // keep the drag coords within the element
        //     //   })
        //     // ]
        //   }) .on('dragmove',  (event) => {  // call this listener on every dragmove
        //     this.xLocal = event.x0;
        //     this.yLocal = event.y0;
        //   })


        // this.drag = d3.drag()
        // .on("drag", function () {
        //     d3.select(this)
        //         .attr("x", d3.event.x)
        //         .attr("y", d3.event.y);
        // });

     //   this.drag(svg.selectAll(getId()));

//   .origin('self')
//   .draggable({
//   })
        
    },
    //====================================================================================================================
    beforeDestroy() {
    },
    //====================================================================================================================
    methods: {
        getId() {
            return 'card' + this.id;
        }
    }
};
