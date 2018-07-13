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
      data:data
    }); 
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
</style>
