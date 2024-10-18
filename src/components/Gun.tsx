import React, { useState } from 'react';
import './Gun.css'; // Make sure to import the CSS file
import gunImage from '../assets/gun.png'; // Import the gun image
import cockingSound from '../assets/cocking.mp3'; // Import the cocking sound
import gunshotSound from '../assets/gunshot.mp3'; // Import the gunshot sound
import dudSound from '../assets/dud.mp3'; // Import the dud sound
import reloadSound from '../assets/reload.mp3'; // Import the reload sound

const TOTAL_CHAMBERS = 6;

const Gun: React.FC = () => {
  const [shotsFired, setShotsFired] = useState(0);
  const [probability, setProbability] = useState(1 / TOTAL_CHAMBERS);
  const [isShot, setIsShot] = useState(false); // State to track if the user got shot
  const [isCocked, setIsCocked] = useState(false); // State to track if the gun is cocked
  const [isCocking, setIsCocking] = useState(false); // State to track if the gun is cocking
  const [isReloading, setIsReloading] = useState(false); // State to track if the gun is reloading

  const handleCock = () => {
    setIsCocking(true);
    const audio = new Audio(cockingSound);
    audio.play();
    audio.onended = () => {
      setIsCocking(false);
      setIsCocked(true);
    };
  };

  const handleShoot = () => {
    const shot = Math.random() < probability;
    setIsShot(shot);
    setIsCocked(false);
    if (shot) {
      new Audio(gunshotSound).play(); // Play gunshot sound
    } else {
      new Audio(dudSound).play(); // Play dud sound
      setShotsFired(shotsFired + 1);
      setProbability(1 / (TOTAL_CHAMBERS - shotsFired - 1));
    }
  };

  const handleReset = () => {
    setIsReloading(true);
    const audio = new Audio(reloadSound);
    audio.play();
    audio.onended = () => {
      setShotsFired(0);
      setProbability(1 / TOTAL_CHAMBERS);
      setIsShot(false); // Reset the shot state
      setIsCocked(false); // Reset the cocked state
      setIsReloading(false);
    };
  };

  const handleIncrement = () => {
    if (shotsFired < TOTAL_CHAMBERS - 1) {
      setShotsFired(shotsFired + 1);
      setProbability(1 / (TOTAL_CHAMBERS - shotsFired - 1));
    }
  };

  const handleDecrement = () => {
    if (shotsFired > 0) {
      setShotsFired(shotsFired - 1);
      setProbability(1 / (TOTAL_CHAMBERS - shotsFired + 1));
    }
  };

  const canCock = !isCocking && !isReloading && !isCocked && !isShot && shotsFired < TOTAL_CHAMBERS;

  const canReset = shotsFired > 0 && !isCocking && !isCocked;

  const infoText = () => {
    if (isCocking) {
      return { text: 'Cocking...', className: '' };
    } else if (isReloading) {
      return { text: 'Resetting...', className: '' };
    } else if (isShot) {
      return { text: 'You Died!', className: 'dead' };
    } else if (isCocked) {
      return { text: 'Tap anywhere to shoot', className: 'shoot' };
    } else {
      return { text: `${shotsFired}/${TOTAL_CHAMBERS}`, className: 'shots-fired' };
    }
  };

  const { text, className } = infoText();

  return (
    <div className="gun-container" onClick={isCocked ? handleShoot : undefined}>
      <img src={gunImage} alt="Gun" className="gun-image" />
      <div className="controls">
        <p className={`info-text ${className}`}>
          {className === 'shots-fired' && (
            <div className="shots-fired-div">
              <button onClick={handleDecrement} className="small-button">-</button>
              {text}
              <button onClick={handleIncrement} className="small-button">+</button>
            </div>
          )}
          {className !== 'shots-fired' && text}
        </p>
        <div className="button-group">
          <button 
            onClick={handleCock} 
            id="cock-button"
            className={!canCock ? 'disabled' : ''}
            disabled={!canCock}
          >
            Cock
          </button>
          <button
            onClick={handleReset}
            id="reset-button"
            className={!canReset ? 'disabled' : ''}
            disabled={!canReset}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default Gun;