/**
 * WebSocket Health Sync Simulator
 * Simulates real-time smartwatch telemetry emitted to connected clients.
 */

export const setupHealthSimulator = (io) => {
  io.on('connection', (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    // Initial state for this smartwatch connection session
    let heartRate = Math.floor(Math.random() * (90 - 75 + 1)) + 75; // Starting resting HR 75-90 bpm
    let steps = Math.floor(Math.random() * (4500 - 2800 + 1)) + 2800; // Baseline steps
    let activeCalories = Math.floor(steps * 0.042 * 10) / 10; // Dynamic active calories burned
    let spo2 = 98;
    let stressScore = 24;

    // Send immediate initial sync upon connection
    const sendTelemetry = () => {
      // Dynamic random walk for realistic fluctuating heart rate between 70-120 bpm
      const deltaHR = (Math.random() - 0.48) * 8; // slight upward / downward drift
      heartRate = Math.round(Math.min(120, Math.max(70, heartRate + deltaHR)));

      // Dynamically increasing step count (simulating active day movement)
      const stepIncrement = Math.floor(Math.random() * 12) + 3; // +3 to +14 steps per 4s
      steps += stepIncrement;

      // Dynamically increasing active calories burned
      const calIncrement = Math.round((stepIncrement * 0.045 + Math.random() * 0.2) * 10) / 10;
      activeCalories = Math.round((activeCalories + calIncrement) * 10) / 10;

      // Small SpO2 and stress fluctuations
      spo2 = Math.random() > 0.85 ? (Math.random() > 0.5 ? 99 : 97) : 98;
      stressScore = Math.round(Math.min(65, Math.max(15, stressScore + (Math.random() - 0.5) * 4)));

      const telemetryPayload = {
        deviceId: `CYBER-BAND-X9-${socket.id.substring(0, 5).toUpperCase()}`,
        heartRate,
        steps,
        activeCalories,
        spo2,
        stressScore,
        status: 'STREAMING_LIVE',
        syncFrequencySeconds: 4,
        timestamp: new Date().toISOString(),
      };

      socket.emit('live_health_metrics', telemetryPayload);
    };

    // Emit initial burst immediately
    sendTelemetry();

    // Establish setInterval emitting live_health_metrics every 4 seconds
    const intervalId = setInterval(sendTelemetry, 4000);

    // Allow client to manually request a sync or trigger an exertion spike
    socket.on('simulate_activity_surge', (data) => {
      console.log(`[Socket.io] Simulating exertion surge for ${socket.id}`);
      heartRate = Math.min(120, heartRate + 15);
      sendTelemetry();
    });

    // Cleanup on disconnect
    socket.on('disconnect', (reason) => {
      console.log(`[Socket.io] Client disconnected (${socket.id}): ${reason}`);
      clearInterval(intervalId);
    });
  });
};
