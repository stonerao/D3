<template>
  <div id="antv">
    <input type="text">
   <svg id="grap" />
  </div>
</template>

<script>
import { graph } from "../antv/index";
import * as d3 from "d3";
import render from "./index";
import { data } from "./data";
export default {
  data() {
    return {
      height: 900,
      width: 1200
    };
  },
  methods: {},
  mounted() { 
    var func = new render()
  }
};
</script>

<style lang="less"  >
.antv-box {
  position: absolute;
  bottom: 0;
  top: 0;
}
.antv-left {
  left: 0;
  right: 0;
  background: #fff;
}
.antv-right {
  right: 0;
  width: 0;
  background: #ccc;
}
#d3_selectable_force_directed_graph svg {
  border: 1px solid;
  font: 13px sans-serif;
  text-anchor: end;
}

#d3_selectable_force_directed_graph .node {
  stroke: #fff;
  stroke-width: 1.5px;
}
.nodes {
  g {
    cursor: pointer;
  }
  g:hover {
    circle {
      transition: all 0.1s;
    }
    circle {
      stroke: grey;
      transform: scale(1.1);
    }
  }
  text {
  }
}
.node .selected {
  stroke: black;
}

.link {
  stroke: #999;
}
.text1 {
  text {
    font-size: 12px;
    width: 100px;
    text-align: center;
  }
  font-size: 12px;
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

.slider-holder {
  width: 700px;
}
.ticks {
  font: 14px sans-serif;
}

.track,
.track-inset,
.track-overlay {
  stroke-linecap: round;
}

.track {
  stroke: #bbb;
  stroke-width: 10px;
}

.track-overlay {
  pointer-events: stroke;
  stroke-width: 50px;
  cursor: crosshair;
}

.sel-range {
  stroke: #9ccc65;
  stroke-width: 8px;
}

.handle {
  fill: #e0f7fa;
  stroke: #000;
  stroke-opacity: 0.5;
  stroke-width: 1.25px;
  cursor: pointer;
}
.handle:hover {
  fill: #b2ebf2;
}
.handle.active {
  fill: #4dd0e1;
}
</style>

