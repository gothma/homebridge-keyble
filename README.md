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

## Version log

### 0.0.1

* Retrieve current status at initialization
* Set private settings through Homebridge

### Known Issues

* Handle "UNKNOWN" status response
* Handle keyble timeouts (unresolved promises)
* Improve reaction delay
    * Keep-alive bluetooth connection
    * Use async

### Feature Backlog

* README
    * Description
    * Install instructions
    * Pairing instructions
* Set/update new status to homebridge depending if it is expected
* Retrieve lock information from lock
* Display battery life
* Turn lock specific number of times
* Pair locks in plugin