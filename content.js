/* 
Processes requests using page's dom
*/
chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {

        switch(message.type) {
            case "getDomInfo":
                            
                allLinksCount = document.getElementsByTagName('a').length;
                nofollowLinksCount = document.querySelectorAll('a[rel="nofollow"]').length;
                externalLinksCount = document.querySelectorAll('a[rel="external"]').length;
                
                result = {"allLinksCount": allLinksCount, "nofollowLinksCount": nofollowLinksCount, "externalLinksCount": externalLinksCount};
                break;                
        }        
        sendResponse(result);
    }
);