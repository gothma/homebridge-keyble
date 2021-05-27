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