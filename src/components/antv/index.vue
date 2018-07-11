<template>
  <div id="antv">
    <div class="antv-left antv-box">
      <div align='center' id="grap" style="width: 1600px; height: 900px; margin: auto; margin-bottom: 12px">
        <svg />
      </div>
    </div>
    <div class="antv-right antv-box">

    </div>
  </div>
</template>

<script>
import * as d3 from "d3";
import { graph } from "./index";
export default {
  data() {
    return {
      height: 1600,
      width: 900
    };
  },
  methods: {
    async getJSON() {}
  },
  mounted() {
    //选择svg画布
    var svg = d3.select("#grap");
    function createV4SelectableForceDirectedGraph(svg, graph) {
      //定义SVG的宽高
      let parentWidth = 1600;
      let parentHeight = 900;
      //SVG渲染
      var svg = d3
        .select("svg")
        .attr("width", parentWidth)
        .attr("height", parentHeight);

      // remove any previous graphs
      // 删除以前所有的G
      svg.selectAll(".g-main").remove();

      var gMain = svg.append("g").classed("g-main", true);
      //添加子画布 为全屏
      var rect = gMain
        .append("rect")
        .attr("width", parentWidth)
        .attr("height", parentHeight)
        .style("fill", "white");
      //节点和连线的g Dom
      var gDraw = gMain.append("g");
      //注册平移和缩放
      var zoom = d3.zoom().on("zoom", zoomed);
      gMain.call(zoom);

      function zoomed() {
        //给当前添加transform属性 
        gDraw.attr("transform", d3.event.transform);
      }
      //创建一个序数比例尺。 用于颜色
      var color = d3.scaleOrdinal(d3.schemeCategory20);
      //如果当前数据中没有了线 则返回
      if (!("links" in graph)) {
        console.log("Graph is missing links");
        return;
      }

      var nodes = {};
      var i;
      for (i = 0; i < graph.nodes.length; i++) {
        nodes[graph.nodes[i].id] = graph.nodes[i];
        graph.nodes[i].weight = 1.01;
      }
      // the brush needs to go before the nodes so that it doesn't
      // get called when the mouse is over a node
      var gBrushHolder = gDraw.append("g");
      var gBrush = null;
      //新建一个节点
      //把所有线条注册进去
      var link = gDraw
        .append("g")
        .attr("class", "link")
        .selectAll("line")
        .data(graph.links)
        .enter()
        .append("line")
        .attr("stroke-width", function(d) {
          return Math.sqrt(d.value);
        });
      //新建一个节点
      //把所有节点注册进去
      var node = gDraw
        .append("g")
        .attr("class", "node")
        .selectAll("circle")
        .data(graph.nodes)
        .enter()
        .append("circle")
        .attr("r", function(e) {
          //注册节点的大小
          return 20;
        })
        .attr("fill", function(d) {
          //根据当前值生成颜色
          if ("color" in d) return d.color;
          else return color(d.group);
        })
        .on("click", function(data) {
          console.log(d3.selectAll(data));
        })
        .call(
          d3
            .drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
        );

      var text = gDraw
        .append("g")
        .attr("class", "text1")
        .selectAll("text")
        .data(graph.nodes)
        .enter()
        .append("text")
        .text(function(d) {
          return d.id;
        })
        .attr("fill", "red")
        .call(
          d3
            .drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
        );

      // add titles for mouseover blurbs
      // 给添加移入显示信息
      node.append("title").text(function(d) {
        if ("name" in d) return d.name;
        else return d.id;
      });
      var attractForce = d3
        .forceManyBody()
        .strength(20)
        .distanceMax(140)
        .distanceMin(60);
      var repelForce = d3
        .forceManyBody()
        .strength(-80)
        .distanceMax(5000)
        .distanceMin(0);
      var simulation = d3
        .forceSimulation()
        // .forceManyBody()
        .force(
          // 设置力导图线条的ID 长度
          "link",
          d3
            .forceLink(5000)
            .id(function(d) {
              return d.id;
            })
            .distance(function(d) {
              //线条的长度
              return 80;
              //var dist = 20 / d.value;
              //console.log('dist:', dist);
            })
        )
        .force("manyBody", repelForce)
        .force("charge", d3.forceManyBody()) //创建多体力
        .force("center", d3.forceCenter(parentWidth / 2, parentHeight / 2)) //图的整体位置
        .force("x", d3.forceX(parentWidth / 2))
        .force("y", d3.forceY(parentHeight / 2));
      console.log(graph.nodes);
      simulation.nodes(graph.nodes).on("tick", ticked);
      simulation.force("link").links(graph.links);
      function ticked() {
        // update node and line positions at every step of
        // the force simulation
        //线条 位置
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
        node
          .attr("cx", function(d) {
            return d.x;
          })
          .attr("cy", function(d) {
            return d.y;
          });
        text
          .attr("x", function(d) {
            return d.x - d.id.length * 12 / 4;
          })
          .attr("y", function(d) {
            return d.y + (12 - 6) / 2;
          });
      }
      // 定时添加节点

      var brushMode = false;
      var brushing = false;

      var brush = d3
        .brush()
        .on("start", brushstarted)
        .on("brush", brushed)
        .on("end", brushended);

      function brushstarted() {
        // keep track of whether we're actively brushing so that we
        // don't remove the brush on keyup in the middle of a selection
        brushing = true;

        node.each(function(d) {
          d.previouslySelected = shiftKey && d.selected;
        });
      }

      rect.on("click", e => {
        //点击节点外的画布，取消所有选择
        node.each(function(d) {
          d.selected = false;
          d.previouslySelected = false;
        });
        node.classed("selected", false);
      });

      function brushed() {
        if (!d3.event.sourceEvent) return;
        if (!d3.event.selection) return;
        var extent = d3.event.selection;
        node.classed("selected", function(d) {
          return (d.selected =
            d.previouslySelected ^
            (extent[0][0] <= d.x &&
              d.x < extent[1][0] &&
              extent[0][1] <= d.y &&
              d.y < extent[1][1]));
        });
      }

      function brushended() {
        if (!d3.event.sourceEvent) return;
        if (!d3.event.selection) return;
        if (!gBrush) return;

        gBrush.call(brush.move, null);

        if (!brushMode) {
          // the shift key has been release before we ended our brushing
          gBrush.remove();
          gBrush = null;
        }

        brushing = false;
      }

      d3.select("body").on("keydown", keydown);
      d3.select("body").on("keyup", keyup);

      var shiftKey;

      function keydown() {
        shiftKey = d3.event.shiftKey;
        if (shiftKey) {
          // if we already have a brush, don't do anything
          if (gBrush) return;

          brushMode = true;

          if (!gBrush) {
            gBrush = gBrushHolder.append("g");
            gBrush.call(brush);
          }
        }
      }

      function keyup() {
        shiftKey = false;
        brushMode = false;

        if (!gBrush) return;

        if (!brushing) {
          // only remove the brush if we're not actively brushing
          // otherwise it'll be removed when the brushing ends
          gBrush.remove();
          gBrush = null;
        }
      }

      function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.9).restart();

        if (!d.selected && !shiftKey) {
          // if this node isn't selected, then we have to unselect every other node
          node.classed("selected", function(p) {
            return (p.selected = p.previouslySelected = false);
          });
        }

        d3.select(this).classed("selected", function(p) {
          d.previouslySelected = d.selected;
          return (d.selected = true);
        });

        node
          .filter(function(d) {
            return d.selected;
          })
          .each(function(d) {
            d.fx = d.x;
            d.fy = d.y;
          });
      }

      function dragged(d) {
        //d.fx = d3.event.x;
        //d.fy = d3.event.y;
        node
          .filter(function(d) {
            return d.selected;
          })
          .each(function(d) {
            d.fx += d3.event.dx;
            d.fy += d3.event.dy;
          });
      }

      function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
        node
          .filter(function(d) {
            return d.selected;
          })
          .each(function(d) {
            //d.fixed &= ~6;
            d.fx = null;
            d.fy = null;
          });
      }

      var texts = [];

      // svg
      //   .selectAll("text")
      //   .data(texts)
      //   .enter()
      //   .append("text")
      //   .attr("x", 900)
      //   .attr("y", function(d, i) {
      //     return 470 + i * 18;
      //   })
      //   .text(function(d) {
      //     return d;
      //   });

      return graph;
    }
    var num = 0;
    function add() {
      var name = graph.nodes[num].id;
      num++;
      for (let i = 0; i < 10; i++) {
        graph.nodes.push({ id: name + i, group: parseInt(Math.random() * 5) });
        graph.links.push({ source: name, target: name + i, value: 1 });
      }
    }
    var num1 = 0;
    function addArr() {
      var name = graph.nodes[num1].id;
      var nodesArr = [];
      var linksArr = [];
      for (let i = 0; i < 10; i++) {
        nodesArr.push({ id: name + i, group: parseInt(Math.random() * 5) });
        linksArr.push({ source: name, target: name + i, value: 1 });
        num1++;
      }
      return {
        nodes: nodesArr,
        links: linksArr
      };
    }

    // for (var i = 0; i < 0; i++) {
    //   add();
    // }
    /*   setInterval(x=>{ 
      add();
    },3000) */

    createV4SelectableForceDirectedGraph(svg, graph);
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
</style>

