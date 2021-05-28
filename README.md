# homebridge-keyble

HomeKit Support via Homebridge for Eqiva EQ3 Doorlocks

## Installation

If not present, install and setup homebridge. Then install the plugin
```
npm install --update --global --unsafe-perm homebridge-keyble
```
In case of issues check the [installation instructions of *keyble*](https://github.com/oyooyo/keyble#global-installation)

## Pairing

Now register your smartlock with your keycard
```
# Install keyble globally (in future this will be keyble-cli)
sudo npm install --update --global --unsafe-perm keyble@0.2.6
keyble-registeruser -n John -q M0123456789ABK0123456789ABCDEF0123456789ABCDEFNEQ1234567
```
Check also the more detailed [setup instructions](https://github.com/oyooyo/keyble#keyble-registeruser)
Save the output of the registration, especially you need:

* the `address`
* the `user_id`
* the `user_key`

Now setup keyble's config in homebridge's config.json or in Homebridge Config UI X:
```
        {
            "locks": [
                {
                    "name": "My Key-BLE Lock",
                    "address": "xx:xx:xx:xx:xx:xx",
                    "key": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                    "user": 0
                }
            ],
            "platform": "keyble"
        }
```
You can add several locks. If you remove a lock from the config they will be unregistered at next restart of Homebridge.

Now restart Homebridge and check the log. Your new lock should be setup and ready to be controlled via Homebridge.

## Usage

* Setting lock to 0% -> Lock will be locked
* Settings lock to 50%/100% (1%/2% in Siri) -> Lock will be unlocked but door handle is not enganged
* Settings lock to 150% (3% in Siri) -> Lock will be unlocked and Door handle enganges. Lock status is afterwards set to 100% (2% in Siri)

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

* Set/update new status to homebridge depending if it is expected
* Retrieve current status at initialization
* Set private settings through Homebridge


### Known Issues

* Handle keyble timeouts (unresolved promises)
* Use traditional setProps as Siri/Homekit does not understand custom setProps
* Handle "UNKNOWN" status response
* Improve reaction delay
    * Keep-alive bluetooth connection
    * Use async

### Feature Backlog

* Retrieve lock information from lock
* Display battery life
* Turn lock specific number of times
* Pair locks in plugin
