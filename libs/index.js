let lazyLoad = function () {
}

lazyLoad.store = []

lazyLoad.isSupportWebp = null

lazyLoad.checkWebpSupport = function () {
  try {
    return (document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0);
  } catch (err) {
    return false;
  }
}

lazyLoad.throttle = function () {
  var isClear = arguments[0], fn;
  if (typeof isClear === 'boolean') {
    fn = arguments[1];
    fn.__throttleID && clearTimeout(fn.__throttleID)
  } else {
    fn = isClear;
    var p = Object.assign({
      context: null,
      args: [],
      time: 300,
    }, arguments[1]);

    lazyLoad.throttle(true, fn);

    fn.__throttleID = setTimeout(function () {
      fn.apply(p.context, p.args)
    }, p.time)
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

lazyLoad.load = function (img) {
  let {el, binding} = img
  const url = this.getUrl(binding)
  this.loadNewImg(url).then(() => {
    el.src = url;
  }).catch(() => {
    el.src = this.options.failImg || ''
  })
}

lazyLoad.shouldShow = function (i) {
  const {el} = this.store[i];
  let {top, bottom, left, right} = el.getBoundingClientRect()
  return (top < window.innerHeight && bottom > 0) &&
    (left < window.innerWidth && right > 0)
}

lazyLoad.update = function () {
  const {store} = lazyLoad
  if (!store.length) {
    return;
  }

  let i = store.length;

  while (i--) {
    if (lazyLoad.shouldShow(i)) {
      lazyLoad.load(store[i])
      store.splice(i, 1);
    }
  }
}

lazyLoad.bindEvent = function () {
  const {throttle, update} = this
  window.addEventListener('resize', function () {
    throttle(update, {context: this})
  }, false)
  window.addEventListener('scroll', function () {
    throttle(update, {context: this})
  }, false)
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

  this.bindEvent();

  Vue.directive('webp', {
    bind: (el, binding) => {
      el.src = loadImg
      this.store.push({el, binding, status: 'pending'})
      this.throttle(this.update, {context: this})
    }
  })
}

export default lazyLoad
