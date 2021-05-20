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
    "revision": "b2fbdf5bdbb12dd0642f9727d07fc119"
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
    "url": "assets/js/10.baaa3ab6.js",
    "revision": "6712040b901760dbe8eb418f61b825dd"
  },
  {
    "url": "assets/js/11.9dbeab92.js",
    "revision": "ed9e28fe0ab809ed7fd540445d31ab72"
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
    "url": "assets/js/14.e5d8e3e3.js",
    "revision": "55e5e07a889d31ff7932744ba53ab042"
  },
  {
    "url": "assets/js/15.cf80a6af.js",
    "revision": "785c54c95342239b9c537419e1f16fbe"
  },
  {
    "url": "assets/js/16.07e50270.js",
    "revision": "403932a6100800eb0cafa55ffc2fb0e0"
  },
  {
    "url": "assets/js/17.1748a0d5.js",
    "revision": "082ecf016cf0c5606140b8243dbf9cfc"
  },
  {
    "url": "assets/js/18.06919319.js",
    "revision": "40aa4ac4249ffd2ad81c81008a2eb4be"
  },
  {
    "url": "assets/js/19.cbd6cb57.js",
    "revision": "ae5f012565b4487de8644d496300f1d9"
  },
  {
    "url": "assets/js/2.fb594e9f.js",
    "revision": "12ac55df8c8424dd6f29a76c20bbc17c"
  },
  {
    "url": "assets/js/20.ca67a14e.js",
    "revision": "55b349a01125282420f095818742b4ca"
  },
  {
    "url": "assets/js/21.aa866e33.js",
    "revision": "9c17ca116fd669841cc7988004605b95"
  },
  {
    "url": "assets/js/22.3348f99a.js",
    "revision": "ad30e75792f32c59dee1795d1d2ecfdf"
  },
  {
    "url": "assets/js/3.b5414e19.js",
    "revision": "012b03e45f3550ff1d1251f1cb1bd33a"
  },
  {
    "url": "assets/js/4.bc7e4567.js",
    "revision": "425355b6cab6b2ba2b1d8478ca553efa"
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
    "url": "assets/js/8.859d6921.js",
    "revision": "0bd3b3e933aab0d0c5ca2b39e636ffd5"
  },
  {
    "url": "assets/js/9.bfc3f41d.js",
    "revision": "21a15882f2444fab81bc7b7b33162981"
  },
  {
    "url": "assets/js/app.9fa5359d.js",
    "revision": "ad052d5816dbe03c22c8842ac52673e9"
  },
  {
    "url": "config.html",
    "revision": "3168e0dba340bdf4eb02e372b1b96708"
  },
  {
    "url": "guide/index.html",
    "revision": "25cdf5b73b3c12456727a38fdeb94e22"
  },
  {
    "url": "img/logo.png",
    "revision": "d80f0c002434e99d0752f85860bebbb2"
  },
  {
    "url": "index.html",
    "revision": "46208bf33b255beb5914d8e6b899c5bb"
  },
  {
    "url": "javascript/function.html",
    "revision": "f864a3b2438e570ef57260a56286794d"
  },
  {
    "url": "javascript/index.html",
    "revision": "3bab03dbf0d0d99cc77e66f49bf55435"
  },
  {
    "url": "javascript/json.html",
    "revision": "3f2f06fcc5a9d8e1ee80d76252ea8b43"
  },
  {
    "url": "javascript/letLoopAndClosure.html",
    "revision": "7576685c85bd1c44373f7f88ffb5a79a"
  },
  {
    "url": "javascript/objectWrapper.html",
    "revision": "5c16332e7f81c5effa6f905ce032f6c8"
  },
  {
    "url": "javascript/promise.html",
    "revision": "883acd69a45e77703780914d8142197f"
  },
  {
    "url": "javascript/runner.html",
    "revision": "edb8170bb322b9d4e80330b68704aa5a"
  },
  {
    "url": "javascript/scope.html",
    "revision": "bc260ec3da718f034f6726a1d1a3d86f"
  },
  {
    "url": "javascript/typeConversion.html",
    "revision": "2c911c74d55577fd1a2a5673344c317d"
  },
  {
    "url": "javascript/typeof.html",
    "revision": "3b880ab0083b46c7186095f208b9c1f0"
  },
  {
    "url": "typescript/class.html",
    "revision": "809c8a320720773ac023fe4472a94220"
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
