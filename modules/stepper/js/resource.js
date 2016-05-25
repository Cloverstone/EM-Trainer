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
stepperView = Backbone.View.extend({
	// events: {
	// 	'click #new-meet': 'add'
	// },
	template: "stepper" ,
	// childView: resultView,
	onShow: function(){
				$('.form').berry({actions:false,attributes:{interval: 10},fields:{
				'Interval': {min:3, max: 999, type: 'slider'},
				'Half Step': {type: 'switch'}
			}
		}).delay('change:interval', function(){
			console.log('i'+this.toJSON().interval+'\n');
				chrome.serial.send(connectionId, convertStringToArrayBuffer('i'+this.toJSON().interval+'\n'), function(){})
		})

	},
	initialize: function() {
		this.setElement(render(this.template, {}));

	}
});