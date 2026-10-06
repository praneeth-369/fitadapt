/**
 * Web Bluetooth API Service for Real Fitness Bands & Smartwatches
 * Connects directly to real Bluetooth Low Energy (BLE) Heart Rate monitors
 * (Apple Watch, Polar H10, Garmin, Xiaomi Mi Band, Whoop, Fitbit BLE, etc.)
 */

// Standard Bluetooth SIG UUIDs
const HEART_RATE_SERVICE = 'heart_rate'; // 0x180D
const HEART_RATE_MEASUREMENT = 'heart_rate_measurement'; // 0x2A37
const BATTERY_SERVICE = 'battery_service'; // 0x180F
const BATTERY_LEVEL = 'battery_level'; // 0x2A19
const DEVICE_INFO_SERVICE = 'device_information'; // 0x180A

export const isBluetoothSupported = () => {
  return typeof navigator !== 'undefined' && 'bluetooth' in navigator;
};

export class RealFitnessBandManager {
  constructor() {
    this.device = null;
    this.server = null;
    this.hrCharacteristic = null;
    this.isConnected = false;
    this.onHeartRateUpdate = null;
    this.onStatusChange = null;
    this.deviceInfo = {
      name: '',
      batteryLevel: null,
      manufacturer: '',
    };
  }

  /**
   * Request Bluetooth Pairing with real physical Fitness Band / Smartwatch
   */
  async requestAndConnect() {
    if (!isBluetoothSupported()) {
      throw new Error(
        'Web Bluetooth is not supported in this browser. Please use Google Chrome or Microsoft Edge.'
      );
    }

    try {
      console.log('[WebBluetooth] Prompting user for Bluetooth fitness band scan...');

      // Standard Heart Rate BLE filter + acceptAllDevices fallback
      this.device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [HEART_RATE_SERVICE] }],
        optionalServices: [BATTERY_SERVICE, DEVICE_INFO_SERVICE],
      });

      console.log(`[WebBluetooth] User selected device: ${this.device.name || 'Unnamed Band'}`);

      this.deviceInfo.name = this.device.name || 'Generic BLE Fitness Band';

      // Setup disconnect listener
      this.device.addEventListener('gattserverdisconnected', () => {
        console.warn('[WebBluetooth] Device disconnected');
        this.isConnected = false;
        if (this.onStatusChange) {
          this.onStatusChange({
            isConnected: false,
            device: this.deviceInfo,
            error: null,
          });
        }
      });

      // Connect to GATT Server
      console.log('[WebBluetooth] Connecting to GATT server...');
      this.server = await this.device.gatt.connect();
      console.log('[WebBluetooth] Connected to GATT server!');

      // Get Heart Rate Service & Characteristic
      const hrService = await this.server.getPrimaryService(HEART_RATE_SERVICE);
      this.hrCharacteristic = await hrService.getCharacteristic(HEART_RATE_MEASUREMENT);

      // Start real notifications
      await this.hrCharacteristic.startNotifications();
      console.log('[WebBluetooth] Started Heart Rate notifications stream!');

      this.hrCharacteristic.addEventListener('characteristicvaluechanged', (event) => {
        const value = event.target.value;
        const hr = this.parseHeartRate(value);
        if (this.onHeartRateUpdate) {
          this.onHeartRateUpdate({
            heartRate: hr,
            deviceName: this.deviceInfo.name,
            timestamp: new Date().toISOString(),
            isRealBluetoothDevice: true,
          });
        }
      });

      // Try reading battery level if available
      try {
        const batteryService = await this.server.getPrimaryService(BATTERY_SERVICE);
        const batteryChar = await batteryService.getCharacteristic(BATTERY_LEVEL);
        const batteryVal = await batteryChar.readValue();
        this.deviceInfo.batteryLevel = batteryVal.getUint8(0);
        console.log(`[WebBluetooth] Read battery level: ${this.deviceInfo.batteryLevel}%`);
      } catch (battErr) {
        console.log('[WebBluetooth] Battery service not accessible on this device (optional).');
      }

      this.isConnected = true;
      if (this.onStatusChange) {
        this.onStatusChange({
          isConnected: true,
          device: this.deviceInfo,
          error: null,
        });
      }

      return {
        success: true,
        deviceName: this.deviceInfo.name,
        batteryLevel: this.deviceInfo.batteryLevel,
      };
    } catch (error) {
      console.error('[WebBluetooth] Connection failed:', error);
      this.isConnected = false;
      if (this.onStatusChange) {
        this.onStatusChange({
          isConnected: false,
          device: null,
          error: error.message,
        });
      }
      throw error;
    }
  }

  /**
   * Parse Bluetooth SIG Heart Rate Measurement payload
   */
  parseHeartRate(dataView) {
    const flags = dataView.getUint8(0);
    const rate16Bits = flags & 0x1;
    let heartRate;
    if (rate16Bits) {
      heartRate = dataView.getUint16(1, /*littleEndian=*/true);
    } else {
      heartRate = dataView.getUint8(1);
    }
    return heartRate;
  }

  disconnect() {
    if (this.device && this.device.gatt.connected) {
      this.device.gatt.disconnect();
    }
    this.isConnected = false;
  }
}

export const bandManager = new RealFitnessBandManager();
