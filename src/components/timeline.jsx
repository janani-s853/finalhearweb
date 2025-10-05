import React, { useEffect, useRef, useState } from "react";
import { FaUsers, FaLightbulb, FaSearch, FaCogs } from "react-icons/fa";
import "./timeline.css";

const steps = [
  { id: "2023", title: "Humble Beginnings", desc: "Started with a vision to help the hearing impaired.", icon: <FaUsers size={24} />, color: "#e91e63" },
  { id: "2024", title: "Founding Vision", desc: "The core team came together to launch H.E.A.R.", icon: <FaLightbulb size={24} />, color: "#f39c12", offset: 20 },
  { id: "2025", title: "Research Phase", desc: "Built and tested the first working model.", icon: <FaSearch size={24} />, color: "#27ae60", offset: 20 },
  { id: "2026", title: "Prototype Launch", desc: "Rolled out across India via online and retail.", icon: <FaCogs size={24} />, color: "#3498db" }
];

const svgWidth = 1200;
const svgHeight = 250;
const baseY = 150;
const curveHeight = 60;

function buildWaveSegments(len, width, y) {
  const stepX = width / (len - 1);
  const segments = [];
  for (let i = 0; i < len; i++) {
    const x = i * stepX;
    const yPos = i % 2 === 0 ? y + curveHeight : y - curveHeight;
    segments.push({ x, y: yPos });
  }
  return segments;
}

export default function Timeline() {
  const pathRef = useRef(null);
  const rocketRef = useRef(null);
  const [circlePositions, setCirclePositions] = useState([]);
  const [activeStep, setActiveStep] = useState(-1);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Handle resize for responsive
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Rocket animation (desktop only)
  useEffect(() => {
    if (isMobile) return;

    const path = pathRef.current;
    const rocket = rocketRef.current;
    if (!path || !rocket) return;

    const pathLength = path.getTotalLength();
    path.style.strokeDasharray = pathLength;
    path.style.strokeDashoffset = pathLength;

    const positions = steps.map((s, i) => {
      const t = i / (steps.length - 1);
      const point = path.getPointAtLength(t * pathLength);
      return { x: point.x, y: point.y + (s.offset || 0) };
    });
    setCirclePositions(positions);

    const duration = 3000;
    let startTime = null;

    function animate(time) {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      let progress = elapsed / duration;
      if (progress > 1) progress = 1;

      const point = path.getPointAtLength(progress * pathLength);
      if (progress < 1) {
        rocket.style.left = `${point.x}px`;
        rocket.style.top = `${point.y - 20}px`;
      } else {
        rocket.style.display = "none";
      }

      path.style.strokeDashoffset = pathLength * (1 - progress);
      const stepIndex = Math.floor(progress * steps.length);
      setActiveStep(stepIndex);

      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, [isMobile]);

  // Build wave path (desktop only)
  const points = buildWaveSegments(steps.length, svgWidth, baseY);
  const segments = [];
  for (let i = 0; i < points.length - 1; i++) {
    const cpX = (points[i].x + points[i + 1].x) / 2;
    const cpY = i % 2 === 0 ? points[i].y + curveHeight : points[i].y - curveHeight;
    segments.push({
      startX: points[i].x,
      startY: points[i].y,
      cpX,
      cpY,
      endX: points[i + 1].x,
      endY: points[i + 1].y
    });
  }
  const pathD = segments.map(seg => `M ${seg.startX} ${seg.startY} Q ${seg.cpX} ${seg.cpY}, ${seg.endX} ${seg.endY}`).join(" ");

  return (
    <section className="timeline-section">
      <h2 className="timeline-heading">Our Journey</h2>
      <div className="timeline-wrapper">
        {!isMobile && (
          <svg className="timeline-svg" viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="none">
            <path d={pathD} stroke="#ffcc00" strokeWidth="4" fill="none" strokeDasharray="6 10" strokeLinecap="round"/>
            <path ref={pathRef} d={pathD} fill="none" stroke="transparent"/>
          </svg>
        )}

        {!isMobile && <div className="rocket" ref={rocketRef}></div>}

<div className="timeline-container">
  {steps.map((s, i) => {
    const pos = circlePositions[i];
    return (
      <div
        key={i}
        className={`timeline-item active`}
        style={{
          position: isMobile ? 'relative' : 'absolute',
          left: isMobile ? undefined : pos?.x - 30,
          top: isMobile ? undefined : pos?.y - 60,
          justifyContent: isMobile ? (i % 2 === 0 ? 'flex-start' : 'flex-end') : undefined
        }}
      >
        {/* Add unique class to each circle */}
        <div className={`timeline-circle circle-${i + 1}`} style={{ borderColor: s.color, background: "#1e1e2f" }}>
          {/* Add unique class to each icon */}
          <div className={`timeline-icon icon-${i + 1}`} style={{ color: s.color }}>
            {s.icon}
          </div>
        </div>

        {/* Add unique class for each text box */}
        <div className={`timeline-text top box-${i + 1}`}>
          <h3>{s.title}</h3>
          <p>{s.desc}</p>
          <span className="timeline-num" style={{ color: s.color }}>{s.id}</span>
        </div>
      </div>
    );
  })}
</div>


      </div>
    </section>
  );
}
