$(".newQuote").on("click", function () {
  "use strict";

  var $quoteInput = $(".quote"),
      $citationInput = $(".citation");

  // make an API request to get a randomly generated quote
  $.ajax({
    url: "https://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1",
    // call function if request succeeds
    success: function success(json) {
      // deal with lsep issue - seen on quote from Apple
      var quote = json[0].content;
      var author = json[0].title;

      $quoteInput.html(quote);
      $citationInput.html(author);

      var tweet = $quoteInput.text().trim() + $citationInput.text().trim();
      var $twtBtn = $(".tweetQuote");

      // if quote + citation length is 280 chrs or less,
      // enable the tweet quote button
      if (tweet.length + 3 <= 280) {
        $twtBtn.prop("disabled", false);
      } else {
        $twtBtn.prop("disabled", true);
      }
    },
    // handle request failure
    error: function error() {
      $quoteInput.html("Error");
      $citationInput.html("Sorry, something went wrong");
    },
    cache: false
  });
});

$(".tweetQuote").on("click", function () {
  "use strict";

  var tweet = getTweet();
  //   handle errors
  if (tweet === false) return;

  var link = "https://twitter.com/home?status=" + tweet;
  //   give user the option to tweet a quote
  window.open(link);
});

function getTweet() {
  "use strict";

  //  return the quote + the citation

  var $quote = $(".quote").text(),
      $citation = $(".citation").text(),
      defaultMsg = "Click the button to get a quote about design!";

  if ($quote === "" || $quote === defaultMsg) return false;

  return encodeURIComponent('"' + $quote.trim() + '" ' + $citation);
}
