let store = []; // store images


class Utils {
  static options = {}

  static isSupportWebp = null

  static checkWebpSupport = () => {
    try {
      return (document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0);
    } catch (err) {
      return false;
    }
  }

  static throttle = function () {
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

      Utils.throttle(true, fn);

      fn.__throttleID = setTimeout(function () {
        fn.apply(p.context, p.args)
      }, p.time)
    }
  }

  static loadNewImg = (src) => {
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

  static getUrl = (binding) => {
    if (Utils.options.openWebp && Utils.isSupportWebp) {
      Utils.getUrl = (binding) => {
        return binding.value.webp || binding.value.image
      }
    } else {
      Utils.getUrl = (binding) => {
        return binding.value.image
      }
    }
    return Utils.getUrl(binding)
  }

  static load = (img) => {
    let {el, binding} = img
    const url = Utils.getUrl(binding)
    Utils.loadNewImg(url).then(() => {
      el.src = url;
    }).catch(() => {
      el.src = Utils.options.failImg || ''
    })
  }

  static shouldShow = (i) => {
    const {el} = store[i];
    let {top, bottom, left, right} = el.getBoundingClientRect()
    return (top < window.innerHeight && bottom > 0) &&
      (left < window.innerWidth && right > 0)
  }

  static update = () => {
    if (!store.length) {
      return;
    }

    let i = store.length;

    while (i--) {
      if (Utils.shouldShow(i)) {
        Utils.load(store[i])
        store.splice(i, 1);
      }
    }
  }

  static bindEvent = () => {
    const {throttle, update} = Utils
    window.addEventListener('resize', function () {
      throttle(update, {context: this})
    }, false)
    window.addEventListener('scroll', function () {
      throttle(update, {context: this})
    }, false)
  }

}


let lazyLoad = function () {
}

lazyLoad.test = ()=>{
  console.log(123)
}

lazyLoad.install = function (Vue, options) {
  // loading 时的图片
  // loading 失败的图片
  // webp true or false 默认 false

  console.log('run', this, this.test())

  let {
    loadImg,
    failImg,
    openWebp = true
  } = options

  Utils.options = {
    loadImg,
    failImg,
    openWebp
  }

  if (openWebp) {
    Utils.isSupportWebp = Utils.checkWebpSupport()
  }

  Utils.bindEvent();

  Vue.directive('webp', {
    bind(el, binding) {
      el.src = loadImg
      store.push({el, binding, status: 'pending'})
      Utils.throttle(Utils.update, {context: this})
    }
  })
}

export default lazyLoad
