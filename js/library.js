var debug = false;
var alert = function(text){
	if(debug){
		console.log(text);
	}
}
function render(template, data){
	if(typeof templates[template] === 'undefined'){
		templates[template] =  Hogan.compile($('#'+template).html());
	}
  return templates[template].render(data, templates);
}
// Backbone.View.prototype.close = function() {
// 	this.remove();
// 	this.unbind();
// 	if (this.onClose){
// 		this.onClose();
// 	}
// };

Backbone.View.prototype.form = function(options) {
	options = options || {target: this.formTarget};
	this.berry = $(this.formTarget || options.target).berry($.extend({model: this.model, legend: this.legend, fields: this.fields }, options));
	return this.berry;
};
Backbone.View.prototype.destroy = function(e) {
	e.stopPropagation();
	//if(confirm('Are you sure you want to delete?')) {
		this.$el.fadeOut('fast', $.proxy(function() {
			this.model.destroy();
			this.remove();
		}, this));
	//}
};

Backbone.Model.prototype.fields = function(keys) {
	return containsKey(this.schema,keys);
};
Backbone.View.prototype.autoElement = function(options) {
	options = $.extend({append: true}, options);
	this.setElement(render(this.template, this.model.attributes ));
	this.model.on('change', $.proxy(function() {
		this.$el.replaceWith(this.setElement(render(this.template, this.model.attributes )).$el);
		this.render()
		this.editing = false;
		this.trigger('rendered');
	}), this);
	if(options.append !== false){
		$(this.target).append(this.$el);
	}
};
// Backbone.View.prototype.autoAdd = function(options) {
// 	this.collection.on('add', $.proxy(function(){ contentManager.show( new this.constructor({ collection: this.collection }))}, this) );
// };

(function($) {
  $.score = function(base, abbr, offset) {

    //offset = offset || 0 // TODO: I think this is unused... remove

    if(abbr.length === 0) return 0.9;
    if(abbr.length > base.length) return 0.0;

    for (var i = abbr.length; i > 0; i--) {
      var sub_abbr = abbr.substring(0,i);
      var index = base.indexOf(sub_abbr);

      if(index < 0) continue;
      if(index + abbr.length > base.length + offset) continue;

      var next_string = base.substring(index+sub_abbr.length);
      var next_abbr = null;

      if(i >= abbr.length)
        next_abbr = '';
      else
        next_abbr = abbr.substring(i);

      // Changed to fit new (jQuery) format (JSK)
      var remaining_score   = $.score(next_string, next_abbr,offset+index);

      if (remaining_score > 0) {
        var score = base.length-next_string.length;

        if(index !== 0) {
          //var j = 0;

          var c = base.charCodeAt(index-1);
          if(c==32 || c == 9) {
            for(var j=(index-2); j >= 0; j--) {
              c = base.charCodeAt(j);
              score -= ((c == 32 || c == 9) ? 1 : 0.15);
            }
          } else {
            score -= index;
          }
        }

        score += remaining_score * next_string.length;
        score /= base.length;
        return score;
      }
    }
    return 0.0;
  };
})(jQuery);




function processFilter(){
	$('.filterable').each(
	function(){
		if($(this).text().toLowerCase().indexOf($('[name=filter]').val().toLowerCase())>-1){
			$(this).removeClass('nodisplay');
		}else{
			$(this).addClass('nodisplay');
		}
	});
	$("#wait").hide();
}

filterTimer = null;
$('body').on('keyup','[name=filter]',function(event){
	if(!$(this).hasClass("delay")){
		$(".filterable").each(
		function(){
			if($.score($(this).text().toLowerCase(), $('[name=filter]').val().toLowerCase() ) >0.40){
				$(this).show();
			}else{
				$(this).hide();
			}
		});
	}else{
	clearTimeout(filterTimer);
	filterTimer=setTimeout(processFilter,300);
	}
});


$(function() {
	sidebarManager = new RegionManager({el: '#sidebar_left'});
});

/* Tools */
RegionManager = function(defaults) {
	this.currentView = undefined;
	defaults = $.extend({el:"#content"}, defaults);
	var el = defaults.el;

	var closeView = function (view) {
		for(var i in Berry.instances){
			Berry.instances[i].destroy();
		}
		if (view && view.close) {
			view.close();
		}
	};

	var openView = function (view) {
		view.render();
		$(el).html(view.el);
		if (view.onShow) {
			view.onShow();
		}
		$('html, body').animate({ scrollTop: 0 }, 'fast');
		$(el).find('.tooltips').tooltip();
    $(el).find('.popovers').popover();
	};

	this.show = function (view) {
		var r = true;
		// if(widget_factory.changed){
		// 	r = confirm("Any changes that you made will be lost.\n\nAre you sure you want to leave this page?");
		// }
		if (r == true) {
			// widget_factory.changed = false;
			closeView(this.currentView);
			if(view){
				this.currentView = view;
				openView(this.currentView);
			}else{
				this.currentView = undefined;
			}
		} else {
			myrouter.previous(false);
			myrouter.history.pop();
		}
	};
};


pages={};
currentPage = '',

loadPage = function(page, id) {
	if(typeof pages[page].load == 'function') {
		currentPage = page;
		pages[page].load(id);
	}
}

Berry.options.modal = {header_class: 'bg-system'};
// Convert string to ArrayBuffer




(function(b, $){
	b.register({ type: 'switch',
		defaults: {container: 'span'},
		create: function() {
			this.checkStatus(this.value);
			return b.render('switch', this);
		},
		checkStatus: function(value){
			if(value === true || value === "true" || value === 1 || value === "1" || value === "on" || value == this.truestate){
				this.value = true;
			}else{
				this.value = false;
			}
		},
		setup: function() {
			this.$el = this.self.find('[type=checkbox]');
			this.$el.off();
			if(this.onchange !== undefined) {
				this.on('change', this.onchange);
			}
			this.$el.change($.proxy(function(){this.trigger('change');},this));
		},
		getValue: function() {
			if(this.$el.is(':checked')){
				return this.truestate || true
			}else{
				return this.falsestate || false;
			};
		},
		setValue: function(value) {
			this.checkStatus(value);
			this.$el.prop('checked', this.value);
			this.value = value;
		},
		displayAs: function() {
			for(var i in this.item.options) {
				if(this.item.options[i].value == this.lastSaved) {
					return this.item.options[i].name;
				}
			}
		},
		focus: function(){
			this.$el.focus();
		},
		satisfied: function(){
			return this.$el.is(':checked');
		},
	});
})(Berry, jQuery);


(function(b, $){




	b.register({ type: 'slider',
		// value: '',
		create: function() {
			this.options = b.processOpts.call(this.owner, this.item, this).options;
			return b.render('slider', this);
		},
		setup: function() {
			this.$el = this.self.find('input');

			this.slider  = this.$el.slider({
				tooltip_position:'bottom',
				tooltip: 'always',
				ticks: _.pluck(this.options, 'value'),
				ticks_labels:_.pluck(this.options, 'label')
			});
    // {{#options.0}}data-slider-ticks="[{{#options}}{{value}},{{/options}}]"
    // data-slider-ticks-labels="[{{#options}}'{{label}}',{{/options}}]"{{/options.0}}
			this.$el.off();

			this.setValue(this.value);
			if(this.onchange !== undefined){
				this.on('change', this.onchange);
			}
			this.$el.change($.proxy(function(){this.trigger('change');}, this));
		},
				setValue: function(value){
			if(typeof this.lastSaved === 'undefined'){
				this.lastSaved = value;
			}
			this.value = value;
			this.slider.slider('setValue', this.value);
			return this.$el;
		},
		getValue: function(){
			return this.slider.slider('getValue');
		},
		displayAs: function() {
			var o = this.options;
			for(var i in o) {
				if(o[i].value == this.lastSaved) {
					return o[i].label;
				}
			}
		}
	});
})(Berry, jQuery);


convertStringToArrayBuffer = function(str) {
	if(typeof str == 'string'){
	  var buf=new ArrayBuffer(str.length);
	  var bufView=new Uint8Array(buf);
	  for (var i=0; i<str.length; i++) {
	    bufView[i]=str.charCodeAt(i);
	  }
	  return buf;
	}
	return new ArrayBuffer(0);
}
