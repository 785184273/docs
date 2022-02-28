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
    "revision": "e94ef76d955ceb6d1d7c57e598717be6"
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
    "url": "assets/js/15.57f91b35.js",
    "revision": "ae8d1caaff6c606d9169819a719b7a9d"
  },
  {
    "url": "assets/js/16.d4371b7d.js",
    "revision": "899c812c334c7b3d8076e7d42a27cbc4"
  },
  {
    "url": "assets/js/17.cf356e3b.js",
    "revision": "07d4798f35f46d7e6e778f9a1c2ab7bc"
  },
  {
    "url": "assets/js/18.077e9838.js",
    "revision": "be9a124b2a1fdfd0d2f157032f92d9da"
  },
  {
    "url": "assets/js/19.ff2fc9e3.js",
    "revision": "619a1b45a86423a2c15bcf0f14ec47ab"
  },
  {
    "url": "assets/js/20.67477ca6.js",
    "revision": "f71d7594a691a63692518d75dc9bf281"
  },
  {
    "url": "assets/js/21.ca71fa1c.js",
    "revision": "e00e80d0c5cdd4c27053aad95aa3f669"
  },
  {
    "url": "assets/js/22.c78898f5.js",
    "revision": "b77372e1cedadac4d31dfdb15bf7c99e"
  },
  {
    "url": "assets/js/23.e570b7ed.js",
    "revision": "19564092895a709cfec0b33684ff5c88"
  },
  {
    "url": "assets/js/24.8b2ba88a.js",
    "revision": "f279b939878ae407bc06bf5574da2077"
  },
  {
    "url": "assets/js/25.ab80b686.js",
    "revision": "d86469288fc01cd2cc135b6f4e4bad8b"
  },
  {
    "url": "assets/js/26.e7ce9445.js",
    "revision": "ce541d275819db7ec21bdbbe605d9927"
  },
  {
    "url": "assets/js/27.63c36cb0.js",
    "revision": "1a008c1cf07cbdc21a2017df1a3e5b85"
  },
  {
    "url": "assets/js/28.5bb8f8ab.js",
    "revision": "58fa6eef5f944e93841acd0600998d93"
  },
  {
    "url": "assets/js/29.1daceda9.js",
    "revision": "8c47ead073128b3cf3125ac6a7db8a69"
  },
  {
    "url": "assets/js/3.1b48434c.js",
    "revision": "a3dbd88225ca8f54ff94885db3135b5b"
  },
  {
    "url": "assets/js/30.b8602c2d.js",
    "revision": "c102d0adaa24600dc3cbc0f2b251e5c8"
  },
  {
    "url": "assets/js/31.151dab49.js",
    "revision": "e8688f86b47dbb64ee7a196d342d3e50"
  },
  {
    "url": "assets/js/32.d33d5ceb.js",
    "revision": "7a516db7df323a88eb1e51938e1d0952"
  },
  {
    "url": "assets/js/33.db5423d2.js",
    "revision": "900b578c3bb60658943d3067b8094e81"
  },
  {
    "url": "assets/js/34.963b2440.js",
    "revision": "02a555f4622b2edc295d228bf70e91bc"
  },
  {
    "url": "assets/js/35.f6bf7659.js",
    "revision": "58e1d3bf42b8375d4a6ec78466641794"
  },
  {
    "url": "assets/js/36.87b37dad.js",
    "revision": "bf08d6b544cce6220381f9ac3996e15f"
  },
  {
    "url": "assets/js/37.81454298.js",
    "revision": "5c69adf68f087dda55e778aa5e7ada1f"
  },
  {
    "url": "assets/js/38.845722ee.js",
    "revision": "f5844c1adc6d038b809c0063bb713213"
  },
  {
    "url": "assets/js/39.13b3bd5e.js",
    "revision": "a704a57cf635c9be86c2c664e4b26858"
  },
  {
    "url": "assets/js/4.480fd2de.js",
    "revision": "06ec2eb0b347a6360a92e4b1153489e9"
  },
  {
    "url": "assets/js/40.9de7b92c.js",
    "revision": "1e73bf3ccf369884f50e51dcc421fcec"
  },
  {
    "url": "assets/js/41.8c81f79f.js",
    "revision": "338119869cacfe0ef7f3e508988ef376"
  },
  {
    "url": "assets/js/42.d1ecd2d0.js",
    "revision": "3758e2c87b844f811776a167be24a5a6"
  },
  {
    "url": "assets/js/43.eb414201.js",
    "revision": "4d62f9a5f75087e65ace9c3d680b9a61"
  },
  {
    "url": "assets/js/44.453344c9.js",
    "revision": "4f78cd7c21f0dc5f1f6df585fed0525a"
  },
  {
    "url": "assets/js/45.973c9907.js",
    "revision": "5cdd4dc8141a4e810f9fdcba8af89eb3"
  },
  {
    "url": "assets/js/46.6cd39dc3.js",
    "revision": "9d8a8660d85c0be5c9d02bdc1b348dd1"
  },
  {
    "url": "assets/js/47.065de3d7.js",
    "revision": "39f6ec71e1537bdbe5d03a68630c0e54"
  },
  {
    "url": "assets/js/48.6eca48a9.js",
    "revision": "7caaabc0bf3c81038fd7a422652c5c20"
  },
  {
    "url": "assets/js/49.e7a371d1.js",
    "revision": "0d7a7824609dbd997bfa11992d161bbc"
  },
  {
    "url": "assets/js/5.cf32e46d.js",
    "revision": "a11b5d29dc7862918c2e79fb3dd265f9"
  },
  {
    "url": "assets/js/50.1172fe75.js",
    "revision": "8dc85d59a76aeb04c252c9accf091edd"
  },
  {
    "url": "assets/js/51.03208651.js",
    "revision": "0d4c063fde7e57f07e3ee00512b9c827"
  },
  {
    "url": "assets/js/52.1f42f1ab.js",
    "revision": "d571bf721fe94a839fd8c98b30095a67"
  },
  {
    "url": "assets/js/53.469422e4.js",
    "revision": "59dd28590dd7d57ae98a794e92263d72"
  },
  {
    "url": "assets/js/54.be263f12.js",
    "revision": "c1cf3fee6aad48fa791e727212f07c5f"
  },
  {
    "url": "assets/js/55.155b5a9c.js",
    "revision": "eb5a0a287e568b3c6776facc8a59c2bc"
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
    "url": "assets/js/app.098e38a1.js",
    "revision": "e9001c0f2548498caa50a5296756480e"
  },
  {
    "url": "categories/index.html",
    "revision": "d758bad6376b6d2ef27166dc85c18b4f"
  },
  {
    "url": "categories/源码分析/index.html",
    "revision": "ae0596f96b2a50b0e856b94a73a513d4"
  },
  {
    "url": "categories/源码分析/page/2/index.html",
    "revision": "205451a717aefef49ceb5688fababfb9"
  },
  {
    "url": "categories/进阶/index.html",
    "revision": "84bbbb274ae20015518befd2b9532d9d"
  },
  {
    "url": "categories/零碎点/index.html",
    "revision": "8bf8f3760468a5ed9842d75883cd4ce3"
  },
  {
    "url": "config.html",
    "revision": "e1fa7df6ee53bd8c762fdfcbf468e511"
  },
  {
    "url": "dataStructure/deque.html",
    "revision": "ec3f0a59248faa8a82634a2b91ec59e7"
  },
  {
    "url": "dataStructure/doublyLinkList.html",
    "revision": "6f0698396c2354f3a1601530547204c0"
  },
  {
    "url": "dataStructure/linkedList.html",
    "revision": "dd170fb7f567d7ecd33f8959dccb00d3"
  },
  {
    "url": "dataStructure/queue.html",
    "revision": "8833196259830bebae6b36f32aef3c14"
  },
  {
    "url": "dataStructure/sortAlgorithm.html",
    "revision": "6e9f2438b4de7452f3b5ac1019c493cf"
  },
  {
    "url": "dataStructure/stack.html",
    "revision": "f5f782b178eff2920bf74ed5419c18f2"
  },
  {
    "url": "guide/index.html",
    "revision": "bafde962ba88f8b40342bf7e86a9ac38"
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
    "revision": "1a6acf0f35d4b2e6ef206c243905f942"
  },
  {
    "url": "javascript/function.html",
    "revision": "75fbdd41613d9348eda010dbe411dc64"
  },
  {
    "url": "javascript/index.html",
    "revision": "3d6b92ced676f342477f4c555ecf5b5f"
  },
  {
    "url": "javascript/json.html",
    "revision": "7902f81f9fe07bcf40a8343777745ef3"
  },
  {
    "url": "javascript/letLoopAndClosure.html",
    "revision": "8342e4cffa17be9432e0213a0a460c67"
  },
  {
    "url": "javascript/objectWrapper.html",
    "revision": "8d7592591bc72d1d65f13df83951cc94"
  },
  {
    "url": "javascript/offset.html",
    "revision": "aa47c074bbf577952f925d2cab332df2"
  },
  {
    "url": "javascript/promise.html",
    "revision": "1e99f382f62f284f097207e1507f16bc"
  },
  {
    "url": "javascript/runner.html",
    "revision": "571d13b5636ba64bb4a29960e8c7ddfb"
  },
  {
    "url": "javascript/scope.html",
    "revision": "7a12360dfb8221183fd934d571f0c693"
  },
  {
    "url": "javascript/typeConversion.html",
    "revision": "ddf90e9654f12e672fbc88daf35ada71"
  },
  {
    "url": "javascript/typeof.html",
    "revision": "4da76cd60c2e2302ddc652e054800f16"
  },
  {
    "url": "live2d/koharu/assets/moc/koharu.2048/texture_00.png",
    "revision": "495eea8d906c2b03abfe3fa9de2f2a8b"
  },
  {
    "url": "tag/index.html",
    "revision": "4e17924ddc31243f0f06cdde6681bc7d"
  },
  {
    "url": "tag/js/index.html",
    "revision": "7678eac0f0920e8102202027262435b4"
  },
  {
    "url": "tag/json/index.html",
    "revision": "b54e024795202b518b746bc246f8fa1c"
  },
  {
    "url": "tag/ts/index.html",
    "revision": "08ace283d5e4b850dcece665b7d7df69"
  },
  {
    "url": "tag/vue/index.html",
    "revision": "df1f012b8c434526a0853ba200cad210"
  },
  {
    "url": "tag/vue/page/2/index.html",
    "revision": "f444451ef09393685c97726e68f93bf9"
  },
  {
    "url": "timeline/index.html",
    "revision": "56e23288d89235862b6abfe087467ab4"
  },
  {
    "url": "typescript/asConst.html",
    "revision": "f8775c942ba736875baa5ca2813c3b24"
  },
  {
    "url": "typescript/enum.html",
    "revision": "6c11fbf3462954b03dcc821ffb51d38b"
  },
  {
    "url": "typescript/never.html",
    "revision": "10ab0da30a82c4b0c18ea12ccdb827cd"
  },
  {
    "url": "typescript/this.html",
    "revision": "008ed1dde08dbea1ca3000099ec5af24"
  },
  {
    "url": "typescript/typeAssertionVSTypeDeclaration.html",
    "revision": "eb379195b120d7abf9e564b63b622550"
  },
  {
    "url": "typescript/unknown.html",
    "revision": "e1058ca5aaa1988fc1706ee66056b690"
  },
  {
    "url": "vue/componentRegistry.html",
    "revision": "a51fe5c7b239942d4aedadccff2870fe"
  },
  {
    "url": "vue/computed.html",
    "revision": "5239f07324cf4a3be865a54e5d81de4d"
  },
  {
    "url": "vue/createComponent.html",
    "revision": "bd8063318c235b20bf11e7e5cc2f1d17"
  },
  {
    "url": "vue/del.html",
    "revision": "76e7c45e5e6ffadee2ec8687276db9fd"
  },
  {
    "url": "vue/depCollection.html",
    "revision": "e97ab1fbef3eb669ba9ef95cea7ac795"
  },
  {
    "url": "vue/domDiff.html",
    "revision": "97f354e728a47707b07277b373d2dd5e"
  },
  {
    "url": "vue/fncCallComponent.html",
    "revision": "2a2e16a389d19f288a0321c1ec0e1ef1"
  },
  {
    "url": "vue/mergeOption.html",
    "revision": "3050c1422ea719eabeca40007ce98ab1"
  },
  {
    "url": "vue/newVue.html",
    "revision": "122784e33f8e185e8fde04bd7d9f3034"
  },
  {
    "url": "vue/nextTick.html",
    "revision": "3c4f2de232e3a249742cb1e4ef61adff"
  },
  {
    "url": "vue/notifyUpdate.html",
    "revision": "5566220113fe9480c79f16689dac8e82"
  },
  {
    "url": "vue/observe.html",
    "revision": "70f8e089bb1ef82c3c3f414eec688747"
  },
  {
    "url": "vue/patch.html",
    "revision": "a334c7dec519f072f2350de08c63a0e9"
  },
  {
    "url": "vue/props.html",
    "revision": "959959d0535e0f104b8f0f694f799bcc"
  },
  {
    "url": "vue/render.html",
    "revision": "705e9b95f49923d685490530b8719306"
  },
  {
    "url": "vue/set.html",
    "revision": "f4d79381fc0174ae19b28093b067a53c"
  },
  {
    "url": "vue/update.html",
    "revision": "50d6f06cdc8578e09b08f4247e761ff8"
  },
  {
    "url": "vue/watch.html",
    "revision": "96ae2c3eb1c81a685f5ce0619f5e18c3"
  },
  {
    "url": "vue/watcher.html",
    "revision": "094d25daa09750faef49caa66eaa3034"
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
