<template>
  <div class="hello">
    <router-link to="/test">jump</router-link>
    <img v-webp="{image:'https://grewer.github.io/dataSave/back.jpg',
      webp:'https://grewer.github.io/dataSave/back.webp'}">
    <img alt=""
         v-webp="{image:'https://grewer.github.io/dataSave/hero.jpg',
         webp:'https://grewer.github.io/dataSave/hero.webp'}">
    <img alt="" style="position: absolute;top: 2000px;left: 100px;"
         v-webp="{image:'https://grewer.github.io/dataSave/s.jpg',
         webp:'https://grewer.github.io/dataSave/s.webp'}">
  </div>
</template>

<script>
    export default {
        name: 'HelloWorld',
        data() {
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
