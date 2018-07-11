<template>
  <div id="antv">
    <p>
      <span>11</span>
    </p>
    <div class="antv-left antv-box">
      <div align='center'>
        <svg id="grap" />
      </div>
    </div>
    <div class="antv-right antv-box">

    </div>
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
    var color = d3.scaleOrdinal(d3.schemeCategory20);
    var dom = document.querySelectorAll(".antv-left")[0]
    
    var svg = d3.select("#grap"),
      width = +svg.attr("width", dom.offsetWidth-10),
      height = +svg.attr("height", dom.offsetHeight-10);

    var main = svg.append("g").attr("class", "main");
    var zoom = d3.zoom().on("zoom", zoomed);
    svg.call(zoom);
    function zoomed() {
      //给当前添加transform属性
      main.attr("transform", d3.event.transform);
    }
    var repelForce = d3
      .forceManyBody()
      .strength(-1500)
      .distanceMax(800) 
       .distanceMin(0);
    var simulation = d3
      .forceSimulation()
      .force(
        "link",
        d3.forceLink().id(function(d) {
          return d.id;
        })
      )
      .force("manyBody", repelForce)
      .force("center", d3.forceCenter(1400 / 2, 800 / 2))
      .on("tick", ticked);

    var link = main
      .append("g")
      .attr("class", "links")
      .selectAll("line")

    var node = main
      .append("g")
      .attr("class", "nodes")
      .selectAll("circle");
    var t = d3
      .transition()
      .duration(50)
      .ease(d3.easeLinear);

    /* --------------- */

    function ticked() {
      link
        .attr("x1", function(d) {
          return d.source.x;
        })
        .attr("y1", function(d) {
          return d.source.y;
        })
        .attr("x2", function(d) {
          return d.target.x;
        })
        .attr("y2", function(d) {
          return d.target.y;
        });

      node.attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      });
    }
    function restart(data) {
      // Apply the general update pattern to the nodes.
      node = node.data(data.nodes, function(d) {
        return d.id;
      });
      node.exit().remove();
      let allG = node
        .enter()
        .append("g")
        .call(
          d3
            .drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
        );
      /*  var newNode = node
        .enter()
        .append("g")
        .append("circle")
        .attr("r", 7)
        .style("opacity", 0)
        .attr("fill", function(d) {
          return color(d.group);
        })
        .call(
          d3
            .drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
        ); */
      let size = 30;
      var newNode = allG
        .append("circle")
        .attr("r", size)
        .style("opacity", 0)
        .attr("fill", function(d) {
          return color(d.group);
        });

      var texts = allG
        .append("text")
        .text(function(d) {
          return d.id;
        })
        .attr("text-anchor", "middle")
        .attr("y", `6px`);
      newNode.transition(t).style("opacity", 1);

      node = allG.merge(node);

      newNode.append("title").text(function(d) {
        return d.id + " (" + d.group + ")";
      });
      // Apply the general update pattern to the links.
      link = link.data(data.links, function(d) {
        return d.source.id + "-" + d.target.id;
      });
      link.exit().remove();
      link = link
        .enter()
        .append("line")
        .attr("stroke-width", function(d) {
          return Math.sqrt(d.value);
        }).on("click",function(data){
        console.log(data)
      })
        .merge(link);
      simulation.nodes(data.nodes);
      simulation.force("link").links(data.links);
      simulation.alpha(1).restart();
    }
    function dragstarted(d) {
      if (!d3.event.active) {
        simulation.alphaTarget(0.2).restart();
      }
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) {
        simulation.alphaTarget(0);
      }
      d.fx = null;
      d.fy = null;
    }

    restart(data);
    var Num = 0;
    setTimeout(x => {
      for (let index = 0; index < 1000; index++) {
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
      }
      data.links.push({
        source: data.nodes[data.nodes.length - 1],
        target: data.nodes[parseInt(Math.random() * data.nodes.length - 2)],
        value: 1
      });
      restart(data);
    }, 3000);
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

