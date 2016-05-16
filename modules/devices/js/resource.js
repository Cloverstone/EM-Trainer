
racerView = Backbone.View.extend({
	events: {
		'click': 'edit',
		'click .btn': 'toggle',
		'click .fa-times': 'destroy'
	},
	toggle: function(e) {
		e.stopPropagation();
		this.model.set({active:!this.model.attributes.active})
	},
	edit: function() {
		this.form({legend: 'Edit Contestant', model: this.model});
	},
	template: "contestant" ,
	target: ".list-group",
	initialize: function() {
		this.autoElement();
	}
});

racersView = Backbone.View.extend({
	events: {
		'click #new-racer': 'add'
	},
	add: function() {
		this.form({legend: 'New Contestant', model: new racerModel()}).on('saved', $.proxy(function(){
			this.collection.add(this.berry.options.model);
		 	new racerView({model: this.berry.options.model});
		}, this));
	},
	template: "contestants" ,
	childView: racerView,
	onShow: function(){
		this.collection.each(function(model) {
			new this.childView({'model': model});
		}, this);
	},
	initialize: function() {
		this.setElement(render(this.template, this.collection ));
	}
});

racerModel = Backbone.Model.extend({
	schema:{
		Racer: {},
		Name: {},
		Number: {type: 'number'},
		Active: {type: 'checkbox', default: 'true'}
	},
	initialize: function(){
		this.bind('change', function(){ if(this.collection){ this.save(); }})
	},
});

racerCollection = Backbone.Collection.extend({
		chromeStorage: new Backbone.ChromeStorage("contestants", "local"),
		model: racerModel,
		initialize: function(){
			this.on('add', function(model){ model.save(); });
		},
});

