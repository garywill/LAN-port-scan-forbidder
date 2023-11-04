# LAN port scan forbidder

Forbid untrusted web to scan localhost or LAN. Browser addon.

- [Firefox Addon](https://addons.mozilla.org/firefox/addon/lan-port-scan-forbidder/)
- [Chrome Addon](https://chrome.google.com/webstore/detail/lapppchpconamefemlnjdebbcpbncafl) (Manifest v2 needed) (recent version of Chrome has already built-in similar feature)

## What

Webs can try to fetch `127.0.0.1:xxxx` or `192.168.Y.Z:xxxx` to scan your open ports in LAN.

Although browsers have cross-domain protections, webs can't read response contents, **but** can still see the connection succeeds or fails.

There're already reports that some websites using that as tracking fingerprint.

> A web for testing: http://samy.pl/webscan/

## So

Forbid any website behaviors trying to connect to your LAN or localhost, if user is visiting the website via their domains or public IP addresses. (Read the source code `background.js` to see the logic)

> Using JS library [whitequark/ipaddr.js](https://github.com/whitequark/ipaddr.js) (MIT License) v2.0.0 to judge IP range.

### Fallback operation

If user find a web broken, user can temporary set this addon disabled via toolbar button for:

- this one tab
- this one tab and new tabs opened by this tab
- this one window (Firefox only)
- globally

(above can be set as keyboard shortcuts)

there's showy toolbar button badge indicating disabling status.

## Cases when web LAN scan is properly used

Not all LAN-port-scan are evil.

- Some manufacturers provide web for user's browser to scan LAN for their product that need updating.

- Some softwares use `127.0.0.1` communication to interact between native program and web.

## Disclaimer

This open souce addon comes with no warranty. Use on you own risk!

