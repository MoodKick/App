exports.config =
  # See docs at http://brunch.readthedocs.org/en/latest/config.html.
  modules:
    definition: false
    wrapper: (path, data) ->
      """
(function() {
  'use strict';
  #{data}
}).call(this);\n\n
      """
  files:
    javascripts:
      defaultExtension: 'js'
      joinTo:
        'javascripts/app.js': /^app/
        'javascripts/vendor.js': /^vendor/
      order:
        before: [
          'vendor/scripts/console-helper.js',
          'vendor/scripts/jquery-1.7.2.js',
          'vendor/scripts/bluff/js-class.js',
          'vendor/scripts/angular/angular.js',
          'vendor/scripts/angular/angular-resource.js',
          'vendor/scripts/angular/angular-cookies.js'
        ],
        after: [
          'vendor/scripts/content-object-player.js'
          'vendor/scripts/audio.js'
        ]

    stylesheets:
      defaultExtension: 'styl'
      joinTo: 'stylesheets/app.css'
      order:
        before: ['vendor/styles/normalize.css']
        after: ['vendor/styles/helpers.css']

    templates:
      defaultExtension: 'hbs'
      joinTo: 'javascripts/app.js'
