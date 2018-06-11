<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
 svg path:nth-child(2) {
   animation: svg-load 1s linear infinite;
   -webkit-animation: svg-load 1s linear infinite;
   -moz-animation: svg-load 1s linear infinite;
   -o-animation: svg-load 1s linear infinite;
 }
@keyframes svg-load {
  from {
    transform: rotate(0);
    transform-origin: 20px 20px;
  }
  to {
    transform: rotate(360deg);
    transform-origin: 20px 20px;
  }
}
</style>
