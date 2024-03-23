
let notify_enabled = -1;

async function showNotify(origin, target)
{
    if ( notify_enabled === -1) {
        notify_enabled = ( await get_settings_local() ) ['notify'] ;
    }

    if (!notify_enabled===true)
        return;
    
    newNotifyCome({origin, target}); 
    
    async function get_settings_local()
    {
        return ( await browser.storage.local.get() ) ;
    }
}


function batchPopupSystemNotify(arr) 
{
    if (! arr.length > 0)
        return;
    
    
    const origin = arr[0].origin; 
    const target = arr[0].target; 
    
    var notifyText = '';
    
    notifyText = 
`Blocked:
    
from page: ${origin}
to fetch : ${target}`  ;

    if (arr.length >= 2)
        notifyText += `\n\n... and other ${arr.length-1}`

    popupSystemNotify(notifyText);
}

function popupSystemNotify(notifyText) 
{
    chrome.notifications.create({
        "type": "basic",
        "iconUrl": 'icon.png', 
        "title": `${addon_name}`, 
        "message": notifyText, 
    });       
}

let fifo = [];
let fifo_locked = false;
let timerId = null;

async function newNotifyCome(notification) {
    const origin = notification.origin;
    const target = notification.target;
    
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    for (var n=0; n<200;n++) {
        if (!fifo_locked) {
            fifo_locked = true;
            
            if (timerId === null) { 
                batchPopupSystemNotify( [ { origin, target } ] ); 
                timerId = setTimeout(onNotifyTimerout, 5000); 
            } else {
                fifo.push(notification);
            }
            
            fifo_locked = false;
            return;
        } else {
            await sleep(10);
        }
    }
    
    console.warn("fifo_locked. Failed to wait until unlock");
}

function onNotifyTimerout() {
    fifo_locked = true;
    
    if (fifo.length > 0) {
        batchPopupSystemNotify(fifo); 
        fifo = []; 
    }
    
    clearTimeout(timerId); // 清除定时器
    timerId = null;
    
    fifo_locked = false;
};
