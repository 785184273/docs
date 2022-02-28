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
    "revision": "ed586515f3b25b7030b43a365b40d8af"
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
    "url": "assets/js/14.02f5ea20.js",
    "revision": "0a8c9b41569677d18f6d662289f44834"
  },
  {
    "url": "assets/js/15.8d390461.js",
    "revision": "0e738baab4a53e4374afd293831311dc"
  },
  {
    "url": "assets/js/16.1ed3ac79.js",
    "revision": "3e5ad1829d9e323b1ed94f94d6d17e8c"
  },
  {
    "url": "assets/js/17.cb1b4567.js",
    "revision": "887aae2027cf5b53be970a9910a342aa"
  },
  {
    "url": "assets/js/18.0b71f14f.js",
    "revision": "0b655d3c84072335d622b349c86a27cc"
  },
  {
    "url": "assets/js/19.c2b5ccd6.js",
    "revision": "4b27cadbaccf39ff5b9fb464b7d82609"
  },
  {
    "url": "assets/js/20.b324b619.js",
    "revision": "c728605aa69e43334afd10a142e52ff7"
  },
  {
    "url": "assets/js/21.ca71fa1c.js",
    "revision": "e00e80d0c5cdd4c27053aad95aa3f669"
  },
  {
    "url": "assets/js/22.6e0caea7.js",
    "revision": "c90d47095eb9231c7e150665f8150888"
  },
  {
    "url": "assets/js/23.8b246d6b.js",
    "revision": "b581b4dc4b8c39f020cea887eaebe135"
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
    "url": "assets/js/27.29a6a713.js",
    "revision": "91efd5a172d400a19e962f0f9ef551bb"
  },
  {
    "url": "assets/js/28.16a7a8db.js",
    "revision": "03bd7c75bd18831d945f197d9601dda6"
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
    "url": "assets/js/30.ecec75c8.js",
    "revision": "0a08c18468931ebd82554b4bbb5dfbdf"
  },
  {
    "url": "assets/js/31.a964f2e9.js",
    "revision": "e0157a6940fed218b2000f1791f854d8"
  },
  {
    "url": "assets/js/32.2fdbf7da.js",
    "revision": "031922be8758c8499145c93848f7e15f"
  },
  {
    "url": "assets/js/33.7bf1a817.js",
    "revision": "e04ba0b3e65d89c92a7ede74e7423149"
  },
  {
    "url": "assets/js/34.f3b70be7.js",
    "revision": "2d3b5b2cca5063e4bcc3bdd5f8c5aac2"
  },
  {
    "url": "assets/js/35.90b616a6.js",
    "revision": "da6e0b4b364cacbaaabe4bbeb4cfbae1"
  },
  {
    "url": "assets/js/36.280aca95.js",
    "revision": "9052d249d765f42949fc2583c876e885"
  },
  {
    "url": "assets/js/37.66676fdc.js",
    "revision": "fef510cf8cc9331321297793e6e94035"
  },
  {
    "url": "assets/js/38.6ab84caf.js",
    "revision": "fe25caee55c104e2804cec59dd718d01"
  },
  {
    "url": "assets/js/39.10d6c98f.js",
    "revision": "1c7634e09854ab7a9a9d8d0dd03d74f6"
  },
  {
    "url": "assets/js/4.480fd2de.js",
    "revision": "06ec2eb0b347a6360a92e4b1153489e9"
  },
  {
    "url": "assets/js/40.71c2bcc7.js",
    "revision": "b12d73a1711a77afed4b5f1736b20176"
  },
  {
    "url": "assets/js/41.a47bb798.js",
    "revision": "f472429f542830e33eb97aed09901154"
  },
  {
    "url": "assets/js/42.ab11ef51.js",
    "revision": "1002b81be85b16208a5164494688e16f"
  },
  {
    "url": "assets/js/43.f49fe9f7.js",
    "revision": "6b3bd331921ede0ad328095d5a73bc0f"
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
    "url": "assets/js/47.bbabd9f7.js",
    "revision": "e611c321029e71ea8f837142d1cc3ebc"
  },
  {
    "url": "assets/js/48.90a76f1a.js",
    "revision": "11e8219c6d98c53ee40097eb4c2ad827"
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
    "url": "assets/js/50.7291dccb.js",
    "revision": "2e516eb0f5057b4467d5b37b7fa8e02f"
  },
  {
    "url": "assets/js/51.bd608300.js",
    "revision": "eafcd92943f476ba8f1e1fd790359ecc"
  },
  {
    "url": "assets/js/52.e0935a64.js",
    "revision": "2c3becae4967d5df27a4851c030eec92"
  },
  {
    "url": "assets/js/53.469422e4.js",
    "revision": "59dd28590dd7d57ae98a794e92263d72"
  },
  {
    "url": "assets/js/54.e1a2c487.js",
    "revision": "c5080691541b1480fa46bacdf2a2d159"
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
    "url": "assets/js/app.61fc6413.js",
    "revision": "db64fef1479f6c969f86217647637d7c"
  },
  {
    "url": "categories/index.html",
    "revision": "0e883965dea0f355b1c1ae758c4876b8"
  },
  {
    "url": "categories/源码分析/index.html",
    "revision": "ede34075f753a8e6f8926c2ad68ce42e"
  },
  {
    "url": "categories/源码分析/page/2/index.html",
    "revision": "186290f31ef6699cf33f2f8e3293b4a9"
  },
  {
    "url": "categories/进阶/index.html",
    "revision": "d6ac6f9bed6981cc5d85cd1a1c865498"
  },
  {
    "url": "categories/零碎点/index.html",
    "revision": "efa4bd107cb2078b6667ce9764f87b31"
  },
  {
    "url": "config.html",
    "revision": "c913ac89a91799f45e9929c3473b04a8"
  },
  {
    "url": "dataStructure/deque.html",
    "revision": "e2e4b941a5e730ebaaaa42d6cb87be32"
  },
  {
    "url": "dataStructure/doublyLinkList.html",
    "revision": "9442a5554d157e9b0cfe7f974d8450d0"
  },
  {
    "url": "dataStructure/linkedList.html",
    "revision": "011fb5958be818e6a9c903032e5c2215"
  },
  {
    "url": "dataStructure/queue.html",
    "revision": "50517b4fd8378c93d694ea487a8a53b0"
  },
  {
    "url": "dataStructure/sortAlgorithm.html",
    "revision": "56f9309bd75cf46f55a3a66a74c2ba8d"
  },
  {
    "url": "dataStructure/stack.html",
    "revision": "a33b003de34aff4101cb8e8865ae42c0"
  },
  {
    "url": "guide/index.html",
    "revision": "4915c653e2264ab63aacd9f7c8d553a1"
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
    "revision": "87ffd4514fa592a9cd4fce51b4356266"
  },
  {
    "url": "javascript/function.html",
    "revision": "82522ccb7e446820884426d68ff7572e"
  },
  {
    "url": "javascript/index.html",
    "revision": "b52b435166b2ac0d495f9bc254e2947a"
  },
  {
    "url": "javascript/json.html",
    "revision": "5cf7a96093a88e01ed61e3c434cb719d"
  },
  {
    "url": "javascript/letLoopAndClosure.html",
    "revision": "eb1d228e05cb8ab82f53b8e2e98473d1"
  },
  {
    "url": "javascript/objectWrapper.html",
    "revision": "f90c31ffeb128757f766561702a61569"
  },
  {
    "url": "javascript/offset.html",
    "revision": "466951cedaa9429d5fd6ea62033e0fd6"
  },
  {
    "url": "javascript/promise.html",
    "revision": "1907994e4c4724315eb1c9cec9752ea3"
  },
  {
    "url": "javascript/runner.html",
    "revision": "727725ca9a8d7b1417749158c2a4ec78"
  },
  {
    "url": "javascript/scope.html",
    "revision": "760c0ab16aeaf02c331b726846185412"
  },
  {
    "url": "javascript/typeConversion.html",
    "revision": "525830f14e36d0a1d09cd9b09a2ae93a"
  },
  {
    "url": "javascript/typeof.html",
    "revision": "125e52de86ca4f8b70823345140d20b2"
  },
  {
    "url": "live2d/koharu/assets/moc/koharu.2048/texture_00.png",
    "revision": "495eea8d906c2b03abfe3fa9de2f2a8b"
  },
  {
    "url": "tag/index.html",
    "revision": "9dd953ec03ae4173af1b9c472253da35"
  },
  {
    "url": "tag/js/index.html",
    "revision": "8b032cf44d108b6bc79c3eab93a81350"
  },
  {
    "url": "tag/json/index.html",
    "revision": "3382c4f359087066f66578c8a95cdb97"
  },
  {
    "url": "tag/ts/index.html",
    "revision": "18a4512f23bf52bc547252590281a77d"
  },
  {
    "url": "tag/vue/index.html",
    "revision": "d2b79c49a3ca1e01fff607a360528fd5"
  },
  {
    "url": "tag/vue/page/2/index.html",
    "revision": "f9d19bb3974f01b897415828bc0fdeda"
  },
  {
    "url": "timeline/index.html",
    "revision": "f501f18c859845f40ba174598bdd6eb6"
  },
  {
    "url": "typescript/asConst.html",
    "revision": "9174b7defa27741aea875945495770f2"
  },
  {
    "url": "typescript/enum.html",
    "revision": "d6da7c63c51d884e45e600204e6e89c0"
  },
  {
    "url": "typescript/never.html",
    "revision": "651904abfd01645797a5ed43e45dc07f"
  },
  {
    "url": "typescript/this.html",
    "revision": "251684ce8902d98fe9f8c375e562194b"
  },
  {
    "url": "typescript/typeAssertionVSTypeDeclaration.html",
    "revision": "00e74121863d5077bcf7860dbb703197"
  },
  {
    "url": "typescript/unknown.html",
    "revision": "68a6ff19d59050fcf395ee1e43c7ab83"
  },
  {
    "url": "vue/componentRegistry.html",
    "revision": "7bd611ac3bb10f2fc7528b362967ff8d"
  },
  {
    "url": "vue/computed.html",
    "revision": "7f40ea7910a95c33223a70cd57724d29"
  },
  {
    "url": "vue/createComponent.html",
    "revision": "808d293484f115573111258ff388d83b"
  },
  {
    "url": "vue/del.html",
    "revision": "121af601a53d1a896c70ded158f0c464"
  },
  {
    "url": "vue/depCollection.html",
    "revision": "35f22bd78d0774799af093432d99205f"
  },
  {
    "url": "vue/domDiff.html",
    "revision": "b8047a8388e0c416dc0678686dc34aaa"
  },
  {
    "url": "vue/fncCallComponent.html",
    "revision": "8189b3592adec10ae515ac9d57c87996"
  },
  {
    "url": "vue/mergeOption.html",
    "revision": "865385b1954e78d19652886d0610e348"
  },
  {
    "url": "vue/newVue.html",
    "revision": "33a3c5403fcd63acdbb603e6c9cbf996"
  },
  {
    "url": "vue/nextTick.html",
    "revision": "b4992db364cf1347c6a900d2fe49c9a3"
  },
  {
    "url": "vue/notifyUpdate.html",
    "revision": "bfbad2c3f004b30d7e74051f630017f9"
  },
  {
    "url": "vue/observe.html",
    "revision": "430dac1eb43559242694e4fb5399d033"
  },
  {
    "url": "vue/patch.html",
    "revision": "f5141175beb7d867ffb486b0d0740437"
  },
  {
    "url": "vue/props.html",
    "revision": "66b2a486db4fb34caecfff42568ea785"
  },
  {
    "url": "vue/render.html",
    "revision": "d7a3f8bdb8dcea23c366e505e32d7891"
  },
  {
    "url": "vue/set.html",
    "revision": "1569847cea0a774b9285b38654ba9ea3"
  },
  {
    "url": "vue/update.html",
    "revision": "c9c917ef3e44b9f4a33e49baa0b06b04"
  },
  {
    "url": "vue/watch.html",
    "revision": "67a8d7f41c6a2a9fd1862bbc795294db"
  },
  {
    "url": "vue/watcher.html",
    "revision": "bf4bb90c28e75fc251a2d4dd6b7f4e58"
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
