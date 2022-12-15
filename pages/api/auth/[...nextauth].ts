import type { NextAuthOptions } from 'next-auth'
import NextAuth, { Account, Profile, User } from 'next-auth'
import { AdapterUser } from 'next-auth/adapters'
// import Providers from "next-auth/providers"
import DiscordProvider from 'next-auth/providers/discord'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'

import { BASE_URL } from '@/config/constants'
import { fetcher } from '@/lib/fetcher'

//import clientPromise from '../../../lib/mongodb'

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
interface IProps {
   user: User | AdapterUser
   account: Account
   profile: Profile
}
export const authOptions: NextAuthOptions = {
   // https://next-auth.js.org/configuration/providers

   // Database optional. MySQL, Maria DB, Postgres and MongoDB are supported.

   providers: [
      GithubProvider({
         clientId: process.env.GITHUB_ID,
         clientSecret: process.env.GITHUB_SECRET,
      }),
      GoogleProvider({
         clientId: process.env.GOOGLE_ID,
         clientSecret: process.env.GOOGLE_SECRET,
         httpOptions: {
            timeout: 40000,
         },
      }),
      DiscordProvider({
         clientId: process.env.DISCORD_ID,
         clientSecret: process.env.DISCORD_SECRET,
      }),
      // ...add more providers here
   ],
   //
   // Notes:
   // * You must install an appropriate node_module for your database
   // * The Email provider requires a database (OAuth providers do not)
   // database: process.env.DATABASE_URL,

   // The secret should be set to a reasonably long random string.
   // It is used to sign cookies and to sign and encrypt JSON Web Tokens, unless
   // a separate secret is defined explicitly for encrypting the JWT.
   secret: 'asjdlfwerjwklerj',

   session: {
      // Use JSON Web Tokens for session instead of database sessions.
      // This option can be used with or without a database for users/accounts.
      // Note: `jwt` is automatically set to `true` if no database is specified.
      // jwt: true,
      // Seconds - How long until an idle session expires and is no longer valid.
      // maxAge: 30 * 24 * 60 * 60, // 30 days
      // Seconds - Throttle how frequently to write to database to extend a session.
      // Use it to limit write operations. Set to 0 to always update the database.
      // Note: This option is ignored if using JSON Web Tokens
      // updateAge: 24 * 60 * 60, // 24 hours
   },

   // JSON Web tokens are only used for sessions if the `jwt: true` session
   // option is set - or by default if no database is specified.
   // https://next-auth.js.org/configuration/options#jwt
   jwt: {
      // A secret to use for key generation (you should set this explicitly)
      // secret: 'INp8IvdIyeMcoGAgFGoA61DdBglwwSqnXJZkgz8PSnw',
      // Set to true to use encryption (default: false)
      // encryption: true,
      // You can define your own encode/decode functions for signing and encryption
      // if you want to override the default behaviour.
      // encode: async ({ secret, token, maxAge }) => {},
      // decode: async ({ secret, token, maxAge }) => {},
   },

   // You can define custom pages to override the built-in ones. These will be regular Next.js pages
   // so ensure that they are placed outside of the '/api' folder, e.g. signIn: '/auth/mycustom-signin'
   // The routes shown here are the default URLs that will be used when a custom
   // pages is not specified for that route.
   // https://next-auth.js.org/configuration/pages
   pages: {
      //signIn: '/auth/signIn',  // Displays signin buttons
      // signOut: '/auth/signout', // Displays form with sign out button
      // error: '/auth/error', // Error code passed in query string as ?error=
      // verifyRequest: '/auth/verify-request', // Used for check email page
      // newUser: '/session', // If set, new users will be directed here on first sign in
   },

   // Callbacks are asynchronous functions you can use to control what happens
   // when an action is performed.
   // https://next-auth.js.org/configuration/callbacks
   callbacks: {
      async signIn({
         user,
         account,
         profile,
      }: IProps): Promise<string | boolean> {
         console.log('signIn')
         if (user) {
            console.log('next_auth', user)
            const response = await fetcher(`${BASE_URL.SERVER}/api/users`, {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({
                  email: user.email,
                  name: user.name,
               }),
            })
            console.log(response)
         }
         return true
      },
      // async redirect(url, baseUrl) {
      //     console.log("redirect", url, baseUrl);
      //     return baseUrl
      // },
      // async session(session, user) { return session },
      // async jwt(token, user, account, profile, isNewUser) { return token }
   },

   // Events are useful for logging
   // https://next-auth.js.org/configuration/events
   events: {
      async signIn(messages) {
         console.log('Sign In', messages)
      },
      async signOut(messages) {
         console.log('Sign out ', messages)
      },
      async createUser(messages) {
         console.log('Create User', messages)
      },
   },

   // Enable debug messages in the console if you are having problems
   debug: false,
}
export default NextAuth(authOptions)
