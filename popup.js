
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
}, false);

/** 
	Add click event listener for option page opening
**/
document.getElementById('go-to-options').addEventListener('click', function(){ 
	  if (chrome.runtime.openOptionsPage) {
	    chrome.runtime.openOptionsPage();
	  } else {
	    window.open(chrome.runtime.getURL('options.html'));
	  }
}, false);

	
/**
	Get data from content script running on page
**/
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {type:"getDomInfo"}, function(response){    	
        document.getElementById('allLinks').innerHTML = response['allLinksCount'];        
        document.getElementById('nofollowLinks').innerHTML = response['nofollowLinksCount'];        
        document.getElementById('externalLinks').innerHTML = response['externalLinksCount'];        
    });
});