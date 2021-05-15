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
    "revision": "497e5d1214864cdc7723a68a110f8a9e"
  },
  {
    "url": "assets/css/0.styles.b41fd11a.css",
    "revision": "c2192717af2d8cc7912d21a08dc403ec"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.1f8dd0e8.js",
    "revision": "2c7539bdeae329e86ddad68bb798ab9e"
  },
  {
    "url": "assets/js/11.9e8a625f.js",
    "revision": "51b19478607b22e99a7a1a6f85e4e590"
  },
  {
    "url": "assets/js/12.ba9df5cf.js",
    "revision": "2dac981125b2a58ebd3fa64b6a553b0e"
  },
  {
    "url": "assets/js/13.722ec4c6.js",
    "revision": "cac6739b6096141bf4a0faadbb843dbd"
  },
  {
    "url": "assets/js/14.63eea74e.js",
    "revision": "31be6f852c27d179fd58923af0525940"
  },
  {
    "url": "assets/js/15.d74d08dc.js",
    "revision": "4bca19e15bc046ea8866abfafe009c08"
  },
  {
    "url": "assets/js/16.bc85018a.js",
    "revision": "a5a8ffb7d16e22414cb25afb78ad0a15"
  },
  {
    "url": "assets/js/2.fb594e9f.js",
    "revision": "12ac55df8c8424dd6f29a76c20bbc17c"
  },
  {
    "url": "assets/js/3.b5414e19.js",
    "revision": "012b03e45f3550ff1d1251f1cb1bd33a"
  },
  {
    "url": "assets/js/4.56ef8a26.js",
    "revision": "f15cea46d906c2146ccab999741e70e6"
  },
  {
    "url": "assets/js/5.2bd65f15.js",
    "revision": "9b8174b4e1f304306223e7170df2eac1"
  },
  {
    "url": "assets/js/6.e98446e5.js",
    "revision": "61519701cb0890bc3c6f9334eaacdf72"
  },
  {
    "url": "assets/js/7.02a58e74.js",
    "revision": "e4cccb06dcaa09fea9c5ffdbdd02eb6c"
  },
  {
    "url": "assets/js/8.a3c2c25b.js",
    "revision": "1448cb0923c80556e805b757ce0799c2"
  },
  {
    "url": "assets/js/9.bee9a440.js",
    "revision": "1c9a3a80472ba115a8ba11bef478f17d"
  },
  {
    "url": "assets/js/app.8fa9f3fa.js",
    "revision": "0867cc00a75e050191cb5ac672b16cab"
  },
  {
    "url": "config.html",
    "revision": "d1b1d94805b6a2f0ee0562d270f636fd"
  },
  {
    "url": "guide/index.html",
    "revision": "374d64a191df7a6dd2038d2127a3930c"
  },
  {
    "url": "img/logo.png",
    "revision": "d80f0c002434e99d0752f85860bebbb2"
  },
  {
    "url": "index.html",
    "revision": "a189cab0109a513df25dcc5713fc8fa2"
  },
  {
    "url": "javascript/index.html",
    "revision": "3e45a249a0e8c263d78d4c26deb3275b"
  },
  {
    "url": "javascript/promise.html",
    "revision": "646832e8700347114b1228f08ce1dc50"
  },
  {
    "url": "javascript/runner.html",
    "revision": "e7da8b298baadaf898d296af2c91c0d4"
  },
  {
    "url": "javascript/type-conversion.html",
    "revision": "d9d4b78a1db3bbff53748e1a410f99f4"
  },
  {
    "url": "javascript/typeof.html",
    "revision": "1a952c00c3857a5e87d7ba568233b295"
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
