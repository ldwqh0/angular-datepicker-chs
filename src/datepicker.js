import './datepicker.less'
import template from './datepicker.html'
import moment from 'moment'
import angular from 'angular'

let module = angular.module('datepicker', ['ui.bootstrap'])

class DatePickerController {
  static $inject = ['$scope']

  constructor($scope) {
    this.$scope = $scope
  }

  // datepicekr选项
  datepickerOptions = {
    showWeeks: false,
    yearColumns: 3,
    yearRows: 4
  }
  // 弹框状态
  isOpen = false
  // 格式化样式
  format = 'yyyy-MM-dd'

  $doCheck() {
    // 将日期什么的小时，分钟数等等置为空
    if (this.ngModel && this.ngModel instanceof Date) {
      this.ngModel.setSeconds(0)
      this.ngModel.setHours(0)
      this.ngModel.setMinutes(0)
      this.ngModel.setMilliseconds(0)
    }
  }

  open() {
    if (this.disabled === '' || this.disabled === 'disabled' || this.disabled === true || this.disabled === 'true') {
    } else {
      this.isOpen = !this.isOpen
    }
  }

  $onChanges(changes) {
    if (changes.options) {
      this.datepickerOptions = Object.assign(this.datepickerOptions, this.options)
    }
    if (changes.minView) {
      this.datepickerOptions.minMode = this.minView
      if (this.minView === 'year' && this.ngModel && this.ngModel instanceof Date) {
        this.ngModel.setMonth(0).setDate(1)
      }
      if (this.minView === 'month' && this.ngModel && this.ngModel instanceof Date) {
        this.ngModel.setDate(1)
      }
    }
    if (changes.maxView) {
      this.datepickerOptions.maxMode = this.maxView
    }
    if (changes.minDate) {
      this.datepickerOptions.minDate = this.minDate
      if (!moment(this.ngMdodel).isAfter(this.minDate)) {
        this.ngModel = this.minDate
      }
    }
    if (changes.maxDate) {
      this.datepickerOptions.maxDate = this.maxDate
      if (!moment(this.ngModel).isBefore(this.maxDate)) {
        this.ngModel = this.maxDate
      }
    }
  }
}

let component = {
  template,
  controller: DatePickerController,
  bindings: {
    ngModel: '=',
    options: '<?',
    minView: '@?',
    maxView: '@?',
    format: '@?',
    maxDate: '<?',
    minDate: '<?',
    disabled: '@?'
  }
}
module.component('datepicker', component)

export default 'datepicker'
