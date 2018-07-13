import * as d3 from "d3";

let color = d3.scaleOrdinal(d3.schemeCategory20);
var main 
class render {
  constructor(gloal) {
    /**
     * @param gloal Object 所有参数集合对象
     * @param el 选择的svg
     * @param width svg 宽度
     * @param height svg 高度
     * @param zoom Bollean 是否开启平移缩放
     */
    let app = document.querySelectorAll(gloal.el)[0];
    if (!gloal.el || !app || app.nodeName != "svg") {
      console.error("传入节点参数名有误")
      return
    }
    //选择svg并且赋予高宽
    let [width, height] = [gloal.width || 500, gloal.height || 300]
    var svg = d3.select(gloal.el)
      .attr("width", width)
      .attr("height", height);
    //添加主体节点
    main = svg.append("g").attr("class", "main");
    if (gloal.zoom) {
      //注册缩放平移
      var zoom = d3.zoom().on("zoom", zoomed);
      svg.call(zoom);

      function zoomed() {
        //给当前添加transform属性
        main.attr("transform", d3.event.transform);
      }

    }
    //动力
    var repelForce = d3
      .forceManyBody()
      .strength(-1500)
      .distanceMax(800)
      .distanceMin(0);
    var simulation = d3
      .forceSimulation()
      .force("link", d3.forceLink().id(function (d) {
        return d.id;
      }))
      .force("manyBody", repelForce)
      .force("center", d3.forceCenter(width / 2, height / 2))
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
    //ticked event
    function ticked() {
      link
        .attr("x1", function (d) {
          return d.source.x;
        })
        .attr("y1", function (d) {
          return d.source.y;
        })
        .attr("x2", function (d) {
          return d.target.x;
        })
        .attr("y2", function (d) {
          return d.target.y;
        });

      node.attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
      });
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
var _this = this;
    function restart(data) {
      // Apply the general update pattern to the nodes.
      node = _this.node().data(data.nodes, function (d) {
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
      let size = 15;
      var newNode = allG
        .append("circle")
        .attr("r", size)
        .style("opacity", 0)
        .attr("fill", d => {
          return color(d.group);
        });

      var texts = allG
        .append("text")
        .text(function (d) {
          return d.id;
        })
        .attr("text-anchor", "middle")
        .attr("y", `6px`);
      newNode.transition(t).style("opacity", 1);
      node = allG.merge(node);

      newNode.append("title").text(function (d) {
        return d.id + " (" + d.group + ")";
      });
      // Apply the general update pattern to the links.
      link = link.data(data.links, function (d) {
        return d.source.id + "-" + d.target.id;
      });
      link.exit().remove();
      link = link
        .enter()
        .append("line")
        .attr("stroke-width", function (d) {
          return Math.sqrt(d.value);
        }).on("click", function (data) {
          console.log(data)
        })
        .merge(link);
      simulation.nodes(data.nodes);
      simulation.force("link").links(data.links);
      simulation.alpha(1).restart();
    }
    restart(gloal.data)
    this.restart(gloal.data)
  }
  restart() {

  }
  node() {
    return main.append("g").attr("class", "nodes").selectAll("circle");
  }
  link() {
    return main.append("g").attr("class", "links").selectAll("line")
  }
  color(value) {
    //颜色
    let color = d3.scaleOrdinal(d3.schemeCategory20);
    return color(value)
  }
}



export default render
