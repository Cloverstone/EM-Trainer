liveView = Backbone.View.extend({
	template: "live" ,
	initialize: function() {
		this.setElement(render(this.template, {lanes:this.collection} ));
	}
});

processString = function(results) {
  $('.sidebar-left-content').html(render('side', JSON.parse(results) ));
 //$('.sidebar-left-content').html('<center><h1>'+results+'</h1></center>');
}

var onConnect = function(connectionInfo) {
   // The serial port has been opened. Save its id to use later.
  connectionId = connectionInfo.connectionId;
  // Do whatever you need to do with the opened port.
  
      sendCommand('status');
}

var stringReceived = '';

var onReceiveCallback = function(info) {
    if (info.data) {
      // var str = convertArrayBufferToString(info.data);
      var str = String.fromCharCode.apply(null, new Uint8Array(info.data));
      if (str.charAt(str.length-1) === '\n') {
        stringReceived += str.substring(0, str.length-1);
        //onLineReceived(stringReceived);
        processString(stringReceived);
        stringReceived = '';
      } else {
        stringReceived += str;
      }
    }
  };

chrome.serial.onReceive.addListener(onReceiveCallback);

devices = [];
currentDevice = null;
var onGetDevices = function(ports) {
	devices = ['NONE'];
  for (var i=0; i<ports.length; i++) {
    devices.push(ports[i].path);
  }
  // $().berry({legend:'Choose Device',fields:[{label: false, name: 'port', choices: devices, type: 'radio' }]}).on('save', function(){
		// currentDevice = this.toJSON().port;
		// chrome.serial.connect(this.toJSON().port ,{},onConnect)
  //   sendCommand('status');
		// this.trigger('saved');
  // })
  $('#topbar').berry({actions:false, fields:[{label: false, name: 'port', choices: devices, type: 'select' }]}).on('change', function(){
    currentDevice = this.toJSON().port;
    debugger;
    if(currentDevice !== 'NONE'){
      chrome.serial.connect(this.toJSON().port ,{},onConnect)
    }else{
          chrome.serial.disconnect(connectionId, function(){});
    }
    this.trigger('saved');
  })
}
chrome.serial.getDevices(onGetDevices);




// globalModel = Backbone.Model.extend({
// 	schema:{
// 		Racer: {},
// 		Name: {},
// 		Number: {type: 'number'},
// 		Active: {type: 'checkbox', default: 'true'}
// 	},
// 	initialize: function(){
// 		this.bind('change', function(){ if(this.collection){ this.save(); }})
// 	},
// });

// globalCollection = Backbone.Collection.extend({
// 		chromeStorage: new Backbone.ChromeStorage("globals", "local"),
// 		model: globalModel,
// 		initialize: function(){
// 			this.on('add', function(model){ model.save(); });
// 		},
// });
