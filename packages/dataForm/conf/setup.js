import GlobalConfig from './index'
// import XEUtils from 'xe-utils/methods/xe-utils'
import utils from '../../utils'

function mergeOpts (data1, data2) {
  if (data1 && utils.isObject(data2)) {
    utils.objectEach(data2, (val, key) => {
      data1[key] = data1[key] && val ? mergeOpts(data1[key], val) : val
    })
    return data1
  }
  return data2
}

/**
 * 全局参数设置
 */
function setup (options = {}) {
  mergeOpts(GlobalConfig, options)
  return GlobalConfig
}

export default setup
