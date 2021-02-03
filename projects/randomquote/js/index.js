"use strict";

$(".newQuote").on("click", () => {
  const $quoteInput = $(".quote"),
        $citationInput = $(".citation");

  // make an API request to get a randomly generated quote
  $.ajax({
    url: "https://quotesondesign.com/wp-json/wp/v2/posts/?orderby=rand",
    // call function if request succeeds
    success: (json) => {
      const quote = json[0].content.rendered;
      const author = json[0].title.rendered;

      $quoteInput.html(quote);
      $citationInput.html(author);

      const tweet = $quoteInput.text().trim() + $citationInput.text().trim();
      const $twtBtn = $(".tweetQuote");

      // if quote + citation length is 280 chrs or less,
      // enable the tweet quote button
      if (tweet.length + 3 <= 280) {
        $twtBtn.prop("disabled", false);
      } else {
        $twtBtn.prop("disabled", true);
      }
    },
    // handle request failure
    error: () => {
      $quoteInput.html("Error");
      $citationInput.html("Sorry, something went wrong");
    },
    cache: false
  });
});

$(".tweetQuote").on("click", () => {
  const tweet = getTweet();
  //   handle errors
  if (tweet === false) return;

  const link = "https://twitter.com/intent/tweet?text=" + tweet;
  //   give user the option to tweet a quote
  window.open(link);
});

function getTweet () {
  //  return the quote + the citation
  const $quote = $(".quote").text(),
        $citation = $(".citation").text(),
        defaultMsg = "Click the button to get a quote about design!";

  if ($quote === "" || $quote === defaultMsg) return false;
  else return encodeURIComponent('"' + $quote.trim() + '" ' + $citation);
}