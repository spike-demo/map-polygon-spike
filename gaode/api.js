const key = 'b85c5e78e23e360bc638d82b479d7a14'

export const createGeoFence = async (name, points) => {
  const res = await fetch(
    `https://restapi.amap.com/v4/geofence/meta?key=${key}`,
    {
      method: 'post',
      body: JSON.stringify({
        name,
        points,
        repeat: 'Mon,Tues,Wed,Thur,Fri,Sat,Sun'
      })
    }
  )
  console.log('after createGeoFence', res)
}

export const getGeoFence = async () => {
  const res = await fetch(
    `https://restapi.amap.com/v4/geofence/meta?key=${key}`,
    {
      method: 'get'
    }
  )
  console.log('after getGeoFence', res)
  return res
}
