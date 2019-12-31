var x, y = null;
var d = document;
var b = d.getElementById("body");

function getCookie() {
  return d.cookie;
}

function isHasAcceptedPolicy() {
  return (null != getCookie().match(/acceptedPolicy=true/))
}

async function acceptPolicy() {
  d.getElementById("policy-banner").style.opacity = 0;
  writeCookie("acceptedPolicy", true);
  await sleep(1000);
  d.getElementById("policy-banner").style.display = "none";
}
window['acceptPolicy'] = acceptPolicy;

function writeCookie(cookieName, cookieValue, ttl = 14) {
  var date = new Date();
  date.setTime(date.getTime() + ttl * 24 * 3600 * 1000);
  d.cookie = cookieName + "=" + cookieValue + "; expires=" + date.toUTCString() + "; " + "path=/";
}
window['writeCookie'] = writeCookie;

function toggleTheme() {
  if (!isHasAcceptedPolicy()) {
    return;
  }

  b.className = (b.className == "dark-theme") ? "light-theme" : "dark-theme";

  writeCookie("darkTheme", (b.className == "dark-theme"));
}
window['toggleTheme'] = toggleTheme;

async function loadGoogleAnalytics() {
  if (!isHasAcceptedPolicy()) {
    return;
  }
  if (d.getElementById('google-analytics')) return;

  (function(i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function() {
      (i[r].q = i[r].q || []).push(arguments)
    };
    i[r].l = 1 * new Date();
    a = s.createElement(o);
    m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.id = 'google-analytics';
    a.src = g;
    m.parentNode.insertBefore(a, m);
  })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

  while ('undefined' == typeof ga ) {
    await sleep(100);
  }

  ga('create', window['analytics'], 'auto');
  ga('send', 'pageview');

  writeCookie("activateGoogleAnalytics", true);
}
window['loadGoogleAnalytics'] = loadGoogleAnalytics;

function disableGoogleAnalytics() {
  if (!isHasAcceptedPolicy()) {
    return;
  }

  writeCookie("activateGoogleAnalytics", false);
  document.cookie = '_ga=; Path=/; Domain=.0xreki.de; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  document.cookie = '_gid=; Path=/; Domain=.0xreki.de; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  document.cookie = '_gat=; Path=/; Domain=.0xreki.de; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
window['disableGoogleAnalytics'] = disableGoogleAnalytics;

function loadYouTube() {
  var videos = d.getElementsByClassName('youtube');
  for (var i = 0; i < videos.length; i++) {
    videos[i].innerHTML = d.getElementById(videos[i].getAttribute('data-videoid')).innerHTML;
  }
}
window['loadYouTube']=loadYouTube;

function restoreSettingsFromCookie() {
  if (!isHasAcceptedPolicy()) {
    var bannerClass = d.getElementsByClassName("policy-banner");
    for(var i = 0; i < bannerClass.length; i++)
      bannerClass[i].style.display = "block";
    return;
  }

  if (null != getCookie().match(/darkTheme=false/)) toggleTheme();
  if (null != getCookie().match(/fontSize/)) zoom((getCookie().match(/(^| )fontSize=([^;]+)/))[2] - 12);
  if (null != getCookie().match(/activateGoogleAnalytics=true/)) loadGoogleAnalytics();
  acceptPolicy();
}

function g(evt) {
  return evt.touches;
}

function touchStart(evt) {
  const firstTouch = g(evt)[0];
  x = firstTouch.clientX;
  y = firstTouch.clientY;
};

function touchMove(evt) {
  if (null == x || null == y) {
    return;
  }

  var xu = evt.touches[0].clientX;
  var yu = evt.touches[0].clientY;

  var xd = x - xu;
  var yd = y - yu;

  if (Math.abs(xd) > 11 && Math.abs(xd) > 2 * Math.abs(yd)) {
    if (xd > 0) {
      loadPage("next");
    } else {
      loadPage("previous")
    }
  }

  x = null;
  y = null;
};

function loadPage(partId) {
  var urlParagraph = d.getElementById(partId);
  if (null == urlParagraph) return;

  var href = urlParagraph.getElementsByTagName("a")[0].href;
  if ("" == href) return;

  window.location.href = href;
}

function zoom(points) {
  if (!isHasAcceptedPolicy()) {
    return;
  }
  var c = d.getElementById('body')

  var fontSize = (parseInt(c.style.fontSize, 10) || 12) + points;
  if (fontSize > 20) fontSize = 22;
  if (fontSize < 12) fontSize = 10;
  c.style.fontSize = fontSize + 'pt';
  writeCookie("fontSize", fontSize);
}
window['zoom'] = zoom;

function clearCookies() {
  writeCookie("acceptedPolicy", '', -1);
  writeCookie("activateGoogleAnalytics", '', -1);
  writeCookie("fontSize", '', -1);
  writeCookie("darkTheme", '', -1);
  document.cookie = '_ga=; Path=/; Domain=.0xreki.de; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  document.cookie = '_gid=; Path=/; Domain=.0xreki.de; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  document.cookie = '_gat=; Path=/; Domain=.0xreki.de; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
window['clearCookies'] = clearCookies;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function setUpPageForUsers() {
  if (isHasAcceptedPolicy()) {
    document.getElementById('content').scrollIntoView(true);
  }
  await sleep(100);
  var isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;

  if (isMobile) {
    d.addEventListener('touchstart', touchStart, false);
    d.addEventListener('touchmove', touchMove, false);
    toggleAllAccordions();
  }

  d.getElementsByTagName("html")[0].className = "animated";
}

async function storeLastReadChapterURL() {
  if (isHasAcceptedPolicy() && window['pageType'] == "chapter") {
    await sleep(10000);
    writeCookie('lastReadChapterURL', window.location.href);
  }
}

function loadLastReadChapterURL() {
  if (isHasAcceptedPolicy())
    window.location.href = (getCookie().match(/(^| )lastReadChapterURL=([^;]+)/))[2];
}
window['loadLastReadChapterURL'] = loadLastReadChapterURL;

function toggleAccordion(e) {
  e.classList.toggle("active");
}
window['toggleAccordion'] = toggleAccordion;

function toggleAllAccordions() {
  document
    .querySelectorAll('.interface .interface p:first-child')
    .forEach(e => {
      toggleAccordion(e)
    });
}

function loadTalkify() {
  if (!isHasAcceptedPolicy()) {
    return;
  }

  var js, fjs = d.getElementsByTagName("script")[0];
  var html = d.getElementsByTagName("html")[0];
  var i = "talkify";

  if (d.getElementById(i)) return;

  js = d.createElement("script");
  js.id = i;
  js.src = '/assets/vendor/talkify/talkify.min.js';

  fjs.parentNode.insertBefore(js, fjs);
}

async function setUpTalkify() {
  while ('undefined' == typeof talkify || 'undefined' == typeof talkify.config ) {
    await sleep(100);
  }

  talkify.config.useSsml = true;
  talkify.config.remoteService.active = false;
  talkify.config.keyboardCommands.enabled = false;
  talkify.config.voiceCommands.enabled = false;
  talkify.config.ui.audioControls.enabled = true;
  talkify.config.ui.audioControls.container = document.getElementById("player-and-voices");

  window['player'] = new talkify.Html5Player();
  
  while (null == player.forcedVoice) {
    await sleep(100);
    player.forceVoice(window.speechSynthesis.getVoices().find(e => e.name == "Google US English"));
    if (null == player.forcedVoice)
      player.forceVoice(window.speechSynthesis.getVoices().find(e => e.lang.match(/US/)));
  }
  
  window['playlist'] = new talkify.playlist()
    .begin()
    .usingPlayer(window['player'])
    .excludeElements('[aria-hidden=true]')
    .build();
}
window['setUpTalkify'] = setUpTalkify;

async function toggleTTS() {
  if ('undefined' == typeof window['isReading']) {
    window['isReading'] = true;
    toggleAllAccordions();
    loadTalkify();
    setUpTalkify();
  
    while ('undefined' == typeof window['playlist']) {
      await sleep(100);
    }

    playlist.play();
    return;
  }

  if (window['isReading']) {
    player.pause();

  } else {
    player.play();
  }
  window['isReading'] = !window['isReading'];
}
window['toggleTTS'] = toggleTTS;

restoreSettingsFromCookie();
setUpPageForUsers();

if(window['slowProfile']) {
  acceptPolicy();
}

storeLastReadChapterURL();
