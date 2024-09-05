import React, { useState } from 'react';
import { FaPhone, FaVideo } from 'react-icons/fa';
// Component for Audio Call
const AudioCallComponent = ({ contactName, contactImage, onHangUp,receiverUser}) => {
    console.log()
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>{contactName}</h2>
      <p style={{ fontSize: '14px', color: 'gray' }}>Calling...</p>
      <img src={contactImage} alt={`${contactName}'s profile`} style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
      <br />
      <button onClick={onHangUp} style={{ marginTop: '10px' }}>Hang Up</button>
    </div>
  );
};
export default AudioCallComponent;