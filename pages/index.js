import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React, { useState } from "react"
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

  return (
    <div className={styles.container}>
      <Head>
        <title>🎥 Personal Twitch Dashboard</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className={styles.inputContainer}>        
        <div className={styles.inputContainer}>
          {renderForm()}
          <StreamerGrid channels={channelsList}/>
        </div>
      </div>
    </div>
  )
}

export default Home