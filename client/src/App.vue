<template>
  <div id="app">
    <Todos />
    <footer class="info">
      <p>Based on a project written by <a href="http://evanyou.me">Evan You</a></p>
      <p>Original Vue TodoApp project is <a href="https://vuejs.org/v2/examples/todomvc.html">here</a></p>
      <p>Modified for this tutorial by Andrew Hughes</p>
    </footer>
  </div>
</template>

<script>

  import Todos from './components/Todos'

  // app Vue instance
  const app = {

    name: 'app',

    components: {
      Todos
    },

    // app initial state
    data: () => {
      return {
      }
    }

  }

  export default app

</script>

<style>

  [v-cloak] { display: none; }


</style>
