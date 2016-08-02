// ==UserScript==
// @name         MidenQuest - Custom Navbar
// @namespace    https://github.com/Vibblez/MidenQuest
// @version      0.1.2.6
// @description  MidenQuest Enhancement Script
// @author       Vibblez
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js
// @include      http://www.midenquest.com/Game.aspx
// @include      http://midenquest.com/Game.aspx
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    $("#TitleEmbedded").html('\
<div class=\"drop\">\
<ul class="drop_menu">\
<li>\
<a href="Home.aspx" target="_blank">Home</a>\
</li>\
<li>\
<a href="https://www.reddit.com/r/MidenQuestOnline/" target="_blank">Subreddit</a>\
</li>\
<li>\
<a href="Credits.aspx" target="_blank">Credits</a>\
</li>\
<li>\
<a href="Terms.aspx" target="_blank">ToS</a>\
</li>\
<li>\
<a href="#">Help</a>\
<ul>\
<li>\
<a href="FAQ.aspx" target="_blank">FAQ</a>\
</li>\
<li>\
<a href="https://www.reddit.com/r/MidenQuestOnline/wiki/index" target="_blank">Wiki</a>\
</li>\
</ul>\
</li>\
<li>\
<a href="#">Quick Links</a>\
<ul>\
<li>\
<a href="#" onclick="sendRequestContentFill(\'getMarket.aspx?null=\')">Market</a>\
</li>\
<li>\
<a href="#" onclick="sendRequestContentFill(\'getCustomize.aspx?null=\')">Customize/Sell</a>\
</li>\
<li>\
<a href="#" onclick="sendRequestContentFill(\'getExpedition.aspx?null=\')">Inn</a>\
</li>\
<li>\
<a href="#" onclick="sendRequestContentFill(\'getSearch.aspx?null=\')">Town</a>\
</li>\
<li>\
<a href="#" onclick="sendRequestContentFill(\'getTradeskill.aspx?w=1&null=\');ChangeLogChannel(2);">Scout</a>\
</li>\
<li>\
<a href="#" onclick="sendRequestContentFill(\'getTradeskill.aspx?w=2&null=\');ChangeLogChannel(2);">Selling</a>\
</li>\
<li>\
<a href="#" onclick="sendRequestContentFill(\'getTradeskill.aspx?w=3&null=\');ChangeLogChannel(2);">Mine</a>\
</li>\
<li>\
<a href="#" onclick="sendRequestContentFill(\'getTradeskill.aspx?w=4&null=\');ChangeLogChannel(2);">Gather</a>\
</li>\
<li>\
<a href="#" onclick="sendRequestContentFill(\'getTradeskill.aspx?w=5&null=\');ChangeLogChannel(2);">Logging</a>\
</li>\
<li>\
<a href="#" onclick="sendRequestContentFill(\'getTradeskill.aspx?w=6&null=\');ChangeLogChannel(2);">Fishing</a>\
</li>\
</ul>\
</li>\
<li>\
<a href="#">Town Quests</a>\
<ul>\
<li><a href="#" onclick="sendRequestContentFill(\'getMap.aspx?NewX=986&NewY=985\');sendRequestContentFill(\'getTradeskill.aspx?w=1&null=\');">Scouting @ 985,986</a></li>\
<li><a href="#" onclick="sendRequestContentFill(\'getMap.aspx?NewX=968&NewY=985\');sendRequestContentFill(\'getTownQuest.aspx?null=\');">City @ 968,985</a></li>\
<li><a href="#" onclick="sendRequestContentFill(\'getMap.aspx?NewX=982&NewY=993\');sendRequestContentFill(\'getTownQuest.aspx?null=\');">City @ 982,993</a></li>\
<li><a href="#" onclick="sendRequestContentFill(\'getMap.aspx?NewX=984&NewY=964\');sendRequestContentFill(\'getTownQuest.aspx?null=\');">City @ 984,964</a></li>\
<li><a href="#" onclick="sendRequestContentFill(\'getMap.aspx?NewX=984&NewY=973\');sendRequestContentFill(\'getTownQuest.aspx?null=\');">City @ 984,973</a></li>\
<li><a href="#" onclick="sendRequestContentFill(\'getMap.aspx?NewX=985&NewY=975\');sendRequestContentFill(\'getTownQuest.aspx?null=\');">City @ 985,975</a></li>\
<li><a href="#" onclick="sendRequestContentFill(\'getMap.aspx?NewX=985&NewY=994\');sendRequestContentFill(\'getTownQuest.aspx?null=\');">City @ 985,994</a></li>\
<li><a href="#" onclick="sendRequestContentFill(\'getMap.aspx?NewX=985&NewY=996\');sendRequestContentFill(\'getTownQuest.aspx?null=\');">City @ 985,996</a></li>\
<li><a href="#" onclick="sendRequestContentFill(\'getMap.aspx?NewX=986&NewY=976\');sendRequestContentFill(\'getTownQuest.aspx?null=\');">City @ 986,976</a></li>\
<li><a href="#" onclick="sendRequestContentFill(\'getMap.aspx?NewX=986&NewY=986\');sendRequestContentFill(\'getTownQuest.aspx?null=\');">City @ 986,986</a></li>\
<li><a href="#" onclick="sendRequestContentFill(\'getMap.aspx?NewX=993&NewY=982\');sendRequestContentFill(\'getTownQuest.aspx?null=\');">City @ 993,982</a></li>\
<li><a href="#" onclick="sendRequestContentFill(\'getMap.aspx?NewX=994&NewY=984\');sendRequestContentFill(\'getTownQuest.aspx?null=\');">City @ 994,984</a></li>\
<li><a href="#" onclick="sendRequestContentFill(\'getMap.aspx?NewX=996&NewY=985\');sendRequestContentFill(\'getTownQuest.aspx?null=\');">City @ 996,985</a></li>\
<li><a href="#" onclick="sendRequestContentFill(\'getMap.aspx?NewX=997&NewY=984\');sendRequestContentFill(\'getTownQuest.aspx?null=\');">City @ 997,984</a></li>\
</ul>\
</a>\
</li>\
<li>\
<a href="#" onclick="sendRequestContentFill(\'getEventScreen.aspx?null=\')>\
Event Points: <span id="ev_count0"></span>\
</a>\
</li>\
</ul>\
</div>');

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }

        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    addGlobalStyle('body > div:nth-child(2) { display: none; } #TitleEmbedded {  margin-bottom: 5px !important; }');
    addGlobalStyle('.drop { height: 40px; } .drop_menu {  padding:0;	margin:0;	list-style-type:none;	height:40px;}.drop_menu li { float:left; z-index: 9999; padding-top: 5px; }.drop_menu li a {	padding:9px 20px;	display:block;	color:#fff;	text-decoration:none;	font:12px arial, verdana, sans-serif;}.drop_menu ul {	position:absolute;	left:-9999px;	top:-9999px;	list-style-type:none;}.drop_menu li:hover { position:relative; }.drop_menu li:hover ul {	left:0px;	top:30px;	background:#BFAD71;	padding:0px; margin-left;     border-left: 2px #000 solid;border-right: 2px #000 solid;border-bottom: 2px #000000 solid;}.drop_menu li:hover ul li a {	display:block;	width:100px }.drop_menu li:hover ul li a:hover { background:#005555; }');
    addGlobalStyle('.prgActionOverlay { margin-top: -20px !important; }');

})();