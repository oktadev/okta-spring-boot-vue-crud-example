<template>
  <div class="column justify-center items-center" id="row-container">
    <q-card class="my-card">
      <q-card-section style="text-align: center">
        <div v-if='isAuthenticated'>
          <h6>You are logged in as {{ user.email }}</h6>
          <q-btn flat color="primary" @click="todo">Go to Todo app</q-btn>
          <q-btn flat @click="logout">Log out</q-btn>
        </div>
        <div v-else>
          <h6>Please <a href="#" @click.prevent="login">log in</a> to access Todo app</h6>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>

import { useAuth0 } from '@auth0/auth0-vue';
import { useRouter } from 'vue-router'

export default {
  name: 'HomeComponent',
  setup() {

    const { loginWithRedirect, user, isAuthenticated, logout } = useAuth0();
    const router = useRouter()

    return {
      login: () => {
        loginWithRedirect();
      },
      logout: () => {
        logout({ logoutParams: { returnTo: window.location.origin } });
      },
      todo() {
        router.push('/todos')
      },
      user,
      isAuthenticated
    };
  }
}
</script>
