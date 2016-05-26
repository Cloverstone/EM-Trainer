Berry.btn.play = {
		label: 'Play',
		icon:'play',
		id: 'berry-submit',
		modifier: 'success col-sm-offset-4',
		click: function() {
			if(this.options.autoDestroy) {
				this.on('saved', this.destroy);
			}
			this.trigger('save');
		}
	};

speakerView = Backbone.View.extend({
	// events: {
	// 	'click #new-meet': 'add'
	// },
	template: "speaker" ,
	// childView: resultView,
	onShow: function(){
				$('.form').berry({actions:['play', ''] ,attributes: {interval: 10},fields:{
				'Coil': {min:1, max:4, type: 'custom_radio', value: 1},
				'Song': {required: true, options:[{label: 'Mario', value: 0}, {label:' Mario UnderWorld', value: 1}, {label: 'Shave and a Haircut', value: 2}, {label:'Bond', value: 0},{label: 'Mukkathe Penne', value: 0} ], value_key: 'index', type: 'custom_radio'},

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