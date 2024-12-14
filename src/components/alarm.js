import React, { useState, useEffect } from 'react';
import { publishMessage, subscribeToChannel, unsubscribeFromChannel } from './API/PubNub'; 
import Clock from "./Img/clock.svg"
import './App.css'; 

const AlarmApp = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alarmTime, setAlarmTime] = useState({ hours: '', minutes: '', seconds: '' });
  const [alarmSet, setAlarmSet] = useState(false);
  const [alarms, setAlarms] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleAlarmMessage = (message) => {
      alert(`Будильник сработал! Время: ${message}`);
    };

    subscribeToChannel('alarm-channel', handleAlarmMessage);

    return () => unsubscribeFromChannel('alarm-channel');
  }, []);

  useEffect(() => {
    alarms.forEach((alarm) => {
      const [hours, minutes, seconds] = alarm.time.split(':').map(Number);
      if (
        alarm.isActive &&
        currentTime.getHours() === hours &&
        currentTime.getMinutes() === minutes &&
        currentTime.getSeconds() === seconds
      ) {
        publishMessage('alarm-channel', `Будильник сработал в ${currentTime.toLocaleTimeString()}`);
        alert(`Будильник сработал: ${alarm.time}`);
      }
    });
  }, [currentTime, alarms]);


  return (
    <div className="app-container">
      <img src={Clock} alt="" />
      <div className="current-time">
        <h2>{currentTime.toLocaleTimeString()}</h2>
        <p>{currentTime.toLocaleDateString()}</p>
      </div>
      <div className="alarm-setup">
        <select
          onChange={(e) => setAlarmTime({ ...alarmTime, hours: e.target.value })}
          defaultValue=""
        >
          <option value="" disabled>
            Hrs
          </option>
          {Array.from({ length: 24 }, (_, i) => (
            <option key={i} value={i}>
              {i < 10 ? `0${i}` : i}
            </option>
          ))}
        </select>
        <select
          onChange={(e) => setAlarmTime({ ...alarmTime, minutes: e.target.value })}
          defaultValue=""
        >
          <option value="" disabled>
            Min
          </option>
          {Array.from({ length: 60 }, (_, i) => (
            <option key={i} value={i}>
              {i < 10 ? `0${i}` : i}
            </option>
          ))}
        </select>
        <select
          onChange={(e) => setAlarmTime({ ...alarmTime, seconds: e.target.value })}
          defaultValue=""
        >
          <option value="" disabled>
            Sec
          </option>
          {Array.from({ length: 60 }, (_, i) => (
            <option key={i} value={i}>
              {i < 10 ? `0${i}` : i}
            </option>
          ))}
        </select>
        <button onClick={handleSetAlarm}>Set Alarm</button>
        <div className="alarms-list">
          {alarms.map((alarm, index) => (
            <div key={index} className="alarm-item">
              <div className="alarm-time">{alarm.time}</div>
              <div className="alarm-date">{currentTime.toLocaleDateString()}</div>
              <div className="switch">
                <div className="switch__1">
                  <input
                    id={`switch-${index}`}
                    type="checkbox"
                    checked={alarm.isActive}
                    onChange={() => toggleAlarm(index)}
                  />
                  <label htmlFor={`switch-${index}`}></label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlarmApp;