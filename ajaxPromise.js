'use strict';

/*
// B-> Here you define its functions and its payload
var mdnAPI = 'https://developer.mozilla.org/en-US/search.json';
var payload = {
  'topic' : 'js',
  'q'     : 'Promise'
};

var callback = {
  success : function(data){
     console.log(1, 'success', JSON.parse(data));
  },
  error : function(data){
     console.log(2, 'error', JSON.parse(data));
  }
};
// End B

// Executes the method call 
$http(mdnAPI) 
  .get(payload) 
  .then(callback.success) 
  .catch(callback.error);

// Executes the method call but an alternative way (1) to handle Promise Reject case 
$http(mdnAPI) 
  .get(payload) 
  .then(callback.success, callback.error);

// Executes the method call but an alternative way (2) to handle Promise Reject case 
$http(mdnAPI) 
  .get(payload) 
  .then(callback.success)
  .then(undefined, callback.error);
*/

// A-> $http function is implemented in order to follow the standard Adapter pattern
function $http(url) {

  // A small example of object
  var core = {

    // Method that performs the ajax request
    ajax: function (method, url, args) {
      // Creating a promise
      var promise = new Promise(function (resolve, reject) {

        // Instantiates the XMLHttpRequest
        var client = new XMLHttpRequest();
        var uri = url, params = '', postFlag = (method === 'POST' || method === 'PUT');

        if (args) {
          uri += '?';
          var argcount = 0;
          for (var key in args) {
            if (args.hasOwnProperty(key)) {
              if (argcount++) {
                params += '&';
              }
              params += encodeURIComponent(key) + '=' + encodeURIComponent(args[key]);
            }
          }
          uri += params
        }


        client.open(method, postFlag ? url : uri);
        postFlag && client.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        client.send(postFlag ? params : null);

        client.onload = function () {
          if (this.status >= 200 && this.status < 300) {
            // Performs the function "resolve" when this.status is equal to 2xx
            resolve(this.response);
          } else {
            // Performs the function "reject" when this.status is different than 2xx
            reject(this.statusText);
          }
        };
        client.onerror = function () {
          reject(this.statusText);
        };
      });

      // Return the promise
      return promise;
    }
  };

  // Adapter pattern
  return {
    'get': function (args) {
      return core.ajax('GET', url, args);
    },
    'post': function (args) {
      return core.ajax('POST', url, args);
    },
    'put': function (args) {
      return core.ajax('PUT', url, args);
    },
    'delete': function (args) {
      return core.ajax('DELETE', url, args);
    }
  };
};
// End A

module.exports = $http