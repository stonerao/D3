<template>
  <div id="app">
    <router-view id="app-box" />
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style lang="less">
@import url("./styles/reset.less");

#app-box,
#app,
html,
body {
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  top: 0;
  min-width: 1400px;
  min-width: 800px;
}
</style>

