# Build a Simple CRUD App with Spring Boot and Vue.js

This example app shows how to build a CRUD app with Spring Boot 3.0, Spring Data, Quasar, and Vue.js.

Please read [Build a Simple CRUD App with Spring Boot and Vue.js](https://developer.okta.com/blog/2022/08/19/build-crud-spring-and-vue) to see how this app was created.

**Prerequisites:**

- [Java 17](https://adoptium.net/)
- [Okta CLI](https://cli.okta.com/manual/#installation)
- [Node 16+](https://nodejs.org)

You will need a free Okta Developer account if you don't already have one. You will be able to sign up for one in the instructions below using the Okta CLI.

## Clone and Configure the Project

To install this example application, run the following commands:

```bash
git clone https://github.com/oktadev/okta-spring-boot-vue-crud-example.git spring-boot-vue
cd spring-boot-vue
```

**TIP**: If you'd like to use Auth0, check out the `auth0` branch (`git checkout auth0`) and follow the instructions in its `README.md`. 

If you do not already have a free Okta developer account, use the CLI to create one (`okta register`). Otherwise, log in (`okta login`).

Once you are registered and logged in, create a new OIDC application.

```bash
okta apps create
```

- The default name is fine.

- Select **2: Single Page App**

- The default redirect URIs are fine.

You need to put the **Issuer** and **Client ID** into two places. The first is to configure the Spring Boot API. The second configures the Vue client. Replace the bracketed values below with the values from the Okta CLI output.

`resource-server/src/main/resources/application.properties`

```properties
server.port=9000
okta.oauth2.issuer=https://<your-okta-domain>/oauth2/default
okta.oauth2.clientId=<your-client-id>
```

You'll also need to update the `.env` file in the client project.

`client/.env`

```env
VUE_APP_CLIENT_ID=<your-client-id>
VUE_APP_ISSUER_URI=<your-issuer-uri>
VUE_APP_SERVER_URI=http://localhost:9000
```

## Start the App

To start the API, open a Bash shell and navigate to the `resource-server` subdirectory.

```bash
./gradlew bootRun
```

To start the client, open another Bash shell and navigate to the `client` subdirectory.

Install the dependencies.

```bash
npm install
```

Start the client.

```bash
npm run serve
```

Open a browser to `http://localhost:8080`.

## Links

This example uses the following open source libraries from Okta:

* [Okta Spring Boot Starter](https://github.com/okta/okta-spring-boot)
* [Okta Vue SDK](https://github.com/okta/okta-vue)

## Help

Please post any questions as comments on the [blog post](https://developer.okta.com/blog/2022/08/19/build-crud-spring-and-vue), or visit our [Okta Developer Forums](https://devforum.okta.com/). 

## License

Apache 2.0, see [LICENSE](LICENSE).
