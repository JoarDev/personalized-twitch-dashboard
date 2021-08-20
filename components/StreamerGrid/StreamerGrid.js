import React from 'react'
import Image from "next/image"
import styles from "../../styles/StreamerGrid.module.css"

const StreamerGrid = ({ channels }) => {

  const renderGridItem = channel => (
    <div className={styles.gridItem} key={channel.id}>
      <Image layout="fill" src={channel.thumbnail_url} />
      <div className={styles.gridItemContent}>
        <p>{channel.display_name}</p>
        {channel.is_live && <p>🔴´Live Now!</p>}
        {!channel.is_live && <p>⚫ Offline</p>}
      </div>
    </div>
  )

  // the below div lacks of classname styles.gridContainer which is not in css tho discord chat
  return (
    <div className={styles.container}>
      <h2>{`Joaquin's Twitch Dashboard`}</h2>
      <div className={styles.gridContainer}>
        {channels.map(renderGridItem)}
      </div>
    </div>
  )
}

export default StreamerGrid