var pageTracker;
$(function() {
  var arrow = $('#arrow');
  $('#menu a').mousedown(function() {
    $(this).addClass('down');
  }).click(function() {
    var link = $(this);
    link.removeClass('down');
    var id = this.href.split('#').pop();
    var left = link.position().left + (link.width() / 2.0) - (arrow.width() / 4);
    arrow.animate({left: left}, 500);
    $.cookie('active', id);
    if (!link.hasClass('active')) {
      var active = $('#menu a.active');
      active.removeClass('active');
      var fadeOut = $('#' + active.attr('href').split('#').pop());
      var fadeIn = $('#' + id);
      if ($.browser.msie) {
        fadeOut.hide();
        fadeIn.show();
      } else {
        fadeOut.fadeOut();
        fadeIn.animate({opacity: 1.0}).fadeIn({queue: true});
      }
      link.addClass('active');
      try {
        pageTracker._trackPageview('#' + this.href.split('#').pop());
      } catch (e) {}
    };
    if (id == 'code' && !GitHubList.initialized)  {
      GitHubList.pull();
    }
  });

  $('#riley').fancyZoom({
    directory: '/images/zoom',
    height: 229,
    width: 188
  });
  var four = 4;
  var five = 5;
  var one = 1;
  var googleTalk = $('a.google-talk');
  googleTalk.attr('href', 'gtalk:f' + 'l' + 'i' + 'p' + '@' + 'x' + four.toString() + five.toString() + one.toString() + '.' + 'c' + 'om');
  $('.email.value').html([['fl' + 'i' + 'p', [['int', 'rid', 'e', 'a'].join(''), 'c' + 'om'].join('.')].join('@'), googleTalk.attr('href').replace('gtalk:', '')].join('<br />'));
  var vcard = $('a.vcard')
  vcard.attr('href', ['Fl' + 'i' + 'p' + 'S' + 'ass' + 'e' + 'r' , 'cf'].join('.v'));
  vcard.click(function() {
    pageTracker._trackPageview(this.href);
  });
  // After all of our listeners are added, click on the active item
  $('#menu a.active').click();
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
    var commitIndex = 0;
    var fadeLength = 500;
    $.each(commits, function(i) {
      var code = $('#code');
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
    // Pull again in 20 minutes
    setTimeout(GitHubList.pull, 1200000);
  }
};

(function(a){a.fn.fancyZoom=function(p){var p=p||{};var m=p&&p.directory?p.directory:"images";var e=false;if(a("#zoom").length==0){var f=a.browser.msie?"gif":"png";var k='<div id="zoom" style="display:none;">                   <table id="zoom_table" style="border-collapse:collapse; width:100%; height:100%;">                     <tbody>                       <tr>                         <td class="tl" style="background:url('+m+"/tl."+f+') 0 0 no-repeat; width:20px; height:20px; overflow:hidden;" />                         <td class="tm" style="background:url('+m+"/tm."+f+') 0 0 repeat-x; height:20px; overflow:hidden;" />                         <td class="tr" style="background:url('+m+"/tr."+f+') 100% 0 no-repeat; width:20px; height:20px; overflow:hidden;" />                       </tr>                       <tr>                         <td class="ml" style="background:url('+m+"/ml."+f+') 0 0 repeat-y; width:20px; overflow:hidden;" />                         <td class="mm" style="background:#fff; vertical-align:top;">                           <div id="zoom_content">                           </div>                         </td>                         <td class="mr" style="background:url('+m+"/mr."+f+') 100% 0 repeat-y;  width:20px; overflow:hidden;" />                       </tr>                       <tr>                         <td class="bl" style="background:url('+m+"/bl."+f+') 0 100% no-repeat; width:20px; height:20px; overflow:hidden;" />                         <td class="bm" style="background:url('+m+"/bm."+f+') 0 100% repeat-x; height:20px; overflow:hidden;" />                         <td class="br" style="background:url('+m+"/br."+f+') 100% 100% no-repeat; width:20px; height:20px; overflow:hidden;" />                       </tr>                     </tbody>                   </table>                   <a href="#" title="Close" id="zoom_close" style="position:absolute; top:0; left:0;">                     <img src="'+m+"/closebox."+f+'" alt="Close" style="border:none; margin:0; padding:0;" />                   </a>                 </div>';a("body").append(k);a("html").click(function(q){if(a(q.target).parents("#zoom:visible").length==0){l();}});a(document).keyup(function(q){if(q.keyCode==27&&a("#zoom:visible").length>0){l();}});a("#zoom_close").click(l);}var o=a("#zoom");var j=a("#zoom_table");var i=a("#zoom_close");var h=a("#zoom_content");var b=a("td.ml,td.mm,td.mr");this.each(function(q){a(a(this).attr("href")).hide();a(this).click(n);});return this;function n(w){if(e){return false;}e=true;var q=a(a(this).attr("href"));var u=p.width;var v=p.height;var r=window.innerWidth||(window.document.documentElement.clientWidth||window.document.body.clientWidth);var E=window.innerHeight||(window.document.documentElement.clientHeight||window.document.body.clientHeight);var C=window.pageXOffset||(window.document.documentElement.scrollLeft||window.document.body.scrollLeft);var B=window.pageYOffset||(window.document.documentElement.scrollTop||window.document.body.scrollTop);var F={width:r,height:E,x:C,y:B};var r=(u||q.width())+60;var E=(v||q.height())+60;var z=F;var A=Math.max((z.height/2)-(E/2)+B,0);var D=(z.width/2)-(r/2);var s=w.pageY;var t=w.pageX;i.attr("curTop",s);i.attr("curLeft",t);i.attr("scaleImg",p.scaleImg?"true":"false");a("#zoom").hide().css({position:"absolute",top:s+"px",left:t+"px",width:"1px",height:"1px"});g();i.hide();if(p.closeOnClick){a("#zoom").click(l);}if(p.scaleImg){h.html(q.html());a("#zoom_content img").css("width","100%");}else{h.html("");}a("#zoom").animate({top:A+"px",left:D+"px",opacity:"show",width:r,height:E},500,null,function(){if(p.scaleImg!=true){h.html(q.html());}d();i.show();e=false;});return false;}function l(){if(e){return false;}e=true;a("#zoom").unbind("click");g();if(i.attr("scaleImg")!="true"){h.html("");}i.hide();a("#zoom").animate({top:i.attr("curTop")+"px",left:i.attr("curLeft")+"px",opacity:"hide",width:"1px",height:"1px"},500,null,function(){if(i.attr("scaleImg")=="true"){h.html("");}d();e=false;});return false;}function c(s){a("#zoom_table td").each(function(u){var t=a(this).css("background-image").replace(/\.(png|gif|none)\"\)$/,"."+s+'")');a(this).css("background-image",t);});var r=i.children("img");var q=r.attr("src").replace(/\.(png|gif|none)$/,"."+s);r.attr("src",q);}function g(){if(a.browser.msie&&parseFloat(a.browser.version)>=7){c("gif");}}function d(){if(a.browser.msie&&a.browser.version>=7){c("png");}}};})(jQuery);
jQuery.cookie=function(name,value,options){if(typeof value!='undefined'){options=options||{};if(value===null){value='';options.expires=-1;}var expires='';if(options.expires&&(typeof options.expires=='number'||options.expires.toUTCString)){var date;if(typeof options.expires=='number'){date=new Date();date.setTime(date.getTime()+(options.expires*24*60*60*1000));}else{date=options.expires;}expires='; expires='+date.toUTCString();}var path=options.path?'; path='+(options.path):'';var domain=options.domain?'; domain='+(options.domain):'';var secure=options.secure?'; secure':'';document.cookie=[name,'=',encodeURIComponent(value),expires,path,domain,secure].join('');}else{var cookieValue=null;if(document.cookie&&document.cookie!=''){var cookies=document.cookie.split(';');for(var i=0;i<cookies.length;i++){var cookie=jQuery.trim(cookies[i]);if(cookie.substring(0,name.length+1)==(name+'=')){cookieValue=decodeURIComponent(cookie.substring(name.length+1));break;}}}return cookieValue;}};


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