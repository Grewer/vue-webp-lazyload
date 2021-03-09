// https://github.com/w3c/IntersectionObserver/blob/main/polyfill/intersection-observer.js

let lazyLoad = function () {
}

const CacheMap = new Map()

lazyLoad.isSupportWebp = null

lazyLoad.checkWebpSupport = function () {
  try {
    return (document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0);
  } catch (err) {
    return false;
  }
}

lazyLoad.loadNewImg = function (src) {
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

lazyLoad.getUrl = function (binding) {
  if (this.options.openWebp && this.isSupportWebp) {
    lazyLoad.getUrl = (binding) => {
      return binding.value.webp || binding.value.image
    }
  } else {
    lazyLoad.getUrl = (binding) => {
      return binding.value.image
    }
  }
  return this.getUrl(binding)
}

// 加载图片
lazyLoad.load = function (info) {
  let {el, binding} = info
  const url = this.getUrl(binding)
  this.loadNewImg(url).then(() => {
    el.src = url;
    info.status = 'resolve'
    CacheMap.set(el, info)
  }).catch(() => {
    el.src = this.options.failImg || ''
    info.status = 'reject'
    CacheMap.set(el, info)
  })
}

// 添加检测
lazyLoad.observer = function () {
  return new IntersectionObserver((entries) => {
    entries.forEach(val => {
      if (val.isIntersecting) {
        const target = val.target
        if (CacheMap.has(target)) {
          const info = CacheMap.get(target)
          if (info.status === 'pending') {
            lazyLoad.load(info)
          }
        }
      }
    })
  }, {
    rootMargin: '0px',
    threshold: 0
  });
}

// 检查图片是否被加载过
lazyLoad.checkComplete = function (url) {
  const img = new Image();
  img.src = url;

  return !!(img.complete || img.width);
}

lazyLoad.install = function (Vue, options) {
  // loading 时的图片
  // loading 失败的图片
  // webp true or false 默认 false
  let {
    loadImg,
    failImg,
    openWebp = true
  } = options

  this.options = {
    loadImg,
    failImg,
    openWebp
  }

  if (openWebp) {
    this.isSupportWebp = this.checkWebpSupport()
  }

  let observer = this.observer()

  Vue.directive('webp', {
    bind: (el, binding) => {

      const target = (this.options.openWebp && this.isSupportWebp) ? binding.value.webp : binding.value.image

      const isLoaded = this.checkComplete(target)

      el.src = isLoaded ? target : loadImg

      CacheMap.set(el, {el, binding, status: isLoaded ? 'resolve' : 'pending'})

      console.log(CacheMap)

      observer.observe(el);
    },
    unbind: (el,) => {
      if (CacheMap.has(el)) {
        CacheMap.delete(el)
      }
    }
  })
}

export default lazyLoad
