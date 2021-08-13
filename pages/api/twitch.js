const HOST_NAME = "https://api.twitch.tv/helix"

export default async (req, res) => {
  try {
    if (req.method === "POST") {
      // Twitch APi call
      const { data } = req.body

      const channelData = await getTwitchChannel(data)

      if (channelData) {
        //console.log("Channel data: ", channelData)
        res.status(200).json({ data: channelData })
      }

      res.status(404).send()
    }
  } catch (error) {
    console.error(error)
    res.status(500).send()
  }
}

const getTwitchChannel = async channelName => {
  console.log("Searching for twitch channel... ")
  if (channelName) {
    // Get Access Token
    const accessToken = await getTwitchAccessToken()

    if (accessToken) {
      //Get channels request

      const response = await fetch(`${HOST_NAME}/search/channels?query=${channelName}`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Client-Id": process.env.TWITCH_CLIENT_ID
        }
      })

      const json = await response.json()


      if (json.data) {
        const { data } = json
        const lowercaseChannelName = channelName.toLowerCase()

        const foundChannel = data.find(channel => {
          const lowercaseDislayName = channel.display_name.toLowerCase()

          return lowercaseChannelName === lowercaseDislayName
        })

        return foundChannel
      }
    }
  }

}

const getTwitchAccessToken = async () => {
  console.log("Getting access token... ")
  const path = `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_SECRET_ID}&grant_type=client_credentials`

  const response = await fetch(path, {
    method: "POST"
  })

  if (response) {
    const json = await response.json()
    return json.access_token
  }
}