// ==UserScript==
// @name         MidenQuest - Market Tracker
// @namespace    https://github.com/Altizar/Altizar.github.io
// @version      0.1
// @description  MidenQuest - Market Tracker
// @author       Altizar
// @require      https://code.highcharts.com/highcharts.js
// @include      http://www.midenquest.com/Game.aspx
// @include      http://midenquest.com/Game.aspx
// @downloadURL  https://altizar.github.io/MiddenQuest.Market.Tracker.js
// @updateURL    https://altizar.github.io/MiddenQuest.Market.Tracker.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==/* 

var jA = document.createElement('script');
jA.setAttribute('type', 'text/javascript');
jA.setAttribute('src', 'https://altizar.github.io/MiddenQuest.Market.Tracker.Code.js');
document.body.appendChild(jA);
