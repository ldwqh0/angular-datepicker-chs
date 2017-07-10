import './datepicker.less'
import template from './datepicker.html'

let DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

/**
 * 获取给定日期的指定月份的第一天的day 也就是星期的数值
 * @param date
 */
function getFirstDayOfMonth(date) {
    let d = new Date(date.getTime())
    d.setDate(1)
    return d.getDay()
}

/**
 * 获取给定日期的指定月份最后一天的day 也就是星期的数值
 * @param date
 */
function getLastDayOfMonth(date) {
    let year = date.getFullYear()
    let month = date.getMonth()
    let d = new Date(date.getTime())
    d.setDate(getDays(year, month))
    return d.getDay()
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

angular.module('datepicker',[]).directive('datepicker', ['$timeout', function ($timeout) {
    return {
        replace: true,
        restrict: 'E',
        template,
        scope: {
            value: '=?ngModel'
        },
        link () {
        },
        controller: ['$scope', '$element', '$document', function ($scope, $element, $document) {

            /**
             * 当前日历的值
             * @type {Date}
             */
            $scope.current = new Date()
            $scope.view = 'day' // 保存当前视图状态
            $scope.months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
            $scope.isOpen = false

            initPopup()

            /**
             * 监测控件的弹出状态
             */
            $scope.$watch('isOpen', function (v) {
                if (v) {
                    initPopup()
                    $document.on('click', documentClickBind)
                } else {
                    $document.off('click', documentClickBind)
                }
            })

            function initPopup() {
                if (!$scope.value || $scope.value === '') {
                    $scope.value = new Date($scope.current.getTime())
                }
            }

            /**
             * 文档点击事件，控制控件的关闭
             * @param event
             */
            function documentClickBind(event) {
                let dpContainsTarget = $element[0].contains(event.target) || $element.find('picker-wrapper')[0].contains(event.target)
                if ($scope.isOpen && !dpContainsTarget) {
                    $scope.$apply(() => {
                        $scope.isOpen = false
                    })
                }
            }

            /**
             * 获取某一年的相邻年份
             * @param year
             * @returns {Array}
             */
            $scope.getYears = function () {
                let year = $scope.current.getFullYear()
                let years = []
                for (let i = year - 5; i < year + 7; i++) {
                    years.push(i)
                }
                return years
            }

            /**
             * 获取指定月的天数
             * @param year
             * @param month
             * @returns {Array}
             */
            $scope.getDays = function () {
                let year = $scope.current.getFullYear()
                let month = $scope.current.getMonth()
                let dayCount = getDays(year, month)
                let days = []
                for (let i = 1; i <= dayCount; i++) {
                    days.push(i)
                }
                return days
            }

            // 设置某个值
            $scope.setCurrent = function (type, value) {
                switch (type) {
                    case 'year':
                        $scope.current.setFullYear(value)
                        break
                    case 'month':
                        $scope.current.setMonth(value)
                        break
                    case 'date':
                        $scope.current.setDate(value)
                        break
                }
                return true
            }

            /**
             * 切换到某个视图
             * @param type
             * @returns {boolean}
             */
            $scope.setView = function (type) {
                $scope.view = type
                return true
            }

            $scope.nextMonth = function () {
                let m = $scope.current.getMonth()
                let y = $scope.current.getFullYear()
                if (m === 11) {
                    $scope.current.setFullYear(y + 1)
                    $scope.current.setMonth(0)
                } else {
                    $scope.current.setMonth(m + 1)
                }
            }

            $scope.test = function (event) {
                console.log(angular.element(event.target).hasClass('picker-wrapper'))
            }

            $scope.prevMonth = function () {
                let m = $scope.current.getMonth()
                let y = $scope.current.getFullYear()
                if (m === 0) {
                    $scope.current.setFullYear(y - 1)
                    $scope.current.setMonth(11)
                } else {
                    $scope.current.setMonth(m - 1)
                }
            }
            // 选中值
            $scope.toHour = function () {
                $scope.value = new Date($scope.current.getTime())
                $scope.isOpen = false
            }

            $scope.prevYears = function () {
                let cy = $scope.current.getFullYear()
                $scope.current.setFullYear(cy - 12)
            }

            $scope.nextYears = function () {
                let cy = $scope.current.getFullYear()
                $scope.current.setFullYear(cy + 12)
            }
        }]
    }
}])

export default 'datepicker'
