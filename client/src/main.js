import { createApp } from 'vue'
import App from './App.vue'
import { Quasar } from 'quasar'
import quasarUserOptions from './quasar-user-options'
import VueLogger from 'vuejs3-logger'
import router from './router'
import createApi from './Api'

import { createAuth0 } from '@auth0/auth0-vue';

const options = {
  isEnabled: true,
  logLevel: 'debug',
  stringifyArguments: false,
  showLogLevel: true,
  showMethodName: false,
  separator: '|',
  showConsoleColors: true
};

const app = createApp(App)
  .use(Quasar, quasarUserOptions)
  .use(VueLogger, options)
  .use(router)
  .use(createAuth0({
      domain: process.env.VUE_APP_AUTH0_DOMAIN,
      clientId: process.env.VUE_APP_CLIENT_ID,
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: process.env.VUE_APP_AUTH0_AUDIENCE
      }
    })
  );

// pass auth0 to the api (to get a JWT), which is set as a global property
app.config.globalProperties.$api = createApi(app.config.globalProperties.$auth0)

app.mount('#app')
