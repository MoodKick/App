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

