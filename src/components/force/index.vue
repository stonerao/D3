<template>
    <div id="force">
        <svg id="svg"></svg>
    </div>
</template>

<script>
import * as d3 from "d3";
import store from "./index.js";
import {
  data
} from "@/components/d3/data.js";
export default {
  mounted() {
    
    let vm = new store({
      el: "#svg",
      zoom:true,
      width:1200,
      height:800,
      data:data,
      size:14,
      label:{
        show:false
      }
    }); 
    vm._restart(data)
    var Num = 0;
     setTimeout(x => {
      for (let index = 0; index < 300; index++) {
        var radom = parseInt(Math.random() * data.nodes.length) - 1;
        data.nodes.push({
          id: index + "nodes" + Num,
          group: parseInt(Math.random() * 20)
        });
        data.links.push({
          source: data.nodes[radom < 0 ? 0 : radom],
          target: index + "nodes" + Num,
          value: 3
        });
        data.links.push({
          source: data.nodes[radom < 0 ? 0 : radom],
          target: data.nodes[radom < 0 ? 0 : radom],
          value: 3
        });
      }
       
       
     vm._restart(data)
    }, 3000);
  }
};
</script>

<style lang="less">
.track {
  stroke: #bbb;
  stroke-width: 10px;
}
.links line {
  stroke: #999;
  stroke-opacity: 0.6;
  cursor: pointer;
}

.nodes circle {
  stroke: #fff;
  stroke-width: 1.5px;
}
.nodes g text{
  cursor: pointer;
}
</style>
