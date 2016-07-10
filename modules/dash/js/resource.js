Berry.btn.excite = {
		label: 'Take Reading',
		icon:'magnet',
		id: 'berry-submit',
		modifier: 'success col-sm-offset-4',
		click: function() {
			if(this.options.autoDestroy) {
				this.on('saved', this.destroy);
			}
			this.trigger('save');
		}
	};

dashView = Backbone.View.extend({
	// events: {
	// 	'click #new-meet': 'add'
	// },
	template: "dash" ,
	// childView: resultView,
	onShow: function(){
				$('#solonoid1.form').berry({actions:['excite', ''] ,attributes: {interval: 10},fields:{
				// 'Coil': {min:1, max:4, type: 'custom_radio', value: 1},
				// 'Direction': {type: 'switch', truestate: 'NORTH', falsestate: 'SOUTH'}
			}
		}).on('save', function(){
			// alert(this.toJSON().song);
			// sendCommand('play:'+this.toJSON().song);
			sendCommand('h');
		})


	},
	initialize: function() {
		this.setElement(render(this.template, {}));

	}
});