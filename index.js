let lazyLoad = function () {}

lazyLoad.install = function (Vue, options) {
  // loading 时的图片 
  // loading 失败的图片
  // webp true or false 默认 false

  let isSupportWebp = null;

  let {loadImg, failImg, openWebp} = options
  let check = null


  let store = {
    queue: [],
    topics: {},
    push: function (value) {
      this.queue.push(value)
      this.topics['push'] && this.topics['push'](value);
    },
    addListener: function (topic, cb) {
      this.topics[topic] = cb;
    }
  };




  if (openWebp) {
    check = (() => {
      return new Promise((resolve, reject) => {
        let webpTestsUri = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
        let image = new Image();

        const addResult = (event) => {
          isSupportWebp = event && event.type === 'load' ? image.width == 1 : false;
          resolve(isSupportWebp)
        }

        image.onerror = addResult;
        image.onload = addResult;
        image.src = webpTestsUri;
      })
    })();

  }

  const replace = (i, isAllow) => {
    let {el, binding} = i
    let webp = isAllow ? binding.value.replace(/(\.jpg|\.png)/g, ".webp") : binding.value
    loadNewImg(webp).then(() => {
      el.src = webp;
      imgCache[webp] = 1
      i.status = 'loaded'
    }).catch(() => {
      el.src = failImg || ''
    })
  }

  const loadNewImg = (src) => {
    return new Promise((resolve, reject) => {
      let img = new Image()
      img.onload = function () {
        resolve()
      }
      img.onerror = function () {
        reject()
      }
      img.src = src
    })
  }
  const checkInView = (el) => {
    let {top, bottom, left, right} = el.getBoundingClientRect()
    return (top < window.innerHeight && bottom > 0) &&
      (left < window.innerWidth && right > 0)
  }


  const scroll = () => {
    let queue = store.queue
    if (queue.length > 0) {
      for (let i = 0, l = queue.length; i < l; i++) {
        if(queue[i]){
          if (queue[i].status === 'loaded') {
            queue[i] = undefined
            continue;
          }
          load(queue[i])
        }
      }
    }
  }

  window.onscroll = scroll;


  let imgCache = {} //缓存已经加载过的图片

  const load = (i) => {
    let {el, binding} = i
    const _load = () => {
      if (openWebp) {
        if (isSupportWebp === null) {
          check.then(() => {
            replace(i, isSupportWebp)
          })
        } else {
          replace(i, isSupportWebp)
        }
      } else {
        loadNewImg(binding.value).then(() => {
          el.src = binding.value;
          imgCache[binding.value] = 1
          i.status = 'loaded'
        }).catch(() => {
          el.src = failImg || ''
        })
      }
    }

    Vue.nextTick(() => {
      if (checkInView(el)) {
        if (!imgCache[binding.value]) {
          _load()
        } else {
          el.src = binding.value
        }
      }
    })

  }


  store.addListener('push', load)

  Vue.directive('webp', {
    bind(el, binding) {
      el.src = loadImg
      store.push({el, binding, status: 'pending'})
    }
  })
}

export default lazyLoad
