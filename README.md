This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## User table set up

1. Add public.user.id foreign key relation to the auth.user.id

   - public.requests.organisation_id to public.organisations.id
   - public.requests.user_id to public.user.id

   - Organisation ID default value - gen_random_uuid()

2. Database -> Functions -> Create new
   Name: create_user_map
   Schema: public
   Return: trigger
   Definition:

   ```sql
   begin
       insert into public.users(id, email)
       values(new.id, new.email);

       return new;
   end;
   ```

   Advanced Settings: Security Definer

3. Go to Sql editor
   ```sql
       create trigger "create_user_map_trigger"
       after insert on auth.users
       for each row
       execute function create_user_map();
   ```

Note: In case we want to drop the trigger

    ```sql
        drop trigger "create_user_map_trigger" on auth.users;
    ```
