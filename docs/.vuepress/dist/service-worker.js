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
    "revision": "23d27aa728dbd3caa291d72069d996d5"
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
    "url": "assets/js/10.a7b8fbcc.js",
    "revision": "6b3a07631b9caeffe82844d3590ac0de"
  },
  {
    "url": "assets/js/11.a8eed9f0.js",
    "revision": "c4eaf97f6bccb023ec7e2c161a43f965"
  },
  {
    "url": "assets/js/12.b4649e0e.js",
    "revision": "7a2e40ec9382a22e27c7533bef02c2d1"
  },
  {
    "url": "assets/js/13.8e9d76a5.js",
    "revision": "a00d4fc749d350d8f0915e8e9e622335"
  },
  {
    "url": "assets/js/14.603d326c.js",
    "revision": "482732fe7bb9826c2b92f2f31f814209"
  },
  {
    "url": "assets/js/15.9bdebf59.js",
    "revision": "64c9571923cd482c953e0ed984ece137"
  },
  {
    "url": "assets/js/16.15e11cfd.js",
    "revision": "a99b62b9b5a281283c447c1cc93890f1"
  },
  {
    "url": "assets/js/17.cee6192e.js",
    "revision": "a12da439a638c08521301f3f3fbde8cf"
  },
  {
    "url": "assets/js/18.50e4fe33.js",
    "revision": "6667720a13fec69764e21a805250bc4d"
  },
  {
    "url": "assets/js/19.76710cd9.js",
    "revision": "05e99819a52556884413af917c4003f9"
  },
  {
    "url": "assets/js/2.1672b9b1.js",
    "revision": "1358825e933908a484fec87c1eaaaa26"
  },
  {
    "url": "assets/js/20.42d178b1.js",
    "revision": "2b9663228c92c53c443e7350ade169e2"
  },
  {
    "url": "assets/js/21.a63bfa9a.js",
    "revision": "b4ff14cfdb2a1f793bec280fa238d570"
  },
  {
    "url": "assets/js/22.51d29a93.js",
    "revision": "bed6e583ed2056d556efbfbc2059cd2d"
  },
  {
    "url": "assets/js/23.cb23296d.js",
    "revision": "091103555ff3ff5fc20ef412bdfa680e"
  },
  {
    "url": "assets/js/24.08477fef.js",
    "revision": "7cb29b669a67039d7db2f1882c0ee700"
  },
  {
    "url": "assets/js/25.53f59ed0.js",
    "revision": "a7db898301cd4c8b361ce7733641a3d1"
  },
  {
    "url": "assets/js/26.792b75d2.js",
    "revision": "8f241afede9a69ef54bf8dd841031db9"
  },
  {
    "url": "assets/js/3.f5842e1d.js",
    "revision": "08d2f2b00b512ac10218ee41269b412b"
  },
  {
    "url": "assets/js/4.c72ea7c2.js",
    "revision": "fd538be67a1e6d11019d338b3b633a6e"
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
    "url": "assets/js/8.ef37e7f3.js",
    "revision": "aa9667333fd09a7fe53da6bd176c5137"
  },
  {
    "url": "assets/js/9.be803b25.js",
    "revision": "7b2e143f900489a2ed85e5be91ef3dc8"
  },
  {
    "url": "assets/js/app.f97dae62.js",
    "revision": "771875e71a5ba1567befa0be1796b7a0"
  },
  {
    "url": "config.html",
    "revision": "47bda15d27525f85f34d0a603adac8cc"
  },
  {
    "url": "guide/index.html",
    "revision": "bff223c1fca44ff13feadb6e4df531ab"
  },
  {
    "url": "img/logo.png",
    "revision": "d80f0c002434e99d0752f85860bebbb2"
  },
  {
    "url": "index.html",
    "revision": "e82b8037de56f894561749770f99abd5"
  },
  {
    "url": "javascript/function.html",
    "revision": "81a940cefaf1894393fc43558b91842b"
  },
  {
    "url": "javascript/index.html",
    "revision": "53fc078a02c4febcbf1918dc08475edb"
  },
  {
    "url": "javascript/json.html",
    "revision": "241878fa4495480613b3641ea6aef834"
  },
  {
    "url": "javascript/letLoopAndClosure.html",
    "revision": "e37bfeaa518406416005dc3dc7283b58"
  },
  {
    "url": "javascript/objectWrapper.html",
    "revision": "8a845228ff3b5d3b840d56e5e3306d62"
  },
  {
    "url": "javascript/promise.html",
    "revision": "bbcc1d0331b0fb1334338f929ec2a6a5"
  },
  {
    "url": "javascript/runner.html",
    "revision": "48bcf2af6b56c5829e093f734eb32b82"
  },
  {
    "url": "javascript/scope.html",
    "revision": "93e22b72faf1d24b97c4736d20c4624d"
  },
  {
    "url": "javascript/typeConversion.html",
    "revision": "24129a87b9a74328647999d45a6e8f5b"
  },
  {
    "url": "javascript/typeof.html",
    "revision": "fd434fd174bcce3420b45245508eb81b"
  },
  {
    "url": "typescript/asConst.html",
    "revision": "9196e2e559d133c05c5b530b6d34830c"
  },
  {
    "url": "typescript/enum.html",
    "revision": "71cdc6f8633a7a0740ee0d03dc0d0886"
  },
  {
    "url": "typescript/never.html",
    "revision": "af57e332deb08ec4f9f18f8d4a938432"
  },
  {
    "url": "typescript/this.html",
    "revision": "fdfee177aa7aa3e67e3e17bfadc7c897"
  },
  {
    "url": "typescript/unknown.html",
    "revision": "5e3d8d913135e1514e0c8fb5ab783d68"
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
