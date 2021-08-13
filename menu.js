 
browser.menus.create({
    contexts: ["browser_action"],
    id: "checkbox_t_disable",
    type: "checkbox",
    title: `Disable ${addon_name} on this tab`
});
browser.menus.create({
    contexts: ["browser_action"],
    id: "checkbox_h_disable",
    type: "checkbox",
    title: `Disable ${addon_name} on this tab and new tabs opened by this tab`
});
browser.menus.create({
    contexts: ["browser_action"],
    type: "separator",
});
browser.menus.create({
    contexts: ["browser_action"],
    id: "checkbox_w_disable",
    type: "checkbox",
    title: `Disable ${addon_name} in this window`
});
browser.menus.create({
    contexts: ["browser_action"],
    id: "checkbox_global_disable",
    type: "checkbox",
    title: `Disable ${addon_name} globally`
});
browser.menus.onShown.addListener(async function(info, tab) {
    const tabid = tab.id;
    const wid = tab.windowId;
    
    browser.menus.update("checkbox_global_disable", {checked: ! isGlobalEnabled() });
    browser.menus.update("checkbox_w_disable", {checked: isWindowDisabled(wid) });
    browser.menus.update("checkbox_t_disable", {checked: isTabIn_list_t(tabid) });
    browser.menus.update("checkbox_h_disable", {checked: isTabIn_list_h(tabid) });

    // Note: Not waiting for returned promise.
    browser.menus.refresh();
});

browser.menus.onClicked.addListener((info, tab) => {
    const tabid = tab.id;
    const wid = tab.windowId;
    const checked = info.checked;
    const menuItemId = info.menuItemId;

    switch ( menuItemId ){
        case "checkbox_global_disable":
            if (checked) unsetGlobalEnable();
            else setGlobalEnable();
        break;
        case "checkbox_w_disable":
            if (checked) setWindowDisabled(wid);
            else unsetWindowDisabled(wid);
        break;
        case "checkbox_t_disable":
            if (checked) setTab_t(tabid);
            else unsetTab_t(tabid);
        break;
        case "checkbox_h_disable":
            if (checked) setTab_h(tabid);
            else unsetTab_h(tabid);
        break;
    }
});
