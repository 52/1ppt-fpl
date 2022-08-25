let status = "";

browser.storage.sync.get('status').then((res) => {
	status = res.status;

	// default is off
	if ( status == undefined ) {
		status = "off";
		browser.storage.sync.set({'status': 'off'});
	}

	if ( status == "on" ) {
		browser.browserAction.setIcon({"path": "icons/enabled-icon-48.png"});
		browser.browserAction.setTitle({title: "1PPT\nClick to turn off"});
	} else {
		browser.browserAction.setIcon({"path": "icons/disabled-icon-48.png"});
		browser.browserAction.setTitle({title: "1PPT\nClick to turn on"});
	}
});

browser.browserAction.onClicked.addListener(() => {

	browser.storage.sync.get('status').then((res) => {
		status = res.status;
		if (status == 'off') {
			browser.browserAction.setIcon({"path": "icons/enabled-icon-48.png"});
			browser.browserAction.setTitle({title: "1PPT\nClick to turn off"});
			browser.storage.sync.set({'status': 'on'});
			status = "on";
		} else {
			browser.browserAction.setIcon({"path": "icons/disabled-icon-48.png"});
			browser.browserAction.setTitle({title: "1PPT\nClick to turn on"});
			browser.storage.sync.set({'status': 'off'});
			status = "off";
		}
		
	    const gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});

	    gettingActiveTab.then((tabs) => {
	     	browser.tabs.sendMessage(tabs[0].id, {status: status});
	    });
	});


});


