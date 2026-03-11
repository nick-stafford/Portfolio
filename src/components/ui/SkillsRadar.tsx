import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Skill {
  name: string;
  level: number; // 0-100
  color?: string;
}

interface SkillsRadarProps {
  skills: Skill[];
  size?: number;
}

export default function SkillsRadar({ skills, size = 300 }: SkillsRadarProps) {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const center = size / 2;
  const radius = (size / 2) * 0.8;
  const levels = [20, 40, 60, 80, 100];
  const angleStep = (2 * Math.PI) / skills.length;

  // Calculate point position
  const getPoint = (index: number, level: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (level / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Generate polygon path
  const getPolygonPath = (levelMultiplier: number = 1) => {
    return skills
      .map((skill, i) => {
        const point = getPoint(i, skill.level * levelMultiplier);
        return `${point.x},${point.y}`;
      })
      .join(' ');
  };

  // Generate level polygon
  const getLevelPath = (level: number) => {
    return skills
      .map((_, i) => {
        const point = getPoint(i, level);
        return `${point.x},${point.y}`;
      })
      .join(' ');
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="overflow-visible">
        <defs>
          <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#635BFF', stopOpacity: 0.8 }} />
            <stop offset="100%" style={{ stopColor: '#00D4FF', stopOpacity: 0.6 }} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background levels */}
        {levels.map((level) => (
          <polygon
            key={level}
            points={getLevelPath(level)}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="1"
            opacity={0.3}
          />
        ))}

        {/* Axis lines */}
        {skills.map((_, i) => {
          const point = getPoint(i, 100);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={point.x}
              y2={point.y}
              stroke="var(--color-border)"
              strokeWidth="1"
              opacity={0.3}
            />
          );
        })}

        {/* Data polygon */}
        <motion.polygon
          points={getPolygonPath(isVisible ? 1 : 0)}
          fill="url(#radarGradient)"
          stroke="var(--color-accent-primary)"
          strokeWidth="2"
          filter="url(#glow)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />

        {/* Data points */}
        {skills.map((skill, i) => {
          const point = getPoint(i, skill.level);
          const isHovered = hoveredSkill === skill.name;
          return (
            <motion.circle
              key={skill.name}
              cx={point.x}
              cy={point.y}
              r={isHovered ? 8 : 5}
              fill="var(--color-accent-primary)"
              stroke="white"
              strokeWidth="2"
              style={{ cursor: 'pointer' }}
              initial={{ scale: 0 }}
              animate={{ scale: isVisible ? 1 : 0 }}
              transition={{ delay: 0.5 + i * 0.1, type: 'spring' }}
              onMouseEnter={() => setHoveredSkill(skill.name)}
              onMouseLeave={() => setHoveredSkill(null)}
              filter="url(#glow)"
            />
          );
        })}

        {/* Labels */}
        {skills.map((skill, i) => {
          const point = getPoint(i, 115);
          const isHovered = hoveredSkill === skill.name;
          return (
            <motion.text
              key={`label-${skill.name}`}
              x={point.x}
              y={point.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={isHovered ? 'var(--color-accent-primary)' : 'var(--color-text-secondary)'}
              fontSize={isHovered ? 14 : 12}
              fontWeight={isHovered ? 600 : 400}
              style={{ cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={() => setHoveredSkill(skill.name)}
              onMouseLeave={() => setHoveredSkill(null)}
            >
              {skill.name}
            </motion.text>
          );
        })}

        {/* Center label */}
        {hoveredSkill && (
          <motion.g
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <text
              x={center}
              y={center - 8}
              textAnchor="middle"
              fill="var(--color-text-primary)"
              fontSize={16}
              fontWeight={600}
            >
              {hoveredSkill}
            </text>
            <text
              x={center}
              y={center + 12}
              textAnchor="middle"
              fill="var(--color-accent-primary)"
              fontSize={14}
            >
              {skills.find((s) => s.name === hoveredSkill)?.level}%
            </text>
          </motion.g>
        )}
      </svg>
    </div>
  );
}
