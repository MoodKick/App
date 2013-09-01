(function( Popcorn ) {

  var

  AP = Array.prototype,
  OP = Object.prototype,

  forEach = AP.forEach,
  slice = AP.slice,
  hasOwn = OP.hasOwnProperty,
  toString = OP.toString;

  // stores parsers keyed on filetype
  Popcorn.parsers = {};

  // An interface for extending Popcorn
  // with parser functionality
  Popcorn.contentObjectParser = function( name, type, definition ) {

    if ( Popcorn.protect.natives.indexOf( name.toLowerCase() ) >= 0 ) {
      Popcorn.error( "'" + name + "' is a protected function name" );
      return;
    }

    // fixes parameters for overloaded function call
    if ( typeof type === "function" && !definition ) {
      definition = type;
      type = "";
    }

    if ( typeof definition !== "function" || typeof type !== "string" ) {
      return;
    }

    // Provides some sugar, but ultimately extends
    // the definition into Popcorn.p

    var natives = Popcorn.events.all,
        parseFn,
        parser = {};

    parseFn = function( filename, args, callback ) {
      if ( !filename ) {
        return this;
      }

      var that = this;

      Popcorn.xhr({
        url: filename,
        dataType: type,
        success: function( data ) {

          var tracksObject = definition( data, args ),
              tracksData,
              tracksDataLen,
              tracksDef,
              idx = 0;

          tracksData = tracksObject.data || [];
          tracksDataLen = tracksData.length;
          tracksDef = null;

          //  If no tracks to process, return immediately
          if ( !tracksDataLen ) {
            return;
          }

          //  Create tracks out of parsed object
          for ( ; idx < tracksDataLen; idx++ ) {

            tracksDef = tracksData[ idx ];

            for ( var key in tracksDef ) {

              if ( hasOwn.call( tracksDef, key ) && !!that[ key ] ) {

                that[ key ]( tracksDef[ key ] );
              }
            }
          }
          if ( callback ) {
            callback(args);
          }
        }
      });

      return this;
    };

    // Assign new named definition
    parser[ name ] = parseFn;

    // Extend Popcorn.p with new named definition
    Popcorn.extend( Popcorn.p, parser );

    // keys the function name by filetype extension
    //Popcorn.parsers[ name ] = true;

    return parser;
  };
})( Popcorn );

(function (Popcorn) {
  Popcorn.plugin("externalHtml" , {
    _setup: function(options) {
      var self = this;
      var container = document.createElement('div');
      var target = Popcorn.dom.find(options.target);
      var transformedXML = function(xml) {
        $(xml).find('img').attr('src', function(i, val) { return options.contentObjectPath + val; })
        var innerHTML = xml.body.innerHTML;
        return innerHTML;
      };

      container.style.display = 'none';
      options._container = container;
      options._target = target;
      $.get(options.url, function(xhtml) {
        options._container.innerHTML = transformedXML(xhtml);
        options._target.appendChild(options._container);
      }, 'xml');
    },

    start: function(event, options) {
      options._container.style.display = 'block';
    },

    end: function(event, options) {
      options._container.style.display = 'none';
    },

    frame: function(event, options) {
         // when frameAnimation is enabled, fire on every frame between start and end
         // event refers to the event object
         // options refers to the options passed into the plugin on init
         // this refers to the popcorn object
    },
    toString: function(event, options) {
       // provide a custom toString method for each plugin
       // defaults to return start, end, id, and target
       // event refers to the event object
       // options refers to the options passed into the plugin on init
       // this refers to the popcorn object
    }
  });
})(Popcorn);

(function (Popcorn) {
  Popcorn.contentObjectParser("parseContentObject", "JSON", function(data, args) {
    var contentObjectPath = args['content_object_path'];
    var retObj = {
          title: "",
          remote: "",
          data: []
        },
        manifestData = {},
        dataObj = data;

    Popcorn.forEach(dataObj.data, function (obj, key) {
      res = {}
      if (obj.html) {
        res.text = {};
        res.text.start = obj.html.start;
        res.text.end = obj.html.end;
        res.text.text = obj.html.text;
        res.text.target = 'content';
      } else if (obj.audio) {
        res.audio = {};
        res.audio.start = obj.audio.start;
        if (res.audio.start == 0) {
          res.audio.start = 0.01 // otherwise audio would start playing before the start of player
        }
        res.audio.end = obj.audio.end;
        res.audio.target = 'media';
        res.audio.source = contentObjectPath + 'audio/' + obj.audio.source;
      } else if (obj.external_html) {
        res.externalHtml = {};
        res.externalHtml.start = obj.external_html.start;
        res.externalHtml.end = obj.external_html.end;
        res.externalHtml.url = contentObjectPath + obj.external_html.url;
        res.externalHtml.contentObjectPath = contentObjectPath
        res.externalHtml.target = 'content';
      }
      retObj.data.push(res);
    });

    return retObj;
  });
})(Popcorn);

