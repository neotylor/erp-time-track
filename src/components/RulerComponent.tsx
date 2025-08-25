import React from "react";

interface RulerProps {
  orientation: "horizontal" | "vertical";
  length: number;
  zoom?: number;
  offset?: number;
}

const RulerComponent: React.FC<RulerProps> = ({ 
  orientation, 
  length, 
  zoom = 1, 
  offset = 0 
}) => {
  const isHorizontal = orientation === "horizontal";
  const rulerSize = 20; // ruler thickness in pixels
  
  // Create tick marks every 10, 50, and 100 pixels
  const createTicks = () => {
    const ticks = [];
    const step = 10;
    const maxTicks = Math.ceil(length / step);
    
    for (let i = 0; i <= maxTicks; i++) {
      const position = i * step * zoom + offset;
      if (position > length) break;
      
      const isMajor = i % 10 === 0; // Every 100px
      const isMid = i % 5 === 0; // Every 50px
      
      let tickHeight = 4;
      if (isMajor) tickHeight = 12;
      else if (isMid) tickHeight = 8;
      
      const tickStyle = isHorizontal ? {
        left: `${position}px`,
        height: `${tickHeight}px`,
        top: `${rulerSize - tickHeight}px`,
      } : {
        top: `${position}px`,
        width: `${tickHeight}px`,
        left: `${rulerSize - tickHeight}px`,
      };
      
      ticks.push(
        <div
          key={i}
          className="absolute bg-foreground/60"
          style={{
            ...tickStyle,
            width: isHorizontal ? "1px" : `${tickHeight}px`,
            height: isHorizontal ? `${tickHeight}px` : "1px",
          }}
        />
      );
      
      // Add labels for major ticks
      if (isMajor && i > 0) {
        const labelValue = i * step;
        const labelStyle = isHorizontal ? {
          left: `${position + 2}px`,
          top: "2px",
        } : {
          top: `${position + 2}px`,
          left: "2px",
          transform: "rotate(-90deg)",
          transformOrigin: "left center",
        };
        
        ticks.push(
          <span
            key={`label-${i}`}
            className="absolute text-xs text-foreground/70 select-none"
            style={labelStyle}
          >
            {labelValue}
          </span>
        );
      }
    }
    
    return ticks;
  };
  
  const rulerStyle = isHorizontal ? {
    width: `${length}px`,
    height: `${rulerSize}px`,
  } : {
    width: `${rulerSize}px`,
    height: `${length}px`,
  };
  
  return (
    <div
      className="relative bg-muted border-border select-none"
      style={{
        ...rulerStyle,
        borderWidth: isHorizontal ? "0 0 1px 0" : "0 1px 0 0",
      }}
    >
      {createTicks()}
    </div>
  );
};

export default RulerComponent;