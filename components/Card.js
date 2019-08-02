let card_template = /*template*/`
<svg
    version="1.1"
    viewBox="0 0 100 153"
    height="306"
    width="200"
    :id="getId()"
    :x="xLocal" :y="yLocal"
    style="cursor: pointer;">

  <g
     transform="matrix(3.7795276,0,0,3.7795276,1450.4612,47.810953)"
     id="layer1">
    <g
       style="fill:#fffffd;fill-opacity:1"
       id="g850">
      <rect
         style="opacity:1;fill:#cccccc;fill-opacity:1;stroke:#000000;stroke-width:0.40088382;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"
         id="rect815"
         width="26.057449"
         height="40.088383"
         x="-383.56741"
         y="-12.449539"
         ry="1.2857285" />
      <rect
         style="opacity:1;fill:#fffffd;fill-opacity:1;stroke:#000000;stroke-width:0.25827864;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"
         id="rect815-3"
         width="23.55422"
         height="18.408638"
         x="-382.3158"
         y="-11.459431"
         ry="0.59040821" />
      <rect
         style="opacity:1;fill:#fffffd;fill-opacity:1;stroke:#000000;stroke-width:0.25503752;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"
         id="rect815-3-1"
         width="23.561262"
         height="17.944155"
         x="-382.31931"
         y="8.1318092"
         ry="0.57551122" />
    </g>
  </g>
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
