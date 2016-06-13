Berry.btn.excite = {
		label: 'Excite',
		icon:'wifi fa-rotate-90',
		id: 'berry-submit',
		modifier: 'success col-sm-offset-4',
		click: function() {
			if(this.options.autoDestroy) {
				this.on('saved', this.destroy);
			}
			this.trigger('save');
		}
	};

brushedView = Backbone.View.extend({
	// events: {
	// 	'click #new-meet': 'add'
	// },
	template: "brushed" ,
	// childView: resultView,
	onShow: function(){
				$('#solonoid1.form').berry({actions:['excite', ''] ,attributes: {interval: 10},fields:{
				// 'Coil': {min:1, max:4, type: 'custom_radio', value: 1},
				'Direction': {type: 'switch', truestate: 'NORTH', falsestate: 'SOUTH'}
			}
		}).on('save', function(){
			alert(this.toJSON().song);
			sendCommand('play:'+this.toJSON().song);
		})


	},
	initialize: function() {
		this.setElement(render(this.template, {}));

	}
});