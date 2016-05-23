// stepperModel = Backbone.Model.extend({
// 	initialize: function(){
// 		this.bind('change', function(){ if(this.collection){ this.save(); }})
// 	}
// });

// stepperCollection = Backbone.Collection.extend({
// 		chromeStorage: new Backbone.ChromeStorage("stepper", "local"),
// 		model: stepperModel,
// 		initialize: function(){
// 			this.on('add', function(model){ model.save(); });
// 		},
// });
// resultView = Backbone.View.extend({
// 	// events: {
// 	// 	'click .fa-times': 'destroy'
// 	// },
// 	// toggle: function(e) {
// 	// 	e.stopPropagation();
// 	// 	this.model.set({active:!this.model.attributes.active})
// 	// },
// 	// edit: function() {
// 	// 	this.form({legend: 'Edit Contestant', model: this.model});
// 	// },
// 	template: "result" ,
// 	target: ".list-group",
// 	initialize: function() {
// 		this.autoElement();
// 	}
// });
speakerView = Backbone.View.extend({
	// events: {
	// 	'click #new-meet': 'add'
	// },
	template: "speaker" ,
	// childView: resultView,
	// onShow: function(){
	// 	this.collection.each(function(model) {
	// 		new this.childView({'model': model});
	// 	}, this);
	// },
	initialize: function() {
		this.setElement(render(this.template, {}));

	}
});