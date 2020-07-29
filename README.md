### demo page

1. gaode, tencent 高德和腾讯地图 demo
2. gaode-gps-convertor 高德地图的坐标转换工具 将`/lgnlats/gps.json`中的坐标集转换为高德腾讯地图所用的 GCJ-02
3. gaode-coordinate-collector 高德地图坐标拾取工具(鼠标点击放置坐标点 右键结束收集并在 devtool 控制台输出经纬度集合)

### 高德腾讯地图 api 差异

在自定义 marker 点坐标图片时不要忘记设置偏移: 以 30\*30 的图为例，如以图片中间和下面为基准 应设置偏移为-15, -30  
腾讯地图使用纬度经度`new TMap.LatLng(lat, lng)` 高德地图使用经度纬度`new AMap.LngLat(lng, lat)` 正好相反  
腾讯地图填充色支持 rgba，而高德地图需要使用 color+透明度  
腾讯 api 对象为 multiple 多个区域和多个坐标都可以存在于一个 class 中

### 以高德为例创建 polygon 多边形和 marker 点坐标的方法

```js
// 1. 首先需要到高德api官网注册开发者账号和使用的key(注册web端即可) 参考官网文档 https://lbs.amap.com/api/javascript-api/guide/abc/prepare
// 2. html中引入amap
<script
      type="text/javascript"
      src="https://webapi.amap.com/maps?v=1.4.15&key=77737f6b7133d0846bbccfb2e7c16601"
    ></script>
<div id="container"></div>

// 3. 创建map对象
const map = new AMap.Map('container', { center: [114.670752, 30.509396], zoom: 9 })

// 4. 创建polygon对象并加入map
var polygon = new AMap.Polygon({
    path,
    fillColor, // 多边形填充颜色
    fillOpacity: 0.2,
    borderWeight: 0.5, // 线条宽度，默认为 1
    strokeColor: '#5e5e5e', // 线条颜色
    bubble: true,
    extData: {
      areaId
    },
    visible: true
  })
map.add(polygon)

// 5. 创建marker并加入map
// 自定义icon
const redIcon = new AMap.Icon({
  image: './coordinate-red.svg', // Icon的图像
  imageSize: new AMap.Size(30, 30)
})
 const mapMarker = new AMap.Marker({
      title: marker.title,
      position: getLngLatInstance(marker.position),
      visible: false,
      // content: '<img src="/coordinates.png" style="width:30px"></div>',
      icon: marker.color === 'red' ? redIcon : blueIcon, //'/coordinates.png'
      offset: new AMap.Pixel(-15, -30) // 以图标中线和底部为基准: 上下偏移图片高度，左右偏移半个图片宽度
    })
map.add(mapMarker)

```

### 高德地图

api 服务协议 https://lbs.amap.com/home/terms

坐标收集 https://www.opengps.cn/Map/Tools/PickUpGPS_AMap.aspx

覆盖物文档 https://lbs.amap.com/api/javascript-api/guide/overlays/marker

覆盖物 api https://lbs.amap.com/api/javascript-api/reference/overlay

gps 经纬度转化为 GCJ-02 https://lbs.amap.com/api/javascript-api/guide/transform/convertfrom

像素坐标转化为经纬度 https://lbs.amap.com/api/javascript-api/guide/transform/coord_trans  
`var lnglat = mapObj.pixelToLngLat(new AMap.Pixel(x, y), 3);`

### 腾讯地图

api https://lbs.qq.com/webApi/javascriptGL/glGuide/glPolygon
