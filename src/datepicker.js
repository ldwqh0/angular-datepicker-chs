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

let module = angular.module('datepicker', ['ui.bootstrap'])


class DatePickerController {
  static $inject = ['$element']
  current = moment()
  view = 'day'
  years = []
  months = []
  days = []
  minView = 'day'
  format = 'yyyy-MM-dd'
  value = this.current.toDate()

  constructor($element) {
    this.$element = $element
  }

  $onChanges(obj) {
    console.log(DatePickerController)
    if (obj.minView) {
      if (viewAfter(this.view, this.minView)) {
        this.view = this.minView
      }
    }
  }

  next() {
    switch (this.view) {
      case 'year':
        this.current.add(12, 'y')
        break
      case 'month':
        this.current.add(1, 'y')
        break
      case 'day':
        this.current.add(1, 'M')
        break
    }
    this.setCurrent()
  }

  prev() {
    switch (this.view) {
      case 'year':
        this.current.subtract(12, 'y')
        break
      case 'month':
        this.current.subtract(1, 'y')
        break
      case 'day':
        this.current.subtract(1, 'M')
        break
    }
    this.setCurrent()
  }

  setView(type) {
    if (viewAfter(type, this.minView)) {
      this.value = this.current.toDate()
      this.isOpen = false
    } else {
      this.view = type
    }
  }

  isCurrent(type, value) {
    switch (type) {
      case "year":
        return this.value.getFullYear() === value
        break
      case "month":
        return this.value.getMonth() === value
        break
      case "day":
        return this.value.getDay() === value
        break
    }
  }

  setCurrent(data) {
    let $ctrl = this
    if (data) {
      if (data.year) {
        this.current.year(data.year)
      }
      if (data.month) {
        this.current.month(data.month)
      }
      if (data.date) {
        this.current.date(data.date)
      }
    }

    // 在当前的视图值改变之后，设置页面列表项
    let year = this.current.year()
    let month = this.current.month()
    let date = this.current.date()
    let years = []
    let days = []
    for (let i = year - 5; i < year + 7; i++) {
      years.push(i)
    }
    this.years = years
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

  getDisabled() {
    return this.$element.attr('disabled') === 'disabled'
  }

  $onInit() {
    this.setCurrent()
  }

}

let component = {
  template,
  controller: DatePickerController,
  bindings: {
    value: "=?ngModel",
    minView: "@?",
    format: '@?'
  }
}

module.component('datepicker', component)

export default 'datepicker'
