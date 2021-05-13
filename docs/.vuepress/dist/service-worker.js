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
    "revision": "47e8c700bf9fcefed6593089c173a9c2"
  },
  {
    "url": "assets/css/0.styles.c896736b.css",
    "revision": "d624c638641df3e856e6ce098aa08abc"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.a7b8fbcc.js",
    "revision": "6b3a07631b9caeffe82844d3590ac0de"
  },
  {
    "url": "assets/js/11.bb6ddb79.js",
    "revision": "b7d6b9c4c40ee0c08209d7a889ef19fa"
  },
  {
    "url": "assets/js/12.c2f32682.js",
    "revision": "a78796ab99b1d44bcd8b6f9ba386494f"
  },
  {
    "url": "assets/js/13.ab228ed3.js",
    "revision": "2a7224b56df311b3c072a6cc89f6cb83"
  },
  {
    "url": "assets/js/14.dfe3e42d.js",
    "revision": "fa49910bb8e6ac5d811dd2221923fdf6"
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
    "url": "assets/js/4.dd018152.js",
    "revision": "4ae3e0f4aa63bad163520e66e171150b"
  },
  {
    "url": "assets/js/5.c2adf207.js",
    "revision": "e7565f6c26c477ff1be92354031c1c9a"
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
    "url": "assets/js/app.af565ccc.js",
    "revision": "e6cc49ebed055216122a794a2d6ab188"
  },
  {
    "url": "config.html",
    "revision": "d0511dff5a726df96f4361e713b5a210"
  },
  {
    "url": "guide/index.html",
    "revision": "1509b393c7858ae03250f3cc88cdd23d"
  },
  {
    "url": "img/logo.png",
    "revision": "d80f0c002434e99d0752f85860bebbb2"
  },
  {
    "url": "index.html",
    "revision": "fb825ecd1daab0b91bb243e07d500485"
  },
  {
    "url": "javascript/index.html",
    "revision": "5403c1347b184d197fd3a98b9bd0c03b"
  },
  {
    "url": "javascript/promise.html",
    "revision": "c7e6050e347e3f046543367c9142c106"
  },
  {
    "url": "javascript/runner.html",
    "revision": "29f80c74d0692e3a87febb044332f43f"
  },
  {
    "url": "javascript/type-conversion.html",
    "revision": "5c88e0051c07e8e99ef5c16b5baf4b76"
  },
  {
    "url": "javascript/typeof.html",
    "revision": "8fe4c283236e7e1fbf3da670381b3c1c"
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
