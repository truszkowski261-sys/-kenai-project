import React, { useState } from "react";
import "./ButtonEffect.css";

interface Polygon {
  left: string;
  top: string;
}

const AnimatedButton: React.FC = () => {
  const [polygons, setPolygons] = useState<Polygon[]>([]);

  const handleMouseEnter = () => {
    // Create random polygons on hover
    const newPolygons: Polygon[] = [];
    for (let i = 0; i < 20; i++) {
      const start = Math.random() * 1500;
      console.log(start);
      const xPos = Math.random() * 100;
      const yPos = Math.random() * 100;
      setTimeout(() => {
        newPolygons.push({ left: `${xPos}%`, top: `${yPos}%` });
      }, start);
    }
    setPolygons(newPolygons);

    // Remove polygons after animation ends
  };

  const handleMouseLeave = () => {
    setPolygons([]);
  };

  return (
    <div className="button-container">
      <button
        className="animated-button"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span className="button-text">Join Waitlist</span>
      </button>
      <div className="polygon-container">
        {polygons.map((polygon, index) => (
          <div
            key={index}
            className="polygon"
            style={{ left: polygon.left, top: polygon.top }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default AnimatedButton;
