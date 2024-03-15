import { Session } from 'next-auth'
import { Router } from 'next/router'
import type { AppProps as NextAppProps } from 'next/app'

import AppWithContexts from './_app.internal'

type AppProps = NextAppProps<{
  session: Session
  router?: Router
}>

export default function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {

  return (
    <AppWithContexts Component={Component} pageProps={{ ...pageProps }} />
  )
}
