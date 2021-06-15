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
    "revision": "7364be929b44df0175f45a2b8c6716b6"
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
    "url": "assets/js/10.1350d19e.js",
    "revision": "3ca6b84a7fc1c81ced8058165aea2084"
  },
  {
    "url": "assets/js/11.689db56c.js",
    "revision": "6ae20f735da15bf40df35b49aa12cb33"
  },
  {
    "url": "assets/js/12.47f4f5e7.js",
    "revision": "64ff30be7b029b141ff1c19718e5f0e6"
  },
  {
    "url": "assets/js/13.789bc905.js",
    "revision": "9da0524b42de6d3f422b3724fb947851"
  },
  {
    "url": "assets/js/14.72dcecaa.js",
    "revision": "59a0eefd682172d078a212468a5ef635"
  },
  {
    "url": "assets/js/15.0d0e4d18.js",
    "revision": "50f2259cccd157b6a33f751e1f255d78"
  },
  {
    "url": "assets/js/16.8bf4e698.js",
    "revision": "1e51c2ed3a710cd1014ca847cbe3bcfd"
  },
  {
    "url": "assets/js/17.bc157ea3.js",
    "revision": "6f4b7869f3a5bbe7962f7604212b50c2"
  },
  {
    "url": "assets/js/18.83810988.js",
    "revision": "d53b7b88c0ac5a9a9d1ca1ca15daa4ce"
  },
  {
    "url": "assets/js/19.4335795c.js",
    "revision": "0eee06adb7b36fec12b5f7cea5234136"
  },
  {
    "url": "assets/js/2.1672b9b1.js",
    "revision": "1358825e933908a484fec87c1eaaaa26"
  },
  {
    "url": "assets/js/20.c5ec9fc7.js",
    "revision": "f4d6e34b58f454c279621f2c8049da52"
  },
  {
    "url": "assets/js/21.364094a5.js",
    "revision": "cba3f9ab4da50e3262bc62f849a9fda9"
  },
  {
    "url": "assets/js/22.e1ee893a.js",
    "revision": "7f125e35c5a65c6f0b9371ea9440deea"
  },
  {
    "url": "assets/js/23.f2cde115.js",
    "revision": "8d51087d138927450e15adf9caaefcd3"
  },
  {
    "url": "assets/js/24.28368cca.js",
    "revision": "40d12fbdbeea415dc503ec0f3bf70b7f"
  },
  {
    "url": "assets/js/25.2aa6dd6f.js",
    "revision": "693f699e4244d48351cb49542120b865"
  },
  {
    "url": "assets/js/26.69746e5c.js",
    "revision": "20ef3553e490ad9bfdd7e9c77098115f"
  },
  {
    "url": "assets/js/27.26337cc7.js",
    "revision": "bf33a0ae12f2c9df9756f10ae6e16a71"
  },
  {
    "url": "assets/js/28.6680caca.js",
    "revision": "b263bf1f937bc875eebe14bd6c512df7"
  },
  {
    "url": "assets/js/29.48f45851.js",
    "revision": "88494df7d84b33893fee0220ed40f679"
  },
  {
    "url": "assets/js/3.df7a1aed.js",
    "revision": "eacc0577d76752f175041d9a1c84dc1b"
  },
  {
    "url": "assets/js/30.338c4bc2.js",
    "revision": "c90358735eb97840565041ca43fb27de"
  },
  {
    "url": "assets/js/31.5a0f6078.js",
    "revision": "299b721db0c2172df7b5aef2e5717aff"
  },
  {
    "url": "assets/js/32.82b11c0b.js",
    "revision": "e7b50b19dbf2c97d370e125b2d5d617a"
  },
  {
    "url": "assets/js/33.36f0b1f3.js",
    "revision": "8d6af4bee6624db0f87e1bfb19c4293b"
  },
  {
    "url": "assets/js/4.8025c340.js",
    "revision": "580e043ac0309af1ebc8a6af7905faf2"
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
    "url": "assets/js/app.d1d83eca.js",
    "revision": "c8be91ec5f65a3068db64d30f14e041e"
  },
  {
    "url": "config.html",
    "revision": "25dc1b5271c870721e03dc49fd043899"
  },
  {
    "url": "dataStructure/deque.html",
    "revision": "31959ade9dfdbcacb091800e093c5b2b"
  },
  {
    "url": "dataStructure/doublyLinkList.html",
    "revision": "6ca31de4dd343261dcd1d4a84efa8373"
  },
  {
    "url": "dataStructure/linkedList.html",
    "revision": "25ff5186e8dfa57f9248568b6686e9bf"
  },
  {
    "url": "dataStructure/queue.html",
    "revision": "294efc8a8fdc6246a546501dac883574"
  },
  {
    "url": "dataStructure/sortAlgorithm.html",
    "revision": "9df9bfcd10f970309822490aefd50c04"
  },
  {
    "url": "dataStructure/stack.html",
    "revision": "6014cd0614b29e7bcc8bf90c3f8a5ed4"
  },
  {
    "url": "guide/index.html",
    "revision": "8bc2c2413ae8c0c161d814638b5571f9"
  },
  {
    "url": "img/bubble.gif",
    "revision": "33a947c71ad62b254cab62e5364d2813"
  },
  {
    "url": "img/doublyLinkedList1.jpg",
    "revision": "98631431d60e2c9eb736518c5f71571d"
  },
  {
    "url": "img/insert.gif",
    "revision": "91b76e8e4dab9b0cad9a017d7dd431e2"
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
    "url": "img/merge.jpg",
    "revision": "a15a4fe29b8b4245c6a30f329cc5592a"
  },
  {
    "url": "img/selection.gif",
    "revision": "1c7e20f306ddc02eb4e3a50fa7817ff4"
  },
  {
    "url": "index.html",
    "revision": "d292c79d0459d58b7ee0a40027284c04"
  },
  {
    "url": "javascript/function.html",
    "revision": "7c3a5ed3fb33493b2c7cfe674f430c6d"
  },
  {
    "url": "javascript/index.html",
    "revision": "955ac14848aa7ca46295b9ac3f7dbc04"
  },
  {
    "url": "javascript/json.html",
    "revision": "7b2824a49dea89b3610064ed88564238"
  },
  {
    "url": "javascript/letLoopAndClosure.html",
    "revision": "4f94d17f08ec802aa9413209b31e7767"
  },
  {
    "url": "javascript/objectWrapper.html",
    "revision": "df1e2dc1d88d0f2ce1b72651b92180a9"
  },
  {
    "url": "javascript/promise.html",
    "revision": "a9e9f64767cda4bef221067ab4cfaf24"
  },
  {
    "url": "javascript/runner.html",
    "revision": "102d87494e16b2b39eb21be18a6e79d4"
  },
  {
    "url": "javascript/scope.html",
    "revision": "18d6418d0b8ece38d9addbf0693f24a9"
  },
  {
    "url": "javascript/typeConversion.html",
    "revision": "554973b261ef37e50480ec196bfac9ca"
  },
  {
    "url": "javascript/typeof.html",
    "revision": "3fd8b0cd6affc881d0f45b229ca9a94c"
  },
  {
    "url": "other/fncCallComponent.html",
    "revision": "043e8613e4d24cb3b316b0b8a87b46ce"
  },
  {
    "url": "typescript/asConst.html",
    "revision": "5b250979016ae1c226e08229deb0bd2e"
  },
  {
    "url": "typescript/enum.html",
    "revision": "8cd4e55631e1c564a07b12fc60b8bdd3"
  },
  {
    "url": "typescript/never.html",
    "revision": "92c5ecb619c56dd7ca44fc8619745793"
  },
  {
    "url": "typescript/this.html",
    "revision": "82947104e12553cb151bb5e89369d7ca"
  },
  {
    "url": "typescript/unknown.html",
    "revision": "e5f04918d8ac3f0e9af2d3c79f584fb6"
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
