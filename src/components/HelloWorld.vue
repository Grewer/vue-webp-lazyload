<template>
  <div class="hello">
    <img v-webp="'https://grewer.github.io/dataSave/back.jpg'" >
    <img v-webp="'https://grewer.github.io/dataSave/hero.jpg'" alt="">
    <img v-webp="'https://grewer.github.io/dataSave/monster.jpg'" alt="" style="position: absolute;top: 2000px;left: 0">
    <img v-webp="'https://grewer.github.io/dataSave/s.jpg'" alt="" style="position: absolute;top: 2000px;left: 100px;">
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
