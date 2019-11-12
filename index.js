let lazyLoad = function () {
}

const checkWebpSupport = () => {
  try {
    return (document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0);
  } catch (err) {
    return false;
  }
}

const throttle = function () {
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

    throttle(true, fn);

    fn.__throttleID = setTimeout(function () {
      fn.apply(p.context, p.args)
    }, p.time)
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


  let store = []; // store images

  if (openWebp) {
    isSupportWebp = checkWebpSupport()
  }

  const load = (function () {
    const getUrl = openWebp && isSupportWebp ? (binding) => {
        return binding.value.webp || binding.value.image
      } :
      (binding) => {
        return binding.value.image
      }

    return (img) => {
      let {el, binding} = img
      const url = getUrl(binding)
      loadNewImg(url).then(() => {
        el.src = url;
      }).catch(() => {
        el.src = failImg || ''
      })
    }
  })()


  const shouldShow = (i) => {
    const {el} = store[i];
    let {top, bottom, left, right} = el.getBoundingClientRect()
    return (top < window.innerHeight && bottom > 0) &&
      (left < window.innerWidth && right > 0)
  }


  const update = () => {
    if (!store.length) {
      return;
    }

    let i = store.length;

    while (i--) {
      if (shouldShow(i)) {
        load(store[i])
        store.splice(i, 1);
      }
    }
  }

  const bindEvent = () => {
    window.addEventListener('resize',function () {
      throttle(update, {context: this})
    },false)
    window.addEventListener('scroll',function () {
      throttle(update, {context: this})
    },false)
  }

  update();
  bindEvent();

  Vue.directive('webp', {
    bind(el, binding) {
      el.src = loadImg
      store.push({el, binding, status: 'pending'})
    }
  })
}

// 项目开始时未触发 // 页面进入时

export default lazyLoad
