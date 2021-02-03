$(window).on("load", function () {
  "use strict";

  var users = [
    "OgamingSC2",
    "cretetion",
    "sips_",
    "Punz",
    "ofmanny",
    "Symfuhny",
    "sodapoppin",
    "LCK",
  ];
  var promisesArr = [];
  var $userContainer = $(".userContainer");

  users.map(function (user) {
    // for each user, create a promise consisting of a call to the twitch.tv API to get data about the user. Push the promises into an array.
    promisesArr.push(new Promise(function (resolve, reject) {
      $.ajax({
        // use a proxy server to prevent CORS error
        url: "https://cors-anywhere.herokuapp.com/https://" + "wind-bow.gomix.me/twitch-api/channels/" + user,
        success: resolve,
        error: reject
      });
    }));
  });

  // wait until all the API calls have returned, then, for each user, append the returned data to the document
  // we need to wait until all the API calls have been returned to ensure that the users are appended to the doument in the same order each time   
  Promise.all(promisesArr).then(function (values) {
    var i = 0;
    var username = "";
    var link = "";
    var img = "";
    var html = "";
    var $userContainer = $(".userContainer");

    for (i = 0; i < promisesArr.length; i++) {
      username = values[i].display_name;
      link = values[i].url;
      img = values[i].logo;
      html = buildProfileHTML(username, img, link);
      $userContainer.append(html);
      checkStreamStatus(username);
    }
  }).catch(function () {
    $userContainer.append("<div><p>Sorry, something went wrong" + " when we tried to get data from Twitch.tv. Please try again later.</p></div>");
  });
});

// return a string which can be appended to the HTML document in order to
// build the user's profile
function buildProfileHTML(username, img, link) {
  "use strict";

  var statusBox = "<span class='streamStatus'>" + "<i class='fa fa-circle' aria-hidden='true'></i></span>";

  var html = "<div class='" + username + " userBox'>" + statusBox + "<p><img src=" + img + " alt='(Image not available)' class='img-responsive'><a href=" + link + ">" + username + "</a></p></div>";

  return html;
}

function checkStreamStatus(user) {
  "use strict";

  var $userBox = $("." + user);
  var $statusBox = $("." + user + " span");
  var $statusIndicator = $("." + user + " span .fa-circle");
  var html = "";
  var game = "";
  var status = "";
  var viewers = 0;

  // make a call to the twitch.tv API to check whether a given user is
  // currently streaming. If they are streaming, get details about the stream.
  $.ajax({
    // use a proxy server to prevent CORS error
    url: "https://cors-anywhere.herokuapp.com/https://" + "wind-bow.gomix.me/twitch-api/streams/" + user,
    success: function success(json) {
      if (json.stream === null) {
        html = "<p>Not currently streaming.</p>";
        $statusBox.append(" Offline");
      } else {
        // get details of stream
        game = json.stream.game;
        viewers = json.stream.viewers;
        status = json.stream.channel.status;
        html = buildStatusHTML(game, status, viewers);
        $statusBox.append(" <b>Online</b>");
        $statusIndicator.css("color", "green");
      }
      $userBox.append(html);
    },
    error: function error() {
      $userBox.append("<p>Sorry, something went wrong" + " when we tried to get streaming data about this user.</p>");
    }
  });
}

// return a string which can be appended to the HTML document in order to
// display the user's current streaming status
function buildStatusHTML(game, status, viewers) {
  "use strict";

  var html = "";

  if (game === null || game === undefined) {
    html = "<p>Currently streaming.</p><p><b>Status:</b> " + status + ";  <b>Viewers:</b> " + viewers + "</p>";
  } else {
    html = "<p>Currently streaming.</p><p><b>Game:</b> " + game + ";  <b>Status:</b> " + status + ";  <b>Viewers:</b> " + viewers + "</p>";
  }

  return html;
}

// refresh the page
$(".refresh").on("click", function () {
  "use strict";
  // refresh from the server, not the cache

  location.reload(true);
});