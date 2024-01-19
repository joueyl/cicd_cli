export default function flattenObject(obj: { [x: string]: any; hasOwnProperty: (arg0: string) => any; }, parentKey = '', res:any = {}) {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        let propName = parentKey ? parentKey+'_' + key : key; // 如果有父键，则拼接父键和当前键
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          flattenObject(obj[key], propName, res); // 递归调用
        } else {
          res[propName] = obj[key]; // 否则，直接在结果对象上设置属性
        }
      }
    }
    return res;
  }