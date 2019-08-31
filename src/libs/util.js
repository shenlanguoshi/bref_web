import cookies from './util.cookies'
import db from './util.db'
import log from './util.log'

const util = {
  cookies,
  db,
  log
}

/**
 * @description 更新标题
 * @param {String} title 标题
 */
util.title = function (titleText) {
  const processTitle = process.env.VUE_APP_TITLE || 'Duet'
  window.document.title = `${processTitle}${titleText ? ` | ${titleText}` : ''}`
}
util.serialize = function (data) {
    let list = [];
    Object.keys(data).forEach(ele => {
        list.push(`${ele}=${data[ele]}`)
    })
    return list.join('&');
};
util.filterParams = (obj) => {
    let _newPar = {};
    for (let key in obj) {
        //如果对象属性的值不为空，就保存该属性（这里我做了限制，如果属性的值为0，保存该属性。如果属性的值全部是空格，属于为空。）
        if ((obj[key] === false || obj[key] === 0 || obj[key]) && obj[key].toString().replace(/(^\s*)|(\s*$)/g, '') !== '') {
            //记录属性
            _newPar[key] = obj[key];
        }
    }
    //返回对象
    return _newPar;
};
/**
 * 模块排序
 */
util.sortModule = (arr) => {
    let len = arr.length;
    let i, j, min,m;
    for (i=0; i<len; i++) {
        min = i;
        for (j=i+1; j<len; j++) {
            if (arr[min].sort > arr[j].sort) {
                min = j;
            }
        }
        if (min !== i) {
            m = arr[i];
            arr[i] = arr[min];
            arr[min] = m;
        }
        if(arr[i].children){
            arr[i].children=util.sortModule(arr[i].children);
        }
    }
    return arr;
};

util.getObjType = obj => {
    var toString = Object.prototype.toString;
    var map = {
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regExp',
        '[object Undefined]': 'undefined',
        '[object Null]': 'null',
        '[object Object]': 'object'
    };
    if (obj instanceof Element) {
        return 'element';
    }
    return map[toString.call(obj)];
};
/**
 * 对象深拷贝
 */
util.deepClone = data => {
    var type = util.getObjType(data);
    var obj;
    if (type === 'array') {
        obj = [];
    } else if (type === 'object') {
        obj = {};
    } else {
        //不再具有下一层次
        return data;
    }
    if (type === 'array') {
        for (var i = 0, len = data.length; i < len; i++) {
            obj.push(util.deepClone(data[i]));
        }
    } else if (type === 'object') {
        for (var key in data) {
            obj[key] = util.deepClone(data[key]);
        }
    }
    return obj;
};

/**
 * @description 打开新页面
 * @param {String} url 地址
 */
util.open = function (url) {
  var a = document.createElement('a')
  a.setAttribute('href', url)
  a.setAttribute('target', '_blank')
  a.setAttribute('id', 'd2admin-link-temp')
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(document.getElementById('d2admin-link-temp'))
}

export default util
