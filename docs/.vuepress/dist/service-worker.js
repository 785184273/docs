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
    "revision": "b071ba96bc687605a1d21a4cc8baa818"
  },
  {
    "url": "assets/css/0.styles.121133b5.css",
    "revision": "29b02f3f3ea850219cb4f4d76e61474a"
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
    "url": "assets/js/1.1b7b1ef7.js",
    "revision": "94ea9781d372dfca9cfebb9a2dad11af"
  },
  {
    "url": "assets/js/10.ba9d6258.js",
    "revision": "163de76ee4d97c47f2cc4c583fc797f7"
  },
  {
    "url": "assets/js/11.42a78baf.js",
    "revision": "85afb939726e0538094a448cc50c6190"
  },
  {
    "url": "assets/js/12.584b8952.js",
    "revision": "a813c4d8815f9a07021a0d213cbd266e"
  },
  {
    "url": "assets/js/13.5fb0b069.js",
    "revision": "0493278a6b2b780ed7459dada472bcc4"
  },
  {
    "url": "assets/js/14.5efb41cf.js",
    "revision": "a7a351534f1ddc713ab5878e3a5cf7e2"
  },
  {
    "url": "assets/js/15.dbb541e6.js",
    "revision": "a09b7ce137d09d406f7446e45c65585c"
  },
  {
    "url": "assets/js/16.99b414cc.js",
    "revision": "9060a4266d9609ff69b46529c7472f8a"
  },
  {
    "url": "assets/js/17.96ab9e9f.js",
    "revision": "a00f1c2ef6ee2fbbb5ac1de4a2fd5942"
  },
  {
    "url": "assets/js/18.b9da1c56.js",
    "revision": "11d85bc2daf74678105b2ddd92fc37da"
  },
  {
    "url": "assets/js/19.afb1bb11.js",
    "revision": "7cfd8ded76e67543f5018d5fd448ffcc"
  },
  {
    "url": "assets/js/20.0dc44c56.js",
    "revision": "a26bcf55363ed39460ec97940af4f0ac"
  },
  {
    "url": "assets/js/21.79f512a4.js",
    "revision": "1f84d31cbc931f0d46a88d97d4295aeb"
  },
  {
    "url": "assets/js/22.062e89db.js",
    "revision": "812c0ba276370cd8c2b8f6a316c9611a"
  },
  {
    "url": "assets/js/23.56c61a63.js",
    "revision": "fc4d0f8db5e9c98241ec95518ddf16ba"
  },
  {
    "url": "assets/js/24.66761207.js",
    "revision": "abda1da025a258763c56688cfd3d61a8"
  },
  {
    "url": "assets/js/25.0b6561ac.js",
    "revision": "0410a2b72c789bbab37183ccf4af8348"
  },
  {
    "url": "assets/js/26.804512b4.js",
    "revision": "70db31359d06dd821996b3d36e8f4ed7"
  },
  {
    "url": "assets/js/27.e9176008.js",
    "revision": "ec19a9e74c38f1796cdc95bcac4709d4"
  },
  {
    "url": "assets/js/28.5539ac6e.js",
    "revision": "20468a4f4804d767b145c2e092a2bc52"
  },
  {
    "url": "assets/js/29.873f551a.js",
    "revision": "90c41114d9e9f0315f08aa84f8f1570f"
  },
  {
    "url": "assets/js/3.df85a174.js",
    "revision": "9c05e86a97b3e73d8d00d5744ac8cac9"
  },
  {
    "url": "assets/js/30.82159861.js",
    "revision": "6bdcb6dcc573e9a64c33c17f45650787"
  },
  {
    "url": "assets/js/31.735852ec.js",
    "revision": "5ae219865db2a5c648f805f3fbe0f7b1"
  },
  {
    "url": "assets/js/32.4a2c6e08.js",
    "revision": "e523149089d6588c6d6e82deee334284"
  },
  {
    "url": "assets/js/33.3537b009.js",
    "revision": "e78d4de30f817ffa6fd9a65b546924b4"
  },
  {
    "url": "assets/js/34.ec4d9cfd.js",
    "revision": "45912d847737e8f26231e9b2c694f39e"
  },
  {
    "url": "assets/js/35.320fc1bd.js",
    "revision": "60d6c948f0ffef560452db89b7709854"
  },
  {
    "url": "assets/js/36.9bc028c5.js",
    "revision": "8b7b41b25bafeec3c3a23d1b6fcc25b6"
  },
  {
    "url": "assets/js/37.4c61df51.js",
    "revision": "49db33f281eb158ce98ac60bad25e319"
  },
  {
    "url": "assets/js/38.545cb274.js",
    "revision": "f5505682a7305de141d9fbfe260771ee"
  },
  {
    "url": "assets/js/39.59c27411.js",
    "revision": "1b131882f361c2c9963ad064059042a4"
  },
  {
    "url": "assets/js/4.80edc7d2.js",
    "revision": "b4be0493c2802214e9b2fcb257087c29"
  },
  {
    "url": "assets/js/40.a84b60e4.js",
    "revision": "9dbe6fb82e240fee02420c3f8dcaa518"
  },
  {
    "url": "assets/js/41.bcd67e79.js",
    "revision": "bb06b2c101348912873e6e6f438198dc"
  },
  {
    "url": "assets/js/42.0ed4d80b.js",
    "revision": "789d9eb4257655fee0c21fd47768dd9d"
  },
  {
    "url": "assets/js/43.2ecaa3a2.js",
    "revision": "19b987b5c2256c23473e92b7ad0de571"
  },
  {
    "url": "assets/js/44.213d5dbd.js",
    "revision": "e2977d10bcb497b0db1482e4cbeade77"
  },
  {
    "url": "assets/js/45.6d7efd76.js",
    "revision": "34dbebbe28c34bc9eb801992775ea5d2"
  },
  {
    "url": "assets/js/46.c78a67ee.js",
    "revision": "b08f86e55112a3c31b9630b379645171"
  },
  {
    "url": "assets/js/47.b83aefa8.js",
    "revision": "7a027205b0586c89787d03d87fb195e7"
  },
  {
    "url": "assets/js/48.70c446de.js",
    "revision": "fe2574b98e4488a3a5d80c5cc5b6ab57"
  },
  {
    "url": "assets/js/49.c686425e.js",
    "revision": "a4d746a85334a379eaef5507722f1db5"
  },
  {
    "url": "assets/js/5.324091c9.js",
    "revision": "82536708da9b3e8ce16469298a714087"
  },
  {
    "url": "assets/js/50.5098c51c.js",
    "revision": "67e4082d4555105ba3c5dcbe0de79614"
  },
  {
    "url": "assets/js/51.29b3d865.js",
    "revision": "def625ac6827bb5068a8bf22991db9a5"
  },
  {
    "url": "assets/js/52.7cdbcaf6.js",
    "revision": "d94cacbb3a4964420cb15a8606cca828"
  },
  {
    "url": "assets/js/53.05daced5.js",
    "revision": "08c09c0958f37f17f33537fe102e58e0"
  },
  {
    "url": "assets/js/54.e0520ee2.js",
    "revision": "71a2e46216b11007b5ec5fc09f68693c"
  },
  {
    "url": "assets/js/55.0174227c.js",
    "revision": "95b13ccb723455b68ddb9e64335c84bb"
  },
  {
    "url": "assets/js/56.64e1b8a1.js",
    "revision": "ae6a064d1bb5352e08c1a00909f04976"
  },
  {
    "url": "assets/js/6.1e15eb58.js",
    "revision": "b027af5c567e48007c8e79ebf51bf352"
  },
  {
    "url": "assets/js/7.ffba2910.js",
    "revision": "26df9d181b6477bab99cddfeca651781"
  },
  {
    "url": "assets/js/8.c8536361.js",
    "revision": "992f624947246ac4a24af8260fcbc7d9"
  },
  {
    "url": "assets/js/9.a5f70f0b.js",
    "revision": "07e0378df543c5b478023d9864b8c6af"
  },
  {
    "url": "assets/js/app.efd87015.js",
    "revision": "f1f3801e8d28145ca35a50cc254daadd"
  },
  {
    "url": "categories/index.html",
    "revision": "57856221b2747a67b6c55e03eae8e203"
  },
  {
    "url": "categories/源码分析/index.html",
    "revision": "65c9360084fc025c8481c6e681b51238"
  },
  {
    "url": "categories/源码分析/page/2/index.html",
    "revision": "a816ebd52453909ee330796635c29cf3"
  },
  {
    "url": "categories/进阶/index.html",
    "revision": "c3b4de7c4a04a26d0fd0689750cbe006"
  },
  {
    "url": "categories/零碎点/index.html",
    "revision": "4026cf48d9ebdb32d7fd471b4cb24dde"
  },
  {
    "url": "config.html",
    "revision": "a2354ce9683eb9a29ec373fa313996c4"
  },
  {
    "url": "dataStructure/deque.html",
    "revision": "41dcda5ae10b0f7646b3a2d475a1b4ee"
  },
  {
    "url": "dataStructure/doublyLinkList.html",
    "revision": "b47df03e56519520e16b6085fa3d83bd"
  },
  {
    "url": "dataStructure/linkedList.html",
    "revision": "6dcbbe72fa8e0f36ef6517c2956d7ace"
  },
  {
    "url": "dataStructure/queue.html",
    "revision": "98e837348f6f7b87455d695f8965d75b"
  },
  {
    "url": "dataStructure/sortAlgorithm.html",
    "revision": "16615557807550eb69fec8efbcb788b3"
  },
  {
    "url": "dataStructure/stack.html",
    "revision": "d359f33f764e462cc167f0141359019f"
  },
  {
    "url": "guide/index.html",
    "revision": "5448b1a547fb802cddb1961121943a78"
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
    "revision": "0e0b766c9396be685cb2fa8155166801"
  },
  {
    "url": "javascript/function.html",
    "revision": "20a4e79e3797c157c9cb60c4e13c4c58"
  },
  {
    "url": "javascript/index.html",
    "revision": "14a14d81484c1f41a17a1d1d7a490a46"
  },
  {
    "url": "javascript/json.html",
    "revision": "607d70d5151ce59cb642485ed2261302"
  },
  {
    "url": "javascript/letLoopAndClosure.html",
    "revision": "cf526aea0a86c85f51eafb05443e5d9b"
  },
  {
    "url": "javascript/objectWrapper.html",
    "revision": "44cd97df5393b6469592a91cd9439dd8"
  },
  {
    "url": "javascript/offset.html",
    "revision": "6e6041305fde876e626c50b321ddc437"
  },
  {
    "url": "javascript/promise.html",
    "revision": "fa17508750e68fb35927fbb1deb341d2"
  },
  {
    "url": "javascript/runner.html",
    "revision": "cb7388a38c392bd97c706721aa40f6af"
  },
  {
    "url": "javascript/scope.html",
    "revision": "dc047e1c87745cb64cb47c90a4750279"
  },
  {
    "url": "javascript/typeConversion.html",
    "revision": "b13d8397a766d34ac22fa86a34bc4b56"
  },
  {
    "url": "javascript/typeof.html",
    "revision": "6527f9e6e30e9faf9cf65372f4dcdfec"
  },
  {
    "url": "live2d/koharu/assets/moc/koharu.2048/texture_00.png",
    "revision": "495eea8d906c2b03abfe3fa9de2f2a8b"
  },
  {
    "url": "tag/index.html",
    "revision": "5d96e8eb8d7b530c30da1d0ad3fbfcbe"
  },
  {
    "url": "tag/js/index.html",
    "revision": "3d6b0676a1f489c98c880793e432a649"
  },
  {
    "url": "tag/json/index.html",
    "revision": "ca7fdc50b171b6ec5b3cac10b5e5271a"
  },
  {
    "url": "tag/ts/index.html",
    "revision": "6bb862c0ea4e20ae442176aaa8498551"
  },
  {
    "url": "tag/vue/index.html",
    "revision": "9d846d65ec7fc5196542f8ea3ea741c5"
  },
  {
    "url": "tag/vue/page/2/index.html",
    "revision": "1ba399bfdc7d550ad4e627a86e258119"
  },
  {
    "url": "timeline/index.html",
    "revision": "e00fc032c9d7a29b6e8620f9102e3555"
  },
  {
    "url": "typescript/asConst.html",
    "revision": "2af42575160dc8e7622a51c98a079c40"
  },
  {
    "url": "typescript/enum.html",
    "revision": "6872466a957b628617fe874154af4fec"
  },
  {
    "url": "typescript/never.html",
    "revision": "08fde55a527799712d64d195c5c690a7"
  },
  {
    "url": "typescript/this.html",
    "revision": "e27b575798890e730f134d34e29d3889"
  },
  {
    "url": "typescript/typeAssertionVSTypeDeclaration.html",
    "revision": "fd133e88fe7a0ed01df640b4bc99f871"
  },
  {
    "url": "typescript/unknown.html",
    "revision": "4affd2862f0491b5eeba0b8947027c90"
  },
  {
    "url": "vConsole.js",
    "revision": "b39b004da919d015be786149f3130b2e"
  },
  {
    "url": "vue/componentRegistry.html",
    "revision": "4c9f7da05f90fb5692ec90e4ae89b4df"
  },
  {
    "url": "vue/computed.html",
    "revision": "3eae7165bb755afe808a3ed70d7eba04"
  },
  {
    "url": "vue/createComponent.html",
    "revision": "117da1628464660a8faab3c1a41af6ff"
  },
  {
    "url": "vue/del.html",
    "revision": "b4206e4a5b9001c63834dc342b0af0c3"
  },
  {
    "url": "vue/depCollection.html",
    "revision": "d8560a4f5d842778e6c965ef748376e5"
  },
  {
    "url": "vue/domDiff.html",
    "revision": "8099a7808ff7a81244138dafbec0197f"
  },
  {
    "url": "vue/fncCallComponent.html",
    "revision": "906be9c6f3cc0ffb8802ee63592c9d5b"
  },
  {
    "url": "vue/mergeOption.html",
    "revision": "e02c62db6b29db466612b26e1b19ca1c"
  },
  {
    "url": "vue/newVue.html",
    "revision": "ee868ad54ad08953ffd71116065b9c5d"
  },
  {
    "url": "vue/nextTick.html",
    "revision": "dd16e5555717b5b0040a66d7516f039e"
  },
  {
    "url": "vue/notifyUpdate.html",
    "revision": "2d33a146119e9d6d95f9b7b8f1ae435a"
  },
  {
    "url": "vue/observe.html",
    "revision": "0a8c4d9bf3d3c510246d5dda4eb0b8f4"
  },
  {
    "url": "vue/patch.html",
    "revision": "c5456efe69ecdda03fd4597b916d4ac8"
  },
  {
    "url": "vue/props.html",
    "revision": "1bbcd3203b116e3c11626552bfa808d9"
  },
  {
    "url": "vue/render.html",
    "revision": "b41f5ee9d07be327f6b7c6381d1c5364"
  },
  {
    "url": "vue/set.html",
    "revision": "ef52cf9d171e393a1a656785beb2ce27"
  },
  {
    "url": "vue/update.html",
    "revision": "dc37879bbd819ff44b188039e8cfbbcf"
  },
  {
    "url": "vue/watch.html",
    "revision": "e27772615a50213fa8a223c4d084e689"
  },
  {
    "url": "vue/watcher.html",
    "revision": "5af68147d948f3a64923bb17dd27c322"
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
