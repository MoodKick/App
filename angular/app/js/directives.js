'use strict';

var isNumber = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

angular.module('myApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]).
  /*
   * single Slide for Deck of slides. Evals script on slideShown
   */
  directive('slide', function() {
    return {
      restrict: 'E',
      compile: function compile(tElement, tAttrs, transclude) {
        return {
          post: function postLink(scope, element, attrs, controller) {
            element.bind('slideShown', function() {
              eval(scope.slide.script);
            });
          }
        }
      }
    }
  }).
  /*
   * Deck of slides. Whenever current slide changes, triggers events (slideShown and slideHidden)
   * and changes classes of slides (current, previous, next)
   */
  directive('deck', function() {
    return {
      template: '<slide ng-repeat="slide in slides()" id="{{slide.id}}" ng-bind-html="slide.content"></slide>',
      restrict: 'E',
      scope: {
        current: '&current',
        slides: '&slides'
      },
      compile: function compile(tElement, tAttrs, transclude) {
        return {
          post: function postLink(scope, element, attrs, controller) {
            scope.$watch('current()', function(value) {
              var $slides = element.find('slide');
              $slides.each(function(i, slide) {
                if ($(slide).hasClass('current')) {
                  $(slide).trigger('slideHidden');
                }
                $(slide).removeClass('previous current next');
                if (i < value) {
                  $(slide).addClass('previous');
                } else if (i == value) {
                  $(slide).addClass('current');
                  $(slide).trigger('slideShown');
                } else {
                  $(slide).addClass('next');
                }
              })
            })
          }
        }
      }
    }
  }).

  /*
   * Chest of hope. Container for gridster.
   * for each hope item, adds widget for gridster
   */
  directive('chestOfHope', function() {
    return {
      restrict: 'E',
      template: '<div class="gridster"><ul></ul></div>',
      replace: true,
      scope: {
        hopeItems: '=hopeItems'
      },
      compile: function compile(tElement, tAttrs, transclude) {
        return {
          post: function postLink(scope, iElement, iAttrs, controller) {
            window.gridster = $('.gridster ul').gridster({
              widget_margins: [5, 5],
              widget_base_dimensions: [65, 65],
              serialize_params: function($w, wgd) {
                return {
                  col: wgd.col,
                  row: wgd.row,
                  id: $w.data('id')
                }
              }
            }).data('gridster');

            _.each(scope.hopeItems, function(hopeItem) {
              gridster.add_widget('<li data-id="' + hopeItem.id + '">' + hopeItem.content + '</li>', 1, 1, hopeItem.col, hopeItem.row);
            })
          }
        }
      },
    }
  }).
  /*
   * Play button for Audio. Starts the first audio element of parent.
   */
  directive('mkPlayAudio', function() {
    return function(scope, element, attrs) {
      $(element).bind('click', function() {
        $(this).parent().find('audio')[0].play();
        return false;
      });
    }
  }).
  /*
   * Stop button for Audio. Stops the first audio element of parent.
   */
  directive('mkStopAudio', function() {
    return function(scope, element, attrs) {
      $(element).bind('click', function() {
        var audio = $(this).parent().find('audio')[0];
        audio.pause();
        audio.currentTime = 0;
        return false;
      });
    }
  }).
  /*
   * Stripped-down version of jQuery Mobile checkbox.
   */
  directive('mobilecheckbox', function() {
    return {
      restrict: 'E',
      replace: true,
      template:
        '<div class="ui-checkbox">'+
         '<input type="checkbox" name="{{name}}"/>'+
         '<label class="ui-btn ui-btn-corner-all ui-btn-icon-left ui-checkbox-off ui-btn-up-c">'+
           '<span class="ui-btn-inner ui-btn-corner-all">'+
             '<span class="ui-btn-text">{{title}}</span>'+
             '<span class="ui-icon ui-icon-shadow" ng-class="{\'ui-icon-checkbox-on\': value, \'ui-icon-checkbox-off\': !value}"> </span>'+
           '</span>'+
         '</label>'+
        '</div>',
      link: function(scope, element, attrs, controller) {
        element.bind('click', function() {
          scope.$apply(function(){
            scope.value = !scope.value;
          });
        });
      },
      scope: {
        value: '=value',
        title: '@title',
        name: '@name'
      }
    }
  }).
  /*
   * slider for Overall Happiness input on Daily Journal.
   */
  directive('overallhappiness', function() {
    return {
      require: 'ngModel',
      link: function(scope, elm, attrs, controller) {
        if (controller) {
          var createSlider = function() {
            fdSlider.createSlider({
              inp: elm[0],
              min: 0,
              max: 4,
              hideInput: true,
              callbacks: {
                change: [function(e) {
                  updateModel(e);
                }]
              }
          });
          }
          var updateModel = function(e) {
            controller.$setViewValue(e.value)
          }
          createSlider();
          controller.$render = function() {
            if (isNumber(controller.$viewValue)) {
              elm.val(controller.$viewValue);
              fdSlider.updateSlider(attrs.id);
            }
          }
        }
      },
    }
  }).
  /*
   * slider for Measurable Quesion in Questionnaire.
   */
  directive('measurablequestion', function() {
    return {
      restrict: 'E',
      replace: true,
      template:
        '<div class="control-group">'+
          '<label class="control-label">{{question.description}}</label>'+
          '<div class="controls">'+
            //somehow, without id fdSlider stops working
            '<input ng-model="question.answer" id="question{{question.id}}" type="text"/>'+
            '<div class="slider-labels">'+
              '<div class="min-value">{{question.unit.min_value_description}}</div>'+
              '<div class="max-value">{{question.unit.max_value_description}}</div>'+
            '</div>'+
          '</div>'+
        '</div>',
      scope: {
        question: '=question'
      },
      link: function(scope, elm, attrs, controller) {
        //if we create slider without checking if input is there,
        //input would not be there, actually. Somehow angular
        //creates it after the link phase. Well, it looks like it is
        //there in the dom, however there is no id on it yet.
        scope.$watch(function() {
          return $(elm).find('input').length;
        }, function (newVal) {
            if (newVal > 0) {
              fdSlider.createSlider({
                inp: $(elm).find('input')[0],
                min: scope.question.unit.min_value,
                max: scope.question.unit.max_value,
                hideInput: true,
                callbacks: {
                  change: [function(e) {
                    scope.question.answer = e.value;
                  }]
                }
              });
            }
        }, true);
      },
    }
  }).
  /*
   * Text input for Questionnaire
   */
  directive('textquestion', function() {
    return {
      restrict: 'E',
      replace: true,
      template:
        '<div class="control-group">'+
          '<label class="control-label">{{question.description}}</label>'+
          '<div class="controls">'+
            '<input type="text" ng-model="question.answer"/>'+
          '</div>'+
        '</div>',
      scope: {
        question: '=question',
      }
    }
  }).
  /*
   * Group of checkboxes for Questionnaire
   */
  directive('multiplechoicequeston', function() {
    return {
      restrict: 'E',
      replace: true,
      template:
        '<div class="control-group">'+
          '<label class="conrol-label">{{question.description}}</label>'+
          '<mobilecheckbox ng-repeat="choice in question.choices" value="choice.selected" title="{{choice.value}}" name="{{question.position}}"></mobilecheckbox>'+
        '</div>',
      scope: {
        question: '=question',
      }
    }
  }).
  /*
   * Select for Questionnaire
   */
  directive('singlechoicequestion', function() {
    return {
      restrict: 'E',
      replace: true,
      template:
        '<div class="control-group">'+
          '<label class="control-label">{{question.description}}</label>'+
          '<div class="controls">'+
            '<select ng-model="question.answer" ng-options="c.id as c.value for c in question.choices"></section>'+
          '</div>'+
        '</div>',
      scope: {
        question: '=question'
      }
    }
  }).
  /*
   * Line chart used for MoodTrend
   */
  directive('mkTrend', function() {
    return {
      restrict: 'E',
      template: '<canvas id="bluff-graph" height="255" width="302"></canvas>',
      link: function(scope, element, attrs) {
        scope.$watch(attrs.source, function(val) {
          if (val) {
            var g = new Bluff.Line('bluff-graph', "302x200", false);
            g.theme_odeo();
            var colors = [
                '#ff1493',
            ];

            g.set_theme({
              colors: colors,
              marker_color: '#aea9a9',
              font_color: 'black',
              background_colors: 'white'
            });

            g.hide_legend = true;
            g.hide_title = true;
            g.hide_line_markers = false;
            g.data('Happiness', val);
            g.draw();
          }
        });
      }
    }
  }).
  /*
   * Collection of questions for Questionnaire
   */
  directive('questionnaire', function($compile) {
      return {
          restrict: 'E',
          scope: { data: '=data' },
          link: function(scope, elm, attrs) {
              elm.append($compile(
              '<div ng-repeat="question in data.questions">'+
                  '<span ng-switch on="question.type">'+
                  '<div ng-switch-when="measurable">'+
                    '<measurablequestion question="question"></measurablequestion>'+
                  '</div>'+
                  '<div ng-switch-when="single_choice">'+
                    '<singlechoicequestion question="question"></singlechoicequestion>'+
                  '</div>'+
                  '<div ng-switch-when="multiple_choice">'+
                    '<multiplechoicequeston question="question"></multiplechoicequeston>'+
                  '</div>'+
                  '<div ng-switch-when="text">'+
                    '<textquestion question="question"></textquestion'+
                  '</div>'+
                  '</span>'+
              '</div>'
              )(scope));
          }
      }
  });
