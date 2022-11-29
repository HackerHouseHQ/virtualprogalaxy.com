import React, { useContext, useEffect, useState } from 'react'
import { fetcher } from '../../../../lib/fetcher'
import useSWR from 'swr'
import { serverURL } from '../../../../config/urlcontrol'
import { currentUser } from '../../../../utils/recoil/browser'
import { Text, Container } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { SocketContext } from '../../../../utils/context/socket'
import { useRecoilValue, waitForAll } from 'recoil'
import { current } from '@reduxjs/toolkit'
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
   if (str.length < 15) return str
   return str.substring(0, 5) + '...'
}
export default function Information() {
   // const [index, browsers] = useRecoilValue(
   //    waitForAll([currentBrowserIndex, currentBrowsers])
   // )
   // const browser = useRecoilValue(getFocusedBrowser)
   // const { data, mutate, isError, isLoading } = useParticipants(
   //    browsers[index].url
   // )
   const userEmail = useRecoilValue(currentUser)
   const socket = useContext(SocketContext)
   const [data, setData] = useState([])
   useEffect(() => {
      socket.emit('getParticipants', { email: userEmail })
      socket.on('getParticipants', (msg) => {
         console.log('getParticipants', msg)
      })
      socket.on('participantsAdded', (msg) => {
         console.log('par Added', msg)
         showNotification({
            title: 'Member joining',
            message: `${msg.email} is joining`,
            color: 'blue',
            autoClose: false,
         })
         setData((data) => [...data, msg.email])
         // mutate()
      })
      socket.on('participantsRemoved', (msg) => {
         console.log('par Removed', msg)
         showNotification({
            title: 'Member leaving',
            message: `${msg.email} left the session`,
            color: 'red',
            autoClose: false,
         })
         var index = data.indexOf(msg.email)
         setData((data) => [...data.slice(0, index), ...data.slice(index + 1)])
         // mutate()
      })
      return () => {
         socket.off('getParticipants')
         socket.off('participantsAdded')
         socket.off('participantsRemoved')
      }
   }, [])
   return (
      <>
         <Container>
            {data &&
               data.length >= 1 &&
               data.map((item, index) => (
                  <Text color="gray" fw="bold" key={index}>
                     {format(item)}
                  </Text>
               ))}
         </Container>
      </>
   )
}
