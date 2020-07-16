/** 
	Add click event listener for flashingMode
**/
document.getElementById('flashingMode').addEventListener('click', function(){ 
	  var isEnabled = document.getElementById('flashingMode').checked;
	  chrome.storage.sync.set({ "flashingMode": isEnabled });
}, false);

/** 
	Add click event listener for internalLinksType
**/
document.getElementById('internalLinksType').addEventListener('click', function(){ 
	  var isEnabled = document.getElementById('internalLinksType').checked;
	  chrome.storage.sync.set({ "internalLinksType": isEnabled });
}, false);

/** 
	Add click event listener for externalLinksType
**/
document.getElementById('externalLinksType').addEventListener('click', function(){ 
	  var isEnabled = document.getElementById('externalLinksType').checked;
	  chrome.storage.sync.set({ "externalLinksType": isEnabled });
}, false);


getSavedValue("flashingMode", function(data){
		
	if (data == undefined) {
		data = true;
	}

	document.getElementById('flashingMode').checked = data;
});

getSavedValue("externalLinksType", function(data){
		
	if (data == undefined) {
		data = true;
	}

	document.getElementById('externalLinksType').checked = data;
});

getSavedValue("internalLinksType", function(data){
		
	if (data == undefined) {
		data = true;
	}

	document.getElementById('internalLinksType').checked = data;
});