import { createGeoFence, getGeoFence } from './api.js'

let map = null
const areaMarkers = {}
let showArea = false

const blueIcon = new AMap.Icon({
  image: '/coordinates.png', // Icon的图像
  imageSize: new AMap.Size(30, 30)
})

const log = (log) => {
  document.getElementById('logger').innerHTML = log
}
const getLngLatInstance = (positionStr) => {
  const res = positionStr.split(',')
  const lng = parseFloat(res[0])
  const lat = parseFloat(res[1])
  return new AMap.LngLat(lng, lat)
}

const addPolygon = (areaId, polylines, fillColor) => {
  const path = polylines.map((line) => getLngLatInstance(line))

  var polygon = new AMap.Polygon({
    path,
    fillColor, // 多边形填充颜色
    fillOpacity: 0.2,
    borderWeight: 0.5, // 线条宽度，默认为 1
    strokeColor: '#5e5e5e', // 线条颜色
    bubble: true,
    extData: {
      areaId
    }
    // visible: false
  })
  polygon.on('click', () => {
    const { areaId } = polygon.getExtData()
    areaMarkers[areaId].forEach((marker) => {
      marker.show()
    })
    polygon.setOptions({
      fillOpacity: 0.5
    })
  })
  polygon.on('dblclick', () => {
    polygon.setOptions({
      fillColor: 'yellow'
    })
    const { areaId } = polygon.getExtData()
    areaMarkers[areaId].forEach((marker) => {
      marker.show()
    })
  })
  polygon.on('touchstart', () => {
    log('on touchstart')
  })
  map.add(polygon)
}

const addMarkers = (areaId, markers) => {
  const mapMarkers = markers.map((marker) => {
    // marker.color
    return new AMap.Marker({
      position: getLngLatInstance(marker.position),
      visible: false,
      // content: '<img src="/coordinates.png" style="width:30px"></div>',
      icon: blueIcon, //'/coordinates.png'
      offset: new AMap.Pixel(-15, -30) // 以图标中线和底部为基准: 上下偏移图片高度，左右偏移半个图片宽度
    })
  })
  map.add(mapMarkers)
  areaMarkers[areaId] = mapMarkers
}

const addAreas = async () => {
  const res = await fetch('./lgnlats/areas.json')
  const areas = await res.json()
  areas.forEach((area) => {
    addPolygon(area.id, area.polylines, area.fillColor)
    addMarkers(area.id, area.markers)
  })
}

window.onload = function () {
  map = new AMap.Map('container', { center: [114.298572, 30.584355], zoom: 10 })
  addAreas()
}

window.onCreateFence = () => {
  const points =
    '121.298483,31.18197;121.299899,31.182374;121.300972,31.18186;121.3008,31.180575;121.299212,31.180318'
  createGeoFence(`GeoFence`, points)
}

window.onGetFence = () => {
  getGeoFence()
}

window.showAllArea = () => {
  const polygons = map.getAllOverlays('polygon')
  polygons.forEach((polygon) => {
    if (showArea) {
      polygon.hide()
    } else {
      polygon.show()
    }
  })
  showArea = !showArea
}
