contentManager = new RegionManager();
// sidebarManager = new RegionManager({el: '#sidebar_left'});
//menuManager = new RegionManager({el: '#menu'});

// var background = chrome.extension.getBackgroundPage();

addEventListener("unload", function (event) {
    // background.console.log(event.type);
    chrome.serial.disconnect(connectionId, function(){});
}, true);


sidebarManager = new RegionManager({el: '#sidebar'});
var sendCommand = function(command){
	stringReceived = "";
		chrome.serial.send(connectionId, convertStringToArrayBuffer(command+'\n'), function(){})
}

pages.home = {load: function(){
	contentManager.show( new mainView());
	
	Mousetrap.bind('1', function() { sendCommand('on1'); });
	Mousetrap.bind('1', function() { sendCommand('off1'); }, 'keyup');

	Mousetrap.bind('2', function() { sendCommand('on2'); });
	Mousetrap.bind('2', function() { sendCommand('off2'); }, 'keyup');

	Mousetrap.bind('3', function() { sendCommand('on3'); });
	Mousetrap.bind('3', function() { sendCommand('off3'); }, 'keyup');


	Mousetrap.bind('4', function() { sendCommand('on4'); });
	Mousetrap.bind('9', function() { sendCommand('on4'); });
	Mousetrap.bind('4', function() { sendCommand('off4'); }, 'keyup');

	Mousetrap.bind('0', function() { chrome.serial.disconnect(connectionId, function (){


		chrome.serial.getDevices(onGetDevices);
	}) }, 'keyup');

	

}}



pages.stepper = {load: function(){
		contentManager.show( new stepperView());	
}}
pages.speaker = {load: function(){
		contentManager.show( new speakerView());	

		Mousetrap.bind('a', function() { sendCommand('note0262'); });
		Mousetrap.bind('s', function() { sendCommand('note0294'); });
		Mousetrap.bind('d', function() { sendCommand('note0330'); });
		Mousetrap.bind('f', function() { sendCommand('note0349'); });
		Mousetrap.bind('g', function() { sendCommand('note0392'); });
		Mousetrap.bind('h', function() { sendCommand('note0440'); });
		Mousetrap.bind('j', function() { sendCommand('note0494'); });
		Mousetrap.bind('k', function() { sendCommand('note0523'); });

		Mousetrap.bind('a', function() { sendCommand('noteoff'); }, 'keyup');
		Mousetrap.bind('s', function() { sendCommand('noteoff'); }, 'keyup');
		Mousetrap.bind('d', function() { sendCommand('noteoff'); }, 'keyup');
		Mousetrap.bind('f', function() { sendCommand('noteoff'); }, 'keyup');
		Mousetrap.bind('g', function() { sendCommand('noteoff'); }, 'keyup');
		Mousetrap.bind('h', function() { sendCommand('noteoff'); }, 'keyup');
		Mousetrap.bind('j', function() { sendCommand('noteoff'); }, 'keyup');
		Mousetrap.bind('k', function() { sendCommand('noteoff'); }, 'keyup');



}}
pages.solenoid = {load: function(){
		contentManager.show( new solenoidView());	
}}
pages.meter = {load: function(){
		contentManager.show( new meterView());	
}}

pages.brushed = {load: function(){
		contentManager.show( new brushedView());	
}}


pages.relay = {load: function(){
		contentManager.show( new relayView());	
}}

pages.dash = {load: function(){
		contentManager.show( new dashView());	
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
