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
    "revision": "152078575f886f6bfd738d560da3b190"
  },
  {
    "url": "assets/css/0.styles.87662e97.css",
    "revision": "0f7389cb77291fcb657837fcca067558"
  },
  {
    "url": "assets/fonts/iconfont.938fa69e.woff",
    "revision": "938fa69ea89bccb0f20d643cc5f07cbe"
  },
  {
    "url": "assets/fonts/iconfont.ecabaf00.ttf",
    "revision": "ecabaf00c2c5be9907d524bb21a0f0dc"
  },
  {
    "url": "assets/img/bg.2cfdbb33.svg",
    "revision": "2cfdbb338a1d44d700b493d7ecbe65d3"
  },
  {
    "url": "assets/img/claw.f886b8d5.svg",
    "revision": "f886b8d5021c8af029e2cd4dea609bcc"
  },
  {
    "url": "assets/img/sakura.5e4a2cfb.png",
    "revision": "5e4a2cfbc3aae83420146d71ee06ba17"
  },
  {
    "url": "assets/js/1.d74586b3.js",
    "revision": "c79102671e903adc11bcc075a0b0e234"
  },
  {
    "url": "assets/js/10.6c3e9a4d.js",
    "revision": "e893d5caf8746838458440cad5c3cd84"
  },
  {
    "url": "assets/js/11.f7717b31.js",
    "revision": "aee768114114a78b172039b24be4ea45"
  },
  {
    "url": "assets/js/12.dcad633d.js",
    "revision": "8d53bd0ecb6bd4f026c4719ee07056ef"
  },
  {
    "url": "assets/js/13.278f7485.js",
    "revision": "72722f949cc0a8ce10e1f055a2551920"
  },
  {
    "url": "assets/js/14.18c3ba7c.js",
    "revision": "c087360cfad7e11ef1e61b650dfc5c54"
  },
  {
    "url": "assets/js/15.3d12fc4f.js",
    "revision": "7c79d3a0d5e539cf6210bb187a919d86"
  },
  {
    "url": "assets/js/16.1ed3ac79.js",
    "revision": "3e5ad1829d9e323b1ed94f94d6d17e8c"
  },
  {
    "url": "assets/js/17.2936e0c4.js",
    "revision": "3a5f92f05bb8b58b286e08a119505080"
  },
  {
    "url": "assets/js/18.077e9838.js",
    "revision": "be9a124b2a1fdfd0d2f157032f92d9da"
  },
  {
    "url": "assets/js/19.a0eac17a.js",
    "revision": "2b2b0cb6c34236a1fd44a8aab639db04"
  },
  {
    "url": "assets/js/20.b7ed0371.js",
    "revision": "9f590fdfe0bbb009b76d247ae354bebb"
  },
  {
    "url": "assets/js/21.ca71fa1c.js",
    "revision": "e00e80d0c5cdd4c27053aad95aa3f669"
  },
  {
    "url": "assets/js/22.1900b5f8.js",
    "revision": "5eef32134b80d68ea20c486b538557fd"
  },
  {
    "url": "assets/js/23.ad35a77d.js",
    "revision": "2d305dc2f6845302cbd994e8090e712b"
  },
  {
    "url": "assets/js/24.90a7c311.js",
    "revision": "8c1aa4b97a3f48971b8f4a0499633634"
  },
  {
    "url": "assets/js/25.4b0595dd.js",
    "revision": "76aeab38c41a5ecd544a19d97834f16e"
  },
  {
    "url": "assets/js/26.e6f521f3.js",
    "revision": "3e1d368aef18369e6105d7d971ab2ff8"
  },
  {
    "url": "assets/js/27.4a080772.js",
    "revision": "83e07905656471bdfec0838a01f9031c"
  },
  {
    "url": "assets/js/28.bd7442b0.js",
    "revision": "ca260abe02ef5f61b5ebe88caee5652b"
  },
  {
    "url": "assets/js/29.73b0c28b.js",
    "revision": "9954c0906155754478f9cbc15a4302e2"
  },
  {
    "url": "assets/js/3.1b48434c.js",
    "revision": "a3dbd88225ca8f54ff94885db3135b5b"
  },
  {
    "url": "assets/js/30.b36d5338.js",
    "revision": "03e27bd27587d510efdc5f775a73c05c"
  },
  {
    "url": "assets/js/31.0c269324.js",
    "revision": "30a4c89d0af8993210600c88862c6d5b"
  },
  {
    "url": "assets/js/32.5bb736cc.js",
    "revision": "782cf54b628ed6555225c455d5b96b21"
  },
  {
    "url": "assets/js/33.db5423d2.js",
    "revision": "900b578c3bb60658943d3067b8094e81"
  },
  {
    "url": "assets/js/34.bba81a63.js",
    "revision": "1229dee0159c46ebedcfe9c1516b3903"
  },
  {
    "url": "assets/js/35.b50efec2.js",
    "revision": "77b62b6fdf102b2514b7bff967f2746a"
  },
  {
    "url": "assets/js/36.5b94b2b2.js",
    "revision": "965ae85456e7587e5b73cb7d36b5e7b5"
  },
  {
    "url": "assets/js/37.89d67897.js",
    "revision": "8ee66b5d650a7096b00d559947fdae80"
  },
  {
    "url": "assets/js/38.77d980a2.js",
    "revision": "23fd20fcb5bd931de3dddcd31059366d"
  },
  {
    "url": "assets/js/39.e4284509.js",
    "revision": "b429b14fe5e7ed29f036bab1ec35f082"
  },
  {
    "url": "assets/js/4.480fd2de.js",
    "revision": "06ec2eb0b347a6360a92e4b1153489e9"
  },
  {
    "url": "assets/js/40.9be329f0.js",
    "revision": "dc6845da7ef2795b577962b2e4831493"
  },
  {
    "url": "assets/js/41.8c81f79f.js",
    "revision": "338119869cacfe0ef7f3e508988ef376"
  },
  {
    "url": "assets/js/42.ab11ef51.js",
    "revision": "1002b81be85b16208a5164494688e16f"
  },
  {
    "url": "assets/js/43.ce9ce0c7.js",
    "revision": "79b521cf8680ea3e0ed9a2beac7f3fe9"
  },
  {
    "url": "assets/js/44.ae399fbe.js",
    "revision": "38ff50ca12068e6740a158c21f087c8e"
  },
  {
    "url": "assets/js/45.16c6b8ef.js",
    "revision": "8f51bb4aaacd6adf0f9a25d8f66eb526"
  },
  {
    "url": "assets/js/46.8aa3cf6e.js",
    "revision": "608c02785b2d9419a4a2b22b0e22c30c"
  },
  {
    "url": "assets/js/47.2d5594f9.js",
    "revision": "42376d6de1d3d55d1d7abb58ca7c7e8e"
  },
  {
    "url": "assets/js/48.805f63a5.js",
    "revision": "e49176b43addeb04362b9f013eab2e01"
  },
  {
    "url": "assets/js/49.9051862e.js",
    "revision": "2ed5e8580623da3823fc99b8518efddf"
  },
  {
    "url": "assets/js/5.cf32e46d.js",
    "revision": "a11b5d29dc7862918c2e79fb3dd265f9"
  },
  {
    "url": "assets/js/50.9d477036.js",
    "revision": "7714c94d6a550245a34b164cfbd1aac9"
  },
  {
    "url": "assets/js/51.46dd8125.js",
    "revision": "c2588b53eb528c05bc36f4ed32bbf759"
  },
  {
    "url": "assets/js/52.7d11e3b6.js",
    "revision": "c91ce5d39ad59bcd501828b3bdd8bee9"
  },
  {
    "url": "assets/js/53.ffe24c11.js",
    "revision": "da29b136c8d8c622c963dbfd930729da"
  },
  {
    "url": "assets/js/54.652cdefa.js",
    "revision": "07b388d959cf852e9960b099f3d211b9"
  },
  {
    "url": "assets/js/55.a31fabe0.js",
    "revision": "e56d294da10f942c112283be41dbb73e"
  },
  {
    "url": "assets/js/56.04e6bb83.js",
    "revision": "352a176909cc4eac7c65febdbb799cb1"
  },
  {
    "url": "assets/js/6.e88f238d.js",
    "revision": "4e88472958fc8348b0fe70241fc452f2"
  },
  {
    "url": "assets/js/7.c07cab5d.js",
    "revision": "b87d470e8931fec89d80c4a5f59736d0"
  },
  {
    "url": "assets/js/8.ed40359f.js",
    "revision": "215b626e200ccd64290fc2d9a7f5c61e"
  },
  {
    "url": "assets/js/9.7ab461d2.js",
    "revision": "72556e57d5e99c5251e034823b8aa7d8"
  },
  {
    "url": "assets/js/app.a90dc84e.js",
    "revision": "6110a5b2ba7b126d8490553b36536396"
  },
  {
    "url": "categories/index.html",
    "revision": "2e085e7ab24e7d9e3db013bec32c7814"
  },
  {
    "url": "categories/源码分析/index.html",
    "revision": "d92c67f098e5db2ce7e3feebe8c8a5cb"
  },
  {
    "url": "categories/源码分析/page/2/index.html",
    "revision": "885e2fe5b28c5474bca56be162685760"
  },
  {
    "url": "categories/进阶/index.html",
    "revision": "7823878792b59167f68f165f99b14a07"
  },
  {
    "url": "categories/零碎点/index.html",
    "revision": "1a6814f3dbd2b2ded2d2a363495a297c"
  },
  {
    "url": "config.html",
    "revision": "07975d79e86fd2a48f86c957727eac0a"
  },
  {
    "url": "dataStructure/deque.html",
    "revision": "648f6be040d25ece58a465e57d0f53f9"
  },
  {
    "url": "dataStructure/doublyLinkList.html",
    "revision": "79959c241ffe5fe41c05f3d949d951bc"
  },
  {
    "url": "dataStructure/linkedList.html",
    "revision": "b083d2d9bdb6872a3db5ec9a99e4c706"
  },
  {
    "url": "dataStructure/queue.html",
    "revision": "a53999119dbf5ee2148d6c24990b16a7"
  },
  {
    "url": "dataStructure/sortAlgorithm.html",
    "revision": "88c4274eca3a81c162b650a23d4ec51e"
  },
  {
    "url": "dataStructure/stack.html",
    "revision": "fbbae6d65877c013961adb210a19ed46"
  },
  {
    "url": "guide/index.html",
    "revision": "01c27a82ecf1043765ca5b551cc2a495"
  },
  {
    "url": "img/avatar.jpg",
    "revision": "b820cfda200d881097ac62e56043e03e"
  },
  {
    "url": "img/bubble.gif",
    "revision": "33a947c71ad62b254cab62e5364d2813"
  },
  {
    "url": "img/depCollection1.png",
    "revision": "161fdc112673cb26367f98a908c369d2"
  },
  {
    "url": "img/depCollection2.png",
    "revision": "1eab249273d47e4f9804b01b5bb591fa"
  },
  {
    "url": "img/depCollection3.png",
    "revision": "2d6baacd2de7cae1a9c4ba16fee6d14b"
  },
  {
    "url": "img/depCollection4.png",
    "revision": "83c1376742cb56ffb58c6293ab06bb2f"
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
    "url": "img/main-bg.jpg",
    "revision": "6048dbd23a35727bcfa1b64f4e9eff0d"
  },
  {
    "url": "img/main-bg1.jpeg",
    "revision": "f3cfc40ae292cf1496f31f55e0f8ef1a"
  },
  {
    "url": "img/merge.jpg",
    "revision": "a15a4fe29b8b4245c6a30f329cc5592a"
  },
  {
    "url": "img/offset.png",
    "revision": "cbf8d01bafae3c57218e1889cd326ab8"
  },
  {
    "url": "img/renderProcess.png",
    "revision": "da6353399e099d729a3e5728898b959c"
  },
  {
    "url": "img/selection.gif",
    "revision": "1c7e20f306ddc02eb4e3a50fa7817ff4"
  },
  {
    "url": "index.html",
    "revision": "1784dd0779c3af6548c52599922e7378"
  },
  {
    "url": "javascript/function.html",
    "revision": "a41e58451acc98352b1f60113c246b89"
  },
  {
    "url": "javascript/index.html",
    "revision": "eaa6d3491b1836750e9955f004add90b"
  },
  {
    "url": "javascript/json.html",
    "revision": "26c76c920d9019d580c607d88937018f"
  },
  {
    "url": "javascript/letLoopAndClosure.html",
    "revision": "dbd3a25d6fc97e02403ee9ed324b070b"
  },
  {
    "url": "javascript/objectWrapper.html",
    "revision": "4b1523c249898d1c12922f653f235e56"
  },
  {
    "url": "javascript/offset.html",
    "revision": "998dbbba57d1ef1560f0c0436483c64d"
  },
  {
    "url": "javascript/promise.html",
    "revision": "8afdc1aabafcfc78443ab744780dbdf2"
  },
  {
    "url": "javascript/runner.html",
    "revision": "73281c2158350661f09ae6dcedc2fb0e"
  },
  {
    "url": "javascript/scope.html",
    "revision": "1b7d048fe3d579e2865b7397dcb284c2"
  },
  {
    "url": "javascript/typeConversion.html",
    "revision": "dea29add8f8ee428a752277327eb935d"
  },
  {
    "url": "javascript/typeof.html",
    "revision": "cd372eb5e6230e0f9a550522952e5d79"
  },
  {
    "url": "live2d/koharu/assets/moc/koharu.2048/texture_00.png",
    "revision": "495eea8d906c2b03abfe3fa9de2f2a8b"
  },
  {
    "url": "tag/index.html",
    "revision": "1bd492b431409b8a51881ffc3c8bdf21"
  },
  {
    "url": "tag/js/index.html",
    "revision": "0a70d3562a6797df4ecabf75c80c001d"
  },
  {
    "url": "tag/json/index.html",
    "revision": "ee091e91cb73afad40505e6e3bc9bb0b"
  },
  {
    "url": "tag/ts/index.html",
    "revision": "787dac94c0bd652cd6a69e8ddd8df40f"
  },
  {
    "url": "tag/vue/index.html",
    "revision": "d5b96e355c95fada77a365a8b0fd221b"
  },
  {
    "url": "tag/vue/page/2/index.html",
    "revision": "a4a03f38e89de107d601ce69ccb3982e"
  },
  {
    "url": "timeline/index.html",
    "revision": "21d2e8f16f85694433962d8969b2282d"
  },
  {
    "url": "typescript/asConst.html",
    "revision": "237c5ddc3480b547ef1530c1b26c8683"
  },
  {
    "url": "typescript/enum.html",
    "revision": "ddb2e9ab80c5965dcf344c179081fa02"
  },
  {
    "url": "typescript/never.html",
    "revision": "33929a4187c412c2a8c27b8c889e6c72"
  },
  {
    "url": "typescript/this.html",
    "revision": "1e32d2f485ac218c4da3bfc047054be1"
  },
  {
    "url": "typescript/typeAssertionVSTypeDeclaration.html",
    "revision": "e18e438cecf2e02b57bf7716fadfc913"
  },
  {
    "url": "typescript/unknown.html",
    "revision": "50e2ac042d870fbd2c459821010560f0"
  },
  {
    "url": "vue/componentRegistry.html",
    "revision": "c0e946275d7e04c6b1f17f07eb606f0a"
  },
  {
    "url": "vue/computed.html",
    "revision": "57a110f3d5bf1f348603bdde6e825085"
  },
  {
    "url": "vue/createComponent.html",
    "revision": "fd41bb380c641dc66805d809a7b438f7"
  },
  {
    "url": "vue/del.html",
    "revision": "1792759f597249b31b353f329f82e9ed"
  },
  {
    "url": "vue/depCollection.html",
    "revision": "efbc305b0cc4cc4b9266f1ad5fef5302"
  },
  {
    "url": "vue/domDiff.html",
    "revision": "3a581fc512360c102f81f90cd40207d2"
  },
  {
    "url": "vue/fncCallComponent.html",
    "revision": "a7267e7f4d5bd9a808ace705f1ea7815"
  },
  {
    "url": "vue/mergeOption.html",
    "revision": "80460c14526c4926d10080c89aaec379"
  },
  {
    "url": "vue/newVue.html",
    "revision": "d66328f4fd0bff881c7d80a0239a5205"
  },
  {
    "url": "vue/nextTick.html",
    "revision": "12e51c407439e248d8dea2d7ac9dc306"
  },
  {
    "url": "vue/notifyUpdate.html",
    "revision": "3c3e3444e79b671ebb79b47a7af3eca1"
  },
  {
    "url": "vue/observe.html",
    "revision": "383ab7153b639d9c8ea0d8e9f9bf13ae"
  },
  {
    "url": "vue/patch.html",
    "revision": "72493fb492e9554660d380d1572c4b31"
  },
  {
    "url": "vue/props.html",
    "revision": "419ae5cba810fd13b96c7d7b78c7a8ad"
  },
  {
    "url": "vue/render.html",
    "revision": "efa0dc53d56bef4232e56a43e2bcedca"
  },
  {
    "url": "vue/set.html",
    "revision": "8012ef7eef3a9be1ca7544dca4827678"
  },
  {
    "url": "vue/update.html",
    "revision": "b19a7d98927caeed065d3d9aeec48d34"
  },
  {
    "url": "vue/watch.html",
    "revision": "7e14c2ac176ef83756559b00c75980c7"
  },
  {
    "url": "vue/watcher.html",
    "revision": "41195b39d9be627f9f02c3c044bbe5cc"
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
