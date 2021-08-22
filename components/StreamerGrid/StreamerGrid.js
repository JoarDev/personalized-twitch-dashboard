import React from 'react'
import Image from "next/image"
import styles from "../../styles/StreamerGrid.module.css"

const StreamerGrid = ({ channels, setChannel }) => {

  const removeChannelAction = channelId => async () => {
    console.log("removing channel...")

    const filteredChannels = channels.filter(channel => channel.id !== channelId)
    setChannel(filteredChannels)

    const joinedChannels = filteredChannels.map(channel => channel.display_name.toLowerCase()).join(",")

    await setDBChannels(joinedChannels)
  }

  const setDBChannels = async channels => {
    try {
      const path = `https://${window.location.hostname}`

      const response = await fetch(`${path}/api/database`, {
        method: "POST",
        body: JSON.stringify({
          key: "CHANNELS",
          value: channels
        })
      })

      if (response.status === 200) {
        console.log(`Set ${channels} in DB.`)
      }
    } catch (error) {
      console.warn(error.message)
    }
  }

  const renderGridItem = channel => (
    <div className={styles.gridItem} key={channel.id}>
      <Image layout="fill" src={channel.thumbnail_url} />
      <div className={styles.gridItemContent}>
        <button onClick={removeChannelAction(channel.id)}>X</button>
        <p>{channel.display_name}</p>
        {channel.is_live && <p>🔴´Live Now!</p>}
        {!channel.is_live && <p>⚫ Offline</p>}
      </div>
    </div>
  )

  const renderNoItems = () => (
    <div className={styles.gridNoItems}>
      <p>Add a streamer above!</p>
    </div>
  )

  // the below div lacks of classname styles.gridContainer which is not in css tho discord chat
  return (
    <div className={styles.container}>
      <h2>{`🔻 Joar's Twitch Dashboard 🔺`}</h2>
      <div className={styles.gridContainer}>
        {channels.length > 0 && channels.map(renderGridItem)}
        {channels.length === 0 && renderNoItems()}
      </div>
    </div>
  )
}

export default StreamerGrid