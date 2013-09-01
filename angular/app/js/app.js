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
