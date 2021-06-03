/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "be0ea95888acf947434e9b7a4a6e1332"
  },
  {
    "url": "assets/css/0.styles.ff205d38.css",
    "revision": "3e3c3c444f4f2630a879f8ef43de1643"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.cb0090f5.js",
    "revision": "effb02bf0d6b451a180504afa381df0e"
  },
  {
    "url": "assets/js/11.69e40a2a.js",
    "revision": "e3f03a53d11fcac947acbf513959445f"
  },
  {
    "url": "assets/js/12.b44a13e3.js",
    "revision": "fc46f86614d1d2d776feeb7e49d59a54"
  },
  {
    "url": "assets/js/13.391a303a.js",
    "revision": "cd8369a882679e057718fca050624765"
  },
  {
    "url": "assets/js/14.2e8c04ab.js",
    "revision": "5ff88621873ff8210a3f33192e55eedf"
  },
  {
    "url": "assets/js/15.c159d29e.js",
    "revision": "1d271bac65629216a1392a56f3bfb4e2"
  },
  {
    "url": "assets/js/16.9806a603.js",
    "revision": "ac4b1bae51396dc2b29f9131159f2ddf"
  },
  {
    "url": "assets/js/17.a83022ba.js",
    "revision": "4374290a7265cf28efd852159a029b52"
  },
  {
    "url": "assets/js/18.35d475a8.js",
    "revision": "1732f3240c2e3fbc1442b17993aa80e3"
  },
  {
    "url": "assets/js/19.63c4e6ec.js",
    "revision": "46ca9ef39f6092d2f065ca5db813f884"
  },
  {
    "url": "assets/js/2.1672b9b1.js",
    "revision": "1358825e933908a484fec87c1eaaaa26"
  },
  {
    "url": "assets/js/20.26a3aa30.js",
    "revision": "40f8577cc9f025b3b445840ec04e632b"
  },
  {
    "url": "assets/js/21.035f2929.js",
    "revision": "b6b424080bf5fc549e40895ac9ed4193"
  },
  {
    "url": "assets/js/22.c6101fb5.js",
    "revision": "e87224b6e456cdaebc3bfeb1cf71a967"
  },
  {
    "url": "assets/js/23.988531f1.js",
    "revision": "2cdd3a1e9cf418dd55a2e905e7c86b48"
  },
  {
    "url": "assets/js/24.ff2cd1eb.js",
    "revision": "cec0acf5c8d2fd9071f31957e8783061"
  },
  {
    "url": "assets/js/25.6c4684b1.js",
    "revision": "5377e0e56a20f1b7d3a9601a63ee2392"
  },
  {
    "url": "assets/js/26.fc8f216e.js",
    "revision": "2646f76fda1cf05e0f867ffaca58206d"
  },
  {
    "url": "assets/js/27.e1e35b83.js",
    "revision": "8a81248879e7726910ef551685db4580"
  },
  {
    "url": "assets/js/28.c211dcb3.js",
    "revision": "33d5379c9f75478a9fbef54f06928949"
  },
  {
    "url": "assets/js/29.96276678.js",
    "revision": "3f5b0e3e0884b279896185d43a513c03"
  },
  {
    "url": "assets/js/3.f5842e1d.js",
    "revision": "08d2f2b00b512ac10218ee41269b412b"
  },
  {
    "url": "assets/js/30.bc103987.js",
    "revision": "fe097d96501a1b74b2812e856294bdde"
  },
  {
    "url": "assets/js/31.50b3e60d.js",
    "revision": "a78df645b8a6d0252632c1829859879e"
  },
  {
    "url": "assets/js/4.9fe9ddd3.js",
    "revision": "21b89cbdcf1b30e9fb81f8a905d014b5"
  },
  {
    "url": "assets/js/5.2bd65f15.js",
    "revision": "9b8174b4e1f304306223e7170df2eac1"
  },
  {
    "url": "assets/js/6.5a2d1f4e.js",
    "revision": "adbcec83618ca96795ac13877b3809c4"
  },
  {
    "url": "assets/js/7.02a58e74.js",
    "revision": "e4cccb06dcaa09fea9c5ffdbdd02eb6c"
  },
  {
    "url": "assets/js/8.51d25f6c.js",
    "revision": "0cdd9eb8270a207f59d7a8f203cf2323"
  },
  {
    "url": "assets/js/9.bee9a440.js",
    "revision": "1c9a3a80472ba115a8ba11bef478f17d"
  },
  {
    "url": "assets/js/app.c9e1ed9c.js",
    "revision": "30637ece1cb83123bd8a37d0666f3e4c"
  },
  {
    "url": "config.html",
    "revision": "13f9ef14dd8455723c2e68c41c39f686"
  },
  {
    "url": "dataStructure/deque.html",
    "revision": "7135353767a03ec6c2a9bb8a3a5262e4"
  },
  {
    "url": "dataStructure/linkedList.html",
    "revision": "496f4481bad56858dbe6ea9e5fbda4dc"
  },
  {
    "url": "dataStructure/queue.html",
    "revision": "e9b5b38287e85f6df854507419381133"
  },
  {
    "url": "dataStructure/stack.html",
    "revision": "9ce0567216518e10c3ddce54ba63ec6b"
  },
  {
    "url": "guide/index.html",
    "revision": "3d255474908ecd4a6c1cfda655319a59"
  },
  {
    "url": "img/linkedList1.jpg",
    "revision": "29793bbf9a6056f896ac8f39986c7ac2"
  },
  {
    "url": "img/logo.png",
    "revision": "d80f0c002434e99d0752f85860bebbb2"
  },
  {
    "url": "index.html",
    "revision": "066505494ae328341c7222d2d3649e06"
  },
  {
    "url": "javascript/function.html",
    "revision": "448e22ce6ce8e51bd19f757f00fed61e"
  },
  {
    "url": "javascript/index.html",
    "revision": "fb40acb26e19f46caa37380308f7d2fc"
  },
  {
    "url": "javascript/json.html",
    "revision": "36fc248ebf3c650cf8722d25eb4f92b8"
  },
  {
    "url": "javascript/letLoopAndClosure.html",
    "revision": "8db9957f76cf453031cab625194d20c0"
  },
  {
    "url": "javascript/objectWrapper.html",
    "revision": "028692a73739761f356bd9921eb8c91b"
  },
  {
    "url": "javascript/promise.html",
    "revision": "e10bcdc162fdac695c1af88989ab97f7"
  },
  {
    "url": "javascript/runner.html",
    "revision": "e535682ed3ea5dfba40e257635157b85"
  },
  {
    "url": "javascript/scope.html",
    "revision": "e38c8a86a8b18ea3381b50b7c4e8f33c"
  },
  {
    "url": "javascript/typeConversion.html",
    "revision": "2881e338bbd046e8c628ad9560e7d1d7"
  },
  {
    "url": "javascript/typeof.html",
    "revision": "b1ff143c4245ed817b2aff396d4ffb23"
  },
  {
    "url": "other/fncCallComponent.html",
    "revision": "f2c6f500c4a3e2b09cc0fc819e822562"
  },
  {
    "url": "typescript/asConst.html",
    "revision": "33d210af499c6dbf9f4f938715b1a15f"
  },
  {
    "url": "typescript/enum.html",
    "revision": "c289ba68cc7c2e350c16c5707061cad6"
  },
  {
    "url": "typescript/never.html",
    "revision": "5eb994ce3b67dfac14a4ffcf463ae485"
  },
  {
    "url": "typescript/this.html",
    "revision": "bac1eb9edeca922208e20b9cc90c1b67"
  },
  {
    "url": "typescript/unknown.html",
    "revision": "5dd6cc010233008cee8ddec96a11029a"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
