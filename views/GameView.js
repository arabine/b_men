var real_view_template = /*template*/`
<div id="airport-container" class="responsive-container airport-bg">


<svg class="viewArea svg-content" id="svgmain">
    <defs>
    </defs>

    <!-- Ici c'est l'image de la piste -->
    <g id="background" class="viewArea" transform="translate(0,0)">
    </g>

    <!-- Ici on stocke les feux -->
    <g id="svgroot" ref="icons">
        <template v-for="light in lights">
          <LightIcon 
          :type="light.type" 
          :layers="getLayers(light.type)" 
          :x="light.x" 
          :y="light.y" 
          :id="light.id"
          :enableSelect="true"
          :size="getSize(light.type)"
          :group="light.group"></LightIcon>
        </template>

    </g>

  </svg>

<!-- ==========================  VUE REELLE  ========================== -->   

<button id="zoom-center" class="md-btn md-btn-raised col-gray" style="z-index:200;position:absolute;bottom:120px;right:10px;" ><i class="fas fa-lg fa-crosshairs" /></button>
<button id="zoom-in" class="md-btn md-btn-raised col-gray" style="z-index:200;position:absolute;bottom:60px;right:10px;" ><i class="fas fa-lg fa-plus" /></button>
<button id="zoom-out" class="md-btn md-btn-raised col-gray" style="z-index:200;position:absolute;bottom:20px;right:10px;" ><i class="fas fa-lg fa-minus" /></button>

</div>
`;


/* Return a transform for center a bounding box in the browser viewport
    - w and h are the witdh and height of the container
    - center cointains the coordinates of the bounding box center
    - side_lengths is an array containing the length of the bounding box sides
    - margin defines the margin of the bounding box once zoomed
  */

to_bounding_box = function(W, H, center, w, h, margin)
{
  /*
  var k, kh, kw, x, y;
  kw = (W - margin) / w;
  kh = (H - margin) / h;
  k = d3.min([kw, kh]);
  x = W / 2 - center.x * k;
  y = H / 2 - center.y * k;*/
  return d3.zoomIdentity.translate(center.x, center.y).scale(0.2);
};

RealView = {
  name: 'real-view',
  template: real_view_template,
  components: { LightIcon },
  //====================================================================================================================
  data: function() {
    return {
      view: {
        w: 0,
        h: 0,
      },
      airport: {
        w: 0,
        h: 0,
      },
      zoom: null
    }
  },
  //====================================================================================================================
  computed: {
    ...Vuex.mapState({
      lights : state => state.lights,
      groups : state => state.groups,
    })
  },
  activated() {
    console.log('Component RealView activated');
    this.handleResize();
  },
  //====================================================================================================================
  created() {
    console.log('Created view RealView');
  },
  //====================================================================================================================
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
  },
  //====================================================================================================================
  mounted: function() {
    console.log('Mounted view RealView');
    
    this.createCentralMap();
    window.addEventListener('resize', this.onResize);
    
  },
  //====================================================================================================================
  methods : {
    
    getLayers(type) {
      let layers = [];
        for (let i = 0; i < Api.config.types.length; i++) {
          if (type == Api.config.types[i].name) {
            layers = Api.config.types[i].layers;
            break;
          }
        }
        return layers;
    },
    //====================================================================================================================
    getSize(type) {
      let size = 10; // default size
      for (let i = 0; i < Api.config.types.length; i++) {
        if (type == Api.config.types[i].name) {
          size = Api.config.types[i].size_real;
          break;
        }
      }
      return size;
  },
    //====================================================================================================================
    onResize: function() {
      this.handleResize();
    },
    //====================================================================================================================
    fitByHeight: function(ratio)
    {
        let airportNewWidth = 0;
        let airportNewHeight = 0;
        let offsetX = 0;

        airportNewHeight = this.view.h;

        airportNewWidth = airportNewHeight * ratio;
        offsetX = (this.view.w - airportNewWidth) / 2;


        return {
          w:airportNewWidth,
          h:airportNewHeight,
          x:offsetX,
          y:0,
        }
    },
    //====================================================================================================================
    fitByWidth: function(ratio)
    {
      let airportNewWidth = 0;
      let airportNewHeight = 0;
      let offsetY = 0;
  
      airportNewWidth = this.view.w;
  
      airportNewHeight = airportNewWidth / ratio;
      offsetY = (this.view.h - airportNewHeight) / 2;
  
      return {
        w:airportNewWidth,
        h:airportNewHeight,
        x:0,
        y:offsetY,
      }
    },
  //==============================================================================================
    computeAirportSize: function(boxSize)
    {
      let ratio = boxSize.w / boxSize.h;
  
      // Show the airport with some margins (10% each side)
      let sizeByHeight = this.fitByHeight(ratio);
      let sizeByWidth = this.fitByWidth(ratio);
  
      if ((sizeByWidth.w <= this.view.w) && (sizeByWidth.h <= this.view.h))
      {
        console.log("Fit width");
        return sizeByWidth;
      }
      else
      {
        return sizeByHeight;
      }
  
    },
  //==============================================================================================
    computeContainerSize: function()
    {
      // create svg root node
      let central_area = d3.select('#airport-container');
  
      var size = central_area.node().getBoundingClientRect();
      this.view.w = size.width;
      this.view.h = size.height;
      // console.log("Canvas width: " + this.view.w);
      // console.log("Canvas height: " + this.view.h);
    },
  //==============================================================================================
    handleResize: function()
    {
      this.computeContainerSize();
  
      let real_new = this.computeAirportSize(this.airport);
      // Resize airport
      d3.select('#airport-svg')
        .attr("x", real_new.x)
        .attr("y", real_new.y)
        .attr("width", real_new.w)
        .attr("height", real_new.h);

      // Resize all views
      d3.selectAll('.viewArea')
        .attr("width", this.view.w)
        .attr("height", this.view.h);
  
    },
    //======================================================================================================================
    loadAirport: function(xml)
    {
        var svg = d3.select('#background');
        svg.node().appendChild(document.importNode(xml.documentElement, true));
  
        var svgImage  = svg.select('svg');
        svgImage.attr('id', 'airport-svg');
  
        // Save locally the airport box size
        var size = svgImage.node().getBBox();
        this.airport.w = size.width;
        this.airport.h = size.height;

        var content = this.$refs.icons;
        content.parentNode.removeChild(content);
        svgImage.node().appendChild(content);
  
        // console.log("Airport Width: " + this.airport.w);
        // console.log("Airport Height: " + this.airport.h);
    },
    //====================================================================================================================
    createDef: function(xml, id_name)
    {
      var g = d3.select('#svgmain defs');
      var node = document.importNode(xml.documentElement, true);
      d3.select(node).attr("id", id_name);
      g.node().appendChild(node);
    },
    //====================================================================================================================
    createCentralMap: function()
    {
      let svg = d3.select("#svgmain");
      let container = d3.select("#svgroot");

  
      //add zoom capabilities
      this.zoom = d3.zoom()
      .scaleExtent([1, 20])
      .on("zoom", () => {

        // the "zoom" event populates d3.event with an object that has
        // a "translate" property (a 2-element Array in the form [x, y])
        // and a numeric "scale" property

        // now, constrain the x and y components of the translation by the
        // dimensions of the viewport
        tx = Math.min(0, Math.max(d3.event.transform.x, this.view.w - this.view.w * d3.event.transform.k)),
        ty = Math.min(0, Math.max(d3.event.transform.y, this.view.h - this.view.h * d3.event.transform.k));
        // then, update the zoom behavior's internal translation, so that
        // it knows how to properly manipulate it on the next movement
        d3.zoomIdentity.translate(tx, ty);
        // and finally, update the <g> element's transform attribute with the
        // correct translation and scale (in reverse order)
        container.attr("transform", [
          "translate(" + [tx, ty] + ")",
          "scale(" + d3.event.transform.k + ")"
        ].join(" "));

      });
  
      svg.call(this.zoom);

      let zoomIn = d3.select("#zoom-in");
      let zoomOut = d3.select("#zoom-out");
      let zoomCenter = d3.select("#zoom-center");

      zoomIn.on("click", () => {
        this.zoom.scaleBy(svg.transition().duration(750), 2);
      })

      zoomOut.on("click", () => {
        this.zoom.scaleBy(svg.transition().duration(750), 0.5);
      })

      zoomCenter.on("click", () => {
        this.zoom.scaleBy(svg.transition().duration(750), -2);
      })

      let filesToLoad = [
        d3.xml('./images/airport_real.svg')
      ]

      let imageNames = [];

      for (let i = 0; i < Api.config.images.length; i++) {
        filesToLoad.push(d3.xml('images/' + Api.config.images[i][1]));
        imageNames.push(Api.config.images[i][0]);
      }
  
      // We must wait for all data to be fetched before compute various sizes
      Promise.all(filesToLoad).then((list) =>
      {
        // First element is the real background map file
        this.loadAirport(list[0]);

        // All other elements are lights
        for (let i = 1; i < list.length; i++) {
          this.createDef(list[i], imageNames[i-1]);
        }
        
         this.handleResize();

      })
      .catch(function(error) {
        console.log("Promise get files error: " + error);
      });
    },
  }
  // END OF METHODS

}
