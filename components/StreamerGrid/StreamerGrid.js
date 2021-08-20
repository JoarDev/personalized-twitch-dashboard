import React from 'react'
import Image from "next/image"
import styles from "../../styles/StreamerGrid.module.css"

const StreamerGrid = ({ channels, setChannel }) => {

  const removeChannelAction = channelId => () => {
    console.log("removing channel...")
    setChannel(channels.filter(channel => channel.id !== channelId))
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
      <h2>{`Joaquin's Twitch Dashboard`}</h2>
      <div className={styles.gridContainer}>
        {channels.length > 0 && channels.map(renderGridItem)}
        {channels.length === 0 && renderNoItems()}
      </div>
    </div>
  )
}

export default StreamerGrid