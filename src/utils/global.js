import Vue from 'vue'

Vue.filter('userStatus', function(value) {
  if (value === 2) {
    return '正常'
  } else if (value === 4) {
    return '销户'
  }
})
