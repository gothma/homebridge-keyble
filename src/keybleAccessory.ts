import { Service, PlatformAccessory, CharacteristicValue, CharacteristicSetCallback, CharacteristicGetCallback } from 'homebridge';

import { KeyblePlatform } from './platform';

import { Key_Ble } from "keyble";

import { privateSettings } from './privateSettings';

enum Position {
  Lock = 0,
  Unlock = 1,
  Open = 2
}

/**
 * Platform Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 */
export class KeybleAccessory {
  private service: Service;
  private lock: Key_Ble;

  /**
   * These are just used to create a working example
   * You should implement your own code to track the state of your accessory
   */
  private state = {
    currentPosition: 0,
    movement: this.platform.Characteristic.PositionState.STOPPED,
    targetPosition: 0
  };



  constructor(
    private readonly platform: KeyblePlatform,
    private readonly accessory: PlatformAccessory,
  ) {

    this.lock = new Key_Ble({
      address: privateSettings.address,
      user_id: privateSettings.user,
      user_key: privateSettings.key,
      auto_disconnect_time: 15,
      status_update_time: 600
    })

    // set accessory information
    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'eqiva')
      .setCharacteristic(this.platform.Characteristic.Model, 'eq3')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, 'Default-Serial');

    // get the Door service if it exists, otherwise create a new Door service
    // you can create multiple services for each accessory
    this.service = this.accessory.getService(this.platform.Service.Door) || this.accessory.addService(this.platform.Service.Door);

    // set the service name, this is what is displayed as the default name on the Home app
    // in this example we are using the name we stored in the `accessory.context` in the `discoverDevices` method.
    this.service.setCharacteristic(this.platform.Characteristic.Name, accessory.context.device.exampleDisplayName);

    // each service must implement at-minimum the "required characteristics" for the given service type
    // see https://developers.homebridge.io/#/service/Door

    this.service.getCharacteristic(this.platform.Characteristic.CurrentPosition)
      .setProps({
        minValue: Position.Lock,
        minStep: Position.Unlock,
        maxValue: Position.Unlock
      });
    
    this.service.getCharacteristic(this.platform.Characteristic.TargetPosition)
      .setProps({
        minValue: Position.Lock,
        minStep: Position.Unlock,
        maxValue: Position.Open
      });

    // register handlers for the CurrentPosition Characteristic
    this.service.getCharacteristic(this.platform.Characteristic.CurrentPosition)
      .on('get', this.getCurrentPosition.bind(this));

    // register handlers for the State Characteristic
    this.service.getCharacteristic(this.platform.Characteristic.PositionState)
      .on('get', this.getState.bind(this));

    // register handlers for the TargetPosition Characteristic
    this.service.getCharacteristic(this.platform.Characteristic.TargetPosition)
      .on('get', this.getTargetPosition.bind(this))
      .on('set', this.setTargetPosition.bind(this));

    // register handler for status changes from lock
    this.lock
      .on('status_change', this.onStatusChange.bind(this));

  }

  /**
   * Handle the "GET" requests from HomeKit
   * These are sent when HomeKit wants to know the current state of the accessory, for example, checking if a Light bulb is on.
   * 
   * GET requests should return as fast as possbile. A long delay here will result in
   * HomeKit being unresponsive and a bad user experience in general.
   * 
   * If your device takes time to respond you should update the status of your device
   * asynchronously instead using the `updateCharacteristic` method instead.

   * @example
   * this.service.updateCharacteristic(this.platform.Characteristic.On, true)
   */

  getCurrentPosition(callback: CharacteristicGetCallback) {
    const currentPosition = this.state.currentPosition;
    this.platform.log.debug('Get Characteristic Current Position ->', currentPosition)
    callback(null, currentPosition);
  }

  getState(callback: CharacteristicGetCallback) {
    const movement = this.state.movement;
    this.platform.log.debug('Get Characteristic State ->', movement)
    callback(null, movement);
  }

  getTargetPosition(callback: CharacteristicGetCallback) {
    const targetPosition = this.state.targetPosition;
    this.platform.log.debug('Get Characteristic Target Position ->', targetPosition)
    callback(null, targetPosition);
  }

  /**
   * Handle "SET" requests from HomeKit
   * These are sent when the user changes the state of an accessory, for example, changing the Brightness
   */
  setTargetPosition(value: CharacteristicValue, callback: CharacteristicSetCallback) {

    if ( this.state.targetPosition != value ) {
      this.state.targetPosition = value as number;

      this.platform.log.debug('Set Characteristic Target Position -> ', value);
      switch(value) {
        case Position.Open:
          this.platform.log.debug('Open')
          this.state.movement = this.platform.Characteristic.PositionState.INCREASING;
          this.lock.open()
          .catch((error) => {this.onError(error);});
          break;
        case Position.Unlock:
          this.platform.log.debug('Unlock')
          this.state.movement = this.platform.Characteristic.PositionState.INCREASING;
          this.lock.unlock()
          .catch((error) => {this.onError(error);});
          break;
        case Position.Lock:
          this.platform.log.debug('Lock')
          this.state.movement = this.platform.Characteristic.PositionState.DECREASING;
          this.lock.lock()
          .catch((error) => {this.onError(error);});
      }
    }


    callback(null);
  }

  onError(error: string) {
    this.lock.request_status();
    this.platform.log.error(error);
  }

  onStatusChange(newStatusId : number) {
    switch(newStatusId) {
      case 3: // LOCKED
        this.state.targetPosition = Position.Lock;
        this.state.currentPosition = Position.Lock;
        this.state.movement = this.platform.Characteristic.PositionState.STOPPED;
        break;
      case 2: // UNLOCKED
      case 4: // OPENED
        this.state.targetPosition = Position.Unlock;
        this.state.currentPosition = Position.Unlock;
        this.state.movement = this.platform.Characteristic.PositionState.STOPPED;
        break;
      case 1: // MOVING
        if (this.state.targetPosition > Position.Lock) {
          this.state.movement = this.platform.Characteristic.PositionState.INCREASING;
        } else {
          this.state.movement = this.platform.Characteristic.PositionState.DECREASING;
        }
        break;
      case 0: // UNKNOWN
        this.platform.log.info("Lock state unknown");
        break;
      default:
        this.platform.log.error("Received unkown state");
        break;
    }
  }
}
