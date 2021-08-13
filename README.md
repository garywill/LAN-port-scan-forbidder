# LAN port scan forbidder

Forbid untrusted web to scan localhost or LAN. Firefox addon.

## What

Webs can try to fetch `127.0.0.1:xxxx` or `192.168.Y.Z:xxxx` to scan your open ports in LAN.

Although browsers have cross-domain protections, webs can't read response contents, **but** can still see the connection succeeds or fails.

There're already reports that some websites using that as tracking fingerprint.

## So

Forbid any website behaviors trying to connect to your LAN or localhost, if user is visiting the website via their domains or public IP addresses.

> Using JS library [whitequark/ipaddr.js](https://github.com/whitequark/ipaddr.js) (MIT License) v2.0.0 to judge IP range.

### Fallback operation

If user find a web broken (generally won't), user can temporary set this addon disabled via toolbar button for:

- this one tab
- this one tab and new tabs opened by this tab
- this one window
- globally

there's toolbar button badge indicating disabling status.
