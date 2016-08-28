'use strict';
//gitBatchBuilderApp
var angularApp = angular.module('gitBatchBuilderApp', ['ui.bootstrap']);
angularApp.constant('AppServerEndPoint', {
  basePath: 'http://project.xinong.wang:18080/',
  createBatchApi: 'api/gitbatch/test'
});
angularApp.config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    }).when('/forms/create', {
      templateUrl: 'views/create.html',
      controller: 'CreateCtrl'
    }).otherwise({ redirectTo: '/' });
  }
]).run([
  '$rootScope',
  function () {
  }
]);
'use strict';
angularApp.controller('MainCtrl', [
  '$scope',
  function ($scope) {
  }
]);
'use strict';
angularApp.controller('CreateCtrl', [
  '$scope',
  '$http',
  '$dialog',
  'FormService',
  'AppServerEndPoint',
  function ($scope, $http, $dialog, FormService, AppServerEndPoint) {
    // preview form mode
    $scope.previewMode = false;
    $scope.disabledBrach = false;
    // new form
    $scope.form = {};
    $scope.form.form_id = 1;
    $scope.form.url = '';
    $scope.form.barnch = '';
    $scope.form.form_name = 'My Form';
    $scope.form.form_fields = [];
    // previewForm - for preview purposes, form will be copied into this
    // otherwise, actual form might get manipulated in preview mode
    $scope.previewForm = {};
    // add new field drop-down:
    $scope.addField = {};
    $scope.addField.lastAddedID = 0;
    // accordion settings
    $scope.accordion = {};
    $scope.accordion.oneAtATime = true;
    let btns = [{
          result: 'ok',
          label: 'OK',
          cssClass: 'btn-primary'
        }];
    // create new field button click
    $scope.addNewField = function () {
      var url = $scope.form.url;
      if (!url || url.indexOf('.git') === -1) {
        $dialog.messageBox('\u63d0\u793a', '\u8bf7\u586b\u5199\u6b63\u786e\u7684Url\u5730\u5740~\uff01\u4f8b\u5982\uff1ahttps://github.com/giscafer/git-batch-file-builder.git', btns).open();
        return;
      }
      // incr field_id counter
      $scope.addField.lastAddedID++;
      var s = url.lastIndexOf('/');
      var e = url.lastIndexOf('.');
      var title = url.substring(s + 1, e);
      var newField = {
          'field_id': $scope.addField.lastAddedID,
          'url': url,
          'branch': $scope.form.branch,
          'pro_title': title
        };
      // put newField into fields array
      $scope.form.form_fields.push(newField);
      $scope.form.url = '';
      $scope.form.branch = '';
    };
    // deletes particular field on button click
    $scope.deleteField = function (field_id) {
      for (var i = 0; i < $scope.form.form_fields.length; i++) {
        if ($scope.form.form_fields[i].field_id == field_id) {
          $scope.form.form_fields.splice(i, 1);
          break;
        }
      }
    };
    // add new option to the field
    $scope.addOption = function (field) {
      if (!field.field_options)
        field.field_options = new Array();
      var lastOptionID = 0;
      if (field.field_options[field.field_options.length - 1])
        lastOptionID = field.field_options[field.field_options.length - 1].option_id;
      // new option's id
      var option_id = lastOptionID + 1;
      var newOption = {
          'option_id': option_id,
          'option_title': 'Option ' + option_id,
          'option_value': option_id
        };
      // put new option into field_options array
      field.field_options.push(newOption);
    };
    // delete particular option
    $scope.deleteOption = function (field, option) {
      for (var i = 0; i < field.field_options.length; i++) {
        if (field.field_options[i].option_id == option.option_id) {
          field.field_options.splice(i, 1);
          break;
        }
      }
    };
    // decides whether field options block will be shown (true for dropdown and radio fields)
    $scope.showAddOptions = function (field) {
      if (field.field_type == 'radio' || field.field_type == 'dropdown')
        return true;
      else
        return false;
    };
    // deletes all the fields
    $scope.reset = function () {
      $scope.form.form_fields.splice(0, $scope.form.form_fields.length);
      $scope.addField.lastAddedID = 0;
    };
    $scope.submit = function () {
      var url = AppServerEndPoint.basePath + AppServerEndPoint.createBatchApi;
      FormService.send(url, { data: $scope.form.form_fields }).then(function (data) {
        if (data.resultCode === 200) {
          var paths = data.paths;
          for (var i = 0; i < paths.length; i++) {
            var path = paths[i];
            window.open(AppServerEndPoint.basePath + path);
          }
        } else {
          $dialog.messageBox('\u63d0\u793a', '\u4e0b\u8f7d\u6587\u4ef6\u5931\u8d25', btns).open();
          return;
        }
      });
    };
  }
]);
'use strict';
angularApp.controller('HeaderCtrl', [
  '$scope',
  '$location',
  function ($scope, $location) {
    $scope.$location = $location;
  }
]);
'use strict';
angularApp.service('FormService', [
  '$q',
  '$http',
  '$dialog',
  function FormService($q, $http, $dialog) {
    return {
      send: function (link, parameters) {
        let deferred = $q.defer();
        $http.post(link, parameters).success(function (data) {
          deferred.resolve(data);  /*if (data.resultCode == '200') {
                        deferred.resolve(data);
                    } else {
                        deferred.promise.catch(function(data) {
                            var btns = [{ result: 'ok', label: 'OK', cssClass: 'btn-primary' }];
                            $dialog.messageBox("提示", "错误", btns).open();
                        });
                        deferred.reject(data);
                    }*/
        }).error(function () {
          deferred.reject();
        });
        return deferred.promise;
      }
    };
  }
]);
angular.module('ui.bootstrap', [
  'ui.bootstrap.tpls',
  'ui.bootstrap.transition',
  'ui.bootstrap.collapse',
  'ui.bootstrap.accordion',
  'ui.bootstrap.alert',
  'ui.bootstrap.buttons',
  'ui.bootstrap.carousel',
  'ui.bootstrap.datepicker',
  'ui.bootstrap.dialog',
  'ui.bootstrap.dropdownToggle',
  'ui.bootstrap.modal',
  'ui.bootstrap.pagination',
  'ui.bootstrap.position',
  'ui.bootstrap.tooltip',
  'ui.bootstrap.popover',
  'ui.bootstrap.progressbar',
  'ui.bootstrap.rating',
  'ui.bootstrap.tabs',
  'ui.bootstrap.timepicker',
  'ui.bootstrap.typeahead'
]), angular.module('ui.bootstrap.tpls', [
  'template/accordion/accordion-group.html',
  'template/accordion/accordion.html',
  'template/alert/alert.html',
  'template/carousel/carousel.html',
  'template/carousel/slide.html',
  'template/datepicker/datepicker.html',
  'template/dialog/message.html',
  'template/pagination/pager.html',
  'template/pagination/pagination.html',
  'template/tooltip/tooltip-html-unsafe-popup.html',
  'template/tooltip/tooltip-popup.html',
  'template/popover/popover.html',
  'template/progressbar/bar.html',
  'template/progressbar/progress.html',
  'template/rating/rating.html',
  'template/tabs/tab.html',
  'template/tabs/tabset.html',
  'template/timepicker/timepicker.html',
  'template/typeahead/typeahead.html'
]), angular.module('ui.bootstrap.transition', []).factory('$transition', [
  '$q',
  '$timeout',
  '$rootScope',
  function (e, t, n) {
    function a(e) {
      for (var t in e)
        if (void 0 !== i.style[t])
          return e[t];
    }
    var o = function (a, i, r) {
        r = r || {};
        var l = e.defer(), s = o[r.animation ? 'animationEndEventName' : 'transitionEndEventName'], c = function () {
            n.$apply(function () {
              a.unbind(s, c), l.resolve(a);
            });
          };
        return s && a.bind(s, c), t(function () {
          angular.isString(i) ? a.addClass(i) : angular.isFunction(i) ? i(a) : angular.isObject(i) && a.css(i), s || l.resolve(a);
        }), l.promise.cancel = function () {
          s && a.unbind(s, c), l.reject('Transition cancelled');
        }, l.promise;
      }, i = document.createElement('trans'), r = {
        WebkitTransition: 'webkitTransitionEnd',
        MozTransition: 'transitionend',
        OTransition: 'oTransitionEnd',
        transition: 'transitionend'
      }, l = {
        WebkitTransition: 'webkitAnimationEnd',
        MozTransition: 'animationend',
        OTransition: 'oAnimationEnd',
        transition: 'animationend'
      };
    return o.transitionEndEventName = a(r), o.animationEndEventName = a(l), o;
  }
]), angular.module('ui.bootstrap.collapse', ['ui.bootstrap.transition']).directive('collapse', [
  '$transition',
  function (e) {
    var t = function (e, t, n) {
      t.removeClass('collapse'), t.css({ height: n }), t[0].offsetWidth, t.addClass('collapse');
    };
    return {
      link: function (n, a, o) {
        var i, r = !0;
        n.$watch(function () {
          return a[0].scrollHeight;
        }, function () {
          0 !== a[0].scrollHeight && (i || (r ? t(n, a, a[0].scrollHeight + 'px') : t(n, a, 'auto')));
        }), n.$watch(o.collapse, function (e) {
          e ? u() : c();
        });
        var l, s = function (t) {
            return l && l.cancel(), l = e(a, t), l.then(function () {
              l = void 0;
            }, function () {
              l = void 0;
            }), l;
          }, c = function () {
            r ? (r = !1, i || t(n, a, 'auto')) : s({ height: a[0].scrollHeight + 'px' }).then(function () {
              i || t(n, a, 'auto');
            }), i = !1;
          }, u = function () {
            i = !0, r ? (r = !1, t(n, a, 0)) : (t(n, a, a[0].scrollHeight + 'px'), s({ height: '0' }));
          };
      }
    };
  }
]), angular.module('ui.bootstrap.accordion', ['ui.bootstrap.collapse']).constant('accordionConfig', { closeOthers: !0 }).controller('AccordionController', [
  '$scope',
  '$attrs',
  'accordionConfig',
  function (e, t, n) {
    this.groups = [], this.closeOthers = function (a) {
      var o = angular.isDefined(t.closeOthers) ? e.$eval(t.closeOthers) : n.closeOthers;
      o && angular.forEach(this.groups, function (e) {
        e !== a && (e.isOpen = !1);
      });
    }, this.addGroup = function (e) {
      var t = this;
      this.groups.push(e), e.$on('$destroy', function () {
        t.removeGroup(e);
      });
    }, this.removeGroup = function (e) {
      var t = this.groups.indexOf(e);
      -1 !== t && this.groups.splice(this.groups.indexOf(e), 1);
    };
  }
]).directive('accordion', function () {
  return {
    restrict: 'EA',
    controller: 'AccordionController',
    transclude: !0,
    replace: !1,
    templateUrl: 'template/accordion/accordion.html'
  };
}).directive('accordionGroup', [
  '$parse',
  '$transition',
  '$timeout',
  function (e) {
    return {
      require: '^accordion',
      restrict: 'EA',
      transclude: !0,
      replace: !0,
      templateUrl: 'template/accordion/accordion-group.html',
      scope: { heading: '@' },
      controller: [
        '$scope',
        function () {
          this.setHeading = function (e) {
            this.heading = e;
          };
        }
      ],
      link: function (t, n, a, o) {
        var i, r;
        o.addGroup(t), t.isOpen = !1, a.isOpen && (i = e(a.isOpen), r = i.assign, t.$watch(function () {
          return i(t.$parent);
        }, function (e) {
          t.isOpen = e;
        }), t.isOpen = i ? i(t.$parent) : !1), t.$watch('isOpen', function (e) {
          e && o.closeOthers(t), r && r(t.$parent, e);
        });
      }
    };
  }
]).directive('accordionHeading', function () {
  return {
    restrict: 'EA',
    transclude: !0,
    template: '',
    replace: !0,
    require: '^accordionGroup',
    compile: function (e, t, n) {
      return function (e, t, a, o) {
        o.setHeading(n(e, function () {
        }));
      };
    }
  };
}).directive('accordionTransclude', function () {
  return {
    require: '^accordionGroup',
    link: function (e, t, n, a) {
      e.$watch(function () {
        return a[n.accordionTransclude];
      }, function (e) {
        e && (t.html(''), t.append(e));
      });
    }
  };
}), angular.module('ui.bootstrap.alert', []).directive('alert', function () {
  return {
    restrict: 'EA',
    templateUrl: 'template/alert/alert.html',
    transclude: !0,
    replace: !0,
    scope: {
      type: '=',
      close: '&'
    },
    link: function (e, t, n) {
      e.closeable = 'close' in n;
    }
  };
}), angular.module('ui.bootstrap.buttons', []).constant('buttonConfig', {
  activeClass: 'active',
  toggleEvent: 'click'
}).directive('btnRadio', [
  'buttonConfig',
  function (e) {
    var t = e.activeClass || 'active', n = e.toggleEvent || 'click';
    return {
      require: 'ngModel',
      link: function (e, a, o, i) {
        i.$render = function () {
          a.toggleClass(t, angular.equals(i.$modelValue, e.$eval(o.btnRadio)));
        }, a.bind(n, function () {
          a.hasClass(t) || e.$apply(function () {
            i.$setViewValue(e.$eval(o.btnRadio)), i.$render();
          });
        });
      }
    };
  }
]).directive('btnCheckbox', [
  'buttonConfig',
  function (e) {
    var t = e.activeClass || 'active', n = e.toggleEvent || 'click';
    return {
      require: 'ngModel',
      link: function (e, a, o, i) {
        var r = e.$eval(o.btnCheckboxTrue), l = e.$eval(o.btnCheckboxFalse);
        r = angular.isDefined(r) ? r : !0, l = angular.isDefined(l) ? l : !1, i.$render = function () {
          a.toggleClass(t, angular.equals(i.$modelValue, r));
        }, a.bind(n, function () {
          e.$apply(function () {
            i.$setViewValue(a.hasClass(t) ? l : r), i.$render();
          });
        });
      }
    };
  }
]), angular.module('ui.bootstrap.carousel', ['ui.bootstrap.transition']).controller('CarouselController', [
  '$scope',
  '$timeout',
  '$transition',
  '$q',
  function (e, t, n) {
    function a() {
      function n() {
        i ? (e.next(), a()) : e.pause();
      }
      o && t.cancel(o);
      var r = +e.interval;
      !isNaN(r) && r >= 0 && (o = t(n, r));
    }
    var o, i, r = this, l = r.slides = [], s = -1;
    r.currentSlide = null, r.select = function (o, i) {
      function c() {
        r.currentSlide && angular.isString(i) && !e.noTransition && o.$element ? (o.$element.addClass(i), o.$element[0].offsetWidth = o.$element[0].offsetWidth, angular.forEach(l, function (e) {
          angular.extend(e, {
            direction: '',
            entering: !1,
            leaving: !1,
            active: !1
          });
        }), angular.extend(o, {
          direction: i,
          active: !0,
          entering: !0
        }), angular.extend(r.currentSlide || {}, {
          direction: i,
          leaving: !0
        }), e.$currentTransition = n(o.$element, {}), function (t, n) {
          e.$currentTransition.then(function () {
            u(t, n);
          }, function () {
            u(t, n);
          });
        }(o, r.currentSlide)) : u(o, r.currentSlide), r.currentSlide = o, s = p, a();
      }
      function u(t, n) {
        angular.extend(t, {
          direction: '',
          active: !0,
          leaving: !1,
          entering: !1
        }), angular.extend(n || {}, {
          direction: '',
          active: !1,
          leaving: !1,
          entering: !1
        }), e.$currentTransition = null;
      }
      var p = l.indexOf(o);
      void 0 === i && (i = p > s ? 'next' : 'prev'), o && o !== r.currentSlide && (e.$currentTransition ? (e.$currentTransition.cancel(), t(c)) : c());
    }, r.indexOfSlide = function (e) {
      return l.indexOf(e);
    }, e.next = function () {
      var t = (s + 1) % l.length;
      return e.$currentTransition ? void 0 : r.select(l[t], 'next');
    }, e.prev = function () {
      var t = 0 > s - 1 ? l.length - 1 : s - 1;
      return e.$currentTransition ? void 0 : r.select(l[t], 'prev');
    }, e.select = function (e) {
      r.select(e);
    }, e.isActive = function (e) {
      return r.currentSlide === e;
    }, e.slides = function () {
      return l;
    }, e.$watch('interval', a), e.play = function () {
      i || (i = !0, a());
    }, e.pause = function () {
      e.noPause || (i = !1, o && t.cancel(o));
    }, r.addSlide = function (t, n) {
      t.$element = n, l.push(t), 1 === l.length || t.active ? (r.select(l[l.length - 1]), 1 == l.length && e.play()) : t.active = !1;
    }, r.removeSlide = function (e) {
      var t = l.indexOf(e);
      l.splice(t, 1), l.length > 0 && e.active ? t >= l.length ? r.select(l[t - 1]) : r.select(l[t]) : s > t && s--;
    };
  }
]).directive('carousel', [function () {
    return {
      restrict: 'EA',
      transclude: !0,
      replace: !0,
      controller: 'CarouselController',
      require: 'carousel',
      templateUrl: 'template/carousel/carousel.html',
      scope: {
        interval: '=',
        noTransition: '=',
        noPause: '='
      }
    };
  }]).directive('slide', [
  '$parse',
  function (e) {
    return {
      require: '^carousel',
      restrict: 'EA',
      transclude: !0,
      replace: !0,
      templateUrl: 'template/carousel/slide.html',
      scope: {},
      link: function (t, n, a, o) {
        if (a.active) {
          var i = e(a.active), r = i.assign, l = t.active = i(t.$parent);
          t.$watch(function () {
            var e = i(t.$parent);
            return e !== t.active && (e !== l ? l = t.active = e : r(t.$parent, e = l = t.active)), e;
          });
        }
        o.addSlide(t, n), t.$on('$destroy', function () {
          o.removeSlide(t);
        }), t.$watch('active', function (e) {
          e && o.select(t);
        });
      }
    };
  }
]), angular.module('ui.bootstrap.datepicker', []).constant('datepickerConfig', {
  dayFormat: 'dd',
  monthFormat: 'MMMM',
  yearFormat: 'yyyy',
  dayHeaderFormat: 'EEE',
  dayTitleFormat: 'MMMM yyyy',
  monthTitleFormat: 'yyyy',
  showWeeks: !0,
  startingDay: 0,
  yearRange: 20
}).directive('datepicker', [
  'dateFilter',
  '$parse',
  'datepickerConfig',
  function (e, t, n) {
    return {
      restrict: 'EA',
      replace: !0,
      scope: {
        model: '=ngModel',
        dateDisabled: '&'
      },
      templateUrl: 'template/datepicker/datepicker.html',
      link: function (a, o, r) {
        function l(e, t, n) {
          a.rows = e, a.labels = t, a.title = n;
        }
        function s() {
          a.showWeekNumbers = 'day' === a.mode && p;
        }
        function c(e, t) {
          return 'year' === a.mode ? t.getFullYear() - e.getFullYear() : 'month' === a.mode ? new Date(t.getFullYear(), t.getMonth()) - new Date(e.getFullYear(), e.getMonth()) : 'day' === a.mode ? new Date(t.getFullYear(), t.getMonth(), t.getDate()) - new Date(e.getFullYear(), e.getMonth(), e.getDate()) : void 0;
        }
        function u(e) {
          return d && c(e, d) > 0 || m && 0 > c(e, m) || a.dateDisabled && a.dateDisabled({
            date: e,
            mode: a.mode
          });
        }
        a.mode = 'day';
        var p, d, m, g = new Date(), f = {};
        f.day = angular.isDefined(r.dayFormat) ? a.$eval(r.dayFormat) : n.dayFormat, f.month = angular.isDefined(r.monthFormat) ? a.$eval(r.monthFormat) : n.monthFormat, f.year = angular.isDefined(r.yearFormat) ? a.$eval(r.yearFormat) : n.yearFormat, f.dayHeader = angular.isDefined(r.dayHeaderFormat) ? a.$eval(r.dayHeaderFormat) : n.dayHeaderFormat, f.dayTitle = angular.isDefined(r.dayTitleFormat) ? a.$eval(r.dayTitleFormat) : n.dayTitleFormat, f.monthTitle = angular.isDefined(r.monthTitleFormat) ? a.$eval(r.monthTitleFormat) : n.monthTitleFormat;
        var h = angular.isDefined(r.startingDay) ? a.$eval(r.startingDay) : n.startingDay, v = angular.isDefined(r.yearRange) ? a.$eval(r.yearRange) : n.yearRange;
        r.showWeeks ? a.$parent.$watch(t(r.showWeeks), function (e) {
          p = !!e, s();
        }) : (p = n.showWeeks, s()), r.min && a.$parent.$watch(t(r.min), function (e) {
          d = new Date(e), w();
        }), r.max && a.$parent.$watch(t(r.max), function (e) {
          m = new Date(e), w();
        });
        var b = function (e, t) {
            for (var n = []; e.length > 0;)
              n.push(e.splice(0, t));
            return n;
          }, $ = function (e, t) {
            return new Date(e, t + 1, 0).getDate();
          }, y = {
            day: function () {
              function t(t, a, i) {
                for (var r = 0; a > r; r++)
                  n.push({
                    date: new Date(t),
                    isCurrent: i,
                    isSelected: k(t),
                    label: e(t, f.day),
                    disabled: u(t)
                  }), t.setDate(t.getDate() + 1);
                o = t;
              }
              var n = [], a = [], o = null, r = new Date(g);
              r.setDate(1);
              var s = h - r.getDay(), c = s > 0 ? 7 - s : -s;
              for (c > 0 && (r.setDate(-c + 1), t(r, c, !1)), t(o || r, $(g.getFullYear(), g.getMonth()), !0), t(o, (7 - n.length % 7) % 7, !1), i = 0; 7 > i; i++)
                a.push(e(n[i].date, f.dayHeader));
              l(b(n, 7), a, e(g, f.dayTitle));
            },
            month: function () {
              for (var t = [], n = 0, a = g.getFullYear(); 12 > n;) {
                var o = new Date(a, n++, 1);
                t.push({
                  date: o,
                  isCurrent: !0,
                  isSelected: k(o),
                  label: e(o, f.month),
                  disabled: u(o)
                });
              }
              l(b(t, 3), [], e(g, f.monthTitle));
            },
            year: function () {
              for (var t = [], n = parseInt((g.getFullYear() - 1) / v, 10) * v + 1, a = 0; v > a; a++) {
                var o = new Date(n + a, 0, 1);
                t.push({
                  date: o,
                  isCurrent: !0,
                  isSelected: k(o),
                  label: e(o, f.year),
                  disabled: u(o)
                });
              }
              var i = t[0].label + ' - ' + t[t.length - 1].label;
              l(b(t, 5), [], i);
            }
          }, w = function () {
            y[a.mode]();
          }, k = function (e) {
            if (a.model && a.model.getFullYear() === e.getFullYear()) {
              if ('year' === a.mode)
                return !0;
              if (a.model.getMonth() === e.getMonth())
                return 'month' === a.mode || 'day' === a.mode && a.model.getDate() === e.getDate();
            }
            return !1;
          };
        a.$watch('model', function (e, t) {
          angular.isDate(e) && (g = angular.copy(e)), angular.equals(e, t) || w();
        }), a.$watch('mode', function () {
          s(), w();
        }), a.select = function (e) {
          g = new Date(e), 'year' === a.mode ? (a.mode = 'month', g.setFullYear(e.getFullYear())) : 'month' === a.mode ? (a.mode = 'day', g.setMonth(e.getMonth())) : 'day' === a.mode && (a.model = new Date(g));
        }, a.move = function (e) {
          'day' === a.mode ? g.setMonth(g.getMonth() + e) : 'month' === a.mode ? g.setFullYear(g.getFullYear() + e) : 'year' === a.mode && g.setFullYear(g.getFullYear() + e * v), w();
        }, a.toggleMode = function () {
          a.mode = 'day' === a.mode ? 'month' : 'month' === a.mode ? 'year' : 'day';
        }, a.getWeekNumber = function (e) {
          if ('day' === a.mode && a.showWeekNumbers && 7 === e.length) {
            var t = h > 4 ? 11 - h : 4 - h, n = new Date(e[t].date);
            return n.setHours(0, 0, 0), Math.ceil(((n - new Date(n.getFullYear(), 0, 1)) / 86400000 + 1) / 7);
          }
        };
      }
    };
  }
]);
var dialogModule = angular.module('ui.bootstrap.dialog', ['ui.bootstrap.transition']);
dialogModule.controller('MessageBoxController', [
  '$scope',
  'dialog',
  'model',
  function (e, t, n) {
    e.title = n.title, e.message = n.message, e.buttons = n.buttons, e.close = function (e) {
      t.close(e);
    };
  }
]), dialogModule.provider('$dialog', function () {
  var e = {
      backdrop: !0,
      dialogClass: 'modal',
      backdropClass: 'modal-backdrop',
      transitionClass: 'fade',
      triggerClass: 'in',
      resolve: {},
      backdropFade: !1,
      dialogFade: !1,
      keyboard: !0,
      backdropClick: !0
    }, t = {}, n = { value: 0 };
  this.options = function (e) {
    t = e;
  }, this.$get = [
    '$http',
    '$document',
    '$compile',
    '$rootScope',
    '$controller',
    '$templateCache',
    '$q',
    '$transition',
    '$injector',
    function (a, o, i, r, l, s, c, u, p) {
      function d(e) {
        var t = angular.element('<div>');
        return t.addClass(e), t;
      }
      function m(n) {
        var a = this, o = this.options = angular.extend({}, e, t, n);
        this._open = !1, this.backdropEl = d(o.backdropClass), o.backdropFade && (this.backdropEl.addClass(o.transitionClass), this.backdropEl.removeClass(o.triggerClass)), this.modalEl = d(o.dialogClass), o.dialogFade && (this.modalEl.addClass(o.transitionClass), this.modalEl.removeClass(o.triggerClass)), this.handledEscapeKey = function (e) {
          27 === e.which && (a.close(), e.preventDefault(), a.$scope.$apply());
        }, this.handleBackDropClick = function (e) {
          a.close(), e.preventDefault(), a.$scope.$apply();
        }, this.handleLocationChange = function () {
          a.close();
        };
      }
      var g = o.find('body');
      return m.prototype.isOpen = function () {
        return this._open;
      }, m.prototype.open = function (e, t) {
        var n = this, a = this.options;
        if (e && (a.templateUrl = e), t && (a.controller = t), !a.template && !a.templateUrl)
          throw Error('Dialog.open expected template or templateUrl, neither found. Use options or open method to specify them.');
        return this._loadResolves().then(function (e) {
          var t = e.$scope = n.$scope = e.$scope ? e.$scope : r.$new();
          if (n.modalEl.html(e.$template), n.options.controller) {
            var a = l(n.options.controller, e);
            n.modalEl.children().data('ngControllerController', a);
          }
          i(n.modalEl)(t), n._addElementsToDom(), setTimeout(function () {
            n.options.dialogFade && n.modalEl.addClass(n.options.triggerClass), n.options.backdropFade && n.backdropEl.addClass(n.options.triggerClass);
          }), n._bindEvents();
        }), this.deferred = c.defer(), this.deferred.promise;
      }, m.prototype.close = function (e) {
        function t(e) {
          e.removeClass(a.options.triggerClass);
        }
        function n() {
          a._open && a._onCloseComplete(e);
        }
        var a = this, o = this._getFadingElements();
        if (o.length > 0)
          for (var i = o.length - 1; i >= 0; i--)
            u(o[i], t).then(n);
        else
          this._onCloseComplete(e);
      }, m.prototype._getFadingElements = function () {
        var e = [];
        return this.options.dialogFade && e.push(this.modalEl), this.options.backdropFade && e.push(this.backdropEl), e;
      }, m.prototype._bindEvents = function () {
        this.options.keyboard && g.bind('keydown', this.handledEscapeKey), this.options.backdrop && this.options.backdropClick && this.backdropEl.bind('click', this.handleBackDropClick);
      }, m.prototype._unbindEvents = function () {
        this.options.keyboard && g.unbind('keydown', this.handledEscapeKey), this.options.backdrop && this.options.backdropClick && this.backdropEl.unbind('click', this.handleBackDropClick);
      }, m.prototype._onCloseComplete = function (e) {
        this._removeElementsFromDom(), this._unbindEvents(), this.deferred.resolve(e);
      }, m.prototype._addElementsToDom = function () {
        g.append(this.modalEl), this.options.backdrop && (0 === n.value && g.append(this.backdropEl), n.value++), this._open = !0;
      }, m.prototype._removeElementsFromDom = function () {
        this.modalEl.remove(), this.options.backdrop && (n.value--, 0 === n.value && this.backdropEl.remove()), this._open = !1;
      }, m.prototype._loadResolves = function () {
        var e, t = [], n = [], o = this;
        return this.options.template ? e = c.when(this.options.template) : this.options.templateUrl && (e = a.get(this.options.templateUrl, { cache: s }).then(function (e) {
          return e.data;
        })), angular.forEach(this.options.resolve || [], function (e, a) {
          n.push(a), t.push(angular.isString(e) ? p.get(e) : p.invoke(e));
        }), n.push('$template'), t.push(e), c.all(t).then(function (e) {
          var t = {};
          return angular.forEach(e, function (e, a) {
            t[n[a]] = e;
          }), t.dialog = o, t;
        });
      }, {
        dialog: function (e) {
          return new m(e);
        },
        messageBox: function (e, t, n) {
          return new m({
            templateUrl: 'template/dialog/message.html',
            controller: 'MessageBoxController',
            resolve: {
              model: function () {
                return {
                  title: e,
                  message: t,
                  buttons: n
                };
              }
            }
          });
        }
      };
    }
  ];
}), angular.module('ui.bootstrap.dropdownToggle', []).directive('dropdownToggle', [
  '$document',
  '$location',
  function (e) {
    var t = null, n = angular.noop;
    return {
      restrict: 'CA',
      link: function (a, o) {
        a.$watch('$location.path', function () {
          n();
        }), o.parent().bind('click', function () {
          n();
        }), o.bind('click', function (a) {
          var i = o === t;
          a.preventDefault(), a.stopPropagation(), t && n(), i || (o.parent().addClass('open'), t = o, n = function (a) {
            a && (a.preventDefault(), a.stopPropagation()), e.unbind('click', n), o.parent().removeClass('open'), n = angular.noop, t = null;
          }, e.bind('click', n));
        });
      }
    };
  }
]), angular.module('ui.bootstrap.modal', ['ui.bootstrap.dialog']).directive('modal', [
  '$parse',
  '$dialog',
  function (e, t) {
    return {
      restrict: 'EA',
      terminal: !0,
      link: function (n, a, o) {
        var i, r = angular.extend({}, n.$eval(o.uiOptions || o.bsOptions || o.options)), l = o.modal || o.show;
        r = angular.extend(r, {
          template: a.html(),
          resolve: {
            $scope: function () {
              return n;
            }
          }
        });
        var s = t.dialog(r);
        a.remove(), i = o.close ? function () {
          e(o.close)(n);
        } : function () {
          angular.isFunction(e(l).assign) && e(l).assign(n, !1);
        }, n.$watch(l, function (e) {
          e ? s.open().then(function () {
            i();
          }) : s.isOpen() && s.close();
        });
      }
    };
  }
]), angular.module('ui.bootstrap.pagination', []).controller('PaginationController', [
  '$scope',
  function (e) {
    e.noPrevious = function () {
      return 1 === e.currentPage;
    }, e.noNext = function () {
      return e.currentPage === e.numPages;
    }, e.isActive = function (t) {
      return e.currentPage === t;
    }, e.selectPage = function (t) {
      !e.isActive(t) && t > 0 && e.numPages >= t && (e.currentPage = t, e.onSelectPage({ page: t }));
    };
  }
]).constant('paginationConfig', {
  boundaryLinks: !1,
  directionLinks: !0,
  firstText: 'First',
  previousText: 'Previous',
  nextText: 'Next',
  lastText: 'Last',
  rotate: !0
}).directive('pagination', [
  'paginationConfig',
  function (e) {
    return {
      restrict: 'EA',
      scope: {
        numPages: '=',
        currentPage: '=',
        maxSize: '=',
        onSelectPage: '&'
      },
      controller: 'PaginationController',
      templateUrl: 'template/pagination/pagination.html',
      replace: !0,
      link: function (t, n, a) {
        function o(e, t, n, a) {
          return {
            number: e,
            text: t,
            active: n,
            disabled: a
          };
        }
        var i = angular.isDefined(a.boundaryLinks) ? t.$eval(a.boundaryLinks) : e.boundaryLinks, r = angular.isDefined(a.directionLinks) ? t.$eval(a.directionLinks) : e.directionLinks, l = angular.isDefined(a.firstText) ? t.$parent.$eval(a.firstText) : e.firstText, s = angular.isDefined(a.previousText) ? t.$parent.$eval(a.previousText) : e.previousText, c = angular.isDefined(a.nextText) ? t.$parent.$eval(a.nextText) : e.nextText, u = angular.isDefined(a.lastText) ? t.$parent.$eval(a.lastText) : e.lastText, p = angular.isDefined(a.rotate) ? t.$eval(a.rotate) : e.rotate;
        t.$watch('numPages + currentPage + maxSize', function () {
          t.pages = [];
          var e = 1, n = t.numPages, a = angular.isDefined(t.maxSize) && t.maxSize < t.numPages;
          a && (p ? (e = Math.max(t.currentPage - Math.floor(t.maxSize / 2), 1), n = e + t.maxSize - 1, n > t.numPages && (n = t.numPages, e = n - t.maxSize + 1)) : (e = (Math.ceil(t.currentPage / t.maxSize) - 1) * t.maxSize + 1, n = Math.min(e + t.maxSize - 1, t.numPages)));
          for (var d = e; n >= d; d++) {
            var m = o(d, d, t.isActive(d), !1);
            t.pages.push(m);
          }
          if (a && !p) {
            if (e > 1) {
              var g = o(e - 1, '...', !1, !1);
              t.pages.unshift(g);
            }
            if (t.numPages > n) {
              var f = o(n + 1, '...', !1, !1);
              t.pages.push(f);
            }
          }
          if (r) {
            var h = o(t.currentPage - 1, s, !1, t.noPrevious());
            t.pages.unshift(h);
            var v = o(t.currentPage + 1, c, !1, t.noNext());
            t.pages.push(v);
          }
          if (i) {
            var b = o(1, l, !1, t.noPrevious());
            t.pages.unshift(b);
            var $ = o(t.numPages, u, !1, t.noNext());
            t.pages.push($);
          }
          t.currentPage > t.numPages && t.selectPage(t.numPages);
        });
      }
    };
  }
]).constant('pagerConfig', {
  previousText: '\xab Previous',
  nextText: 'Next \xbb',
  align: !0
}).directive('pager', [
  'pagerConfig',
  function (e) {
    return {
      restrict: 'EA',
      scope: {
        numPages: '=',
        currentPage: '=',
        onSelectPage: '&'
      },
      controller: 'PaginationController',
      templateUrl: 'template/pagination/pager.html',
      replace: !0,
      link: function (t, n, a) {
        function o(e, t, n, a, o) {
          return {
            number: e,
            text: t,
            disabled: n,
            previous: l && a,
            next: l && o
          };
        }
        var i = angular.isDefined(a.previousText) ? t.$parent.$eval(a.previousText) : e.previousText, r = angular.isDefined(a.nextText) ? t.$parent.$eval(a.nextText) : e.nextText, l = angular.isDefined(a.align) ? t.$parent.$eval(a.align) : e.align;
        t.$watch('numPages + currentPage', function () {
          t.pages = [];
          var e = o(t.currentPage - 1, i, t.noPrevious(), !0, !1);
          t.pages.unshift(e);
          var n = o(t.currentPage + 1, r, t.noNext(), !1, !0);
          t.pages.push(n), t.currentPage > t.numPages && t.selectPage(t.numPages);
        });
      }
    };
  }
]), angular.module('ui.bootstrap.position', []).factory('$position', [
  '$document',
  '$window',
  function (e, t) {
    function n(e, n) {
      return e.currentStyle ? e.currentStyle[n] : t.getComputedStyle ? t.getComputedStyle(e)[n] : e.style[n];
    }
    function a(e) {
      return 'static' === (n(e, 'position') || 'static');
    }
    var o, i;
    e.bind('mousemove', function (e) {
      o = e.pageX, i = e.pageY;
    });
    var r = function (t) {
      for (var n = e[0], o = t.offsetParent || n; o && o !== n && a(o);)
        o = o.offsetParent;
      return o || n;
    };
    return {
      position: function (t) {
        var n = this.offset(t), a = {
            top: 0,
            left: 0
          }, o = r(t[0]);
        return o != e[0] && (a = this.offset(angular.element(o)), a.top += o.clientTop, a.left += o.clientLeft), {
          width: t.prop('offsetWidth'),
          height: t.prop('offsetHeight'),
          top: n.top - a.top,
          left: n.left - a.left
        };
      },
      offset: function (n) {
        var a = n[0].getBoundingClientRect();
        return {
          width: n.prop('offsetWidth'),
          height: n.prop('offsetHeight'),
          top: a.top + (t.pageYOffset || e[0].body.scrollTop),
          left: a.left + (t.pageXOffset || e[0].body.scrollLeft)
        };
      },
      mouse: function () {
        return {
          x: o,
          y: i
        };
      }
    };
  }
]), angular.module('ui.bootstrap.tooltip', ['ui.bootstrap.position']).provider('$tooltip', function () {
  function e(e) {
    var t = /[A-Z]/g, n = '-';
    return e.replace(t, function (e, t) {
      return (t ? n : '') + e.toLowerCase();
    });
  }
  var t = {
      placement: 'top',
      animation: !0,
      popupDelay: 0
    }, n = {
      mouseenter: 'mouseleave',
      click: 'click',
      focus: 'blur'
    }, a = {};
  this.options = function (e) {
    angular.extend(a, e);
  }, this.setTriggers = function (e) {
    angular.extend(n, e);
  }, this.$get = [
    '$window',
    '$compile',
    '$timeout',
    '$parse',
    '$document',
    '$position',
    '$interpolate',
    function (o, i, r, l, s, c, u) {
      return function (o, p, d) {
        function m(e) {
          var t, a;
          return t = e || g.trigger || d, a = angular.isDefined(g.trigger) ? n[g.trigger] || t : n[t] || t, {
            show: t,
            hide: a
          };
        }
        var g = angular.extend({}, t, a), f = e(o), h = m(void 0), v = u.startSymbol(), b = u.endSymbol(), $ = '<' + f + '-popup ' + 'title="' + v + 'tt_title' + b + '" ' + 'content="' + v + 'tt_content' + b + '" ' + 'placement="' + v + 'tt_placement' + b + '" ' + 'animation="tt_animation()" ' + 'is-open="tt_isOpen"' + '>' + '</' + f + '-popup>';
        return {
          restrict: 'EA',
          scope: !0,
          link: function (e, t, n) {
            function a() {
              e.tt_isOpen ? d() : u();
            }
            function u() {
              e.tt_popupDelay ? y = r(f, e.tt_popupDelay) : e.$apply(f);
            }
            function d() {
              e.$apply(function () {
                v();
              });
            }
            function f() {
              var n, a, o, i;
              if (e.tt_content) {
                switch (b && r.cancel(b), k.css({
                    top: 0,
                    left: 0,
                    display: 'block'
                  }), x ? (w = w || s.find('body'), w.append(k)) : t.after(k), n = g.appendToBody ? c.offset(t) : c.position(t), a = k.prop('offsetWidth'), o = k.prop('offsetHeight'), e.tt_placement) {
                case 'mouse':
                  var l = c.mouse();
                  i = {
                    top: l.y,
                    left: l.x
                  };
                  break;
                case 'right':
                  i = {
                    top: n.top + n.height / 2 - o / 2,
                    left: n.left + n.width
                  };
                  break;
                case 'bottom':
                  i = {
                    top: n.top + n.height,
                    left: n.left + n.width / 2 - a / 2
                  };
                  break;
                case 'left':
                  i = {
                    top: n.top + n.height / 2 - o / 2,
                    left: n.left - a
                  };
                  break;
                default:
                  i = {
                    top: n.top - o,
                    left: n.left + n.width / 2 - a / 2
                  };
                }
                i.top += 'px', i.left += 'px', k.css(i), e.tt_isOpen = !0;
              }
            }
            function v() {
              e.tt_isOpen = !1, r.cancel(y), angular.isDefined(e.tt_animation) && e.tt_animation() ? b = r(function () {
                k.remove();
              }, 500) : k.remove();
            }
            var b, y, w, k = i($)(e), x = angular.isDefined(g.appendToBody) ? g.appendToBody : !1;
            e.tt_isOpen = !1, n.$observe(o, function (t) {
              e.tt_content = t;
            }), n.$observe(p + 'Title', function (t) {
              e.tt_title = t;
            }), n.$observe(p + 'Placement', function (t) {
              e.tt_placement = angular.isDefined(t) ? t : g.placement;
            }), n.$observe(p + 'Animation', function (t) {
              e.tt_animation = angular.isDefined(t) ? l(t) : function () {
                return g.animation;
              };
            }), n.$observe(p + 'PopupDelay', function (t) {
              var n = parseInt(t, 10);
              e.tt_popupDelay = isNaN(n) ? g.popupDelay : n;
            }), n.$observe(p + 'Trigger', function (e) {
              t.unbind(h.show), t.unbind(h.hide), h = m(e), h.show === h.hide ? t.bind(h.show, a) : (t.bind(h.show, u), t.bind(h.hide, d));
            }), n.$observe(p + 'AppendToBody', function (t) {
              x = angular.isDefined(t) ? l(t)(e) : x;
            }), x && e.$on('$locationChangeSuccess', function () {
              e.tt_isOpen && v();
            }), e.$on('$destroy', function () {
              e.tt_isOpen ? v() : k.remove();
            });
          }
        };
      };
    }
  ];
}).directive('tooltipPopup', function () {
  return {
    restrict: 'E',
    replace: !0,
    scope: {
      content: '@',
      placement: '@',
      animation: '&',
      isOpen: '&'
    },
    templateUrl: 'template/tooltip/tooltip-popup.html'
  };
}).directive('tooltip', [
  '$tooltip',
  function (e) {
    return e('tooltip', 'tooltip', 'mouseenter');
  }
]).directive('tooltipHtmlUnsafePopup', function () {
  return {
    restrict: 'E',
    replace: !0,
    scope: {
      content: '@',
      placement: '@',
      animation: '&',
      isOpen: '&'
    },
    templateUrl: 'template/tooltip/tooltip-html-unsafe-popup.html'
  };
}).directive('tooltipHtmlUnsafe', [
  '$tooltip',
  function (e) {
    return e('tooltipHtmlUnsafe', 'tooltip', 'mouseenter');
  }
]), angular.module('ui.bootstrap.popover', ['ui.bootstrap.tooltip']).directive('popoverPopup', function () {
  return {
    restrict: 'EA',
    replace: !0,
    scope: {
      title: '@',
      content: '@',
      placement: '@',
      animation: '&',
      isOpen: '&'
    },
    templateUrl: 'template/popover/popover.html'
  };
}).directive('popover', [
  '$compile',
  '$timeout',
  '$parse',
  '$window',
  '$tooltip',
  function (e, t, n, a, o) {
    return o('popover', 'popover', 'click');
  }
]), angular.module('ui.bootstrap.progressbar', ['ui.bootstrap.transition']).constant('progressConfig', {
  animate: !0,
  autoType: !1,
  stackedTypes: [
    'success',
    'info',
    'warning',
    'danger'
  ]
}).controller('ProgressBarController', [
  '$scope',
  '$attrs',
  'progressConfig',
  function (e, t, n) {
    function a(e) {
      return r[e];
    }
    var o = angular.isDefined(t.animate) ? e.$eval(t.animate) : n.animate, i = angular.isDefined(t.autoType) ? e.$eval(t.autoType) : n.autoType, r = angular.isDefined(t.stackedTypes) ? e.$eval('[' + t.stackedTypes + ']') : n.stackedTypes;
    this.makeBar = function (e, t, n) {
      var r = angular.isObject(e) ? e.value : e || 0, l = angular.isObject(t) ? t.value : t || 0, s = angular.isObject(e) && angular.isDefined(e.type) ? e.type : i ? a(n || 0) : null;
      return {
        from: l,
        to: r,
        type: s,
        animate: o
      };
    }, this.addBar = function (t) {
      e.bars.push(t), e.totalPercent += t.to;
    }, this.clearBars = function () {
      e.bars = [], e.totalPercent = 0;
    }, this.clearBars();
  }
]).directive('progress', function () {
  return {
    restrict: 'EA',
    replace: !0,
    controller: 'ProgressBarController',
    scope: {
      value: '=percent',
      onFull: '&',
      onEmpty: '&'
    },
    templateUrl: 'template/progressbar/progress.html',
    link: function (e, t, n, a) {
      e.$watch('value', function (e, t) {
        if (a.clearBars(), angular.isArray(e))
          for (var n = 0, o = e.length; o > n; n++)
            a.addBar(a.makeBar(e[n], t[n], n));
        else
          a.addBar(a.makeBar(e, t));
      }, !0), e.$watch('totalPercent', function (t) {
        t >= 100 ? e.onFull() : 0 >= t && e.onEmpty();
      }, !0);
    }
  };
}).directive('progressbar', [
  '$transition',
  function (e) {
    return {
      restrict: 'EA',
      replace: !0,
      scope: {
        width: '=',
        old: '=',
        type: '=',
        animate: '='
      },
      templateUrl: 'template/progressbar/bar.html',
      link: function (t, n) {
        t.$watch('width', function (a) {
          t.animate ? (n.css('width', t.old + '%'), e(n, { width: a + '%' })) : n.css('width', a + '%');
        });
      }
    };
  }
]), angular.module('ui.bootstrap.rating', []).constant('ratingConfig', { max: 5 }).directive('rating', [
  'ratingConfig',
  '$parse',
  function (e, t) {
    return {
      restrict: 'EA',
      scope: { value: '=' },
      templateUrl: 'template/rating/rating.html',
      replace: !0,
      link: function (n, a, o) {
        var i = angular.isDefined(o.max) ? n.$eval(o.max) : e.max;
        n.range = [];
        for (var r = 1; i >= r; r++)
          n.range.push(r);
        n.rate = function (e) {
          n.readonly || (n.value = e);
        }, n.enter = function (e) {
          n.readonly || (n.val = e);
        }, n.reset = function () {
          n.val = angular.copy(n.value);
        }, n.reset(), n.$watch('value', function (e) {
          n.val = e;
        }), n.readonly = !1, o.readonly && n.$parent.$watch(t(o.readonly), function (e) {
          n.readonly = !!e;
        });
      }
    };
  }
]), angular.module('ui.bootstrap.tabs', []).directive('tabs', function () {
  return function () {
    throw Error('The `tabs` directive is deprecated, please migrate to `tabset`. Instructions can be found at http://github.com/angular-ui/bootstrap/tree/master/CHANGELOG.md');
  };
}).controller('TabsetController', [
  '$scope',
  '$element',
  function (e) {
    var t = this, n = t.tabs = e.tabs = [];
    t.select = function (e) {
      angular.forEach(n, function (e) {
        e.active = !1;
      }), e.active = !0;
    }, t.addTab = function (e) {
      n.push(e), 1 == n.length && t.select(e);
    }, t.removeTab = function (e) {
      var a = n.indexOf(e);
      if (e.active && n.length > 1) {
        var o = a == n.length - 1 ? a - 1 : a + 1;
        t.select(n[o]);
      }
      n.splice(a, 1);
    };
  }
]).directive('tabset', function () {
  return {
    restrict: 'EA',
    transclude: !0,
    scope: {},
    controller: 'TabsetController',
    templateUrl: 'template/tabs/tabset.html',
    link: function (e, t, n) {
      e.vertical = angular.isDefined(n.vertical) ? e.$eval(n.vertical) : !1, e.type = angular.isDefined(n.type) ? e.$parent.$eval(n.type) : 'tabs';
    }
  };
}).directive('tab', [
  '$parse',
  '$http',
  '$templateCache',
  '$compile',
  function (e) {
    return {
      require: '^tabset',
      restrict: 'EA',
      replace: !0,
      templateUrl: 'template/tabs/tab.html',
      transclude: !0,
      scope: {
        heading: '@',
        onSelect: '&select'
      },
      controller: function () {
      },
      compile: function (t, n, a) {
        return function (t, n, o, i) {
          var r, l;
          t.active = !1, o.active ? (r = e(o.active), l = r.assign, t.$parent.$watch(r, function (e) {
            e && t.disabled ? l(t.$parent, !1) : t.active = !!e;
          })) : l = r = angular.noop, t.$watch('active', function (e) {
            l(t.$parent, e), e && (i.select(t), t.onSelect());
          }), t.disabled = !1, o.disabled && t.$parent.$watch(e(o.disabled), function (e) {
            t.disabled = !!e;
          }), t.select = function () {
            t.disabled || (t.active = !0);
          }, i.addTab(t), t.$on('$destroy', function () {
            i.removeTab(t);
          }), t.active && l(t.$parent, !0), a(t.$parent, function (e) {
            var n, a = [];
            angular.forEach(e, function (e) {
              e.tagName && (e.hasAttribute('tab-heading') || e.hasAttribute('data-tab-heading') || 'tab-heading' == e.tagName.toLowerCase() || 'data-tab-heading' == e.tagName.toLowerCase()) ? n = e : a.push(e);
            }), n && (t.headingElement = angular.element(n)), t.contentElement = angular.element(a);
          });
        };
      }
    };
  }
]).directive('tabHeadingTransclude', [function () {
    return {
      restrict: 'A',
      require: '^tab',
      link: function (e, t) {
        e.$watch('headingElement', function (e) {
          e && (t.html(''), t.append(e));
        });
      }
    };
  }]).directive('tabContentTransclude', [
  '$parse',
  function (e) {
    return {
      restrict: 'A',
      require: '^tabset',
      link: function (t, n, a) {
        t.$watch(e(a.tabContentTransclude), function (e) {
          n.html(''), e && n.append(e.contentElement);
        });
      }
    };
  }
]), angular.module('ui.bootstrap.timepicker', []).filter('pad', function () {
  return function (e) {
    return angular.isDefined(e) && 2 > ('' + e).length && (e = '0' + e), e;
  };
}).constant('timepickerConfig', {
  hourStep: 1,
  minuteStep: 1,
  showMeridian: !0,
  meridians: [
    'AM',
    'PM'
  ],
  readonlyInput: !1,
  mousewheel: !0
}).directive('timepicker', [
  'padFilter',
  '$parse',
  'timepickerConfig',
  function (e, t, n) {
    return {
      restrict: 'EA',
      require: 'ngModel',
      replace: !0,
      templateUrl: 'template/timepicker/timepicker.html',
      scope: { model: '=ngModel' },
      link: function (a, o, i) {
        function r() {
          var e = parseInt(a.hours, 10), t = a.showMeridian ? e > 0 && 13 > e : e >= 0 && 24 > e;
          return t ? (a.showMeridian && (12 === e && (e = 0), a.meridian === u[1] && (e += 12)), e) : void 0;
        }
        function l() {
          var t = c.getHours();
          a.showMeridian && (t = 0 === t || 12 === t ? 12 : t % 12), a.hours = 'h' === b ? t : e(t), a.validHours = !0;
          var n = c.getMinutes();
          a.minutes = 'm' === b ? n : e(n), a.validMinutes = !0, a.meridian = a.showMeridian ? 12 > c.getHours() ? u[0] : u[1] : '', b = !1;
        }
        function s(e) {
          var t = new Date(c.getTime() + 60000 * e);
          t.getDate() !== c.getDate() && t.setDate(t.getDate() - 1), c.setTime(t.getTime()), a.model = new Date(c);
        }
        var c = new Date(), u = n.meridians, p = n.hourStep;
        i.hourStep && a.$parent.$watch(t(i.hourStep), function (e) {
          p = parseInt(e, 10);
        });
        var d = n.minuteStep;
        i.minuteStep && a.$parent.$watch(t(i.minuteStep), function (e) {
          d = parseInt(e, 10);
        }), a.showMeridian = n.showMeridian, i.showMeridian && a.$parent.$watch(t(i.showMeridian), function (e) {
          if (a.showMeridian = !!e, a.model)
            l();
          else {
            var t = new Date(c), n = r();
            angular.isDefined(n) && t.setHours(n), a.model = new Date(t);
          }
        });
        var m = o.find('input'), g = m.eq(0), f = m.eq(1), h = angular.isDefined(i.mousewheel) ? a.$eval(i.mousewheel) : n.mousewheel;
        if (h) {
          var v = function (e) {
            return e.originalEvent && (e = e.originalEvent), e.detail || e.wheelDelta > 0;
          };
          g.bind('mousewheel', function (e) {
            a.$apply(v(e) ? a.incrementHours() : a.decrementHours()), e.preventDefault();
          }), f.bind('mousewheel', function (e) {
            a.$apply(v(e) ? a.incrementMinutes() : a.decrementMinutes()), e.preventDefault();
          });
        }
        var b = !1;
        a.readonlyInput = angular.isDefined(i.readonlyInput) ? a.$eval(i.readonlyInput) : n.readonlyInput, a.readonlyInput ? (a.updateHours = angular.noop, a.updateMinutes = angular.noop) : (a.updateHours = function () {
          var e = r();
          angular.isDefined(e) ? (b = 'h', null === a.model && (a.model = new Date(c)), a.model.setHours(e)) : (a.model = null, a.validHours = !1);
        }, g.bind('blur', function () {
          a.validHours && 10 > a.hours && a.$apply(function () {
            a.hours = e(a.hours);
          });
        }), a.updateMinutes = function () {
          var e = parseInt(a.minutes, 10);
          e >= 0 && 60 > e ? (b = 'm', null === a.model && (a.model = new Date(c)), a.model.setMinutes(e)) : (a.model = null, a.validMinutes = !1);
        }, f.bind('blur', function () {
          a.validMinutes && 10 > a.minutes && a.$apply(function () {
            a.minutes = e(a.minutes);
          });
        })), a.$watch(function () {
          return +a.model;
        }, function (e) {
          !isNaN(e) && e > 0 && (c = new Date(e), l());
        }), a.incrementHours = function () {
          s(60 * p);
        }, a.decrementHours = function () {
          s(60 * -p);
        }, a.incrementMinutes = function () {
          s(d);
        }, a.decrementMinutes = function () {
          s(-d);
        }, a.toggleMeridian = function () {
          s(720 * (12 > c.getHours() ? 1 : -1));
        };
      }
    };
  }
]), angular.module('ui.bootstrap.typeahead', ['ui.bootstrap.position']).factory('typeaheadParser', [
  '$parse',
  function (e) {
    var t = /^\s*(.*?)(?:\s+as\s+(.*?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+(.*)$/;
    return {
      parse: function (n) {
        var a = n.match(t);
        if (!a)
          throw Error('Expected typeahead specification in form of \'_modelValue_ (as _label_)? for _item_ in _collection_\' but got \'' + n + '\'.');
        return {
          itemName: a[3],
          source: e(a[4]),
          viewMapper: e(a[2] || a[1]),
          modelMapper: e(a[1])
        };
      }
    };
  }
]).directive('typeahead', [
  '$compile',
  '$parse',
  '$q',
  '$timeout',
  '$document',
  '$position',
  'typeaheadParser',
  function (e, t, n, a, o, i, r) {
    var l = [
        9,
        13,
        27,
        38,
        40
      ];
    return {
      require: 'ngModel',
      link: function (s, c, u, p) {
        var d, m = s.$eval(u.typeaheadMinLength) || 1, g = s.$eval(u.typeaheadWaitMs) || 0, f = r.parse(u.typeahead), h = s.$eval(u.typeaheadEditable) !== !1, v = t(u.typeaheadLoading).assign || angular.noop, b = t(u.typeaheadOnSelect), $ = angular.element('<typeahead-popup></typeahead-popup>');
        $.attr({
          matches: 'matches',
          active: 'activeIdx',
          select: 'select(activeIdx)',
          query: 'query',
          position: 'position'
        });
        var y = s.$new();
        s.$on('$destroy', function () {
          y.$destroy();
        });
        var w = function () {
            y.matches = [], y.activeIdx = -1;
          }, k = function (e) {
            var t = { $viewValue: e };
            v(s, !0), n.when(f.source(y, t)).then(function (n) {
              if (e === p.$viewValue) {
                if (n.length > 0) {
                  y.activeIdx = 0, y.matches.length = 0;
                  for (var a = 0; n.length > a; a++)
                    t[f.itemName] = n[a], y.matches.push({
                      label: f.viewMapper(y, t),
                      model: n[a]
                    });
                  y.query = e, y.position = i.position(c), y.position.top = y.position.top + c.prop('offsetHeight');
                } else
                  w();
                v(s, !1);
              }
            }, function () {
              w(), v(s, !1);
            });
          };
        w(), y.query = void 0, p.$parsers.push(function (e) {
          var t;
          return w(), d ? e : (e && e.length >= m && (g > 0 ? (t && a.cancel(t), t = a(function () {
            k(e);
          }, g)) : k(e)), h ? e : void 0);
        }), p.$render = function () {
          var e = {};
          e[f.itemName] = d || p.$viewValue, c.val(f.viewMapper(y, e) || p.$viewValue), d = void 0;
        }, y.select = function (e) {
          var t, n, a = {};
          a[f.itemName] = n = d = y.matches[e].model, t = f.modelMapper(y, a), p.$setViewValue(t), p.$render(), b(y, {
            $item: n,
            $model: t,
            $label: f.viewMapper(y, a)
          }), c[0].focus();
        }, c.bind('keydown', function (e) {
          0 !== y.matches.length && -1 !== l.indexOf(e.which) && (e.preventDefault(), 40 === e.which ? (y.activeIdx = (y.activeIdx + 1) % y.matches.length, y.$digest()) : 38 === e.which ? (y.activeIdx = (y.activeIdx ? y.activeIdx : y.matches.length) - 1, y.$digest()) : 13 === e.which || 9 === e.which ? y.$apply(function () {
            y.select(y.activeIdx);
          }) : 27 === e.which && (e.stopPropagation(), w(), y.$digest()));
        }), o.bind('click', function () {
          w(), y.$digest();
        }), c.after(e($)(y));
      }
    };
  }
]).directive('typeaheadPopup', function () {
  return {
    restrict: 'E',
    scope: {
      matches: '=',
      query: '=',
      active: '=',
      position: '=',
      select: '&'
    },
    replace: !0,
    templateUrl: 'template/typeahead/typeahead.html',
    link: function (e) {
      e.isOpen = function () {
        return e.matches.length > 0;
      }, e.isActive = function (t) {
        return e.active == t;
      }, e.selectActive = function (t) {
        e.active = t;
      }, e.selectMatch = function (t) {
        e.select({ activeIdx: t });
      };
    }
  };
}).filter('typeaheadHighlight', function () {
  function e(e) {
    return e.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
  }
  return function (t, n) {
    return n ? t.replace(RegExp(e(n), 'gi'), '<strong>$&</strong>') : n;
  };
}), angular.module('template/accordion/accordion-group.html', []).run([
  '$templateCache',
  function (e) {
    e.put('template/accordion/accordion-group.html', '<div class="accordion-group">\n  <div class="accordion-heading" ><a class="accordion-toggle" ng-click="isOpen = !isOpen" accordion-transclude="heading">{{heading}}</a></div>\n  <div class="accordion-body" collapse="!isOpen">\n    <div class="accordion-inner" ng-transclude></div>  </div>\n</div>');
  }
]), angular.module('template/accordion/accordion.html', []).run([
  '$templateCache',
  function (e) {
    e.put('template/accordion/accordion.html', '<div class="accordion" ng-transclude></div>');
  }
]), angular.module('template/alert/alert.html', []).run([
  '$templateCache',
  function (e) {
    e.put('template/alert/alert.html', '<div class=\'alert\' ng-class=\'type && "alert-" + type\'>\n    <button ng-show=\'closeable\' type=\'button\' class=\'close\' ng-click=\'close()\'>&times;</button>\n    <div ng-transclude></div>\n</div>\n');
  }
]), angular.module('template/carousel/carousel.html', []).run([
  '$templateCache',
  function (e) {
    e.put('template/carousel/carousel.html', '<div ng-mouseenter="pause()" ng-mouseleave="play()" class="carousel">\n    <ol class="carousel-indicators" ng-show="slides().length > 1">\n        <li ng-repeat="slide in slides()" ng-class="{active: isActive(slide)}" ng-click="select(slide)"></li>\n    </ol>\n    <div class="carousel-inner" ng-transclude></div>\n    <a ng-click="prev()" class="carousel-control left" ng-show="slides().length > 1">&lsaquo;</a>\n    <a ng-click="next()" class="carousel-control right" ng-show="slides().length > 1">&rsaquo;</a>\n</div>\n');
  }
]), angular.module('template/carousel/slide.html', []).run([
  '$templateCache',
  function (e) {
    e.put('template/carousel/slide.html', '<div ng-class="{\n    \'active\': leaving || (active && !entering),\n    \'prev\': (next || active) && direction==\'prev\',\n    \'next\': (next || active) && direction==\'next\',\n    \'right\': direction==\'prev\',\n    \'left\': direction==\'next\'\n  }" class="item" ng-transclude></div>\n');
  }
]), angular.module('template/datepicker/datepicker.html', []).run([
  '$templateCache',
  function (e) {
    e.put('template/datepicker/datepicker.html', '<table class="well well-large">\n  <thead>\n    <tr class="text-center">\n      <th><button class="btn pull-left" ng-click="move(-1)"><i class="icon-chevron-left"></i></button></th>\n      <th colspan="{{rows[0].length - 2 + showWeekNumbers}}"><button class="btn btn-block" ng-click="toggleMode()"><strong>{{title}}</strong></button></th>\n      <th><button class="btn pull-right" ng-click="move(1)"><i class="icon-chevron-right"></i></button></th>\n    </tr>\n    <tr class="text-center" ng-show="labels.length > 0">\n      <th ng-show="showWeekNumbers">#</th>\n      <th ng-repeat="label in labels">{{label}}</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr ng-repeat="row in rows">\n      <td ng-show="showWeekNumbers" class="text-center"><em>{{ getWeekNumber(row) }}</em></td>\n      <td ng-repeat="dt in row" class="text-center">\n        <button style="width:100%;" class="btn" ng-class="{\'btn-info\': dt.isSelected}" ng-click="select(dt.date)" ng-disabled="dt.disabled"><span ng-class="{muted: ! dt.isCurrent}">{{dt.label}}</span></button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n');
  }
]), angular.module('template/dialog/message.html', []).run([
  '$templateCache',
  function (e) {
    e.put('template/dialog/message.html', '<div class="modal-header">\n\t<h3>{{ title }}</h3>\n</div>\n<div class="modal-body">\n\t<p>{{ message }}</p>\n</div>\n<div class="modal-footer">\n\t<button ng-repeat="btn in buttons" ng-click="close(btn.result)" class="btn" ng-class="btn.cssClass">{{ btn.label }}</button>\n</div>\n');
  }
]), angular.module('template/modal/backdrop.html', []).run([
  '$templateCache',
  function (e) {
    e.put('template/modal/backdrop.html', '<div class="modal-backdrop"></div>');
  }
]), angular.module('template/modal/window.html', []).run([
  '$templateCache',
  function (e) {
    e.put('template/modal/window.html', '<div class="modal in" ng-transclude></div>');
  }
]), angular.module('template/pagination/pager.html', []).run([
  '$templateCache',
  function (e) {
    e.put('template/pagination/pager.html', '<div class="pager">\n  <ul>\n    <li ng-repeat="page in pages" ng-class="{disabled: page.disabled, previous: page.previous, next: page.next}"><a ng-click="selectPage(page.number)">{{page.text}}</a></li>\n  </ul>\n</div>\n');
  }
]), angular.module('template/pagination/pagination.html', []).run([
  '$templateCache',
  function (e) {
    e.put('template/pagination/pagination.html', '<div class="pagination"><ul>\n  <li ng-repeat="page in pages" ng-class="{active: page.active, disabled: page.disabled}"><a ng-click="selectPage(page.number)">{{page.text}}</a></li>\n  </ul>\n</div>\n');
  }
]), angular.module('template/tooltip/tooltip-html-unsafe-popup.html', []).run([
  '$templateCache',
  function (e) {
    e.put('template/tooltip/tooltip-html-unsafe-popup.html', '<div class="tooltip {{placement}}" ng-class="{ in: isOpen(), fade: animation() }">\n  <div class="tooltip-arrow"></div>\n  <div class="tooltip-inner" ng-bind-html-unsafe="content"></div>\n</div>\n');
  }
]), angular.module('template/tooltip/tooltip-popup.html', []).run([
  '$templateCache',
  function (e) {
    e.put('template/tooltip/tooltip-popup.html', '<div class="tooltip {{placement}}" ng-class="{ in: isOpen(), fade: animation() }">\n  <div class="tooltip-arrow"></div>\n  <div class="tooltip-inner" ng-bind="content"></div>\n</div>\n');
  }
]), angular.module('template/popover/popover.html', []).run([
  '$templateCache',
  function (e) {
    e.put('template/popover/popover.html', '<div class="popover {{placement}}" ng-class="{ in: isOpen(), fade: animation() }">\n  <div class="arrow"></div>\n\n  <div class="popover-inner">\n      <h3 class="popover-title" ng-bind="title" ng-show="title"></h3>\n      <div class="popover-content" ng-bind="content"></div>\n  </div>\n</div>\n');
  }
]), angular.module('template/progressbar/bar.html', []).run([
  '$templateCache',
  function (e) {
    e.put('template/progressbar/bar.html', '<div class="bar" ng-class=\'type && "bar-" + type\'></div>');
  }
]), angular.module('template/progressbar/progress.html', []).run([
  '$templateCache',
  function (e) {
    e.put('template/progressbar/progress.html', '<div class="progress"><progressbar ng-repeat="bar in bars" width="bar.to" old="bar.from" animate="bar.animate" type="bar.type"></progressbar></div>');
  }
]), angular.module('template/rating/rating.html', []).run([
  '$templateCache',
  function (e) {
    e.put('template/rating/rating.html', '<span ng-mouseleave="reset()">\n\t<i ng-repeat="number in range" ng-mouseenter="enter(number)" ng-click="rate(number)" ng-class="{\'icon-star\': number <= val, \'icon-star-empty\': number > val}"></i>\n</span>\n');
  }
]), angular.module('template/tabs/pane.html', []).run([
  '$templateCache',
  function (e) {
    e.put('template/tabs/pane.html', '<div class="tab-pane" ng-class="{active: selected}" ng-show="selected" ng-transclude></div>\n');
  }
]), angular.module('template/tabs/tab.html', []).run([
  '$templateCache',
  function (e) {
    e.put('template/tabs/tab.html', '<li ng-class="{active: active, disabled: disabled}">\n  <a ng-click="select()" tab-heading-transclude>{{heading}}</a>\n</li>\n');
  }
]), angular.module('template/tabs/tabs.html', []).run([
  '$templateCache',
  function (e) {
    e.put('template/tabs/tabs.html', '<div class="tabbable">\n  <ul class="nav nav-tabs">\n    <li ng-repeat="pane in panes" ng-class="{active:pane.selected}">\n      <a ng-click="select(pane)">{{pane.heading}}</a>\n    </li>\n  </ul>\n  <div class="tab-content" ng-transclude></div>\n</div>\n');
  }
]), angular.module('template/tabs/tabset.html', []).run([
  '$templateCache',
  function (e) {
    e.put('template/tabs/tabset.html', '\n<div class="tabbable">\n  <ul class="nav {{type && \'nav-\' + type}}" ng-class="{\'nav-stacked\': vertical}" ng-transclude>\n  </ul>\n  <div class="tab-content">\n    <div class="tab-pane" \n         ng-repeat="tab in tabs" \n         ng-class="{active: tab.active}"\n         tab-content-transclude="tab" tt="tab">\n    </div>\n  </div>\n</div>\n');
  }
]), angular.module('template/timepicker/timepicker.html', []).run([
  '$templateCache',
  function (e) {
    e.put('template/timepicker/timepicker.html', '<table class="form-inline">\n\t<tr class="text-center">\n\t\t<td><a ng-click="incrementHours()" class="btn btn-link"><i class="icon-chevron-up"></i></a></td>\n\t\t<td>&nbsp;</td>\n\t\t<td><a ng-click="incrementMinutes()" class="btn btn-link"><i class="icon-chevron-up"></i></a></td>\n\t\t<td ng-show="showMeridian"></td>\n\t</tr>\n\t<tr>\n\t\t<td class="control-group" ng-class="{\'error\': !validHours}"><input type="text" ng-model="hours" ng-change="updateHours()" class="span1 text-center" ng-mousewheel="incrementHours()" ng-readonly="readonlyInput" maxlength="2" /></td>\n\t\t<td>:</td>\n\t\t<td class="control-group" ng-class="{\'error\': !validMinutes}"><input type="text" ng-model="minutes" ng-change="updateMinutes()" class="span1 text-center" ng-readonly="readonlyInput" maxlength="2"></td>\n\t\t<td ng-show="showMeridian"><button ng-click="toggleMeridian()" class="btn text-center">{{meridian}}</button></td>\n\t</tr>\n\t<tr class="text-center">\n\t\t<td><a ng-click="decrementHours()" class="btn btn-link"><i class="icon-chevron-down"></i></a></td>\n\t\t<td>&nbsp;</td>\n\t\t<td><a ng-click="decrementMinutes()" class="btn btn-link"><i class="icon-chevron-down"></i></a></td>\n\t\t<td ng-show="showMeridian"></td>\n\t</tr>\n</table>');
  }
]), angular.module('template/typeahead/typeahead.html', []).run([
  '$templateCache',
  function (e) {
    e.put('template/typeahead/typeahead.html', '<ul class="typeahead dropdown-menu" ng-style="{display: isOpen()&&\'block\' || \'none\', top: position.top+\'px\', left: position.left+\'px\'}">\n    <li ng-repeat="match in matches" ng-class="{active: isActive($index) }" ng-mouseenter="selectActive($index)">\n        <a tabindex="-1" ng-click="selectMatch($index)" ng-bind-html-unsafe="match.label | typeaheadHighlight:query"></a>\n    </li>\n</ul>');
  }
]);