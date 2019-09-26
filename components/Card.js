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
    style="opacity:1;fill:#cccccc;fill-opacity:1;stroke:#000000;stroke-width:1.5151515;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1" />
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
    style="opacity:1;fill:#ffffff;fill-opacity:1;stroke:#000000;stroke-width:0.44904202;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"
    id="path4548"
    d="m 98.580322,85.898126 a 10.773434,10.773434 0 0 1 -9.225252,12.11288 10.773434,10.773434 0 0 1 -12.125054,-9.20924 10.773434,10.773434 0 0 1 9.193216,-12.13721 10.773434,10.773434 0 0 1 12.149344,9.17717" />
    
    
    <!-- Texte par dessus les icônes -->
    <text x="6" y="14" 
        font-family="VTC" 
        font-size="10">
        {{data.title}}
  </text>

  <svg x="6" y="15">       
    <image :xlink:href="getImage()" width="80" height="80" draggable="false" onmousedown="if (event.preventDefault) event.preventDefault()"/>
  </svg>

  <template v-for="(s, i) in strings">
    <text x="7" :y="115+8*i" 
            font-family="VTC" 
            font-size="10">
            {{s}}
    </text>
  </template>

  <text x="85" y="90" 
        font-family="Badaboom" 
        font-size="12">
        {{data.value}}
  </text>

  <text x="30" y="103" 
        font-family="Badaboom" 
        font-size="12">
        {{getType()}}
  </text>


</svg>
`;

function splitter(str, l){
    let strs = [];
    while(str.length > l){
        let pos = str.substring(0, l).lastIndexOf(' ');
        pos = pos <= 0 ? l : pos;
        strs.push(str.substring(0, pos));
        let i = str.indexOf(' ', pos)+1;
        if(i < pos || i > pos+l)
            i = pos;
        str = str.substring(i);
    }
    strs.push(str);
    return strs;
}

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
        },
        data: {
            type: Object,
            default: function () {
                return {
                    title: "Ceci est un titre",
                    category: "defense",
                    picture: "pit",
                    text: "Canard PC est vraiment un super journal, mieux que Mickey.",
                    value: 2
                }
            }
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
        strings: function () {
            return splitter(this.data.text, 25);
        }
    },
    //====================================================================================================================
    created() {

    },
    //====================================================================================================================
    mounted: function() {
        
    },
    //====================================================================================================================
    beforeDestroy() {
    },
    //====================================================================================================================
    methods: {
        getId() {
            return 'card' + this.id;
        },
        getImage() {
            return "images/" + this.data.picture + ".png";
        },
        getType() {
            if (this.data.category == "defense") {
                return "DEFENSE";
            } else if (this.data.category == "attack") {
                return "ATTAQUE";
            } else if (this.data.category == "bibine") {
                return "BIBINE";
            }
        }
    }
};
