import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React, { useEffect, useState } from "react"
import StreamerGrid from "../components/StreamerGrid"

const Home = () => {

  const [channelsList, setchannelsList] = useState([])

  const addStreamChannel = async e => {
    e.preventDefault()

    const { value } = e.target.elements.name

    if (value) {
      console.log("input: ", value)

      // NextJs Server API call

      const path = `https://${window.location.hostname}`

      const response = await fetch(`${path}/api/twitch`, {
        method: "POST",
        headers: {
          "content-Type": "application/json"
        },
        body: JSON.stringify({ data: value })
      })

      const json = await response.json()

      console.log("From the server", json.data)
      setchannelsList(prevState => [...prevState, json.data])

      await setChannel(value)
      e.target.elements.name.value = ""
    }
  }

  //<div>{channelsList.join(", ")}</div>

  const renderForm = () => (
    <div className={styles.formContainer}>
      <form onSubmit={addStreamChannel}>
        <input type="text" id="name" placeholder="Twitch Channel Name" required />
        <button type="submit">Add Streamer</button>
      </form>
    </div>
  )

  const setChannel = async channelName => {
    try {
      const currentStreamers = channelsList.map(channel => channel.display_name.toLowerCase())

      const streamerList = [...currentStreamers, channelName].join(",")

      const path = `https://${window.location.hostname}`

      const response = await fetch(`${path}/api/database`, {
        method: `POST`,
        body: JSON.stringify({
          key: `CHANNELS`,
          value: streamerList
        })
      })

      if (response.status === 200) {
        console.log(`Set ${channelName} in DB.`)
      }


    } catch (error) {
      console.warn(error.message)
    }
  }

  useEffect(() => {
    console.log("fetching channels...")
    fetchChannels()
  }, [])

  const fetchChannels = async () => {
    try {
      const path = `https://${window.location.hostname}`

      const response = await fetch(`${path}/api/database`, {
        method: "POST",
        body: JSON.stringify({
          action: "GET_CHANNELS",
          key: "CHANNELS"
        })
      })

      if (response.status === 404) {
        console.log("DB response error (key not found)")
      }

      const json = await response.json()

      

      if (json.data) {
        const channelNames = json.data.split(",")

        console.log("CHANNEL NAMES: ", channelNames)

        const channelData = []

        for await (const channelName of channelNames) {
          console.log("Getting Twitch Data for: ", channelName)

          const channelResp = await fetch(`${path}/api/twitch`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ data: channelName })
          })

          const json = await channelResp.json()

          if (json.data) {
            setchannelsList(prev => [...prev,json.data])
            channelData.push(json.data)
            console.log(channelData)
          }

          
        }
        //setchannelsList(channelData)
      }
    } catch (error) {
      console.warn(error.message)
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>🎥 Personal Twitch Dashboard</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className={styles.inputContainer}>
        <div className={styles.inputContainer}>
          {renderForm()}
          <StreamerGrid channels={channelsList} setChannel={setchannelsList} />
        </div>
      </div>
    </div>
  )
}

export default Home