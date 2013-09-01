// PLUGIN: audio
/**
  * audio Popcorn Plugin.
  * Adds Video/Audio to the page using Popcorns players
  * Start is the time that you want this plug-in to execute
  * End is the time that you want this plug-in to stop executing
  *
  * @param {HTML} options
  *
  * Example:
    var p = Popcorn('#video')
      .audio( {
        source: "http://www.youtube.com/watch?v=bUB1L3zGVvc",
        target: "audiodiv",
        start: 1,
        end: 10
      })
  *
  */
(function ( Popcorn, global ) {
  Popcorn.plugin( "audio", {
    _setup: function( options ) {
      var target = document.getElementById( options.target ),
          container,
          capContainer,
          regexResult;

      // Check if mediaSource is passed and mediaType is NOT audio/video
      if ( !options.source ) {
        Popcorn.error( "Error. Source must be specified." );
      }

      // Check if target container exists
      if ( !target ) {
        Popcorn.error( "Target Audio container doesn't exist." );
      }

      options._container = document.createElement( "div" );
      container = options._container;
      container.id = "audiodiv-" + Popcorn.guid();

      target && target.appendChild( container );

      function constructMedia(){
        options.id = options._container.id;
        options.popcorn = Popcorn.smart( "#" + options.id, options.source );

        options.popcorn.controls( true );

        options._container.style.display = 'none';
      }

      // If Player script needed to be loaded, keep checking until it is and then fire readycallback
      function isPlayerReady() {
        if ( !window.Popcorn.player ) {
          setTimeout( function () {
            isPlayerReady();
          }, 300 );
        } else {
          constructMedia();
        }
      }

      isPlayerReady();
    },

    onResume: function(pop, options) {
      options.popcorn.play();
    },

    onPause: function(pop, options) {
      options.popcorn.pause();
    },

    start: function( event, options ) {
      options._container.style.display = 'block';
      options.popcorn.play();
    },
    end: function( event, options ) {
      options._container.style.display = 'none';
      options.popcorn.pause();
    },
    _teardown: function( options ) {
      if ( options.popcorn && options.popcorn.destory ) {
        options.popcorn.destroy();
      }
      document.getElementById( options.target ) && document.getElementById( options.target ).removeChild( options._container );
    }
  });
})( Popcorn, this );

