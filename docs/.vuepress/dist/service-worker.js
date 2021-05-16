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
    "revision": "a23966d2f2a8aa59297417fc5270dbea"
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
    "url": "assets/js/11.060582a8.js",
    "revision": "b89d025f98aeb0069041252898f6b665"
  },
  {
    "url": "assets/js/12.9064201e.js",
    "revision": "507c9b5e08d8d04f14f967d891549765"
  },
  {
    "url": "assets/js/13.8e9d76a5.js",
    "revision": "a00d4fc749d350d8f0915e8e9e622335"
  },
  {
    "url": "assets/js/14.a1e3b57d.js",
    "revision": "622de2011c48f472235a0bb0f558899c"
  },
  {
    "url": "assets/js/15.9ed58925.js",
    "revision": "d40bf1b55debff92bf6a40b9d50ac2df"
  },
  {
    "url": "assets/js/16.de8b5c88.js",
    "revision": "6cbb98e04bf615b743b2086afbf51754"
  },
  {
    "url": "assets/js/17.8f2606c1.js",
    "revision": "cf83acaadd467850aded1836db96717e"
  },
  {
    "url": "assets/js/18.06919319.js",
    "revision": "40aa4ac4249ffd2ad81c81008a2eb4be"
  },
  {
    "url": "assets/js/19.fadb83fb.js",
    "revision": "afbdd7988d11fd6976989d5d3e4751b3"
  },
  {
    "url": "assets/js/2.fb594e9f.js",
    "revision": "12ac55df8c8424dd6f29a76c20bbc17c"
  },
  {
    "url": "assets/js/20.b207ea95.js",
    "revision": "dfdba026e6db7e809997162bfe1193d4"
  },
  {
    "url": "assets/js/21.5ef69f58.js",
    "revision": "b68e789864496a3b9afedcd57d837521"
  },
  {
    "url": "assets/js/3.b5414e19.js",
    "revision": "012b03e45f3550ff1d1251f1cb1bd33a"
  },
  {
    "url": "assets/js/4.e0104ba9.js",
    "revision": "3f9cc157dd06c1c7e8e80f2e490c7864"
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
    "url": "assets/js/8.ef37e7f3.js",
    "revision": "aa9667333fd09a7fe53da6bd176c5137"
  },
  {
    "url": "assets/js/9.bee9a440.js",
    "revision": "1c9a3a80472ba115a8ba11bef478f17d"
  },
  {
    "url": "assets/js/app.fb8c16d9.js",
    "revision": "208a1e8b4bb678f0205c7d7c4998b45e"
  },
  {
    "url": "config.html",
    "revision": "bae5d3cb83df1dbd3427bed5db316c88"
  },
  {
    "url": "guide/index.html",
    "revision": "00a61b7d8e8faad39db291f6233b6ba2"
  },
  {
    "url": "img/logo.png",
    "revision": "d80f0c002434e99d0752f85860bebbb2"
  },
  {
    "url": "index.html",
    "revision": "2e9de2eb240e099275e276df41146eba"
  },
  {
    "url": "javascript/function.html",
    "revision": "5ca8a2b4649a90dccc96a70c8c470410"
  },
  {
    "url": "javascript/index.html",
    "revision": "c1322ef52f038a11b060d69bdc106965"
  },
  {
    "url": "javascript/json.html",
    "revision": "ef058f214f58aa107f95260612a4318d"
  },
  {
    "url": "javascript/letLoopAndClosure.html",
    "revision": "40b6cc174291ea4c8fe826aa492abd75"
  },
  {
    "url": "javascript/objectWrapper.html",
    "revision": "728ab223e2579eb316c30e2ce142d36f"
  },
  {
    "url": "javascript/promise.html",
    "revision": "714b7630b88f35fb8b1d71db4d55b76e"
  },
  {
    "url": "javascript/runner.html",
    "revision": "6a51763f52eacc8beea0060fc0bf563b"
  },
  {
    "url": "javascript/scope.html",
    "revision": "3d6d12e2418ec7591c77ce35180301bf"
  },
  {
    "url": "javascript/typeConversion.html",
    "revision": "452199173aa63870e1331ba3deed00b0"
  },
  {
    "url": "javascript/typeof.html",
    "revision": "711f8735f65f426169394532e402143b"
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
