# Build a Simple CRUD App with Spring Boot and Vue.js

This example app shows how to build a CRUD app with Spring Boot 3.0, Spring Data, Quasar, and Vue.js.

Please read [Build a Simple CRUD App with Spring Boot and Vue.js](https://developer.okta.com/blog/2022/08/19/build-crud-spring-and-vue) to see how this app was created.

**Prerequisites:**

- [Java 17](https://adoptium.net/)
- [Auth0 CLI](https://github.com/auth0/auth0-cli#-installation)
- [Node 18+](https://nodejs.org)

You will need an Auth0 account if you don't already have one. Sign up for a free account at [auth0.com/signup](https://auth0.com/signup).

## Clone and Configure the Project

To install this example application, run the following commands:

```bash
git clone -b auth0 https://github.com/oktadev/okta-spring-boot-vue-crud-example.git spring-boot-vue
cd spring-boot-vue
```

Create a test Auth0 API. The Auth0 API is what exposes identity functionality for all authentication and authorization protocols, such as OpenID Connect and OAuth.

```bash
auth0 apis create -n myapi --identifier http://my-api
```

Press enter three times to accept the default values for scopes, token lifetime, and allow offline access.

Update `resource-server/src/main/resources/application.properties` with your Auth0 domain.

```properties
server.port=9000
okta.oauth2.issuer=https://<your-auth0-domain>/
okta.oauth2.audience=http://my-api
```

Create a new OIDC app on Auth0:

```bash
auth0 apps create
```

- **Name**: `vue-spring-boot`
- **Type**: Single Page Web Application
- **All the URLs**: `http://localhost:8080`

Update the `client/.env` file. Fill in the OIDC Client ID and Auth0 domain.

```env
VUE_APP_CLIENT_ID=<your-client-id>
VUE_APP_AUTH0_DOMAIN=<your-auth0-domain>
VUE_APP_AUTH0_AUDIENCE=http://my-api
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

* [Auth0 Vue SDK](https://github.com/auth0/auth0-vue)
* [Okta Spring Boot Starter](https://github.com/okta/okta-spring-boot)

## Help

Please post any questions as comments on the [blog post](https://developer.okta.com/blog/2022/08/19/build-crud-spring-and-vue), or visit our [Okta Developer Forums](https://devforum.okta.com/). 

## License

Apache 2.0, see [LICENSE](LICENSE).
