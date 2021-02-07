# homebridge-keyble

HomeKit Support for Eqiva EQ3 Doorlocks


## Known Issues

* VSCode linting does not see homebridge
* Lock status updates are not forwarded to Homebridge
* Understand difference between Unlock/Open
* Allow only available lock states in HomeKit
* Retrieve current status at initialization
* Handle "UNKNOWN" status response
* Handle keyble timeouts (unresolved promises)
* Improve reaction delay
    * Keep-alive bluetooth connection
    * Use async

## Feature Backlog

* Set privateSettings.ts through Homebride
* Retrieve lock information from lock
* Display battery life
* Turn lock specific number of times
* Pair locks in plugin