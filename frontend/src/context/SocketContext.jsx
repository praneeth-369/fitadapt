import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { isBluetoothSupported, bandManager } from '../services/bluetoothService';

const SocketContext = createContext(null);

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  
  // Connection state
  const [isDeviceConnected, setIsDeviceConnected] = useState(() => {
    const saved = localStorage.getItem('fitadapt_device_connected');
    return saved !== null ? JSON.parse(saved) : false;
  });

  const [connectionType, setConnectionType] = useState(() => {
    return localStorage.getItem('fitadapt_connection_type') || 'none'; // 'bluetooth' | 'virtual' | 'none'
  });

  const [connectedDeviceDetails, setConnectedDeviceDetails] = useState({
    name: 'SmartBand',
    battery: null,
    isRealBluetooth: false,
  });

  const [rawMetrics, setRawMetrics] = useState({
    deviceId: 'CYBER-BAND-X9',
    heartRate: 84,
    steps: 3640,
    activeCalories: 152.8,
    spo2: 98,
    stressScore: 24,
    status: 'STREAMING_LIVE',
    timestamp: new Date().toISOString(),
  });

  const [hrHistory, setHrHistory] = useState([78, 80, 82, 79, 81, 84, 82]);
  const [bluetoothError, setBluetoothError] = useState('');
  const [isBluetoothConnecting, setIsBluetoothConnecting] = useState(false);

  const socketRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('fitadapt_device_connected', JSON.stringify(isDeviceConnected));
    localStorage.setItem('fitadapt_connection_type', connectionType);
  }, [isDeviceConnected, connectionType]);

  // Setup Socket.io connection for telemetry & backend communication
  useEffect(() => {
    const socketInstance = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    socketRef.current = socketInstance;
    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      setIsSocketConnected(true);
    });

    socketInstance.on('disconnect', () => {
      setIsSocketConnected(false);
    });

    socketInstance.on('live_health_metrics', (metrics) => {
      // If we are using virtual simulator, update metrics directly
      if (connectionType !== 'bluetooth') {
        setRawMetrics(metrics);
        if (metrics.heartRate) {
          setHrHistory((prev) => [...prev.slice(-9), metrics.heartRate]);
        }
      }
    });

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, [connectionType]);

  // Setup Web Bluetooth listeners
  useEffect(() => {
    bandManager.onHeartRateUpdate = ({ heartRate, deviceName, timestamp }) => {
      setRawMetrics((prev) => {
        // Increment steps and calories realistically with physical HR
        const deltaSteps = heartRate > 100 ? 5 : 2;
        const deltaCals = Math.round((deltaSteps * 0.045) * 10) / 10;
        return {
          ...prev,
          deviceId: deviceName || 'Bluetooth Heart Rate Band',
          heartRate,
          steps: (prev.steps || 3500) + deltaSteps,
          activeCalories: Math.round(((prev.activeCalories || 140) + deltaCals) * 10) / 10,
          status: 'REAL_BLE_LIVE',
          timestamp,
        };
      });

      setHrHistory((prev) => [...prev.slice(-9), heartRate]);
    };

    bandManager.onStatusChange = ({ isConnected, device, error }) => {
      if (!isConnected) {
        if (connectionType === 'bluetooth') {
          setIsDeviceConnected(false);
          setConnectionType('none');
          setConnectedDeviceDetails({ name: '', battery: null, isRealBluetooth: false });
        }
      } else if (device) {
        setConnectedDeviceDetails({
          name: device.name,
          battery: device.batteryLevel,
          isRealBluetooth: true,
        });
      }
      if (error) {
        setBluetoothError(error);
      }
    };
  }, [connectionType]);

  /**
   * Connect to a REAL Physical Bluetooth Fitness Tracker (W3C Web Bluetooth)
   */
  const connectRealBluetoothDevice = async () => {
    setIsBluetoothConnecting(true);
    setBluetoothError('');
    try {
      const res = await bandManager.requestAndConnect();
      setIsDeviceConnected(true);
      setConnectionType('bluetooth');
      setConnectedDeviceDetails({
        name: res.deviceName,
        battery: res.batteryLevel,
        isRealBluetooth: true,
      });
      return { success: true, deviceName: res.deviceName };
    } catch (err) {
      console.warn('[SocketContext] Bluetooth pair canceled or error:', err.message);
      setBluetoothError(err.message);
      throw err;
    } finally {
      setIsBluetoothConnecting(false);
    }
  };

  /**
   * Connect to Virtual Band (Simulator)
   */
  const connectVirtualDevice = () => {
    setIsDeviceConnected(true);
    setConnectionType('virtual');
    setConnectedDeviceDetails({
      name: 'Cyber-Band X9 (Virtual BLE)',
      battery: 89,
      isRealBluetooth: false,
    });
    setBluetoothError('');
  };

  /**
   * Disconnect any linked wearable
   */
  const disconnectDevice = () => {
    if (connectionType === 'bluetooth') {
      bandManager.disconnect();
    }
    setIsDeviceConnected(false);
    setConnectionType('none');
    setConnectedDeviceDetails({ name: '', battery: null, isRealBluetooth: false });
  };

  const triggerActivitySurge = () => {
    if (connectionType === 'virtual' && socketRef.current && isSocketConnected) {
      socketRef.current.emit('simulate_activity_surge');
    } else if (connectionType === 'bluetooth') {
      // Simulate surge on connected band for demo purposes
      setRawMetrics((prev) => ({
        ...prev,
        heartRate: Math.min(130, (prev.heartRate || 80) + 12),
      }));
    }
  };

  // Only expose metrics if a device is connected
  const liveMetrics = isDeviceConnected
    ? rawMetrics
    : {
        deviceId: null,
        heartRate: null,
        steps: null,
        activeCalories: null,
        spo2: null,
        stressScore: null,
        status: 'DISCONNECTED',
        timestamp: null,
      };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isSocketConnected,
        isDeviceConnected,
        connectionType,
        connectedDeviceDetails,
        isBluetoothSupported: isBluetoothSupported(),
        isBluetoothConnecting,
        bluetoothError,
        connectRealBluetoothDevice,
        connectVirtualDevice,
        disconnectDevice,
        liveMetrics,
        rawMetrics,
        hrHistory,
        triggerActivitySurge,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
