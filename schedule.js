 /* Schedule for all pages that have <div id="schedule"></div>.
   Edit the lists in the "SCHEDULE" part below. Times, talk numbers and the 5 minute breaks are worked out automatically. */
(function () {

  /* ---------- SETTINGS (minutes) ---------- */
  var TALK = 40;         // length of a talk
  var DISCUSSION = 5;    // discussion after each talk
  var BREAK = 5;         // short break after each talk
  var TEA = 30;          // tea break
  var LUNCH = 90;        // lunch break
  var LUNCH_START = '13:00';   // lunch always starts at this time

  /* ---------- BUILDING BLOCKS (do not change) ---------- */
  // event('Title', minutes, 'class')  - minutes can also be an end time such as '17:00'
  // class: 'main' = key event (crimson), 'break' = tea (saffron), 'lunch' = lunch (green), '' = plain
  function event(title, mins, cls) { return { type: 'event', title: title, mins: mins, cls: cls || '' }; }
  // tea and lunch follow a talk directly (no 5 minute break before them); lunch starts at LUNCH_START
  function tea()   { var e = event('Tea break', TEA, 'break'); e.noBreakBefore = true; return e; }
  function eveningtea()   { var e = event('Evening Tea', TEA, 'break'); e.noBreakBefore = true; return e; }
  function lunch() { var e = event('Lunch break', LUNCH, 'lunch'); e.noBreakBefore = true; e.start = LUNCH_START; return e; }
  function closing() {var e = event('Closing Remarks', 10, 'main'); e.noBreakBefore=true; return e; }
  // talk('Speaker name', 'Title of the talk', 'page-id')  - the third part is optional: it links the name to talks.html#page-id
  function talk(speaker, title, link) { return { type: 'talk', speaker: speaker, title: title, link: link || '' }; }

  /* ---------- SCHEDULE: EDIT HERE ---------- */
  var days = [
    {
      title: 'Day 1, 15 December',
      start: '11:30',
      items: [
       event('Registration and tea', 30, 'main'),
       event('Inauguration and welcome', 10, 'main'),
        talk('Ramachandran Balasubramanian', 'Title to be announced'),
        lunch(),
        talk('Maki Nakasuji', 'Duality for Shifted Multi-Indexed Poly-Bernoulli Numbers'),
        tea(),
        talk('Gaurav Kumar', 'Title to be announced'),
        talk('Koji Tasaka', 'Unified multiple L-functions and their values at integer points'),
        eveningtea()
      ]
    },
    {
      title: 'Day 2, 16 December',
      start: '10:00',
      items: [
        talk('Masanobu Kaneko', 'Title to be announced'),
        talk('Masatoshi Suzuki', 'On detecting zeros of Dirichlet L-functions from the Riemann zeta-function'),
        tea(),
        talk('Deep Thakur', 'Title to be announced'),
        lunch(),
        talk('Biplab Paul', 'Title to be announced'),
        tea(),
        talk('Preeti Goyat', 'Title to be announced'),
        talk('Simon Rutard', 'Title to be announced'),
        eveningtea()
      ]
    },
    {
      title: 'Day 3, 17 December',
      start: '10:00',
      items: [
        talk('Kohji Matsumoto', 'Title to be announced'),
        talk('Yuichiro Toma', 'Title to be announced'),
        tea(),
        talk('Suhita Hazra', 'Non-vanishing and Holomorphy of a family of L-functions'),
        lunch(),
        talk('Sunil Naik', 'Title to be announced'),
        tea(),
        talk('Yuta Suzuki', 'Title to be announced'),
        talk('Herbert Gangl', 'Title to be announced'),
        closing(),
        eveningtea()
      ]
    }
  ];

  /* ---------- THE REST BUILDS THE PAGE (do not change) ---------- */
  var mount = document.getElementById('schedule');
  if (!mount) return;

  function toMin(t) { var p = t.split(':'); return parseInt(p[0], 10) * 60 + parseInt(p[1], 10); }
  function two(n) { return (n < 10 ? '0' : '') + n; }
  function toTime(m) { return two(Math.floor(m / 60)) + ':' + two(m % 60); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  var talkNumber = 0;
  var nav = '';
  var out = '';

  for (var d = 0; d < days.length; d++) {
    var day = days[d], t = toMin(day.start), rows = '';

    for (var i = 0; i < day.items.length; i++) {
      var it = day.items[i];

      if (it.type === 'talk') {
        talkNumber++;
        var end = t + TALK + DISCUSSION;
        var name = it.link ? '<a href="talks.html#' + esc(it.link) + '">' + esc(it.speaker) + '</a>' : esc(it.speaker);
        rows += '<li><time>' + toTime(t) + ' – ' + toTime(end) + '</time><div><h3>Talk ' + talkNumber + ': ' + name +
                (it.title ? '<span class="ttl"> - ' + esc(it.title) + '</span>' : '') +
                '</h3><p class="dur">' + TALK + ' min talk + ' + DISCUSSION + ' min discussion</p></div></li>';
        var next = day.items[i + 1];
        if (next && !next.noBreakBefore) {          // short break, but not before tea or lunch
          rows += '<li class="gap"><div></div><div><p>' + BREAK + ' minute break</p></div></li>';
          end += BREAK;
        }
        t = end;
      } else {
        if (it.start) {                              // an item with a fixed start time (lunch)
          if (t > toMin(it.start) && window.console) console.warn('Schedule: "' + it.title + '" on ' + day.title + ' should start at ' + it.start + ', but the item before it runs until ' + toTime(t) + '.');
          t = toMin(it.start);
        }
        var stop = (typeof it.mins === 'string') ? toMin(it.mins) : t + it.mins;
        rows += '<li' + (it.cls ? ' class="' + it.cls + '"' : '') + '><time>' + toTime(t) + ' – ' + toTime(stop) +
                '</time><div><h3>' + esc(it.title) + '</h3></div></li>';
        t = stop;
      }
    }

    nav += '<a href="#day-' + (d + 1) + '">' + esc(day.title) + '</a>';
    out += '<div class="day" id="day-' + (d + 1) + '">' +
             '<div class="sec-head" style="margin-bottom:1.4rem"><h2>' + esc(day.title) + '</h2></div>' +
             '<ol class="timeline">' + rows + '</ol>' +
           '</div>';
  }

  mount.innerHTML = '<nav class="daynav" aria-label="Jump to a day">' + nav + '</nav>' + out;

  // open the right day when the address ends with #day-2 and so on
  if (location.hash) {
    var target = document.getElementById(location.hash.slice(1));
    if (target) target.scrollIntoView();
  }
})();
