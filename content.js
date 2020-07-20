/**
    Get DOM information
**/
function getLinksCount() {
   
    var countExternal = 0;
    var countInternal = 0;
    var countLinks = 0;
    var countNoFollowAndExternal = 0;
    var countNoFollowAndInternal = 0;

    var links = document.getElementsByTagName("a");

    var url;
    var isExternal;
    
    for(var i=0; i<links.length; i++) {
        if (links[i].href != undefined && links[i].href != "") {

            url = new URL(links[i].href);            

            if (url.protocol.startsWith("http")) {        
                countLinks++;                    
            } 
            else {
                continue;
            }

            //Process internal/external links
            if (url.hostname != location.hostname ) {        
                countExternal++;    
                isExternal = true;      
            }        
            else if (url.hostname == location.hostname ) {        
                countInternal++;
                isExternal = false;
            }

            //Process nofollow links
            for(var j=0; j<links[i].attributes.length; j++) {
                if (links[i].attributes[j].name == "rel" && links[i].attributes[j].value == "nofollow"){
                   if (isExternal) {
                     countNoFollowAndExternal++;
                   }
                   else {
                     countNoFollowAndInternal++;
                   }
                }
            }
        }
    }

    return {
            "allLinksCount": countLinks, 
            "noFollowAndInternalLinksCount": countNoFollowAndInternal, 
            "noFollowAndExternalLinksCount": countNoFollowAndExternal, 
            "externalLinksCount": countExternal, 
            "internalLinksCount": countInternal
           };
}

/**
    Communication mecanism between popup and DOM
**/
chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {

        switch(message.type) {
            case "getDomInfo":                                           
                result = getLinksCount();
                sendResponse(result);
                break; 

            case "enableExtension":                                           
                enableExtension();
                break;                
            
            case "disableExtension":                                           
                disableExtension();
                break;                
        }                     
    }
);

/**
    Enable extension and mark link type over DOM
**/
function enableExtension(){
      
    getAllSettings(function(data){
        
        var flashingModeActivated = data['flashingMode'];
        var externalLinksTypeActivated = data['externalLinksType'];
        var internalLinksTypeActivated = data['internalLinksType'];

        if (flashingModeActivated == undefined) {
            flashingModeActivated = true;
        }

        if (externalLinksTypeActivated == undefined) {
            externalLinksTypeActivated = true;
        }

        if (internalLinksTypeActivated == undefined) {
            internalLinksTypeActivated = true;
        }

        var links = document.getElementsByTagName("a");

        for (var i=0; i<links.length; i++) {
            if (links[i].href != undefined && links[i].href != "") {
                var url = new URL(links[i].href);
                
                //Process external links
                if (url.protocol.startsWith("http") && url.hostname != location.hostname && externalLinksTypeActivated) {        
                    links[i].classList.add("externalLink");  

                    if (flashingModeActivated) {
                        links[i].classList.add("flashingLink");  
                    }       
                }

                //Process internal links
                if (url.protocol.startsWith("http") && url.hostname == location.hostname && internalLinksTypeActivated) {        
                    links[i].classList.add("internalLink");  

                    if (flashingModeActivated) {
                        links[i].classList.add("flashingLink");  
                    }         
                }
            }
        }
    });
}

/**
    Disable extension and set DOM back to initial state
**/
function disableExtension(){
    
    var internalLinks = document.getElementsByClassName("internalLink");

    while (internalLinks.length > 0) {
        for(var j=0; j<internalLinks.length; j++) {
            internalLinks[j].className = internalLinks[j].className.replace(/\binternalLink\b/g, "");          
        }

        internalLinks = document.getElementsByClassName("internalLink");
    }


    var externalLinks = document.getElementsByClassName("externalLink");
    
    while (externalLinks.length > 0) {
        for(var k=0; k<externalLinks.length; k++) {
            externalLinks[k].className = externalLinks[k].className.replace(/\bexternalLink\b/g, "");          
        }

        externalLinks = document.getElementsByClassName("externalLink");
    } 

    var flashingLinks = document.getElementsByClassName("flashingLink");
    
    while (flashingLinks.length > 0) {
        for(var l=0; l<flashingLinks.length; l++) {
            flashingLinks[l].className = flashingLinks[l].className.replace(/\bflashingLink\b/g, "");          
        }

        flashingLinks = document.getElementsByClassName("flashingLink");
    } 
}

//Run after 1 sec to avoid normal js activity on links
setTimeout(function() { 
    chrome.storage.sync.get("isEnabled", function(items) {
        if(items.isEnabled) {
            enableExtension();
        }   
        else {
            disableExtension();
        }     
    });    
}, 1000);
