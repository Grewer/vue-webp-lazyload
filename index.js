let lazyLoad = function () {
}

const checkWebpSupport = () => {
  try {
    return (document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0);
  } catch (err) {
    return false;
  }
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

lazyLoad.install = function (Vue, options) {
  // loading 时的图片
  // loading 失败的图片
  // webp true or false 默认 false

  let isSupportWebp = null;

  let {
    loadImg,
    failImg,
    openWebp = true
  } = options

  let check = null

  // openWebp need check


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
    check = checkWebpSupport()
  }

  let replace = (i, isAllow) => {
    // todo fix or remove
    if (isAllow) {
      replace = (i) => {
        let {el, binding} = i
        let webp = binding.value.replace(/(\.jpg|\.png)/g, ".webp")
        loadNewImg(webp).then(() => {
          el.src = webp;
          imgCache[webp] = 1
          i.status = 'loaded'
        }).catch(() => {
          el.src = failImg || ''
        })
      }
      replace(i)
    } else {
      replace = (i) => {
        let {el, binding} = i
        let webp = binding.value
        loadNewImg(webp).then(() => {
          el.src = webp;
          imgCache[webp] = 1
          i.status = 'loaded'
        }).catch(() => {
          el.src = failImg || ''
        })
      }
      replace(i)
    }
  }




  const checkInView = (el) => {
    let {top, bottom, left, right} = el.getBoundingClientRect()
    return (top < window.innerHeight && bottom > 0) &&
      (left < window.innerWidth && right > 0)
  }


  let asyncScroll = null

  const scroll = () => {
    let queue = store.queue
    if (queue.length > 0) {
      for (let i = 0, l = queue.length; i < l; i++) {
        if (queue[i]) {
          if (queue[i].status === 'loaded') {
            queue.splice(i, 1)
            continue;
          }
          load(queue[i])
        }
      }
    }
  }

  window.onscroll = function () {
    if (asyncScroll) {
      clearTimeout(asyncScroll)
    }
    asyncScroll = setTimeout(scroll, 500)
  };


  let imgCache = {} //缓存已经加载过的图片

  const load = (i) => {
    let {el, binding} = i
    let _load = () => {
      if (openWebp) {
        if (isSupportWebp === null) {
          if(check){
            _load = () => {
              replace(i, isSupportWebp)
            }
            _load()
          }
        } else {
          _load = () => {
            replace(i, isSupportWebp)
          }
          _load()
        }
      } else {
        _load = () => {
          loadNewImg(binding.value).then(() => {
            el.src = binding.value;
            imgCache[binding.value] = 1
            i.status = 'loaded'
          }).catch(() => {
            el.src = failImg || ''
          })
        }
        _load()
      }
    }

    Vue.nextTick(() => {
      if (checkInView(el)) {
        if (imgCache[binding.value]) {
          el.src = binding.value
        } else {
          _load()
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
