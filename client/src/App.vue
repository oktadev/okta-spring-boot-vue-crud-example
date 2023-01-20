<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <q-icon name="kayaking" size="30px"></q-icon>
          </q-avatar>
          Todo App
        </q-toolbar-title>
        {{ this.claims && this.claims.email ? claims.email : '' }}
        <q-btn flat round dense icon="logout" v-if='authState && authState.isAuthenticated' @click="logout"/>
        <q-btn flat round dense icon="account_circle" v-else @click="login"/>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view></router-view>
    </q-page-container>

  </q-layout>
</template>

<script>
export default {
  name: 'LayoutDefault',
  data: function () {
    return {
      claims: null
    }
  },
  watch: {
    'authState.isAuthenticated'() {
      this.$log.debug(('watch triggered!'))
      this.updateClaims()
    }
  },
  created() {
    this.updateClaims()
  },
  methods: {
    async updateClaims() {
      if (this.authState && this.authState.isAuthenticated) {
        this.claims = await this.$auth.getUser()
      }
    },
    async login() {
      await this.$auth.signInWithRedirect({ originalUri: '/todos' })
    },
    async logout() {
      await this.$auth.signOut()
    }
  },
}
</script>
