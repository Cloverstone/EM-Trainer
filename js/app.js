contentManager = new RegionManager();
// sidebarManager = new RegionManager({el: '#sidebar_left'});
//menuManager = new RegionManager({el: '#menu'});
sidebarManager = new RegionManager({el: '#sidebar'});



pages.home = {load: function(){
	contentManager.show( new mainView());
	$('#form').berry({actions:false,attributes:{interval: 15},fields:{
			'interval': [3,4,5,6,7,8,9,10,15,100,200, 999]
		}
	}).delay('change:interval', function(){
		// debugger;
		// console.log('i'+this.toJSON().interval+'\n');
			chrome.serial.send(connectionId, convertStringToArrayBuffer('i'+this.toJSON().interval+'\n'), function(){})

	})
}}


mainView = Backbone.View.extend({
	// events: {
	// 	'click #start': function(){chrome.serial.send(connectionId, convertStringToArrayBuffer('f\n'), function(){})},
	// 	'click #stop': function(){}
	// },
	template: "main" ,
	initialize: function() {
		this.setElement(render(this.template));
	}
});




$('body').on('click', '[data-link]', function(e){
	e.preventDefault();
	var options=$(e.currentTarget).data('link').split('/')
	loadPage(options[0], options[1])
})

$('body').on('click', '[data-serial]', function(e){
	e.preventDefault();
	chrome.serial.send(connectionId, convertStringToArrayBuffer($(e.currentTarget).data('serial')+'\n'), function(){})

})



	// 	'click #start': function(){chrome.serial.send(connectionId, convertStringToArrayBuffer('f\n'), function(){})},


loadPage('home');