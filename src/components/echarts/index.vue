<template>
  <div>
    <div id="canvas" style="height:200px;width:500px;"></div>
    <img :src="src" alt="">
  </div>
</template>

<script>
import echarts from "echarts";
import { JSON_OBJECT } from "./index";
import { datas } from "./data";
export default {
  data() {
    return {
      myChart: null,
      src: ""
    };
  },
  mounted() {
    this.load();
  },
  methods: {
    async GET_JSON() {
      let num = JSON_OBJECT.nodes.length;
      let arr = [];
      let links = [];
      for (let i = 0; i < 10; i++) {
        let id = i + num.toString();
        arr.push({
          id: id,
          name: "Napoleon",
          itemStyle: {
            normal: {
              color: "rgb(236,81,72)"
            }
          },
          symbolSize: 1,
          attributes: {
            modularity_class: 0
          }
        });
        links.push({
          id: id + "0",
          name: null,
          source: id,
          target: parseInt(Math.random() * 77),
          lineStyle: {
            normal: {}
          }
        });
      }
      JSON_OBJECT.nodes.push(...arr);
      JSON_OBJECT.links.push(...links);
      console.log(JSON_OBJECT);
      return datas;
    },
    load() {
      let canvas = document.getElementById("canvas");
      var myChart = echarts.init(canvas);
      this.myChart = myChart;
      this.GET_JSON().then(webkitDep => {
        var option = {
          legend: {
            data: ["HTMLElement", "WebGL", "SVG", "CSS", "Other"]
          },
          animation: false,
          animationThreshold: 0,
          series: [
            {
              type: "graph",
              layout: "force",
              animation: false,
              label: {
                normal: {
                  position: "right",
                  formatter: "{b}"
                }
              },
              draggable: true,
              data: webkitDep.nodes.map(function(node, idx) {
                node.id = idx;
                return node;
              }),
              categories: webkitDep.categories,
              force: {
                edgeLength: 5,
                repulsion: 20,
                gravity: 0.2
              },
              edges: webkitDep.links
            }
          ]
        };

        myChart.setOption({
          xAxis: {
            type: "category",
            data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
          },
          yAxis: {
            type: "value"
          },
          series: [
            {
              animation: false,
              data: [820, 932, 901, 934, 1290, 1330, 1320],
              type: "line",
              animationDelay: function(idx) {
                return 0;
              }
            }
          ]
        });

        setTimeout(x => {
          this.src = this.myChart.getConnectedDataURL();
        });
      });
    },
    destroyed() {
      this.myChart.clear();
    }
  }
};
</script>

<style>
</style>
