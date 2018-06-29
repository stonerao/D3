<template>
    <div>
        <div id="canvas" style="height:100%;width:100%"></div>
    </div>
</template>

<script>
import echarts from "echarts";
import { JSON_OBJECT } from "./index";
export default {
data(){
    return{
        myChart:null
    }
},
  mounted() {
    this.load();
  },
  methods: {
    async GET_JSON() {
      let num = JSON_OBJECT.nodes.length;
      let arr = [];
      let links = [];
      for (let i = 0; i < 100; i++) {
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
          x: -418.08344,
          y: 446.8853,
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
      console.log(JSON_OBJECT)
      return JSON_OBJECT;
    },
    load() {
      console.log(JSON_OBJECT);
      let canvas = document.getElementById("canvas");
      var myChart = echarts.init(canvas);
      this.myChart = myChart
      this.GET_JSON().then(graph => {
        var categories = [];
        for (var i = 0; i < 9; i++) {
          categories[i] = {
            name: "类目" + i
          };
        }
        graph.nodes.forEach(function(node) {
          node.itemStyle = null;
          node.symbolSize = 10;
          node.value = node.symbolSize;
          node.category = node.attributes.modularity_class;
          // Use random x, y
          node.x = node.y = null;
          node.draggable = true;
        });
        var option = {
          title: {
            text: "Les Miserables",
            subtext: "Default layout",
            top: "bottom",
            left: "right"
          },
          tooltip: {},
          legend: [
            {
              // selectedMode: 'single',
              data: categories.map(function(a) {
                return a.name;
              })
            }
          ],
          animation: false,
          series: [
            {
              name: "Les Miserables",
              type: "graph",
              layout: "force",
              data: graph.nodes,
              links: graph.links,
              categories: categories,
              roam: true,
              label: {
                normal: {
                  position: "right"
                }
              },
              force: {
                repulsion: 150
              }
            }
          ]
        };

        myChart.setOption(option);
      });
    },
    destroyed () {
        this.myChart.clear()
    }
  }
};
</script>

<style>
</style>
