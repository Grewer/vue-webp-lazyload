## vue-webp-lazyload

### intro 
A concise Vue plugin that provides webp images and lazyload

### download
```
npm install -save vue-webp-lazyload
```

### usage 
```
import lazyLoad from '@/vue-lazyload/index.js'

Vue.use(lazyLoad,{
  loadImg:'/static/loading.svg',
  failImg:'/static/fail.png',
  openWebp:false
})
```


**grammar**  

param | explanation  
------|----------  
loadImg | Loading picture 
failImg | Failed to load the picture
openWebp | Whether to support webp picture

-----


**[github](https://github.com/Grewer/vue-webp-lazyload)**

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2018-present, Grewer