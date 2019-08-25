let canvas_layer_template = /*template*/`
<canvas id="maincanvas" width="1920" height="1080"/>
`;

CanvasLayer = {
    name: 'canvas-layer',
    template: canvas_layer_template,
    data() {
      return {
            ctx: null,
            intervalID: null
        }
    },
    methods: {
        stopRain() {
            clearInterval(this.intervalID);
            this.ctx.clearRect(0, 0, 1920, 1080);
        },
        startRain() {
            this.intervalID = renderRain(this.ctx);
        }
    },
    mounted() {
        let canvas = document.getElementById('maincanvas');
        this.ctx =  canvas.getContext("2d");
    }
  };