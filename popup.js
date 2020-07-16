/**
	Add Dom loaded event listener
**/
document.addEventListener('DOMContentLoaded', function(){ 
    var toggler = document.getElementsByClassName("caret");
	var i;

	for (i = 0; i < toggler.length; i++) {
	  toggler[i].addEventListener("click", function() {
	    this.parentElement.querySelector(".nested").classList.toggle("active");
	    this.classList.toggle("caret-down");
	  });
	}

	chrome.storage.sync.get("isEnabled", function(items) {
		document.getElementById('onoffswitch').checked = items.isEnabled; 
		manageExtensionState(items.isEnabled);       
    });

}, false)


/** 
	Add click event listener for switch
**/
document.getElementById('onoffswitch').addEventListener('click', function(){ 
	  var isEnabled = document.getElementById('onoffswitch').checked;
	  manageExtensionState(isEnabled);
}, false);


function manageExtensionState(isEnabled) {
	if (isEnabled) {
		document.getElementById('tree').style.display = "block";
		
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		    chrome.tabs.sendMessage(tabs[0].id, {type:"enableExtension"}, function(response){ 
		    	refreshPopupInfo();  	                  
		    });
		});
	}
	else {
		document.getElementById('tree').style.display = "none";	
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		    chrome.tabs.sendMessage(tabs[0].id, {type:"disableExtension"}, function(response){   	                  
		    });
		});
	}  

    chrome.storage.sync.set({'isEnabled': isEnabled}, function() {});
}


/**
	Get data from content script running on page
**/
function refreshPopupInfo() {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	    chrome.tabs.sendMessage(tabs[0].id, {type:"getDomInfo"}, function(response){   
	        document.getElementById('allLinks').innerHTML = response['allLinksCount'];        
	        document.getElementById('noFollowAndInternalLinks').innerHTML = response['noFollowAndInternalLinksCount'];
	        document.getElementById('noFollowAndExternalLinks').innerHTML = response['noFollowAndExternalLinksCount'];        
	        document.getElementById('externalLinks').innerHTML = response['externalLinksCount']; 
	        document.getElementById('internalLinks').innerHTML = response['internalLinksCount'];           
	    });
	});
}
	
/** 
	Add click event listener for option page opening
**/
/**
document.getElementById('go-to-options').addEventListener('click', function(){ 
	  if (chrome.runtime.openOptionsPage) {
	    chrome.runtime.openOptionsPage();
	  } 
	  else {
	    window.open(chrome.runtime.getURL('options.html'));
	  }
}, false);
**/