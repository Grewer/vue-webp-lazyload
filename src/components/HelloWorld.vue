<template>
  <div class="hello">
    <img src="https://grewer.github.io/JsDemo/game/images/back.jpg" alt="">
    <img src="https://grewer.github.io/JsDemo/game/images/hero.jpg" alt="">
    <img src="https://grewer.github.io/JsDemo/game/images/monster.jpg" alt="" style="position: absolute;top: 1000px;left: 0">
    <img src="https://grewer.github.io/dataSave/table-scroll.gif" alt="" style="position: absolute;top: 1000px;left: 100px;">
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
