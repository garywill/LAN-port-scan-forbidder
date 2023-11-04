

async function get_settings_local()
{
    return ( await browser.storage.local.get() ) ;
}

async function get_settings_sync()
{
    return ( await browser.storage.sync.get() ) ;
}


document.addEventListener("DOMContentLoaded", async function() {

    (async () => {
        if ( ( await get_settings_local() ) ['notify'] === true) 
            document.getElementById("checkbox-notify").checked = true;
    } ) () ;
    
    (async () => {
        document.getElementById("checkbox-notify").addEventListener("change", async function (event) {
            if (event.target.checked)
                console.log(
                    await browser.permissions.request( { permissions: ['notifications'] } )
                ); 
            
            await browser.storage.local.set({
                    "notify": document.getElementById("checkbox-notify").checked 
            });
            
            
        });
    } ) () ;
} ) ;










