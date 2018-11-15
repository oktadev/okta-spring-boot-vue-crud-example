<template>
  <div id="app">
    <router-view :activeUser="activeUser"/>
    <footer class="info">
      <p v-if="activeUser" class="logout-link"><a @click="handleLogout" href="#">Logout</a></p>
      <p>Based on a project written by <a href="http://evanyou.me">Evan You</a></p>
      <p>Original Vue TodoApp project is <a href="https://vuejs.org/v2/examples/todomvc.html">here</a></p>
      <p>Modified for this tutorial by Andrew Hughes</p>
    </footer>
  </div>
</template>

<script>

  // app Vue instance
  const app = {

    name: 'app',

    // app initial state
    data: () => {
      return {
        activeUser: null
      }
    },

    async created () {
      await this.refreshActiveUser()
    },

    watch: {
      '$route': 'refreshActiveUser'
    },

    methods: {
      async refreshActiveUser () {
        this.activeUser = await this.$auth.getUser()
        this.$log.debug('activeUser',this.activeUser)
      },

      async handleLogout () {
        await this.$auth.logout()
        await this.refreshActiveUser()
        this.$router.go('/')
      }
    },

  }

  export default app

</script>

<style>

  [v-cloak] { display: none; }

</style>
