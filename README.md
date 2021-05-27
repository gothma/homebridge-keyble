# homebridge-keyble

HomeKit Support for Eqiva EQ3 Doorlocks

## Mapping behavior:

Target states:

* 0-32 - LOCKED -> Snaps to Locked (0)
* 32-66 - OPEN -> Snaps to Open (66)
* 66-100 - UNLOCKED -> Snaps back to Open when unlocked

## Developing

```bash
# Build type script once
npm run build

# Build type script continously
npm run watch

# Make visible in homebridge (run once)
npm link

# Homebridge must be restarted to reload updated plugin
sudo service homebridge restart
```

### Useful dev resources

* [Homebridge Plugin Template](https://github.com/homebridge/homebridge-plugin-template)
* [Homebridge API Characteristics](https://developers.homebridge.io/#/api/characteristics)

### Known Issues

* Keyble unhandled promise
    
    (node:24481) UnhandledPromiseRejectionWarning: TypeError: Cannot read property 'connect' of null
    at Promise (/home/pi/git/homebridge-keyble/node_modules/simble/simble.js:492:27)
    at new Promise (<anonymous>)
    at Peripheral.ensure_connected (/home/pi/git/homebridge-keyble/node_modules/simble/simble.js:487:10)
    at Peripheral.ensure_discovered (/home/pi/git/homebridge-keyble/node_modules/simble/simble.js:525:15)
    at ensure_peripheral.then (/home/pi/git/homebridge-keyble/node_modules/keyble/keyble.js:888:85)
    at process._tickCallback (internal/process/next_tick.js:68:7)
    (node:24481) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). (rejection id: 91)
    (node:24481) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.

* VSCode linting does not see homebridge
* Lock status updates are not forwarded to Homebridge
* Allow only available lock states in HomeKit
* Retrieve current status at initialization
* Handle "UNKNOWN" status response
* Handle keyble timeouts (unresolved promises)
* Improve reaction delay
    * Keep-alive bluetooth connection
    * Use async

### Feature Backlog

* Set privateSettings.ts through Homebridge
* Retrieve lock information from lock
* Display battery life
* Turn lock specific number of times
* Pair locks in plugin