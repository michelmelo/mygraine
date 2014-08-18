function addForm(_args){
	
	var addTableData = [];
	var weatherTableData = [];
	var startDateField;
	var cityLabel;
    var tempLabel;
    var tempTextLabel;
    var humidityLabel;
    var pressureLabel;
    var fontFamilyVar = 'Source Sans Pro';
    var fontSizeVar ='16';
    var tabbar = _args.tabbar;
	var userid = Ti.App.Properties.getString('userid');
	var domain = Ti.App.Properties.getString('domain');
	var loadingWindow = require('/ui/handheld/loadingWindow');
	var migraineid = _args.migraineid;
	var containingTab = _args.containingTab;
	var parentObject = this;
	var locationsField;
	var locationsCountLabel;
	var triggersCountLabel;
	var notesField;
	var migraineid = _args.migraineid;
	var selectedSeverityValue;
	var parentObject = _args.parentObject;
	
	var self = Ti.UI.createWindow(ef.combine($$.tabWindow,{
		titleControl:Ti.UI.createLabel({
			text:'Migraine',
			color:'#FFF',
			font:{
				fontSize:18,
				fontFamily:fontFamilyVar
			}
		}),
		fullscreen:false,
		navBarHidden:false,
		backgroundColor:'#d7d6d5'
	}));
	
	var mainContainerView = Ti.UI.createScrollView({
	  	width:Ti.UI.FILL,
	  	height:Ti.UI.FILL,
	  	top:0,
	  	layout:'vertical',
	  	contentWidth: 'auto',
  		contentHeight: 'auto',
  		showVerticalScrollIndicator: true,
  		showHorizontalScrollIndicator: false
	});

	self.add(mainContainerView);
	
	var saveButton = Titanium.UI.createButton({
		title:'Save',
		color:'#FFF',
		backgroundImage: 'none',
		font:{
			fontSize:18,
			fontFamily:fontFamilyVar
		}
	});
	
	self.setRightNavButton(saveButton);
	
	saveButton.addEventListener('click', function(e) {
		var saveURL = "http://"+domain+"/model/mobile/services/migraines.cfc?method=editMigraine";
		var saveData = {
		    userid: userid,
		    migraineid: migraineid,
		    startdatetime: startDateField.value,
		    enddatetime: endDateField.value,
		    severity: selectedSeverityValue,
		    locations: locationsField.value,
		    triggers: triggersField.value,
		    notes:notesField.value,
		    w_city: cityField.value,
			w_condition: conditionField.value,
			w_temperature: tempField.value,
			w_humidity: humidityField.value,
			w_pressure: pressureField.value
		};
		
		var	callLoadingWindow = new loadingWindow();
			callLoadingWindow.open();
			
		var xhr = Ti.Network.createHTTPClient({
			enableKeepAlive:false,
	    	onload: function() {
	    		
				var json = JSON.parse(this.responseText);
				var migraine = json.MIGRAINEINFO[0];
				var	migraineid = migraine.ID;

				//startDateTimePickerView.animate(slideUp);
				
				self.close();
				
				if(parentObject){
					parentObject.loadHistory();
				}
				
				callLoadingWindow.close();
	    	},
	    	onerror: function(e) {
	    		alert("STATUS: " + this.status);
		    	alert("TEXT:   " + this.responseText);
		    	alert("ERROR:  " + e.error);
		    	
		    	callLoadingWindow.close();
	    	},
	    	timeout:999999
	    });
	    //xhr.setRequestHeader("ContentType", "image/jpeg");
		//xhr.setRequestHeader("enctype","multipart/form-data");
	    xhr.open("GET", saveURL);
		xhr.send(saveData);
		
	});
	
	var slideLoadingDown = Ti.UI.createAnimation({
		top:0,
		duration:200
	});
	
	var slideLoadingUp = Ti.UI.createAnimation({
		top:-54,
		duration:200
	});
	
	var loadingView = Ti.UI.createView({
	  	backgroundColor:'#00BFFF',
	  	width:Ti.UI.FILL,
	  	height:54,
	  	top:-54,
	  	zIndex:3
	});
	
	var bottomBorderView = Ti.UI.createView({
	  	backgroundColor:'#CCC',
	  	width:Ti.UI.FILL,
	  	height:1,
	  	bottom:0
	});
	
	var loadingActivityIndicator = Ti.UI.createActivityIndicator({
		style:Ti.UI.iPhone.ActivityIndicatorStyle.PLAIN,
		color:'#FFF',
		height:Ti.UI.SIZE,
		width:Ti.UI.SIZE,
		message:'Loading your weather data...',
		font:{
			fontSize:fontSizeVar,
			fontFamily:fontFamilyVar
		}
	});
	
	loadingActivityIndicator.show();
	
	loadingView.add(loadingActivityIndicator);
	loadingView.add(bottomBorderView);
	
	self.add(loadingView);
	
	var startDateTimePickerView = Titanium.UI.createView({
		width:Ti.UI.FILL,
		height:251,
		bottom:-251,
		layout:'vertical',
		zIndex:2
	});
	
	var startDateTimePicker = Ti.UI.createPicker({
		selectionIndicator : true,
		type: Ti.UI.PICKER_TYPE_DATE_AND_TIME,
		bottom:0
	});
	
	var slideUp =  Titanium.UI.createAnimation({bottom:0,duration:300});
	var slideDown =  Titanium.UI.createAnimation({bottom:-251,duration:300});
	
	var space = Ti.UI.createButton({
		systemButton:Ti.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});
	
	var done = Ti.UI.createButton({
		systemButton:Ti.UI.iPhone.SystemButton.DONE,
		width:20
	});
	
	done.addEventListener('click', function() {
		startDateTimePickerView.animate(slideDown);
	});
	
	var startDateTimeToolbar = Ti.UI.iOS.createToolbar({
		items:[space,done],
		width:Ti.UI.FILL,
		height:43,
		backgroundColor:'#bbb'
	});
	
	startDateTimePickerView.add(startDateTimeToolbar);
	startDateTimePickerView.add(startDateTimePicker);
	
	self.add(startDateTimePickerView);
	
	startDateTimePicker.addEventListener('change', function(e) {
		var pickerdatetime = e.value;
	    var day = parseInt(pickerdatetime.getDate());
	    var month = parseInt(pickerdatetime.getMonth())+1;
	    var year = pickerdatetime.getFullYear();
	    var hours = parseInt(pickerdatetime.getHours());
        var minutes = parseInt(pickerdatetime.getMinutes());
        var AMPM = ((pickerdatetime.getHours()>12)?('PM'):'AM');
        if(hours > 12){
        	hours = hours-12;
        }
        if(hours < 10){
        	hours = '0' + hours;
        }
        if(minutes < 10){
        	minutes = '0' + minutes;
        }
	    var newdate = month + "/" + day + "/" + year + ' ' + hours + ':' + minutes + ' ' + AMPM;
	    
		startDateField.value = newdate;
	});
	
	var endDateTimePickerView = Titanium.UI.createView({
		width:Ti.UI.FILL,
		height:251,
		bottom:-251,
		layout:'vertical',
		zIndex:2
	});
	
	var endDateTimePicker = Ti.UI.createPicker({
		selectionIndicator : true,
		type: Ti.UI.PICKER_TYPE_DATE_AND_TIME,
		bottom:0
	});
	
	var slideUp =  Titanium.UI.createAnimation({bottom:0,duration:300});
	var slideDown =  Titanium.UI.createAnimation({bottom:-251,duration:300});
	
	var space = Ti.UI.createButton({
		systemButton:Ti.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});
	
	var endDone = Ti.UI.createButton({
		systemButton:Ti.UI.iPhone.SystemButton.DONE,
		width:20
	});
	
	endDone.addEventListener('click', function() {
		endDateTimePickerView.animate(slideDown);
	});
	
	var endDateTimeToolbar = Ti.UI.iOS.createToolbar({
		items:[space,endDone],
		width:Ti.UI.FILL,
		height:43,
		backgroundColor:'#bbb'
	});
	
	endDateTimePickerView.add(endDateTimeToolbar);
	endDateTimePickerView.add(endDateTimePicker);
	
	self.add(endDateTimePickerView);
	
	endDateTimePicker.addEventListener('change', function(e) {
		var pickerdatetime = e.value;
	    var day = parseInt(pickerdatetime.getDate());
	    var month = parseInt(pickerdatetime.getMonth())+1;
	    var year = pickerdatetime.getFullYear();
	    var hours = parseInt(pickerdatetime.getHours());
        var minutes = parseInt(pickerdatetime.getMinutes());
        var AMPM = ((pickerdatetime.getHours()>12)?('PM'):'AM');
        if(hours > 12){
        	hours = hours-12;
        }
        if(hours < 10){
        	hours = '0' + hours;
        }
        if(minutes < 10){
        	minutes = '0' + minutes;
        }
	    var newdate = month + "/" + day + "/" + year + ' ' + hours + ':' + minutes + ' ' + AMPM;
	    
		endDateField.value = newdate;
	});
	
	var addTable = Ti.UI.createTableView({
		width:Ti.UI.FILL,
		height:Ti.UI.SIZE,
		top:8,
		right:8,
		left:8,
		borderWidth:1,
		borderColor:'#CCC',
		borderRadius:2,
		data:addTableData,
		selectionStyle:'NONE',
		scrollable:false
	});
	
	addTable.footerView = Ti.UI.createView({
    	height: 1,
   		backgroundColor: 'transparent'
	});
	
	mainContainerView.add(addTable);

	function populateAddTable(json){
		
		migraine = json.MIGRAINE[0];

		var sectionView = Ti.UI.createView({
			backgroundColor:'#F5F5F5',
			height:24
		});
		
		var sectionLabel = Titanium.UI.createLabel({
		    text: 'Migraine Info',
		    left: 15,
		    height:24,
		    font:{
		    	fontSize:fontSizeVar,
		    	fontFamily:fontFamilyVar
		    },
		    color:'#595959'
		});
		
		sectionView.add(sectionLabel);
		
		var section = Ti.UI.createTableViewSection({
			headerView:sectionView,
			hasChild:false,
			height:24
		});
		
		addTableData.push(section);
		
		var row = Ti.UI.createTableViewRow({
			title:'',
			hasChild:false,
			font:{
				fontFamily:fontFamilyVar,
				fontSize:12
			}
		});
		
		var fieldLabel = Titanium.UI.createLabel(ef.combine($$.settingsLabel,{
		    text: 'Start',
		    left: 15,
		    height:54
		}));
		
		startDateField = Ti.UI.createTextField(ef.combine($$.settingsField,{
		    left: 100,
		    right: 10,
		    hintText: 'Start',
		    textAlign: 'right',
		    borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
		    height:54,
		    autocorrect:false,
		    bubbleParent: false,
		    value:migraine.STARTDATETIME
		}));
		
		startDateTimePicker.value = new Date(migraine.STARTDATETIME);
		endDateTimePicker.value = new Date(migraine.ENDDATETIME);
		
		startDateField.addEventListener('focus', function(e) {
			startDateField.blur();
			endDateTimePickerView.animate(slideDown);
			startDateTimePickerView.animate(slideUp);
			var pickerdatetime = startDateTimePicker.value;
		    var day = parseInt(pickerdatetime.getDate());
		    var month = parseInt(pickerdatetime.getMonth())+1;
		    var year = pickerdatetime.getFullYear();
		    var hours = parseInt(pickerdatetime.getHours());
	        var minutes = parseInt(pickerdatetime.getMinutes());
	        var AMPM = ((pickerdatetime.getHours()>12)?('PM'):'AM');
	        if(AMPM == 'AM'){
	        	hours = hours + 12;
	        }
	        if(hours > 12){
	        	hours = hours-12;
	        }
	        if(hours < 10){
	        	hours = '0' + hours;
	        }
	        if(minutes < 10){
	        	minutes = '0' + minutes;
	        }
		    var newdate = month + "/" + day + "/" + year + ' ' + hours + ':' + minutes + ' ' + AMPM;
		    
			startDateField.value = newdate;
		});
		
		/*setTimeout(function(e){
			startDateField.focus();
		},300);*/
		
		row.add(fieldLabel);
		row.add(startDateField);
		
		addTableData.push(row);
		
		var row = Ti.UI.createTableViewRow({
			title:'',
			hasChild:false
		});
		
		var fieldLabel = Titanium.UI.createLabel(ef.combine($$.settingsLabel,{
		    text: 'End',
		    left: 15,
		    height:54
		}));
		
		endDateField = Ti.UI.createTextField(ef.combine($$.settingsField,{
		    left: 100,
		    right: 10,
		    hintText: 'End',
		    textAlign: 'right',
		    borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
		    height:54,
		    autocorrect:false,
		    bubbleParent: false,
		    value:migraine.ENDDATETIME
		}));
		
		endDateField.addEventListener('focus', function(e) {
			endDateField.blur();
			startDateTimePickerView.animate(slideDown);
			endDateTimePickerView.animate(slideUp);
			var pickerdatetime = endDateTimePicker.value;
		    var day = parseInt(pickerdatetime.getDate());
		    var month = parseInt(pickerdatetime.getMonth())+1;
		    var year = pickerdatetime.getFullYear();
		    var hours = parseInt(pickerdatetime.getHours());
	        var minutes = parseInt(pickerdatetime.getMinutes());
	        var AMPM = ((pickerdatetime.getHours()>12)?('PM'):'AM');
	        if(AMPM == 'AM'){
	        	hours = hours + 12;
	        }
	        if(hours > 12){
	        	hours = hours-12;
	        }
	        if(hours < 10){
	        	hours = '0' + hours;
	        }
	        if(minutes < 10){
	        	minutes = '0' + minutes;
	        }
		    var newdate = month + "/" + day + "/" + year + ' ' + hours + ':' + minutes + ' ' + AMPM;
		    
			endDateField.value = newdate;
		});
		
		row.add(fieldLabel);
		row.add(endDateField);
		
		addTableData.push(row);
		
		var row = Ti.UI.createTableViewRow({
			title:'',
			hasChild:false,
			backgroundColor:'#FFF',
			layout:'vertical'
		});
		
		var fieldLabel = Titanium.UI.createLabel(ef.combine($$.settingsLabel,{
		    text: 'Severity',
		    left: 15,
		    height:34
		}));
		
		row.add(fieldLabel);
		
		var rowView = Ti.UI.createView({
			width:Ti.UI.SIZE,
			height:100,
			layout:'horizontal',
			top:10
		});
		
		for(i=0;i<4;i++){
			if(i==3){
				var rightVar = 2;
			}
			else{
				var rightVar = 0;
			}
			
			var containerView = Ti.UI.createView({
				width:Ti.UI.SIZE,
				height:100,
				top:0,
				layout:'vertical'	
			});
			
			if(i==0){
				var textVar = 'Mild';
				var circleColor = '#0F0';
				circleView1 = Titanium.UI.createButton({
					width:70,
					height:70,
					borderRadius:35,
					borderWidth:1,
					borderColor:'#CCC',
					left:2,
					right:rightVar,
					top:2,
					bottom:2,
					backgroundColor:'#F5F5F5',
					severityID:i+1,
					title:i+1,
					font:{
				    	fontSize:24,
						fontFamily:fontFamilyVar
				   	},
				   	color:'#000'
				});
				
				circleView1.addEventListener('touchend', function(e) {
					circleView2.backgroundColor = '#F5F5F5';
					circleView3.backgroundColor = '#F5F5F5';
					circleView4.backgroundColor = '#F5F5F5';
					var circleColor = '#0F0';
					circleView1.backgroundColor = circleColor;
					selectedSeverityValue = 1;
				});
				
				var severityNumberLabel = Titanium.UI.createLabel(ef.combine($$.settingsLabel,{
			    	text:i+1,
				    font:{
				    	fontSize:24,
						fontFamily:fontFamilyVar
				    }
				}));
				
				//circleView.add(severityNumberLabel);
				
				var severityLabel = Titanium.UI.createLabel(ef.combine($$.settingsLabel,{
			    	text:textVar,
				    font:{
				    	fontSize:12,
						fontFamily:fontFamilyVar
				    }
				}));
			
				containerView.add(circleView1);
				containerView.add(severityLabel);
			}
			else if(i==1){
				var textVar = 'Moderate';
				var circleColor = '#FF0';
				circleView2 = Titanium.UI.createButton({
					width:70,
					height:70,
					borderRadius:35,
					borderWidth:1,
					borderColor:'#CCC',
					left:2,
					right:rightVar,
					top:2,
					bottom:2,
					backgroundColor:'#F5F5F5',
					severityID:i+1,
					title:i+1,
					font:{
				    	fontSize:24,
						fontFamily:fontFamilyVar
				   	},
				   	color:'#000'
				});
				
				circleView2.addEventListener('touchend', function(e) {
					circleView1.backgroundColor = '#F5F5F5';
					circleView3.backgroundColor = '#F5F5F5';
					circleView4.backgroundColor = '#F5F5F5';
					var circleColor = '#FF0';
					this.backgroundColor = circleColor;
					selectedSeverityValue = 2;
				});
				
				var severityNumberLabel = Titanium.UI.createLabel(ef.combine($$.settingsLabel,{
			    	text:i+1,
				    font:{
				    	fontSize:24,
						fontFamily:fontFamilyVar
				    }
				}));
				
				//circleView.add(severityNumberLabel);
				
				var severityLabel = Titanium.UI.createLabel(ef.combine($$.settingsLabel,{
			    	text:textVar,
				    font:{
				    	fontSize:12,
						fontFamily:fontFamilyVar
				    }
				}));
			
				containerView.add(circleView2);
				containerView.add(severityLabel);
			}
			else if(i==2){
				var textVar = 'Severe';
				var circleColor = '#FF8300';
				circleView3 = Titanium.UI.createButton({
					width:70,
					height:70,
					borderRadius:35,
					borderWidth:1,
					borderColor:'#CCC',
					left:2,
					right:rightVar,
					top:2,
					bottom:2,
					backgroundColor:'#F5F5F5',
					severityID:i+1,
					title:i+1,
					font:{
				    	fontSize:24,
						fontFamily:fontFamilyVar
				   	},
				   	color:'#000'
				});
				
				circleView3.addEventListener('touchend', function(e) {
					circleView1.backgroundColor = '#F5F5F5';
					circleView2.backgroundColor = '#F5F5F5';
					circleView4.backgroundColor = '#F5F5F5';
					var circleColor = '#FF8300';
					this.backgroundColor = circleColor;
					selectedSeverityValue = 3;
				});
				
				var severityNumberLabel = Titanium.UI.createLabel(ef.combine($$.settingsLabel,{
			    	text:i+1,
				    font:{
				    	fontSize:24,
						fontFamily:fontFamilyVar
				    }
				}));
				
				//circleView.add(severityNumberLabel);
				
				var severityLabel = Titanium.UI.createLabel(ef.combine($$.settingsLabel,{
			    	text:textVar,
				    font:{
				    	fontSize:12,
						fontFamily:fontFamilyVar
				    }
				}));
			
				containerView.add(circleView3);
				containerView.add(severityLabel);
			}
			else{
				var textVar = 'Very Severe';
				var circleColor = '#F00';
				circleView4 = Titanium.UI.createButton({
					width:70,
					height:70,
					borderRadius:35,
					borderWidth:1,
					borderColor:'#CCC',
					left:2,
					right:rightVar,
					top:2,
					bottom:2,
					backgroundColor:'#F5F5F5',
					severityID:i+1,
					title:i+1,
					font:{
				    	fontSize:24,
						fontFamily:fontFamilyVar
				   	},
				   	color:'#000'
				});
				
				circleView4.addEventListener('touchend', function(e) {
					circleView1.backgroundColor = '#F5F5F5';
					circleView2.backgroundColor = '#F5F5F5';
					circleView3.backgroundColor = '#F5F5F5';
					var circleColor = '#F00';
					this.backgroundColor = circleColor;
					selectedSeverityValue = 4;
				});
				
				var severityNumberLabel = Titanium.UI.createLabel(ef.combine($$.settingsLabel,{
			    	text:i+1,
				    font:{
				    	fontSize:24,
						fontFamily:fontFamilyVar
				    }
				}));
				
				//circleView.add(severityNumberLabel);
				
				var severityLabel = Titanium.UI.createLabel(ef.combine($$.settingsLabel,{
			    	text:textVar,
				    font:{
				    	fontSize:12,
						fontFamily:fontFamilyVar
				    }
				}));
			
				containerView.add(circleView4);
				containerView.add(severityLabel);
			}
			
			rowView.add(containerView);
			
		}
		
		row.add(rowView);
		
		addTableData.push(row);
		
		if(migraine.SEVERITY == 1){
			circleView2.backgroundColor = '#F5F5F5';
			circleView3.backgroundColor = '#F5F5F5';
			circleView4.backgroundColor = '#F5F5F5';
			var circleColor = '#0F0';
			circleView1.backgroundColor = circleColor;
			selectedSeverityValue = 1;
		}
		else if(migraine.SEVERITY == 2){
			circleView1.backgroundColor = '#F5F5F5';
			circleView3.backgroundColor = '#F5F5F5';
			circleView4.backgroundColor = '#F5F5F5';
			var circleColor = '#FF0';
			circleView2.backgroundColor = circleColor;
			selectedSeverityValue = 2;
		}
		else if(migraine.SEVERITY == 3){
			circleView1.backgroundColor = '#F5F5F5';
			circleView2.backgroundColor = '#F5F5F5';
			circleView4.backgroundColor = '#F5F5F5';
			var circleColor = '#FF8300';
			circleView3.backgroundColor = circleColor;
			selectedSeverityValue = 3;
		}
		else if(migraine.SEVERITY == 4){
			circleView1.backgroundColor = '#F5F5F5';
			circleView2.backgroundColor = '#F5F5F5';
			circleView3.backgroundColor = '#F5F5F5';
			var circleColor = '#F00';
			circleView4.backgroundColor = circleColor;
			selectedSeverityValue = 4;
		}
		
		var painRow = Ti.UI.createTableViewRow({
			title:'',
			hasChild:true
		});
		
		var fieldLabel = Titanium.UI.createLabel(ef.combine($$.settingsLabel,{
		    text: 'Location of Pain',
		    left: 15,
		    height:54
		}));
		
		painRow.add(fieldLabel);
		
		painRow.addEventListener('click', function() {
			var painLocationsWindow = require('/ui/handheld/home/painLocations');
			var callPainLocationsWindow = new painLocationsWindow({parentObject:parentObject,preSelectedValues:locationsField.value});
			containingTab.open(callPainLocationsWindow);
		});
		
		locationsField = Ti.UI.createTextField({
			value:migraine.LOCATIONS
		});
		
		if(migraine.LOCATIONS.length == 0){
			var locationLabelCount = 0;	
		}
		else{
			var locationLabelCount = migraine.LOCATIONS.split(",").length;
		}
		
		locationsCountLabel = Ti.UI.createLabel(ef.combine($$.settingsLabel,{
			text:locationLabelCount,
			right:10
		}));
		
		painRow.add(locationsCountLabel);
		
		addTableData.push(painRow);
		
		var triggersRow = Ti.UI.createTableViewRow({
			title:'',
			hasChild:true
		});
		
		var fieldLabel = Titanium.UI.createLabel(ef.combine($$.settingsLabel,{
		    text: 'Triggers',
		    left: 15,
		    height:54
		}));
		
		triggersRow.add(fieldLabel);
		
		triggersRow.addEventListener('click', function() {
			var triggersWindow = require('/ui/handheld/home/triggers');
			var callTriggersWindow = new triggersWindow({parentObject:parentObject,preSelectedValues:triggersField.value});
			containingTab.open(callTriggersWindow);
		});
		
		triggersField = Ti.UI.createTextField({
			value:migraine.TRIGGERS
		});
		
		if(migraine.TRIGGERS.length == 0){
			var triggerLabelCount = 0;	
		}
		else{
			var triggerLabelCount = migraine.TRIGGERS.split(",").length;
		}
		
		triggersCountLabel = Ti.UI.createLabel(ef.combine($$.settingsLabel,{
			text:triggerLabelCount,
			right:10
		}));
		
		triggersRow.add(triggersCountLabel);
		
		addTableData.push(triggersRow);
		
		var notesRow = Ti.UI.createTableViewRow({
			title:'',
			hasChild:false
		});

		if(migraine.NOTES != '' && migraine.NOTES != 'Notes' && migraine.NOTES != null) {
			var notesVar = migraine.NOTES;
		}
		else {
			var notesVar = 'Notes';
		}
		
		notesField = Titanium.UI.createTextArea(ef.combine($$.settingsLabel,{
		    textAlign:'left',
		  	value:notesVar,
		  	width:Ti.UI.FILL,
		  	height:108,
		  	left:10,
		  	returnKeyType:Ti.UI.RETURNKEY_DONE
		}));
		
		notesRow.add(notesField);
		
		addTableData.push(notesRow);
		
		addTable.setData(addTableData);
		
		var sectionView = Ti.UI.createView({
			backgroundColor:'#F5F5F5',
			height:24
		});
	
		var sectionLabel = Titanium.UI.createLabel({
		    text: 'Weather Info',
		    left: 15,
		    height:24,
		    font:{
		    	fontSize:fontSizeVar,
		    	fontFamily:fontFamilyVar
		    },
		    color:'#595959'
		});
		
		sectionView.add(sectionLabel);
		
		var section = Ti.UI.createTableViewSection({
			headerView:sectionView,
			hasChild:false,
			height:24
		});
		
		weatherTableData.push(section);
		
		var row = Ti.UI.createTableViewRow({
			title:'',
			hasChild:false,
			font:{
				fontFamily:fontFamilyVar,
				fontSize:12
			}
		});
		
		var fieldLabel = Titanium.UI.createLabel(ef.combine($$.settingsLabel,{
		    text: 'City',
		    left: 15,
		    height:54
		}));
		
		cityField = Ti.UI.createTextField(ef.combine($$.settingsField,{
		    left: 100,
		    right: 10,
		    hintText: 'City',
		    textAlign: 'right',
		    borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
		    height:54,
		    autocorrect:false,
		    bubbleParent: false,
		    returnKeyType:Titanium.UI.RETURNKEY_DONE,
		    value:migraine.CITY
		}));
		
		row.add(fieldLabel);
		row.add(cityField);
		
		weatherTableData.push(row);
		
		var row = Ti.UI.createTableViewRow({
			title:'',
			hasChild:false,
			font:{
				fontFamily:fontFamilyVar,
				fontSize:12
			}
		});
		
		var fieldLabel = Titanium.UI.createLabel(ef.combine($$.settingsLabel,{
		    text: 'Condition',
		    left: 15,
		    height:54
		}));
		
		conditionField = Ti.UI.createTextField(ef.combine($$.settingsField,{
		    left: 100,
		    right: 10,
		    hintText: 'Condition',
		    textAlign: 'right',
		    borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
		    height:54,
		    autocorrect:false,
		    bubbleParent: false,
		    returnKeyType:Titanium.UI.RETURNKEY_DONE,
		    value:migraine.CONDITION
		}));
		
		row.add(fieldLabel);
		row.add(conditionField);
		
		weatherTableData.push(row);
		
		var row = Ti.UI.createTableViewRow({
			title:'',
			hasChild:false,
			font:{
				fontFamily:fontFamilyVar,
				fontSize:12
			}
		});
		
		var fieldLabel = Titanium.UI.createLabel(ef.combine($$.settingsLabel,{
		    text: 'Temperature',
		    left: 15,
		    height:54
		}));
		
		tempField = Ti.UI.createTextField(ef.combine($$.settingsField,{
		    left: 100,
		    right: 10,
		    hintText: 'Temperature',
		    textAlign: 'right',
		    borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
		    height:54,
		    autocorrect:false,
		    bubbleParent: false,
		    returnKeyType:Titanium.UI.RETURNKEY_DONE,
		    value:migraine.TEMPERATURE
		}));
		
		row.add(fieldLabel);
		row.add(tempField);
		
		weatherTableData.push(row);
		
		var row = Ti.UI.createTableViewRow({
			title:'',
			hasChild:false,
			font:{
				fontFamily:fontFamilyVar,
				fontSize:12
			}
		});
		
		var fieldLabel = Titanium.UI.createLabel(ef.combine($$.settingsLabel,{
		    text: 'Humidity',
		    left: 15,
		    height:54
		}));
		
		humidityField = Ti.UI.createTextField(ef.combine($$.settingsField,{
		    left: 100,
		    right: 10,
		    hintText: 'Humidity',
		    textAlign: 'right',
		    borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
		    height:54,
		    autocorrect:false,
		    bubbleParent: false,
		    returnKeyType:Titanium.UI.RETURNKEY_DONE,
		    value:migraine.HUMIDITY
		}));
		
		row.add(fieldLabel);
		row.add(humidityField);
		
		weatherTableData.push(row);
		
		var row = Ti.UI.createTableViewRow({
			title:'',
			hasChild:false,
			font:{
				fontFamily:fontFamilyVar,
				fontSize:12
			}
		});
		
		var fieldLabel = Titanium.UI.createLabel(ef.combine($$.settingsLabel,{
		    text: 'Pressure',
		    left: 15,
		    height:54
		}));
		
		pressureField = Ti.UI.createTextField(ef.combine($$.settingsField,{
		    left: 100,
		    right: 10,
		    hintText: 'Pressure',
		    textAlign: 'right',
		    borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
		    height:54,
		    autocorrect:false,
		    bubbleParent: false,
		    returnKeyType:Titanium.UI.RETURNKEY_DONE,
		    value:migraine.PRESSURE
		}));
		
		row.add(fieldLabel);
		row.add(pressureField);
		
		weatherTableData.push(row);
		
		weatherTable.setData(weatherTableData);
	}
	
	var weatherTable = Ti.UI.createTableView({
		width:Ti.UI.FILL,
		height:Ti.UI.SIZE,
		top:8,
		right:8,
		left:8,
		bottom:8,
		borderWidth:1,
		borderColor:'#CCC',
		borderRadius:2,
		data:weatherTableData,
		selectionStyle:'NONE',
		scrollable:false
	});
	
	weatherTable.footerView = Ti.UI.createView({
    	height: 1,
   		backgroundColor: 'transparent'
	});
	
	mainContainerView.add(weatherTable);
	
	function loadMigraine(){
		json = '';
		medsTableData = [];
		
		var loadURL = "http://"+domain+"/model/mobile/services/migraines.cfc?method=getMigraineDetails";
		var loadData = {
			userid: userid,
			migraineid: migraineid
		};
		
		var	callLoadingWindow = new loadingWindow();
			callLoadingWindow.open();
			
		var xhr = Ti.Network.createHTTPClient({
	    	onload: function() {
	    		var json = JSON.parse(this.responseText);
	    		Ti.API.info(json);
				populateAddTable(json);

				callLoadingWindow.close();
			},
	    	onerror: function(e) {
	    		Ti.API.info("STATUS: " + this.status);
		    	Ti.API.info("TEXT:   " + this.responseText);
		    	Ti.API.info("ERROR:  " + e.error);
		    	callLoadingWindow.close();
	    	},
	    	timeout:5000
	    });
	    
	    xhr.open("GET", loadURL);
		xhr.send(loadData);
	
	}
	
	function populateLocations(selectedValues){
		locationsField.value = selectedValues;
		locationsCountLabel.text = selectedValues.length;
	}
	
	this.populateLocations = function(selectedValues){
		populateLocations(selectedValues);
	};
	
	function populateTriggers(selectedValues){
		triggersField.value = selectedValues;
		triggersCountLabel.text = selectedValues.length;
	}
	
	this.populateTriggers = function(selectedValues){
		populateTriggers(selectedValues);
	};
	
	self.addEventListener('open', function(e) {
		loadMigraine();
	});
	
	return self;
};

module.exports = addForm;