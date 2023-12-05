# Link Sharing Backend API

## Frameworks and libraries used

- [Express](https://expressjs.com/) (for server)
- [Mongoose](https://mongoosejs.com/) (for MongoDB)
- [cors](https://www.npmjs.com/package/cors) (for cross origin requests)
- [dotenv](https://www.npmjs.com/package/dotenv) (for environment variables)
- [nodemon](https://www.npmjs.com/package/nodemon) (for development)
- [bcrypt](https://www.npmjs.com/package/bcrypt) (for hashing passwords)

## Install dependencies

```bash
pnpm install
```

## Run development server

```bash
pnpm run dev
```

## Run production server

```bash
pnpm start
```

## Environment variables

- `PORT` (default: 3333)
- `MONGO_URI` (default: mongodb://localhost:27017/link-sharing)

_Check `.env.example` for more details_

## API Endpoints

[API Docs](https://documenter.getpostman.com/view/8970478/2s9YeLZqBV)

## Folder Structure

```
.
├── src
│   ├── server.js (entry point)
│   ├── validation.utils.js (collection of validation functions)
│   ├── routes (all routes)
│   │   ├── auth.routes.js (auth routes)
│   │   ├── users.routes.js (user routes)
|   ├── models (all models and db)
│   ├── services (all services)
```
