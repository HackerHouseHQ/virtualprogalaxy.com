import React, { useContext, useEffect } from 'react'
import { fetcher } from '../../../../lib/fetcher'
import useSWR from 'swr'
import { serverURL } from '../../../../config/urlcontrol'
import {
   getFocusedBrowser,
   currentBrowserIndex,
   currentBrowsers,
} from '../../../../utils/recoil/browser'

import { SocketContext } from '../../../../utils/context/socket'
import { useRecoilValue, waitForAll } from 'recoil'
const fetchParticipantsData = async (url: string, embed_url: string) => {
   console.log('url', embed_url)
   const participantData = await fetcher(
      `${serverURL}/api/session/getParticipantsByEmbedURL`,
      {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
            embed_url: embed_url,
         }),
      }
   )
   console.log(participantData)
   return participantData ? participantData.participants : []
}
const useParticipants = (url: string) => {
   const { data, mutate, error, isValidating } = useSWR(
      ['browser', url],
      fetchParticipantsData,
      { revalidateOnFocus: false }
   )
   return {
      data: data,
      isLoading: (!error && !data) || isValidating,
      isError: error,
      mutate: mutate,
   }
}
const format = (str: string) => {
   return str.substring(0, 10) + '...'
}
export default function Information() {
   const [index, browsers] = useRecoilValue(
      waitForAll([currentBrowserIndex, currentBrowsers])
   )
   const browser = useRecoilValue(getFocusedBrowser)
   const { data, mutate, isError, isLoading } = useParticipants(
      browsers[index].url
   )
   const socket = useContext(SocketContext)

   useEffect(() => {
      socket.on('participantsAdded', (msg) => {
         console.log('par')
         mutate()
      })
      socket.on('participantsRemoved', (msg) => {
         mutate()
      })
   }, [])
   return (
      <>
         {data &&
            data.length >= 1 &&
            data.map((item, index) => (
               <div key={index}>{format(item.email)}</div>
            ))}
      </>
   )
}
