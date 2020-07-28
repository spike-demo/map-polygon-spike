let map = null
const areaMarkers = {}
const areaPolygons = []
let showArea = false

const log = (log) => {
  document.getElementById('logger').innerHTML = log
}
const getLngLatInstance = (positionStr) => {
  const res = positionStr.split(',')
  const lng = parseFloat(res[0])
  const lat = parseFloat(res[1])
  return new TMap.LatLng(lat, lng)
}

const addPolygon = (areaId, polylines, fillColor) => {
  const path = polylines.map((line) => getLngLatInstance(line))

  var polygon = new TMap.MultiPolygon({
    map: map, //设置多边形图层显示到哪个地图实例中
    //多边形样式
    styles: {
      polygon: new TMap.PolygonStyle({
        color: fillColor, //面填充色
        showBorder: true, //是否显示拔起面的边线
        borderColor: '#5e5e5e', //边线颜色 5e5e5e
        borderWidth: 1
      })
    },
    //多边形数据
    geometries: [
      {
        id: areaId, //该多边形在图层中的唯一标识（删除、更新数据时需要）
        styleId: 'polygon',
        paths: path //多边形轮廓
      }
    ]
  })
  // polygon.setVisible(false)

  // TODO: check multi polygon areas
  polygon.on('click', () => {
    const { id } = polygon.getGeometries()[0]
    areaMarkers[id].setVisible(true)
    const styles = polygon.getStyles()
    styles.polygon.color = 'rgba(255, 0, 0, 0.5)'
    polygon.setStyles(styles)
  })
  polygon.on('dblclick', () => {
    const styles = polygon.getStyles()
    styles.polygon.color = 'rgba(255, 255, 255, 0)'
    polygon.setStyles(styles)

    const { id } = polygon.getGeometries()[0]
    areaMarkers[id].setVisible(false)
  })
  polygon.on('touchstart', () => {
    log('on touchstart')
  })

  areaPolygons.push(polygon)
}

const addMarkers = (areaId, markers) => {
  const geometries = markers.map((marker) => {
    return {
      styleId: marker.color, //指定样式id
      position: getLngLatInstance(marker.position), //点标记坐标位置
      properties: {
        //自定义属性
        title: marker.title
      }
      // offset: new AMap.Pixel(-15, -30)
    }
  })

  //创建并初始化MultiMarker
  var markerLayer = new TMap.MultiMarker({
    map: map, //指定地图容器
    //样式定义
    styles: {
      //创建一个styleId为"myStyle"的样式（styles的子属性名即为styleId）
      blue: new TMap.MarkerStyle({
        width: 30, // 点标记样式宽度（像素）
        height: 30, // 点标记样式高度（像素）
        src: '/coordinate-blue.svg', //图片路径
        //焦点在图片中的像素位置，一般大头针类似形式的图片以针尖位置做为焦点，圆形点以圆心位置为焦点
        anchor: { x: 16, y: 32 }
      }),
      red: new TMap.MarkerStyle({
        width: 30, // 点标记样式宽度（像素）
        height: 30, // 点标记样式高度（像素）
        src: '/coordinate-red.svg', //图片路径
        //焦点在图片中的像素位置，一般大头针类似形式的图片以针尖位置做为焦点，圆形点以圆心位置为焦点
        anchor: { x: 16, y: 32 }
      })
    },
    //点标记数据数组
    geometries
  })
  markerLayer.setVisible(false)

  markerLayer.on('click', (evt) => {
    log(evt.geometry.properties.title)
  })

  areaMarkers[areaId] = markerLayer
}

const addAreas = async () => {
  const res = await fetch('./lgnlats/areas.json')
  const areas = await res.json()
  areas.forEach((area) => {
    addPolygon(area.id, area.polylines, area['fillColor-tencent'])
    addMarkers(area.id, area.markers)
  })
}

window.onload = function () {
  // mark: 城市坐标
  var center = new TMap.LatLng(30.509396, 114.670752)
  //定义map变量，调用 TMap.Map() 构造函数创建地图
  map = new TMap.Map(document.getElementById('container'), {
    center, //设置地图中心点坐标
    zoom: 9, //设置地图缩放级别
    viewMode: '2D'
  })
  addAreas()
}

window.showAllArea = () => {
  areaPolygons.forEach((polygon) => {
    polygon.setVisible(!showArea)
  })
  showArea = !showArea
}
