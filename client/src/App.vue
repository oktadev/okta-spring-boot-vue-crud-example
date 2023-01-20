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
        {{ isAuthenticated ? user.email : "" }}
        <q-btn flat round dense icon="logout" v-if='isAuthenticated' @click="logout"/>
        <q-btn flat round dense icon="account_circle" v-else @click="login"/>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view></router-view>
    </q-page-container>

  </q-layout>
</template>

<script>

import { useAuth0 } from '@auth0/auth0-vue';

export default {
  setup() {

    const { loginWithRedirect, user, isAuthenticated, logout } = useAuth0();

    return {
      login: () => {
        loginWithRedirect();
      },
      logout: () => {
        logout({ returnTo: window.location.origin });
      },
      user,
      isAuthenticated
    };
  }
}
</script>
