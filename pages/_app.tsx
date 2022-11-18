import { SessionProvider } from 'next-auth/react'
import {
   MantineProvider,
   ColorSchemeProvider,
   ColorScheme,
} from '@mantine/core'
import { wrapper } from '../store/store'
import type { AppProps } from 'next/app'
import React, { useState } from 'react'
import MySession from './_appp'
import { RecoilRoot } from 'recoil'

function MyApp({ Component, pageProps: { ...pageProps } }: AppProps) {
   const [colorScheme, setColorScheme] = useState<ColorScheme>('light')
   const toggleColorScheme = (value?: ColorScheme) =>
      setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'))
   return (
      <SessionProvider session={pageProps.session}>
         <RecoilRoot>
            <MySession Component={Component} pageProps={{ ...pageProps }} />
         </RecoilRoot>
      </SessionProvider>
   )
}
export default wrapper.withRedux(MyApp)
//export default MyApp
