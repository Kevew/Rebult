# schema.prisma
After changing `schema.prism` you will need to do the following in order for indexing to work again for PrismaClient.ts:
- run `yarn` to clear prisma cache
- run `npx prisma generate` to regenerate prisma cache
- restart vs-code to reset the typescript indexing

Additionally, to see the changes reflected in the database model, run
`npx prisma db push`

# initializing the database
Setup a mysql database
`mysql CREATE DATABASE rebult`
Then in the .env set
`DATABASE_URL`
To configure the database
`npx prisma db push`


# .env template
```
DATABASE_URL=
NEXTAUTH_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

REDIS_URL=
REDIS_SECRET=
```