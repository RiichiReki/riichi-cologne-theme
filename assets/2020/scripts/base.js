var x, y = null;
var d = document;
var b = $('body')[0];

function getCookie() {
  return d.cookie;
}

function isHasAcceptedPolicy() {
  return (null != getCookie().match(/acceptedPolicy=true/));
}

async function acceptPolicy() {
  var banner = $('#policy-banner')[0];
  banner.style.opacity = 0;
  writeCookie("acceptedPolicy", true);
  await sleep(1000);
  banner.style.display = "none";
}


function writeCookie(cookieName, cookieValue, ttl = 14) {
  var date = new Date();
  date.setTime(date.getTime() + ttl * 24 * 3600 * 1000);
  d.cookie = cookieName + "=" + cookieValue + "; expires=" + date.toUTCString() + "; " + "domain=crystaldown.de; path=/";
}


function toggleTheme() {
  if (!isHasAcceptedPolicy()) {
    return;
  }

  $('body').toggleClass('dark-theme').toggleClass('light-theme');
  writeCookie("darkTheme", $('body').hasClass('dark-theme'));
}


function toggleDyslexicFont() {
  if (!isHasAcceptedPolicy()) {
    return;
  }

  $('body').toggleClass('dyslexic');
  writeCookie("dyslexic", $('body').hasClass('dyslexic'));
}


function loadYouTube() {
  var videos = d.getElementsByClassName('youtube');
  for (var i = 0; i < videos.length; i++) {
    videos[i].innerHTML = d.getElementById(videos[i].getAttribute('data-videoid')).innerHTML;
  }
}
window['loadYouTube']=loadYouTube;

function restoreSettingsFromCookie() {
  if (!isHasAcceptedPolicy()) {
    var bannerClass = $('.policy-banner');
    for(var i = 0; i < bannerClass.length; i++)
      bannerClass[i].style.display = "block";
    return;
  }

  if (null != getCookie().match(/darkTheme=false/)) {
    $('#dark-mode').prop('checked', true);
    toggleTheme();
  }
  if (null != getCookie().match(/dyslexic=true/)) {
    $('#dyslexic').prop('checked', true);
    toggleDyslexicFont();
  }
  if (null != getCookie().match(/fontSize/)) zoom((getCookie().match(/(^| )fontSize=([^;]+)/))[2] - 12);
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
      loadPage("previous");
    }
  }

  x = null;
  y = null;
};

function loadPage(partId) {
  var href = $('#' + partId)[0].href;
  if ("" == href) return;

  window.location.href = href;
}

function zoom(points) {
  if (!isHasAcceptedPolicy()) {
    return;
  }

  var fontSize = (parseInt(b.style.fontSize, 10) || 12) + points;
  if (fontSize > 20) fontSize = 22;
  if (fontSize < 12) fontSize = 10;
  b.style.fontSize = fontSize + 'pt';
  writeCookie("fontSize", fontSize);
}


function clearCookies() {
  writeCookie("acceptedPolicy", '', -1);
  writeCookie("activateGoogleAnalytics", '', -1);
  writeCookie("fontSize", '', -1);
  writeCookie("darkTheme", '', -1);
  writeCookie("condensed", '', -1);
  writeCookie("dyslexic", '', -1);
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function setUpPageForUsers() {
  await sleep(200);
  var isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;

  if (isMobile) {
    d.addEventListener('touchstart', touchStart, false);
    d.addEventListener('touchmove', touchMove, false);
    document.getElementById('mobile-top').scrollIntoView(true);
    toggleAllAccordions();
  }

  d.getElementsByTagName("html")[0].className = "animated";

  $('#dark-mode').change(toggleTheme);
  $('#tts').change(toggleTTS);
  $('#line-height').change(toggleLineHeight);
  $('#dyslexic').change(toggleDyslexicFont);
}

function toggleAccordion(e) {
  e.classList.toggle("inactive");
  e.classList.toggle("active");
}


function toggleAllAccordions() {
  document
    .querySelectorAll('.inactive')
    .forEach(e => {
      toggleAccordion(e);
    });
}

function loadTalkify() {
  if (!isHasAcceptedPolicy()) {
    return;
  }

  var js, fjs = d.getElementsByTagName("script")[0];
  var html = d.getElementsByTagName("html")[0];
  var i = "talkify";

  if (d.getElementById(i)) {
    return;
  }

  js = d.createElement("script");
  js.id = i;
  js.src = '/assets/2020/scripts/talkify/talkify.min.js';

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
    .excludeElements('.breadcrumb')
    .build();
}


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


restoreSettingsFromCookie();
setUpPageForUsers();

