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

Berry.btn.update = {
		label: 'Update',
		icon:'check',
		id: 'berry-submit',
		modifier: 'success col-sm-offset-4',
		click: function() {
			if(this.options.autoDestroy) {
				this.on('saved', this.destroy);
			}
			this.trigger('save');
		}
	};
stepperView = Backbone.View.extend({
	// events: {
	// 	'click #new-meet': 'add'
	// },
	template: "stepper" ,
	// childView: resultView,
	onShow: function(){
				$('.form').berry({actions:['update',''],attributes: {interval: 10},fields:{
				'Interval': {choices:[10, 999], type: 'slider'},
				'Half Step': {type: 'switch'},
				'Direction': {type: 'switch'},
				'Steps': {type: 'number'}
			}
		}).delay('change:interval', function(){
			sendCommand('i'+this.toJSON().interval + '\n');
		}).on('change:half_step', function(){
			if(this.toJSON().half_step) {
				sendCommand('half_step');
			}else{
				sendCommand('full_step');
			}
		}).on('change:direction', function(){
			if(this.toJSON().direction){
				sendCommand('f');
			}else{
				sendCommand('r');
			}
		}).on('save', function(){
				sendCommand('x'+this.toJSON().steps);
		})
	},
	initialize: function() {
		this.setElement(render(this.template, {}));

	}
});