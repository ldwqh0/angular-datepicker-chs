import './datepicker.less'
import template from './datepicker.html'
import moment from 'moment'
import angular from 'angular'

const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
let DAYS = ['日', '一', '二', '三', '四', '五', '六']
const VIEWS = {
  year: 0,
  month: 1,
  day: 2,
  hour: 3
}

/**
 * 判断视图a是不是在视图b之后
 * @param a
 * @param b
 */
function viewAfter(a, b) {
  return VIEWS[a] - VIEWS[b] > 0
}

/**
 * 判断一个元素是不是另外一个元素的子代
 * @param source
 * @param target
 */
function isChildrenOf(source, target) {
  if (target.parentNode) {
    let parent = target.parentNode
    if (parent === source) {
      return true
    } else {
      return isChildrenOf(source, parent)
    }
  } else {
    return false
  }
}

/**
 * 获取指定年月的天数
 * @param year
 * @param month
 * @returns {number}
 */
function getDays(year, month) {
  if (month === 1) {
    if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
      return 29
    }
  }
  return DAYS_IN_MONTH[month]
}

let module = angular.module('datepicker', [])

let component = {
  template,
  controller: DatePickerController,
  bindings: {
    value: "=?ngModel",
    miniView: "<?"
  }
}
DatePickerController.$inject = ['$scope', '$document', '$element', '$log']

function DatePickerController($scope, $document, $element, $log) {
  let $ctrl = this
  $ctrl.current = moment()
  $ctrl.view = 'day'
  $ctrl.years = []
  $ctrl.months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  $ctrl.days = []
  $ctrl.isOpen = false
  $ctrl.disabled = false


  if (!$ctrl.miniView) {
    $ctrl.miniView = 'day'
  }
  if (!$ctrl.value) {
    $ctrl.value = $ctrl.current.toDate()
  }

  $ctrl.next = function () {
    switch ($ctrl.view) {
      case 'year':
        $ctrl.current.add(12, 'y')
        break
      case 'month':
        $ctrl.current.add(1, 'y')
        break
      case 'day':
        $ctrl.current.add(1, 'M')
        break
    }
    $ctrl.setCurrent()
  }

  $ctrl.prev = function () {
    switch ($ctrl.view) {
      case 'year':
        $ctrl.current.subtract(12, 'y')
        break
      case 'month':
        $ctrl.current.subtract(1, 'y')
        break
      case 'day':
        $ctrl.current.subtract(1, 'M')
        break
    }
    $ctrl.setCurrent()
  }

  // 设置视图
  $ctrl.setView = function (type) {
    if (viewAfter(type, $ctrl.miniView)) {
      $ctrl.isOpen = false
      $ctrl.value = $ctrl.current.toDate()
    } else {
      $ctrl.view = type
    }
  }

  $ctrl.isCurrent = function (type, value) {
    switch (type) {
      case "year":
        return $ctrl.value.getFullYear() === value
        break
      case "month":
        return $ctrl.value.getMonth() === value
        break
      case "day":
        return $ctrl.value.getDay() === value
        break
    }
  }

  // 设置当前视图的值
  $ctrl.setCurrent = function (data) {
    if (data) {
      if (data.year) {
        $ctrl.current.year(data.year)
      }
      if (data.month) {
        $ctrl.current.month(data.month)
      }
      if (data.date) {
        $ctrl.current.date(data.date)
      }
    }

    // 在当前的视图值改变之后，设置页面列表项
    let year = $ctrl.current.year()
    let month = $ctrl.current.month()
    let date = $ctrl.current.date()
    let years = []
    let days = []
    for (let i = year - 5; i < year + 7; i++) {
      years.push(i)
    }
    $ctrl.years = years
    let dayCount = getDays(year, month)
    for (let i = 0; i < dayCount; i++) {
      days.push({year, month, date: i + 1})
    }

    let first = moment(new Date(year, month, days[0].date))
    let last = moment(new Date(year, month, dayCount))
    for (let i = first.day(); i > 0; i--) {
      first.subtract(1, 'd')
      days.unshift({year: first.year(), month: first.month(), date: first.date()})
    }
    for (let i = last.day(); i < 6; i++) {
      last.add(1, 'd')
      days.push({year: last.year(), month: last.month(), date: last.date()})
    }

    $ctrl.days = days
    return true
  }

  // 初始化一次选项卡
  $ctrl.setCurrent()

  $ctrl.$onInit = function () {

    $document.on('click', documentClickBind)
  }

  $ctrl.$onDestroy = function () {
    $document.off('click', documentClickBind)
  }

  $ctrl.open = function () {
    if ($element.attr('disabled') === 'disabled') {
      $log.debug('component is disabled!')
    } else {
      $ctrl.isOpen = true
    }
  }


  /**
   * 单击文档的任意部分，隐藏选择框
   * @param event
   */
  function documentClickBind(event) {
    let dpContainsTarget = isChildrenOf($element[0], event.target) || isChildrenOf($element.find('picker-wrapper')[0], event.target)
    if ($ctrl.isOpen && !dpContainsTarget) {
      $scope.$apply(() => {
        $ctrl.isOpen = false
      })
    }
  }

}

module.component('datepicker', component)

export default 'datepicker'
