# API Endpoints

<!-- TODO - Manually add the responses for each endpoint. Explain each endpoint  -->

## User

### Add User

**Method:** `POST`

**URL:** `localhost:5550/api/users`

**Body:**

```json
{
  "username": "Spongebob",
  "displayName": "SpongeBob Squarepants",
  "email": "sbsp@example.com",
  "password": "password"
}
```

### All Users

**Method:** `GET`

**URL:** `localhost:5550/api/users`

**Bearer Token:**

```json
{{sessionToken}}
```

### User Profile

**Method:** `GET`

**URL:** `localhost:5550/api/users/profile/`

**Bearer Token:**

```json
{{sessionToken}}
```

### Update User

**Method:** `PUT`

**URL:** `localhost:5550/api/users/profile`

**Body:**

```json
{
  "displayName": "Adam",
  "password": "password"
}
```

**Bearer Token:**

```json
{{sessionToken}}
```

### Delete user by id

**Method:** `DELETE`

**URL:** `localhost:5550/api/users/profile`

**Bearer Token:**

```json
{{sessionToken}}
```

### Login User

**Method:** `POST`

**URL:** `localhost:5550/api/users/login`

**Body:**

```json
{
  "email": "sbsp@example.com",
  "password": "password"
}
```

### Unfollow User

**Method:** `GET`

**URL:** `localhost:5550/api/users/63f11676bfb8f272cc4904f0/unfollow`

**Bearer Token:**

```json
{{sessionToken}}
```

### Follow User

**Method:** `GET`

**URL:** `localhost:5550/api/users/63f11676bfb8f272cc4904f0/follow`

**Bearer Token:**

```json
{{sessionToken}}
```

## Healthcheck

### GET - HEALTHCHECK

**Method:** `GET`

**URL:** `localhost:5550/healthcheck`
