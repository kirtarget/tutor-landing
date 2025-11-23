"use client";

import { useEffect, useRef } from "react";

export function BlobBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const blobRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let animationFrameId: number;
    
    const handleScroll = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      
      animationFrameId = requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        
        blobRefs.current.forEach((blob, index) => {
          if (!blob) return;
          // Разная скорость для разных блобов (параллакс)
          const speed = 0.15 + (index % 3) * 0.1;
          const parallaxY = -(scrolled * speed);
          // Используем CSS переменную для параллакса
          blob.style.setProperty('--parallax-y', `${parallaxY}px`);
        });
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Вызываем сразу для начальной позиции
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
      style={{ zIndex: 1 }}
    >
      {/* Blob 1 - Soft Blue */}
      <div
        ref={(el) => (blobRefs.current[0] = el)}
        className="blob blob-1 absolute w-[800px] h-[800px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(96, 165, 250, 0.4) 0%, rgba(96, 165, 250, 0.2) 40%, rgba(96, 165, 250, 0.05) 70%, transparent 100%)",
          top: "10%",
          left: "5%",
          filter: "blur(80px)",
          opacity: 0.6,
        }}
      />
      
      {/* Blob 2 - Soft Indigo */}
      <div
        ref={(el) => (blobRefs.current[1] = el)}
        className="blob blob-2 absolute w-[700px] h-[700px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(129, 140, 248, 0.4) 0%, rgba(129, 140, 248, 0.2) 40%, rgba(129, 140, 248, 0.05) 70%, transparent 100%)",
          top: "50%",
          right: "10%",
          filter: "blur(80px)",
          opacity: 0.6,
        }}
      />
      
      {/* Blob 3 - Purple */}
      <div
        ref={(el) => (blobRefs.current[2] = el)}
        className="blob blob-3 absolute w-[750px] h-[750px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(196, 181, 253, 0.4) 0%, rgba(196, 181, 253, 0.2) 40%, rgba(196, 181, 253, 0.05) 70%, transparent 100%)",
          bottom: "15%",
          left: "20%",
          filter: "blur(80px)",
          opacity: 0.5,
        }}
      />
      
      {/* Blob 4 - Cyan */}
      <div
        ref={(el) => (blobRefs.current[3] = el)}
        className="blob blob-4 absolute w-[650px] h-[650px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(103, 232, 249, 0.4) 0%, rgba(103, 232, 249, 0.2) 40%, rgba(103, 232, 249, 0.05) 70%, transparent 100%)",
          top: "70%",
          right: "30%",
          filter: "blur(80px)",
          opacity: 0.5,
        }}
      />
      
      {/* Blob 5 - Pink */}
      <div
        ref={(el) => (blobRefs.current[4] = el)}
        className="blob blob-5 absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(251, 113, 133, 0.35) 0%, rgba(251, 113, 133, 0.2) 40%, rgba(251, 113, 133, 0.05) 70%, transparent 100%)",
          top: "30%",
          left: "50%",
          filter: "blur(80px)",
          opacity: 0.4,
        }}
      />
    </div>
  );
}

