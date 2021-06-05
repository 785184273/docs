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
    "revision": "0663b766a453493bb111da016dab3a14"
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
    "url": "assets/js/10.cb0090f5.js",
    "revision": "effb02bf0d6b451a180504afa381df0e"
  },
  {
    "url": "assets/js/11.8c11c10d.js",
    "revision": "87ab86bb2c7a7a5560d10c2a89cb5e72"
  },
  {
    "url": "assets/js/12.47f4f5e7.js",
    "revision": "64ff30be7b029b141ff1c19718e5f0e6"
  },
  {
    "url": "assets/js/13.f2bdecfc.js",
    "revision": "ed95dd1025fbd0f24e1418db147e5111"
  },
  {
    "url": "assets/js/14.64f48975.js",
    "revision": "bf353bec6a9c1f072fb02ec8a82fcb11"
  },
  {
    "url": "assets/js/15.a6b1bb2f.js",
    "revision": "a085d54ae85708c74e88b914c10ee26a"
  },
  {
    "url": "assets/js/16.8bf4e698.js",
    "revision": "1e51c2ed3a710cd1014ca847cbe3bcfd"
  },
  {
    "url": "assets/js/17.690ee4e7.js",
    "revision": "d30f7fdda3acf152e82571858040259c"
  },
  {
    "url": "assets/js/18.8f36d24d.js",
    "revision": "6eae891177a05b198cecd85f48feb972"
  },
  {
    "url": "assets/js/19.96e8cf82.js",
    "revision": "515c69f3c491c9204a63cd4a58673eb9"
  },
  {
    "url": "assets/js/2.1672b9b1.js",
    "revision": "1358825e933908a484fec87c1eaaaa26"
  },
  {
    "url": "assets/js/20.9c93af34.js",
    "revision": "4afa0033e2ade0e23b5779fe032b87af"
  },
  {
    "url": "assets/js/21.87cca84d.js",
    "revision": "ae691bda3bd49482fc2b7df396146b91"
  },
  {
    "url": "assets/js/22.8475a609.js",
    "revision": "e523057b240cd35e3c3120752a0f1e1d"
  },
  {
    "url": "assets/js/23.e986be62.js",
    "revision": "24adaf22a5607020b632c6ae967cbec6"
  },
  {
    "url": "assets/js/24.8e7846a2.js",
    "revision": "1c611be42a008b8ed021c8241dc65083"
  },
  {
    "url": "assets/js/25.25afd60d.js",
    "revision": "c6491c4e1f149a08b673c5befeeaf7f2"
  },
  {
    "url": "assets/js/26.f4dae287.js",
    "revision": "db4114eed1d2acd737145dbb784362d3"
  },
  {
    "url": "assets/js/27.3f1fd7c4.js",
    "revision": "d7a9df9623a2dc0f7deaef02e6e1251b"
  },
  {
    "url": "assets/js/28.b2981e7b.js",
    "revision": "f3152ad098dfe82572abb5ce25a453b8"
  },
  {
    "url": "assets/js/29.5ca55c8e.js",
    "revision": "bfd10bb3753c3bcf962423724bb2f134"
  },
  {
    "url": "assets/js/3.df7a1aed.js",
    "revision": "eacc0577d76752f175041d9a1c84dc1b"
  },
  {
    "url": "assets/js/30.d6086e92.js",
    "revision": "b36fc25f4e090f7f4e88eec42fca71c1"
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
    "url": "assets/js/9.bfc3f41d.js",
    "revision": "21a15882f2444fab81bc7b7b33162981"
  },
  {
    "url": "assets/js/app.525f6b52.js",
    "revision": "17035f8765d43e70853d8c2fd8555a94"
  },
  {
    "url": "config.html",
    "revision": "1bfd2a2439dbb9b0942c05ea2fef6867"
  },
  {
    "url": "dataStructure/deque.html",
    "revision": "85ae4038dc613369667f0425e452dd4f"
  },
  {
    "url": "dataStructure/doublyLinkList.html",
    "revision": "d05be53ad3f700b411a33e3d15d0d7a5"
  },
  {
    "url": "dataStructure/linkedList.html",
    "revision": "0045e1cc4319ed8c77ead01fe3e846eb"
  },
  {
    "url": "dataStructure/queue.html",
    "revision": "465ea5531cb56241641b4726855cf893"
  },
  {
    "url": "dataStructure/sortAlgorithm.html",
    "revision": "29045c91953da92939ae4606da9438c5"
  },
  {
    "url": "dataStructure/stack.html",
    "revision": "240a170c9d6935a6dd52921385ed154d"
  },
  {
    "url": "guide/index.html",
    "revision": "bc50b3c8e88269675f3fbafa20f66116"
  },
  {
    "url": "img/doublyLinkedList1.jpg",
    "revision": "98631431d60e2c9eb736518c5f71571d"
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
    "revision": "7f11bad9eafd64f4a68fb12e5cbeadb1"
  },
  {
    "url": "javascript/function.html",
    "revision": "5659578cdea298cf1cc03df8e4569482"
  },
  {
    "url": "javascript/index.html",
    "revision": "7b3bfa8f3df45170c24e81a0dc959700"
  },
  {
    "url": "javascript/json.html",
    "revision": "d259f014cf4e3e6b624f92fe716f8998"
  },
  {
    "url": "javascript/letLoopAndClosure.html",
    "revision": "7c8416b717e369c8accd4e61f0dca0dc"
  },
  {
    "url": "javascript/objectWrapper.html",
    "revision": "ed8ad07f49128b341dea77d2f2a1e15b"
  },
  {
    "url": "javascript/promise.html",
    "revision": "0a96af550d92195668a0811813794876"
  },
  {
    "url": "javascript/runner.html",
    "revision": "73eef815a23f6ebc2a166dd41c2a1883"
  },
  {
    "url": "javascript/scope.html",
    "revision": "da3f918a1394eed0323968877bb1818e"
  },
  {
    "url": "javascript/typeConversion.html",
    "revision": "f479b23f15d92d5a4384c353d61f446b"
  },
  {
    "url": "javascript/typeof.html",
    "revision": "e99b2d608fe61840589f8ddad1afd19c"
  },
  {
    "url": "other/fncCallComponent.html",
    "revision": "1c82687d903acfb5bfc9bfa3c2b24b69"
  },
  {
    "url": "typescript/asConst.html",
    "revision": "1ff9d155983484fae028daf400d97859"
  },
  {
    "url": "typescript/enum.html",
    "revision": "18f19e97c7f6bb2a105843bd941af389"
  },
  {
    "url": "typescript/never.html",
    "revision": "e2e122db498c5072211d51a341bfe716"
  },
  {
    "url": "typescript/this.html",
    "revision": "92a79fb7df44f44802e445412f7f5f84"
  },
  {
    "url": "typescript/unknown.html",
    "revision": "b10404f9ea21a1de77e2de750a466c3f"
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
