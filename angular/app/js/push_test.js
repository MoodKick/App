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
