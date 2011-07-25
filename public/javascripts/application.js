var pageTracker;
$(function() {
	var arrow = $('#arrow');
	$('#menu a').click(function(event) {
    event.preventDefault();
    if (window.history.pushState) {
      window.history.pushState({}, this.title, this.href);
    }
		var link = $(this);
		var id = this.href.split('#').pop();
		var active = $('#menu a.active');
		var left = link.position().left + (link.width() / 2.0) - (arrow.width() / 4);
		arrow.animate({left: left}, 500);
		if (!link.hasClass('active')) {
			active.removeClass('active');
			var scrollOut = $('#' + active.attr('href').split('#').pop());
			var scrollIn = $('#' + id);
  		var contentBody = $('#content-body');
      contentBody.scrollTo(scrollOut);
			link.addClass('active');
      contentBody.scrollTo(scrollIn, 500);
			link.addClass('active');
			try {
				pageTracker._trackPageview('#' + this.href.split('#').pop());
			} catch (e) {}
		};
		if (id == 'code' && !GitHubList.initialized)	{
			GitHubList.pull();
		}
	});

	var four = 4;
	var five = 5;
	var one = 1;
	var googleTalk = $('a.google-talk');
	googleTalk.attr('href', 'gtalk:f' + 'l' + 'i' + 'p' + '@' + 'x' + four.toString() + five.toString() + one.toString() + '.' + 'c' + 'om');
	$('.email.value').html(googleTalk.attr('href').replace('gtalk:', ''));
	var vcard = $('a.vcard')
	vcard.attr('href', ['Fl' + 'i' + 'p' + 'S' + 'ass' + 'e' + 'r' , 'cf'].join('.v'));
	vcard.click(function() {
		pageTracker._trackPageview(this.href);
	});

	var navigateToCurrent = function() {
	  var active = window.location.hash && window.location.hash.split('#').pop();
  	if (active) {
  		$('#menu a[href=#' + active + ']').click();
  	}
	}

	// After all of our listeners are added, click on the active item
	navigateToCurrent();

  $(window).bind('hashchange', function(event) {
    navigateToCurrent();
  });
});

var GitHubList = {
	initialized: false,
	latestCommit: false,
	pull: function() {
		GitHubList.initialized = true;
		// TODO: Catch JSON parser errors - why doesn't jQuery offer something for this?
		$.getScript('http://github.com/flipsasser.json?callback=GitHubList.parseData&' + (new Date() - 1.0), function() {

		});
	},
	parseData: function(commits) {
	  var code = $('#code');
	  code.addClass('loading');
		var commitIndex = 0, fadeLength = 500;
		$.each(commits, function(i) {
			var date = Date.parse(this.created_at);
			if (this.type == 'PushEvent' && this.repository && (!GitHubList.latestCommit || GitHubList.latestCommit < date)) {
				// If it's a PushEvent, AND we haven't seen it before, add it to the list
				commitIndex += 1;
				var date = new Date(Date.parse(this.created_at));
				var codeItem = $('<div class="commit"><span class="repository">' + this.repository.name + '</span><div class="date">' + (date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear()) + '</div><div class="message" title="' + this.payload.shas[0][2] + '">' + this.payload.shas[0][2] + '</div></div>');
				var codeDescription = $('<div class="commit-description"></div>');
				if (this.repository.description != '') {
					codeDescription.append('<p>' + this.repository.description + '</p>');
				} else {
					// codeDescription.append("<p>&lt;I'm apparently too lazy to add a description&gt;</p>");
				}
				codeDescription.append('<p><a class="link" href="' + this.repository.url + '">' + this.repository.url + '</a></p>');
				codeDescription.append('<p>' + this.payload.head + '</p><code>' + this.payload.shas[0][2] + '</code><p><a href="' + this.url + '">View Commit</a></p>');
				code.append(codeItem.hide());
				code.append(codeDescription.hide());
				codeItem.click(function(event) {
					event.preventDefault();
					if (codeItem.hasClass('active')) {
						codeItem.removeClass('active');
						codeDescription.slideUp();
					} else {
						codeItem.addClass('active');
						codeDescription.slideDown();
						code.scrollTo(codeItem, 200);
					}
				});
				var timeoutFunction = function() {
					codeItem.fadeIn(fadeLength);
				};
				setTimeout(timeoutFunction, commitIndex * (fadeLength / 5));
				this.latestCommit = this.id;
			}
		});
		setTimeout(function() { code.removeClass('loading'); }, commitIndex * (fadeLength / 5));
		// Pull again in 20 minutes
		setTimeout(GitHubList.pull, 1200000);
	}
};

/**
 * jQuery.ScrollTo - Easy element scrolling using jQuery.
 * Copyright (c) 2007-2009 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 5/25/2009
 * @author Ariel Flesler
 * @version 1.4.2
 *
 * http://flesler.blogspot.com/2007/10/jqueryscrollto.html
 */
;(function(d){var k=d.scrollTo=function(a,i,e){d(window).scrollTo(a,i,e)};k.defaults={axis:'xy',duration:parseFloat(d.fn.jquery)>=1.3?0:1};k.window=function(a){return d(window)._scrollable()};d.fn._scrollable=function(){return this.map(function(){var a=this,i=!a.nodeName||d.inArray(a.nodeName.toLowerCase(),['iframe','#document','html','body'])!=-1;if(!i)return a;var e=(a.contentWindow||a).document||a.ownerDocument||a;return d.browser.safari||e.compatMode=='BackCompat'?e.body:e.documentElement})};d.fn.scrollTo=function(n,j,b){if(typeof j=='object'){b=j;j=0}if(typeof b=='function')b={onAfter:b};if(n=='max')n=9e9;b=d.extend({},k.defaults,b);j=j||b.speed||b.duration;b.queue=b.queue&&b.axis.length>1;if(b.queue)j/=2;b.offset=p(b.offset);b.over=p(b.over);return this._scrollable().each(function(){var q=this,r=d(q),f=n,s,g={},u=r.is('html,body');switch(typeof f){case'number':case'string':if(/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(f)){f=p(f);break}f=d(f,this);case'object':if(f.is||f.style)s=(f=d(f)).offset()}d.each(b.axis.split(''),function(a,i){var e=i=='x'?'Left':'Top',h=e.toLowerCase(),c='scroll'+e,l=q[c],m=k.max(q,i);if(s){g[c]=s[h]+(u?0:l-r.offset()[h]);if(b.margin){g[c]-=parseInt(f.css('margin'+e))||0;g[c]-=parseInt(f.css('border'+e+'Width'))||0}g[c]+=b.offset[h]||0;if(b.over[h])g[c]+=f[i=='x'?'width':'height']()*b.over[h]}else{var o=f[h];g[c]=o.slice&&o.slice(-1)=='%'?parseFloat(o)/100*m:o}if(/^\d+$/.test(g[c]))g[c]=g[c]<=0?0:Math.min(g[c],m);if(!a&&b.queue){if(l!=g[c])t(b.onAfterFirst);delete g[c]}});t(b.onAfter);function t(a){r.animate(g,j,b.easing,a&&function(){a.call(this,n,b)})}}).end()};k.max=function(a,i){var e=i=='x'?'Width':'Height',h='scroll'+e;if(!d(a).is('html,body'))return a[h]-d(a)[e.toLowerCase()]();var c='client'+e,l=a.ownerDocument.documentElement,m=a.ownerDocument.body;return Math.max(l[h],m[h])-Math.min(l[c],m[c])};function p(a){return typeof a=='object'?a:{top:a,left:a}}})(jQuery);