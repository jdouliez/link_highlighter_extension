/* 
Processes requests using page's dom
*/

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

chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {

        switch(message.type) {
            case "getDomInfo":                                           
                result = getLinksCount();
                break;                
        }        
        
        sendResponse(result);
    }
);

//Run after 1 sec to avoid normal js activity on links
setTimeout(function() { 
    var links = document.getElementsByTagName("a");

    for(var i=0; i<links.length; i++) {
        if (links[i].href != undefined && links[i].href != "") {
            var url = new URL(links[i].href);
            
            //Process external links
            if (url.protocol.startsWith("http") && url.hostname != location.hostname ) {        
                links[i].classList.add("externalLink");          
            }

            //Process internal links
            else if (url.protocol.startsWith("http") && url.hostname == location.hostname ) {        
                links[i].classList.add("internalLink");          
            }
        }
    }
}, 1000);
