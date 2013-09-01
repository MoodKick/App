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

