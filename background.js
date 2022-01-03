const addon_name = "LAN port scan forbidder";
const default_title = addon_name;

setGlobalEnable();

//----------------------------------------------------------
async function onBeforeRequest(details)
/*
NOTICE Chrome doesn't allow async function here
    Change it to sync function for Chrome
*/
{
    if (await is_off(details=details)) return;
    
    //const method = details.method;
    const targetURL = details.url;
    const resourceType = details.type;
    //const documentUrl = details.documentUrl;
    
    var originUrl;
    if (isFirefox)
        originUrl = details.originUrl;
    else if (isChrome)
        originUrl = details.initiator;
    
    const tabid = details.tabId;
    
    if ( ! originUrl ) 
        return;
    
    if ( resourceType == "main_frame" ) 
        return;
    
    for ( unhandled of ["moz-extension:", "about:", "file:", "chrome:", "javascript:", "data:"] )
        if ( targetURL.toLowerCase().startsWith(unhandled) || originUrl.toLowerCase().startsWith(unhandled) )
            return;
    
    const originHost = getUrlHostNoPort(originUrl);
    const targetHost = getUrlHostNoPort(targetURL);
    
    if (originHost == targetHost)
        return;
    
    var parsed_originHost;
    var parsed_targetHost;
    
    

    
    if ( originHost == "localhost" )
        return;
    
    if ( ipaddr.isValid( originHost ) )  // origin is ip
    {
        //console.log("origin is ip");
        
        parsed_originHost = ipaddr.parse(originHost);
    
        if ( isLan( parsed_originHost ) )
        {
            //console.log("origin is lan");
            return;
        }
    }
    
    
    //------- Here, origin is not LAN -------------
    
 
    if ( targetHost == "localhost" )
    {
        return {cancel: true};
    }
    
    if ( ! ipaddr.isValid(targetHost) )  // target not ip
    {
        //console.log("target not ip");
        return ;
    }
    
    parsed_targetHost = ipaddr.parse(targetHost);
    
    //console.log( parsed_targetHost.range() );
    if ( ifBlock( parsed_targetHost ) )
    {
        //console.log( "in block range");
        return {cancel: true};
    }

    
    if ( parsed_targetHost.kind() == "ipv6" && parsed_targetHost.isIPv4MappedAddress() )
    {
        const targetHost_toV4_parsed= parsed_targetHost.toIPv4MappedAddress();
        
        if ( ifBlock(targetHost_toV4_parsed) )
        {
            //console.log("ipv6 mapped to ipv4 in block range");
            return {cancel: true};
        }
        
    }
    
}

function isLan(parsed_ip)
{
    switch ( parsed_ip.range() )
    {
        case "private":
        case "linkLocal":
        case "loopback":
        case "uniqueLocal":

            return true;
            break;
    }
    return false;
}

function ifBlock(parsed_ip)
{
    switch ( parsed_ip.range() )
    {
        case "private":
        case "unspecified":
        case "linkLocal":
        case "multicast":
        case "loopback":
        case "uniqueLocal":
        case "broadcast":
        case "multicast":
        case "carrierGradeNat":
            
            return true;
            break;
    }
    return false;
}

function getUrlHostNoPort(s) // 'http://example.com:8888/a/b/c' --> 'example.com:8888'
{
    
    var arr = s.split("/");
    var host_full = arr[2];
    
    var result;
    if (host_full.indexOf("]:") != -1 ) // ipv6 + port
    {
        result = host_full.substring( host_full.indexOf("[") + 1 , host_full.indexOf("]") );
    }else if ( host_full.indexOf("]") != -1 ) { // ipv6 no port
        result = host_full.replace('[','').replace(']','');
    }else if ( host_full.indexOf(":") != -1 ) { // ipv4 or domain + port
        result = host_full.split(":")[0];
    }else{   // ipv4 or domain no port
        result = host_full;
    }
    //console.log("host_full: ", host_full, "\nresult: ", result);
    return result;
}
//===debug=========
function json_pretty(obj){
    return JSON.stringify(obj, null, 2);
}
function console_obj(obj){
    console.log( json_pretty( obj ) );
}
