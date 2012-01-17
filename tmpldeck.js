/*!
 * TmplDeck
 *
 * JSDeferred.js required
 *
 * @forked    : Kazunori Tokuda (norimania[at]gmail.com)
 * @modified  : 2012/01/17
 *
 * Based on jQuery.TmplDeck
 * @author    : Takeshi Takatsudo (takazudo[at]gmail.com)
 * @copyright : Takeshi Takatsudo
 * @license   : The MIT License
 * @link      : https://github.com/Takazudo/jQuery.TmplDeck
 * @modified  : 2011/12/02
 * @version   : 0.1
 *
 * underscore.js template storage
*/
(function(window, document, undefined) {

var TmplDeck = function(url) {
	if ( !(this instanceof arguments.callee) ) {
		return new TmplDeck(url);
	}
	this._options = {
		url: url
	};
	this._fetchDefer = new Deferred();
	this._cache = {};
};
TmplDeck.prototype = {
	_fetchedText: null,
	_fetchDefer: null,
	_cache: null,
	load: function() {
		var self = this;
		return get(self._options.url)
			.next(function(data) {
				self._fetchedText = data;
				self._fetchDefer.call();
			})
			.error(function() {
				self._fetchDefer.fail();
			});
	},
	ready: function(fn) {
		this._fetchDefer.next(function() {
			fn();
		});
	},
	draw: function(id) {
		var ret = undefined;
		if ( this._cache[id] ) {
			ret =  this._cache[id];
		} else {
			var re = new RegExp('(^|\\n)' + id + '\\s\{\{\{\\r?\\n([\\s\\S]+?)\}\}\}');
				// get text inside parenthesis
			var res = this._fetchedText.match(re);
			ret = !res ? null : (this._cache[id] = res[2]);
		}
		return ret;
	}
};

/* underscore.js enhancement */

TmplDeck.prototype.tmpl = function(id, data) {
	return _.template(this.draw(id))(data);
};

function get(url) {
	var xhr = false,
		dfd = new Deferred();
	if ( typeof window.ActiveXObject != 'undefined' ) {
		try {
			xhr = new window.ActiveXObject('Microsoft.XMLHTTP');
		} catch (e) {
			xhr = false;
		}
	}
	if ( !xhr && typeof window.XMLHttpRequest !== 'undefined' ) {
		xhr = new window.XMLHttpRequest();
	}

	xhr.open('GET', url, 'True');
	xhr.onreadystatechange = function() {
		if ( xhr.status !== 200 ) {
			dfd.fail();
			return;
		}
		if ( xhr.readyState !== 4 ) {
			return;
		}
		dfd.call(xhr.responseText);
	}
	xhr.send(null);

	return dfd;
}

window.TmplDeck = TmplDeck;

}(this, this.document));
