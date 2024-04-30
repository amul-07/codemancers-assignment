# Description

This minor project asseses the user authentization, authorization and Basic CRUD Operations.

## Run Locally

Clone the project

```bash
  git clone https://github.com/amul-07/codemancers-assignment.git
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```

## Environment Variables

To run this project, you will need to add the following environment variables to your config.env file

`NODE_ENV`: Sets the Node's Running Environment. ("development" | "production")

`DATABASE`: It denotes the mongodb uri used for the connection to the mongodb server.

`PORT`: It denotes the port at which the nodejs server will run.

`JWT_SECRET`: It denotes the secret string which is used for signing and verifying the jwt token.

`JWT_EXPIRES_IN`: It denotes the jwt token's expiry time in string form. (e.g- '48h' or '30d')

`JWT_COOKIE_EXPIRES_IN`: It denotes the jwt token's expiry time in number form. (e.g- 48)

`EMAIL_USERNAME`: It denotes the SMTP username.

`EMAIL_PASSWORD`: It denotes the SMTP password.

`EMAIL_HOST`: It denotes the SMTP host.

`EMAIL_PORT`: It denotes the SMTP port.

`EMAIL_SENDER_USERNAME`: It denotes the sender's email address.

`EMAIL_SENDER_NAME`: It denotes the sender's name.

## Authors

-   [@amulya-kaustubh](https://www.github.com/amul-07)
