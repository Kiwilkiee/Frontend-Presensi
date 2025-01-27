import React, { useState, useEffect } from 'react';
import {Tilt} from 'react-tilt'; // Import from react-parallax-tilt
import './clock.css';

function Clock() {
  const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
        setTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'December'];
  const day = days[time.getDay()];
  const hours = String(time.getHours()).padStart(2, '0');
  const minutes = String(time.getMinutes()).padStart(2, '0');
  const seconds = String(time.getSeconds()).padStart(2, '0');
  const date = String(time.getDate()).padStart(2, '0');
  const month = months[time.getMonth()];
  const year = time.getFullYear();

  return (
    <Tilt
      className="Tilt" >
      <div className="clock-container">
        <div className="clock-day">{day}</div> {/* Pop-out effect on day */}
        <div className="clock-time">
          {hours}:{minutes}:{seconds}
        </div>
        <div className="clock-date ">
          {date} {month} {year}
        </div>
      </div>
    </Tilt>
  );
}

export default Clock;
