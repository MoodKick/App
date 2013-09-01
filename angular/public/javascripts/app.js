(function() {
  'use strict';
  'use strict';


window.AppCtrl = function(s, location) {
  s.$on('event:angular-auth-loginRequired', function() {
    if (location.url() !== 'login') {
      location.url('login');
    }
  });
}
AppCtrl.$inject = ['$scope', '$location'];

/*
 * Session management, log out features
 */
window.SessionCtrl = function(s, location, authentication) {
  s.logout = function() {
    authentication.logout();
    location.url('/login');
  }

  s.confirmLogOut = function() {
    s.confirmNeeded = true;
  }

  s.logOutDiscarded = function() {
    s.confirmNeeded = false;
  }

  s.logOutConfirmed = function() {
    s.confirmNeeded = false;
    authentication.logout();
    location.url('/login');
  }
}
SessionCtrl.$inject = ['$scope', '$location', 'Authentication'];

window.BrochureCtrl = {};
/*
 * Shows brochures screen
 */
BrochureCtrl.Show = function(s, repository, routeParams) {
  repository.get(routeParams.brochureType).then(function(brochure) {
    s.brochure = brochure;
  });
}
BrochureCtrl.Show.$inject = ['$scope', 'BrochureRepository', '$routeParams'];

window.HelpCtrl = {};
/*
 * Shows help screen
 */
HelpCtrl.Show = function(s, repository, routeParams) {
  repository.get('help').then(function(brochure) {
    s.brochure = brochure;
  });
}
HelpCtrl.Show.$inject = ['$scope', 'BrochureRepository', '$routeParams'];

window.DepressionTestCtrl = {};
/*
 * Shows depression test.
 * Adds answer to questionnaire
 */
DepressionTestCtrl.Show = function(s, location, source, questionnaireService, answerGroupRepository) {
  source.get().then(function(depressionTest) {
    s.depressionTest = depressionTest;
  });
  s.canSave = true;
  s.add = function(questionnaire) {
    s.canSave = false;
    s.notice = 'Thank you';
    answerGroupRepository.add(questionnaireService.answerFromQuestionnaire(questionnaire));
    window.scrollTo(0,0);
  }
}
DepressionTestCtrl.Show.$inject = ['$scope', '$location', 'DepressionTestSource', 'QuestionnaireService', 'AnswerGroupRepository'];

window.SafetyPlanCtrl = {};
/*
 * Shows Safety Plan screen
 */
SafetyPlanCtrl.Show = function(s, source) {
  source.get().then(function(safetyPlan) {
    s.safetyPlan = safetyPlan;
  });
}

SafetyPlanCtrl.Show.$inject = ['$scope', 'SafetyPlanSource'];

window.LoginCtrl = {};
/*
 * Shows Login screen
 * Logs in user
 */
LoginCtrl.Show = function(s, location, authentication) {
  s.credentials = {};
  s.login = function(credentials) {
    authentication.authenticate(credentials).then(function() {
      location.url('/dashboard');
    }, function() {
      alert('Wrong credentials');
    });
  }
}

LoginCtrl.Show.$inject = ['$scope', '$location', 'Authentication'];

window.UsersCtrl = {};
/*
 * Shows users list
 */
UsersCtrl.List = function(s, repository) {
  repository.all().then(function(users) {
    s.users = users;
  });
}

/*
 * Shows user by id
 * Adds user to network
 * Removes user from network
 */
UsersCtrl.Show = function(s, userRepository, contactsRepository, routeParams) {
  userRepository.find(routeParams.id).then(function(user) {
    s.user = user;
  });
  s.addToNetwork = function(user) {
    contactsRepository.add(user).then(function() {
      user.in_contacts = true;
    });
  }
  s.removeFromNetwork = function(user) {
    contactsRepository.remove(user).then(function() {
      user.in_contacts = false;
    });
  }
}

UsersCtrl.Show.$inject = ['$scope', 'UsersRepository', 'ContactsRepository', '$routeParams'];
UsersCtrl.List.$inject = ['$scope', 'UsersRepository'];

window.NetworkCtrl = {};
/*
 * Shows users in network screen
 */
NetworkCtrl.List = function(s, repository) {
  repository.all().then(function(contacts) {
    s.contacts = contacts;
  });
}

NetworkCtrl.List.$inject = ['$scope', 'ContactsRepository'];

window.ProfileCtrl = {};
/*
 * Shows user's profile
 */
ProfileCtrl.Show = function(s, source) {
  source.get().then(function(profile) {
    s.profile = profile;
  });
}

/*
 * Shows user's profile edit form
 */
ProfileCtrl.Edit = function(s, location, profileSource, avatarRepository) {
  s.state = 'form';

  profileSource.get().then(function(profile) {
    s.profile = profile;
  });
  avatarRepository.all().then(function(avatars) {
    s.avatars = avatars;
  });
  /*
   * Shows avatars screen
   */
  s.chooseAvatar = function() {
    s.state = 'avatar';
  }
  /*
   * Shows profile form
   */
  s.showForm = function() {
    s.state = 'form';
  }
  /*
   * Changes avatar and switches back to profile form
   */
  s.avatarChoosen = function(avatar) {
    s.profile.avatar_url = avatar.url;
    s.state = 'form';
  }
  /*
   * Updates profile
   */
  s.update = function(profile) {
    profileSource.update(profile).then(function() {
      location.url('profile');
    }, function() {
      alert('Wrong data');
    });
  }
}

ProfileCtrl.Show.$inject = ['$scope', 'ProfileSource'];
ProfileCtrl.Edit.$inject = ['$scope', '$location', 'ProfileSource', 'AvatarRepository'];

window.MeditationalResourcesCtrl = {};
/*
 * Shows list of meditational audio resources
 */
MeditationalResourcesCtrl.ListAudio = function(s, repository) {
  s.audioResources = repository.all();
}

/*
 * Shows list of meditational video resources
 */
MeditationalResourcesCtrl.ListVideo = function(s, repository) {
  s.videoResources = repository.all();
}

MeditationalResourcesCtrl.ListAudio.$inject = ['$scope', 'AudioResourceRepository'];
MeditationalResourcesCtrl.ListVideo.$inject = ['$scope', 'VideoResourceRepository'];

window.MoodTrendCtrl = {};
/*
 * Shows MoodTrend
 */
MoodTrendCtrl.Show = function(s, repository) {
  repository.get().then(function(report) {
    s.report = report;
  });
}

MoodTrendCtrl.Show.$inject = ['$scope', 'MoodTrendRepository'];

window.ContentObjectsCtrl = {};
/*
 * Shows list of Content Objects
 */
ContentObjectsCtrl.List = function(s, repository) {
  repository.all().then(function(contentObjects) {
    s.contentObjects = contentObjects;
  });
}

/*
 * Shows Content object by id
 * Depending on type of content object: timeline or sequential,
 * starts one of dedicated players
 */
ContentObjectsCtrl.Show = function(s, repository, routeParams, config, contentObjectFetcher) {
  repository.find(routeParams.id).then(function(contentObject) {
    s.contentObject = contentObject;
    if (s.contentObject.type == 'timeline') {
      s.start = function(contentObject) {
        Popcorn.player('baseplayer');
        var pop = Popcorn.baseplayer('#player');
        var contentObjectHost = 'http://' + config.serverHost() + ':' + config.serverPort();
        var contentObjectPath = config.contentObjectsUrl() + contentObject.name + '/';
        var url = contentObjectPath + '/manifest.json';
        pop.parseContentObject(url, { 'content_object_path': contentObjectPath });
        pop.play();
      }
    } else if (s.contentObject.type == 'sequential') {
      s.isLast = function() {
        if (!s.slides) {
          return true;
        } else {
          return s.activeSlide + 1 >= s.slides.length;
        }
      }
      s.isFirst = function() {
        if (!s.slides) {
          //to prevent flick of arrow in view on load
          return true;
        } else {
          return s.activeSlide == 0;
        }
      }
      s.next = function() {
        if (s.isLast())
          return;
        s.activeSlide++;
      }
      s.previous = function() {
        if (s.isFirst())
          return;
        s.activeSlide--;
      }

      contentObjectFetcher.fetchSlides(config.contentObjectsUrl() + s.contentObject.name).then(function(slides) {
        s.slides = slides;
        s.activeSlide = 0;
      });
    }
  });
}

ContentObjectsCtrl.List.$inject = ['$scope', 'ContentObjectRepository'];
ContentObjectsCtrl.Show.$inject = ['$scope', 'ContentObjectRepository', '$routeParams', 'Config', 'ContentObjectFetcher'];

window.DailyJournalEntriesCtrl = {};

/*
 * Shows list of daily journal entries
 */
DailyJournalEntriesCtrl.List = function(s, repository) {
  repository.all().then(function(entries) {
    s.entries = entries;
  });
  s.orderProp = '-created_at';
}

/*
 * Validate Daily Journal Entry
 */
function validateEntry(entry, subscriber) {
  if (entry.keywords().length > 0) {
    subscriber.valid();
  } else {
    subscriber.invalid({ keywordError: 'Select at least one keyword' });
  }
}

/*
 * Shows form for new daily journal entry
 * Adds new entry
 */
DailyJournalEntriesCtrl.New = function(s, repository, location) {

  s.entry = repository.buildNew();

  s.add = function(entry) {
    validateEntry(entry, {
      valid: function() {
        repository.add(entry).then(function() {
          location.url('daily_journal_entries');
        });
      },
      invalid: function(errors) {
        s.errors = errors;
      }
    });
  };
}

/*
 * Shows Daily journal entry by id
 * Updates entry
 */
DailyJournalEntriesCtrl.Show = function(s, repository, routeParams, location) {
  repository.find(routeParams.id).then(function(entry) {
    s.entry = entry;
  });

  s.update = function(entry) {
    validateEntry(entry, {
      valid: function() {
        repository.update(entry).then(function() {
          location.url('daily_journal_entries');
        });
      },
      invalid: function(errors) {
        s.errors = errors;
      }
    });
  };
}

DailyJournalEntriesCtrl.New.$inject = ['$scope', 'DailyJournalEntryRepository', '$location'];
DailyJournalEntriesCtrl.List.$inject = ['$scope', 'DailyJournalEntryRepository'];
DailyJournalEntriesCtrl.Show.$inject = ['$scope', 'DailyJournalEntryRepository', '$routeParams', '$location'];

window.ChestOfHopeCtrl = {}
/*
 * Shows Chest Of Hope
 * Saves changes
 */
ChestOfHopeCtrl.Show = function(s, repository) {
  s.hopeItems = repository.all();
  s.save = function() {
    repository.updateAll(gridster.serialize());
  }
}
ChestOfHopeCtrl.Show.$inject = ['$scope', 'HopeItemRepository'];

window.ConfigCtrl = {}
/*
 * Shows Configuration options
 * Updates configuration options
 */
ConfigCtrl.Show = function(s, location, config) {
  s.configs = {
    api_endpoint: config.apiEndpoint()
  }
  s.update = function(configs) {
    config.setApiEndpoint(configs.api_endpoint);
    location.url('/login');
  }
}

ConfigCtrl.Show.$inject = ['$scope', '$location', 'Config'];


}).call(this);

(function() {
  'use strict';
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

}).call(this);

(function() {
  'use strict';
  'use strict';

/* Filters */

angular.module('myApp.filters', []).
  filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }]).
  filter('userRoles', function() {
    return function(userRoles) {
      return userRoles.join(', ');
    }
  });

}).call(this);

(function() {
  'use strict';
  // Apache Cordova related
var pushObject = {};

document.addEventListener("backbutton", function() {
  // catch the android back-button event and to nothing
  return true;
}, false);

document.addEventListener("deviceready",
  function() {
    // see if Push Notifications is availible
    if (window.pushNotification) {
      (function(push) {
        // register for registration events
        push.registerEvent(
          'registration',
          function(err, pushid) {
            if (!err) {
              // save the push id 
              pushObject.pushId = pushid;
              // log push id to console
              console.log('Successfully registered push service with  push id: ' + pushid);
            } else {
              alert("Push notification: Registration failed");
            }
          });
        // register for push messages
        push.registerEvent('push', function(data) {
          alert('Push message: ' + data.message);
        });
        // register for notification types (only used on ios)
        push.registerForNotificationTypes(push.notificationType.badge | push.notificationType.alert);
        // enable push
        console.log('Enable push from Apache Cordova');
        push.enablePush();
        // see of push is enabled
        push.isPushEnabled(function(enabled) {
          if (enabled) {
            console.log("Push is enabled! Fire away!");
            // get push id
            push.getPushID(function(id) {
              if (id) {
                console.log("Got push ID: " + id);
              } else {
                console.log("Did not get push id");
              }
            });
          } else {
            console.log("Push is NOT enabled!");
          }
        });
        // notify we are done configuring
        console.log('Push notification has now been setup');
      })(window.pushNotification);
    } else {
      console.error('Push notifications is not availible');
    }  
  },
  true);

}).call(this);

(function() {
  'use strict';
  'use strict';

angular.module('myApp.services', []).

  factory('QuestionnaireService', function() {
    return new QuestionnaireService();
  }).
  factory('DailyJournalEntryMapper', function() {
    return new DailyJournalEntryMapper();
  }).
  factory('DailyJournalEntryRepository', [
    '$http', 'DailyJournalEntryMapper', 'Authentication', 'Config',
    function(http, mapper, paramsProvider, urlSource) {
      return new DailyJournalEntryRepository(http, mapper, paramsProvider, urlSource)
    }
  ]).
  factory('ContentObjectFetcher', [
    '$http', 'Authentication', 'Config', '$q',
    function(http, paramsProvider, urlSource, q) {
      return new ContentObjectFetcher(http, paramsProvider, urlSource, q);
    }
  ]).
  factory('ContentObjectRepository', [
    '$http', 'Authentication', 'Config',
    function(http, paramsProvider, urlSource) {
      return new ContentObjectRepository(http, paramsProvider, urlSource)
    }
  ]).
  factory('AnswerGroupRepository', [
    '$http', 'Authentication', 'Config',
    function(http, paramsProvider, urlSource) {
      return new AnswerGroupRepository(http, paramsProvider, urlSource);
    }
  ]).
  factory('DepressionTestSource', [
    '$http', 'Authentication', 'Config', function(http, paramsProvider, urlSource) {
      return new DepressionTestSource(http, paramsProvider, urlSource);
    }
  ]).
  factory('MoodTrendRepository', [
    '$http', 'Authentication', 'Config', function(http, paramsProvider, urlSource) {
      return new MoodTrendRepository(http, paramsProvider, urlSource)
    }
  ]).
  factory('ProfileMapper', [
    function() { return new ProfileMapper() }
  ]).
  factory('ProfileSource', [
    '$http', 'ProfileMapper', 'Authentication', 'Config', function(http, mapper, paramsProvider, urlSource) {
      return new ProfileSource(http, mapper, paramsProvider, urlSource)
    }
  ]).
  factory('SafetyPlanSource', [
    '$http', 'Authentication', 'Config', function(http, paramsProvider, urlSource) {
      return new SafetyPlanSource(http, paramsProvider, urlSource)
    }
  ]).
  factory('AvatarRepository', [
    '$http', 'Authentication', 'Config', function(http, paramsProvider, urlSource) {
      return new AvatarRepository(http, paramsProvider, urlSource)
    }
  ]).
  factory('AudioResourceRepository', [
    function() { return new AudioResourceRepository() }
  ]).
  factory('VideoResourceRepository', [
    function() { return new VideoResourceRepository() }
  ]).
  factory('HopeItemRepository', [
    function() { return new HopeItemRepository() }
  ]).
  factory('ContactsRepository', [
    '$http', 'Authentication', 'Config', function(http, paramsProvider, urlSource) {
      return new ContactsRepository(http, paramsProvider, urlSource)
    }
  ]).
  factory('UsersRepository', [
    '$http', 'Authentication', 'Config', function(http, paramsProvider, urlSource) {
      return new UsersRepository(http, paramsProvider, urlSource)
    }
  ]).
  factory('BrochureRepository', [
    '$http', 'Authentication', 'Config', function(http, paramsProvider, urlSource) {
      return new BrochureRepository(http, paramsProvider, urlSource)
    }
  ]).
  factory('Authentication', [
    '$rootScope', '$location', '$http', 'Config', '$route', function(rootScope, location, http, urlSource) {
      return new Authentication(rootScope, location, http, urlSource)
    }
  ]).
  factory('Config', [
    function() { return new Config() }
  ]).
  config(function($httpProvider) {
    var interceptor = function($rootScope, $q) {
      function success(response) {
        return response;
      }

      function error(response) {
        var status = response.status;

        if (status == 401) {
          $rootScope.$broadcast('event:angular-auth-loginRequired');
        }
        // otherwise
        return $q.reject(response);
      }

      return function(promise) {
        return promise.then(success, error);
      }

    };
    $httpProvider.responseInterceptors.push(interceptor);
  }).
  value('version', '0.1');

/**
 * Repository for Hope Items. Has default items. May persist items to local storage.
 */
function HopeItemRepository() {
  this.defaultItems = [{
      col: 1,
      row: 1,
      id: 1,
      content: '<b>Hey</b>'
    },
    {
      col: 2,
      row: 1,
      id: 2,
      content: 'b'
    },
    {
      col: 3,
      row: 1,
      id: 3,
      content: 'c'
    },
    {
      col: 1,
      row: 3,
      id: 4,
      content: 'd'
    }];

  this.loaded = false;
  var KEY_NAME = 'hopeItems';
  var self = this;

  var persistItems = function() {
    localStorage.setItem(KEY_NAME, JSON.stringify(self.items));
  }

  var getItems = function() {
    if (!self.loaded) {
      var loadedItems = JSON.parse(localStorage.getItem(KEY_NAME) || '[]');
      if (loadedItems.length > 0) {
        self.items = loadedItems;
      } else {
        self.items = self.defaultItems;
        persistItems();
      }
      self.loaded = true;
    }
    return self.items;
  }

  /*
   * @return {Array.<Object>} List of items. Either from local storage, if there are any, or default otherwise
   */
  this.all = function() {
    return getItems();
  }

  /*
   * Updates all items, preserving content for those with the same id, while changing position.
   * param {list} items
   */
  this.updateAll = function(items) {
    var self = this;
    _.each(items, function(newItem) {
      var oldItem = _.find(self.items, function(item) { return item.id == newItem.id });
      oldItem.col = newItem.col;
      oldItem.row = newItem.row;
    });
    persistItems();
  }
}

/*
 * Repository for video resources. Has only predefined items.
 */
function VideoResourceRepository() {
  /*
   * @return {Array.<Object>} Predefined list of video resources
   */
  this.all = function() {
    return [{
      title: 'Foregiveness',
      author: 'Jack Kornfield',
      length: '10m 10s',
      description: 'All about foregiveness; how to receive it and how pass it on',
      url: 'PbHKCy4f6Dk'
    }, {
      title: 'Mindfulness',
      author: 'Jack Kornfield',
      length: '10m 14s',
      description: 'Learn how to enter mindfulness to help you remain grounded',
      url: 'ArVTV4CQduM'
    }]
  }
}

/*
 * Repository for audio resources. Has only predefined items.
 */
function AudioResourceRepository() {
  /*
   * @return {Array.<Object>} Predefined list of audio resources
   */
  this.all = function() {
    return [{
      id: 1,
      title: 'I Have A Dream',
      author: 'Martin Luther King Jr.',
      duration: '45m 00s',
      description: 'The famous speech by Martin Luther King Jr. who inspired an entire generation',
      url: 'http://www.archive.org/download/MLKDream/MLKDream_64kb.mp3'
    }, {
      id: 2,
      title: 'What Motivates Us?',
      author: 'Anthony Robbins',
      duration: '25m 37s',
      description: 'Tony Robbins explains how to unlock your true potential, and asks the audience (including former Vice President Al Gore) for a bit of high-level interaction',
      url: 'http://video.ted.com/talk/podcast/2006/None/TonyRobbins_2006.mp3'
    }]
  }
}

/*
 * Maps profile to JSON as needed by server.
 * Needed to add password_confirmation if password was changed.
 */
function ProfileMapper() {
  this.toRaw = function(profile) {
    var raw = {
      email: profile.email,
      full_name: profile.full_name,
      avatar_url: profile.avatar_url,
      role: profile.role,
      location: profile.location,
      description: profile.description
    }
    if (profile.password) {
      raw.password = profile.password;
      raw.password_confirmation = profile.password_confirmation;
    }
    return raw;
  }
}

/*
 * Source for depression test
 */
function DepressionTestSource(http, paramsProvider, urlSource) {
  var resourcesUrl = function() {
    return urlSource.apiEndpoint() + 'questionnaires.json?' + paramsProvider.params();
  }

  /*
   * @return {Object} Single DepressionTest
   */
  this.get = function() {
    return http.get(resourcesUrl()).then(function(response) {
      return response.data[0];
    });
  }
}

/*
 * Repository for brochures. Read-only, API source.
 */
function BrochureRepository(http, paramsProvider, urlSource){
  var resourceUrl = function(type) {
    return urlSource.apiEndpoint() + 'brochures/' + type + '.json?' + paramsProvider.params();
  }

  /*
   * @return {Array.<Object>} List of brochures by type.
   */
  this.get = function(type) {
    return http.get(resourceUrl(type)).then(function(response) {
      return response.data;
    });
  }
}

/*
 * SafetyPlan source. Read-only, API source.
 */
function SafetyPlanSource(http, paramsProvider, urlSource) {
  var resourceUrl = function() {
    return urlSource.apiEndpoint() + 'safety_plan.json?' + paramsProvider.params();
  }

  /*
   * @return {Object} single SafetyPlan
   */
  this.get = function() {
    return http.get(resourceUrl()).then(function(response) {
      return response.data;
    });
  }
}

/*
 * Profile source. Fetches and updates single Profile.
 */
function ProfileSource(http, mapper, paramsProvider, urlSource) {
  var resourceUrl = function() {
    return urlSource.apiEndpoint() + 'profile.json?' + paramsProvider.params();
  }

  /*
   * @return {Object} single Profile
   */
  this.get = function() {
    return http.get(resourceUrl()).then(function(response) {
      return response.data;
    });
  }

  /*
   * Updates single Profile.
   */
  this.update = function(profile) {
    return http.put(resourceUrl(), mapper.toRaw(profile));
  }
}

/*
 * Repository for MoodTrend data points. Read-only, API source.
 */
function MoodTrendRepository(http, paramsProvider, urlSource) {
  var resourceUrl = function() {
    return urlSource.apiEndpoint() + 'mood_trend.json?' + paramsProvider.params();
  }

  /*
   * @return {Array.<Object>} list of MoodTrend data-points.
   */
  this.get = function() {
    return http.get(resourceUrl()).then(function(response) {
      return response.data;
    });
  }
}

/*
 * Repository for Answer Groups. Update-only, API source.
 */
function AnswerGroupRepository(http, paramsProvider, urlSource) {
  var resourcesUrl = function() {
    return urlSource.apiEndpoint() + 'answer_groups.json?' + paramsProvider.params();
  }

  /*
   * Adds single Answer Group
   */
  this.add = function(entry) {
    http.post(resourcesUrl(), entry);
  }
}

/*
 * Repository for Avatars. Read-only, API source.
 */
function AvatarRepository(http, paramsProvider, urlSource) {
  var resourcesUrl = function() {
    return urlSource.apiEndpoint() + 'avatars.json?' + paramsProvider.params();
  }
  /*
   * @return {Array.<Object>} list of all Avatars.
   */
  this.all = function() {
    return http.get(resourcesUrl()).then(function(response) {
      return response.data;
    });
  }
}

/*
 * DailyJournalEntry view-model
 */
function DailyJournalEntry() {
  this.happiness_level = 2;

  /*
   * @return {Array.<string>} list of keywords composed from presence of "angry",
   * "anxious", "calm" and "manic" keywords
   */
  this.keywords = function() {
    var keywords = [];
    if (this.angry) { keywords.push('angry') }
    if (this.anxious) { keywords.push('anxious') }
    if (this.calm) { keywords.push('calm') }
    if (this.manic) { keywords.push('manic') }

    return keywords;
  }

  /*
   * @return {string} mood, based on happiness_level
   */
  this.mood = function() {
    var mood;
    if (this.happiness_level == 0) mood = 'very-sad';
    if (this.happiness_level == 1) mood = 'sad';
    if (this.happiness_level == 2) mood = 'content';
    if (this.happiness_level == 3) mood = 'happy';
    if (this.happiness_level == 4) mood = 'very-happy';

    return mood;
  }

  /*
   * @return {boolean} true if it can be edited - 24 hours hasn't passed since creation
   */
  this.canBeEdited = function() {
    return new Date() - new Date(this.created_at) < 1000*60*60*24;
  }
}

/*
 * Mapper for DailyJournalEntry
 */
function DailyJournalEntryMapper() {
  /*
   * Maps raw JSON to DailyJournalEntry
   * @return {Object}
   */
  this.fromRaw = function(raw) {
    var entry = new DailyJournalEntry();
    entry.id = raw.id;
    entry.created_at = raw.created_at;
    entry.angry = raw.angry;
    entry.anxious = raw.anxious;
    entry.manic = raw.manic;
    entry.calm = raw.calm;
    entry.happiness_level = raw.happiness_level;
    entry.name = raw.name;
    entry.description = raw.description;
    return entry;
  }
}

function QuestionnaireService() {
  /*
   * @return {{questionnaire_id: string, answer: Array.<Object>}} Object describing answers
   * for questionnaire
   * for every question in questionnaire, depending on type
   * of question, it builds an Answer
   */
  this.answerFromQuestionnaire = function(questionnaire) {
    var answers = {};
    _.each(questionnaire.questions, function(question) {
      var item = {};
      if (question.type == 'measurable') {
        item = { value: question.answer }
      }
      if (question.type == 'text') {
        item = { text: question.answer }
      }
      if (question.type == 'single_choice') {
        if (question.answer) {
          item = { choice_id: question.answer }
        } else {
          item = { choice_id: question.choices[0].id }
        }
      }
      if (question.type == 'multiple_choice') {
        var choiceIds = [];
        _.each(question.choices, function(choice) {
          if (choice.selected == true) {
            choiceIds.push(choice.id);
          }
        });
        item = { choice_ids: choiceIds };
      }
      answers[question.position] = item;
    });
    return {
      questionnaire_id: questionnaire.id,
      answer: answers
    }
  }
}

function ContentObjectFetcher(http, paramsProvider, urlSource, q) {
  /*
   * Fetches sequential slides.
   * 1) fetches manifest file and takes slides definition from it
   * 2) for each slide fetches it's page remotely, example:
   *  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
   *    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
   *  <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
   *    <head>
   *      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
   *      <title>XHTML 1.0 Strict Example</title>
   *      <script>
   *        console.log('first');
   *      </script>
   *    </head>
   *    <body id="slide1">
   *      <h1>First</h1><img src='images/f1.png' alt='avatar1'></img>
   *    </body>
   *  </html>
   *
   * @return {Array.<Response>} where Response is an object having
   *  id: id attribute of body
   *  content: content of body, with each image element transformed to have absolut urls
   *  script: content of script
   */
  this.fetchSlides = function(contentObjectUrl) {
    return http.get(contentObjectUrl + '/manifest.json').then(function(manifestResponse) {
      var manifest = manifestResponse.data;
      var slidesDefinition = manifest.data.slides;
      var slides = [];
      var makeImageSrcAbsolute = function(xml, prefix) {
        $(xml).find('img').attr('src', function(i, val) { return prefix + val; });
        return xml;
      }
      var getBodyContent = function(xml) {
        xml = makeImageSrcAbsolute(xml, contentObjectUrl + '/');
        return xml.body.innerHTML;
      }
      var getScriptContent = function(xml) {
        var script = xml.head.getElementsByTagName('script');
        if (script && script[0]) {
          return script[0].text;
        } else {
          return null;
        }
      }
      var getSlideId = function(xml) {
        var id = xml.body.id;
        return id;
      }
      var loadSlides = function(slidesToLoad) {
        var promises = [];
        _.each(slidesToLoad, function(slideToLoad) {
          var slideUrl = contentObjectUrl + '/' + slideToLoad.url;
          var promise = http.get(slideUrl).then(function(response) {
            var xml = (new DOMParser).parseFromString(response.data, 'text/xml');
            return {
              id: getSlideId(xml),
              content: getBodyContent(xml),
              script: getScriptContent(xml)
            };
          });
          promises.push(promise);
        });
        return promises;
      }
      return q.all(loadSlides(slidesDefinition));
    });
  }
}

/*
 * Repository for ContentObjects. Read-only, API source.
 */
function ContentObjectRepository(http, paramsProvider, urlSource) {
  var resourceUrl = function(id) {
    return urlSource.apiEndpoint() + 'content_objects/' + id + '.json?' + paramsProvider.params();
  }

  var resourcesUrl = function() {
    return urlSource.apiEndpoint() + 'content_objects.json?' + paramsProvider.params();
  }

  /*
   * @return {Array.<Object>} list of all ContentObjects
   */
  this.all = function() {
    return http.get(resourcesUrl()).then(function(response) {
      return response.data;
    })
  }

  /*
   * @return {Object} single content object by id
   */
  this.find = function(id) {
    return http.get(resourcesUrl()).then(function(response) {
      return _.find(response.data, function(contentObject) {
        return contentObject.id == id;
      })
    })
  }
}

/*
 * Repository of DailyJournalEntries. Read/update, API source.
 */
function DailyJournalEntryRepository(http, mapper, paramsProvider, urlSource) {
  var resourceUrl = function(id) {
    return urlSource.apiEndpoint() + 'daily_journals/' + id + '.json?' + paramsProvider.params();
  }

  var resourcesUrl = function() {
    return urlSource.apiEndpoint() + 'daily_journals.json?' + paramsProvider.params();
  }

  /*
   * @return {Array.<Object>} List of all Daily Journal Entries
   */
  this.all = function() {
    return http.get(resourcesUrl()).then(function(response) {
      return _.map(response.data, mapper.fromRaw);
    });
  }

  /*
   * @return {Object} Single Daily Journal Entry by id
   */
  this.find = function(id) {
    return http.get(resourceUrl(id)).then(function(response) {
      return mapper.fromRaw(response.data);
    })
  }

  /*
   * replaces Daily Journal Entry by id
   */
  this.update = function(entry) {
    return http.put(resourceUrl(entry.id), entry);
  }

  /*
   * adds Daily Journal Entry
   */
  this.add = function(entry) {
    return http.post(resourcesUrl(), entry);
  }

  /*
   * @return {Object} new Daily Journal Entry
   */
  this.buildNew = function() {
    return new DailyJournalEntry();
  }
}

/*
 * Repository for Contacts. Read/remove, API source
 */
function ContactsRepository(http, paramsProvider, urlSource) {
  var resourcesUrl = function() {
    return urlSource.apiEndpoint() + 'contacts.json?' + paramsProvider.params();
  }

  var resourceByUserUrl = function(userId) {
    return urlSource.apiEndpoint() + 'contacts/by_user/' + userId + '.json?' + paramsProvider.params();
  }

  /*
   * @return {Array.<Object>} list of all Contacts
   */
  this.all = function() {
    return http.get(resourcesUrl()).then(function(response) {
      return response.data;
    });
  }

  /*
   * Adds contact for given user
   */
  this.add = function(user) {
    return http.post(resourcesUrl(), { contact: { user_id: user.id } });
  }

  /*
   * Removes contact of given user
   */
  this.remove = function(user) {
    return http({method: 'DELETE', url: resourceByUserUrl(user.id)});
  }
}

/*
 * Repository for users. Ready-only, API source
 */
function UsersRepository(http, paramsProvider, urlSource) {
  var resourceUrl = function(id) {
    return urlSource.apiEndpoint() + 'users/' + id + '.json?' + paramsProvider.params();
  }

  var resourcesUrl = function() {
    return urlSource.apiEndpoint() + 'users.json?' + paramsProvider.params();
  }

  /*
   * @return {Array.<Object>} list of all Users.
   */
  this.all = function() {
    return http.get(resourcesUrl()).then(function(response) {
      return response.data;
    });
  }

  /*
   * @return {Object} single User by id
   */
  this.find = function(id) {
    return http.get(resourceUrl(id)).then(function(response) {
      return response.data;
    });
  }
}

/*
 * Provides configuration settings
 */
function Config() {
  /*
   * @return {String} Endpoint of API, taken either from localStorage or default value
   * built using serverHost and serverPort
   */
  this.apiEndpoint = function() {
    var value = localStorage.getItem('config_apiEndpoint');
    if (value !== null) {
      return value;
    } else {
      return 'http://' + this.serverHost() + ':' + this.serverPort() + '/api/v1/';
    }
  }

  /*
   * @return {String} URL of ContentObjects, built from serverHost and serverPort
   */
  this.contentObjectsUrl = function() {
    return 'http://' + this.serverHost() + ':' + this.serverPort() + '/content_objects/';
  }

  /*
   * changes setting for Endpoint of API. Stores in localStorage
   */
  this.setApiEndpoint = function(value) {
    localStorage.setItem('config_apiEndpoint', value);
  }

  /*
   * @return {String} Host of server. Either from localStorage or default value
   */
  this.serverHost = function() {
    var value = localStorage.getItem('config_serverHost');
    if (value !== null) {
      return value;
    } else {
      return 'dev.moodkick.com';
    }
  }

  /*
   * @return {String} Port of server. Either from localStorage or default value
   */
  this.serverPort = function() {
    var value = localStorage.getItem('config_serverPort');
    if (value !== null) {
      return value;
    } else {
      return '80';
    }
  }
}

/*
 * Authentication service
 */
function Authentication(rootScope, location, http, urlSource) {
  var self = this;

  /*
   * is user authenticated?
   */
  this.isAuthenticated = function() {
    return localStorage.getItem('auth_token') !== null;
  }

  /*
   * @return {String} authentication token as used by GET params for server
   */
  this.params = function() {
    return 'auth_token=' + localStorage.getItem('auth_token');
  }

  /*
   * sends username and password taken from credentials to server.
   * If successful - sets auth_token in localStorage
   */
  this.authenticate = function(credentials) {
    return http.post(urlSource.apiEndpoint() + 'tokens.json', {
      user: {
        username: credentials.username,
        password: credentials.password
      }
    }).then(function(response) {
      localStorage.setItem('auth_token', response.data.auth_token);
    });
  }

  /*
   * Logs out User by removing auth_token from localStorage
   */
  this.logout = function() {
    localStorage.removeItem('auth_token');
  }

  /*
   * on attempt to change route, if authentication for given route
   * is required - redirect to /login page if user is not authenticated
   */
  rootScope.$on('$routeChangeStart', function(e, next, last) {
    var authRequired = next.$route && next.$route.auth;
    if (authRequired && !self.isAuthenticated()) {
      location.url('/login');
    }
  });
}


}).call(this);

(function() {
  'use strict';
  'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'ngSanitize']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.
    when('/login', {
      templateUrl: 'partials/login.html',
      controller: LoginCtrl.Show,
      auth: false
    }).
    when('/config', {
      templateUrl: 'partials/config.html',
      controller: ConfigCtrl.Show,
      auth: false
    }).
    when('/dashboard', {
      templateUrl: 'partials/dashboard.html',
      controller: SessionCtrl,
      auth: true
    }).
    when('/content_objects', {
      templateUrl: 'partials/content_objects/list.html',
      controller: ContentObjectsCtrl.List,
      auth: true
    }).
    when('/content_objects/:id', {
      templateUrl: 'partials/content_objects/show.html',
      controller: ContentObjectsCtrl.Show,
      auth: true
    }).
    when('/depression_test', {
      templateUrl: 'partials/depression_test.html',
      controller: DepressionTestCtrl.Show,
      auth: true
    }).
    when('/help', {
      templateUrl: 'partials/help.html',
      auth: true
    }).
    when('/daily_journal_entries', {
      templateUrl: 'partials/daily_journal_entries/list.html',
      controller: DailyJournalEntriesCtrl.List,
      auth: true
    }).
    when('/daily_journal_entries/new', {
      templateUrl: 'partials/daily_journal_entries/new.html',
      controller: DailyJournalEntriesCtrl.New,
      auth: true
    }).
    when('/daily_journal_entries/:id', {
      templateUrl: 'partials/daily_journal_entries/show.html',
      controller: DailyJournalEntriesCtrl.Show,
      auth: true
    }).
    when('/mood_trends', {
      templateUrl: 'partials/mood_trends.html',
      controller: MoodTrendCtrl.Show,
      auth: true
    }).
    when('/cheers', {
      templateUrl: 'partials/cheers.html',
      auth: true
    }).
    when('/meditational_resources/audio', {
      templateUrl: 'partials/meditational_resources/list_audio.html',
      controller: MeditationalResourcesCtrl.ListAudio,
      auth: true
    }).
    when('/meditational_resources/video', {
      templateUrl: 'partials/meditational_resources/list_video.html',
      controller: MeditationalResourcesCtrl.ListVideo,
      auth: true
    }).
    when('/profile', {
      templateUrl: 'partials/profile/show.html',
      controller: ProfileCtrl.Show,
      auth: true
    }).
    when('/profile/edit', {
      templateUrl: 'partials/profile/edit.html',
      controller: ProfileCtrl.Edit,
      auth: true
    }).
    when('/contacts', {
      templateUrl: 'partials/contacts/list.html',
      controller: NetworkCtrl.List,
      auth: true
    }).
    when('/contacts/:id', {
      templateUrl: 'partials/contacts/show.html',
      controller: UsersCtrl.Show,
      auth: true
    }).
    when('/users', {
      templateUrl: 'partials/users/list.html',
      controller: UsersCtrl.List,
      auth: true
    }).
    when('/users/:id', {
      templateUrl: 'partials/users/show.html',
      controller: UsersCtrl.Show,
      auth: true
    }).
    when('/contact_profile', {
      templateUrl: 'partials/contact_profile.html',
      auth: true
    }).
    when('/safety_plan', {
      templateUrl: 'partials/safety_plan.html',
      controller: SafetyPlanCtrl.Show,
      auth: true
    }).
    when('/learn', {
      templateUrl: 'partials/learn.html',
      auth: true
    }).
    when('/learn/:brochureType', {
      templateUrl: 'partials/brochure.html',
      controller: BrochureCtrl.Show,
      auth: true
    }).
    when('/help', {
      templateUrl: 'partials/help.html',
      controller: HelpCtrl.Show,
      auth: true
    }).
    when('/chest_of_hope', {
      templateUrl: 'partials/chest_of_hope.html',
      controller: ChestOfHopeCtrl.Show,
      auth: true
    }).
    otherwise({redirectTo: '/dashboard'});
  }]);

}).call(this);

