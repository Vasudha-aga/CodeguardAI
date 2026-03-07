import React from 'react';
import { motion } from 'motion/react';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Animated Gradient Orbs */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(124, 58, 237, 0.2) 50%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        initial={{ top: '10%', left: '5%' }}
      />

      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.4) 0%, rgba(147, 51, 234, 0.2) 50%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{
          x: [0, -80, 0],
          y: [0, 100, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        initial={{ top: '60%', right: '10%' }}
      />

      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full opacity-15"
        style={{
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.5) 0%, rgba(59, 130, 246, 0.2) 50%, transparent 70%)',
          filter: 'blur(50px)',
        }}
        animate={{
          x: [0, 50, 0],
          y: [0, -80, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        initial={{ bottom: '20%', left: '40%' }}
      />

      {/* Flowing Light Trails - SVG Paths */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.6 }}>
        <defs>
          <linearGradient id="lightTrail1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0)" />
            <stop offset="50%" stopColor="rgba(59, 130, 246, 0.8)" />
            <stop offset="100%" stopColor="rgba(124, 58, 237, 0)" />
          </linearGradient>

          <linearGradient id="lightTrail2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(124, 58, 237, 0)" />
            <stop offset="50%" stopColor="rgba(147, 51, 234, 0.8)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
          </linearGradient>

          <linearGradient id="lightTrail3" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(37, 99, 235, 0)" />
            <stop offset="50%" stopColor="rgba(59, 130, 246, 0.6)" />
            <stop offset="100%" stopColor="rgba(124, 58, 237, 0)" />
          </linearGradient>
        </defs>

        {/* Animated Light Path 1 */}
        <motion.path
          d="M-100,300 Q200,100 500,200 T1100,400"
          stroke="url(#lightTrail1)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 1, 0] }}
          transition={{
            pathLength: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
            opacity: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
          }}
        />

        {/* Animated Light Path 2 */}
        <motion.path
          d="M1200,200 Q900,400 600,300 T-100,500"
          stroke="url(#lightTrail2)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 1, 0] }}
          transition={{
            pathLength: { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 },
            opacity: { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 },
          }}
        />

        {/* Animated Light Path 3 */}
        <motion.path
          d="M500,-100 Q700,200 500,400 T300,900"
          stroke="url(#lightTrail3)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 1, 0] }}
          transition={{
            pathLength: { duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 },
            opacity: { duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 },
          }}
        />

        {/* Additional curved paths */}
        <motion.path
          d="M-50,600 Q400,500 800,650 T1500,700"
          stroke="url(#lightTrail1)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 0.8, 0] }}
          transition={{
            pathLength: { duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 2.5 },
            opacity: { duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 2.5 },
          }}
        />
      </svg>

      {/* Floating Particles */}
      {Array.from({ length: 30 }).map((_, i) => {
        const randomX = Math.random() * 100;
        const randomY = Math.random() * 100;
        const randomDuration = 10 + Math.random() * 20;
        const randomSize = 2 + Math.random() * 4;
        const randomDelay = Math.random() * 5;

        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-400"
            style={{
              left: `${randomX}%`,
              top: `${randomY}%`,
              width: `${randomSize}px`,
              height: `${randomSize}px`,
              boxShadow: '0 0 10px rgba(59, 130, 246, 0.8)',
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: randomDuration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: randomDelay,
            }}
          />
        );
      })}

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  );
}
