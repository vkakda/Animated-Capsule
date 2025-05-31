import { useRef, useEffect, useMemo } from 'react';
import gsap from 'gsap';

const CapsuleAnimation = () => {
  const capsuleRef = useRef(null);
  const topHalfRef = useRef(null);
  const bottomHalfRef = useRef(null);
  const dotsRef = useRef([]);

  // Generate powder dots only once
  const powderDots = useMemo(() => {  //useMEMO is react hook to increase the performance during value computation.
    return Array.from({ length: 100 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      width: `${Math.random() * 3 + 3}px`,
      height: `${Math.random() * 3 + 3}px`,
      opacity: Math.random() * 0.5 + 0.3,
      borderRadius: `${Math.random() * 70 + 20}% / ${Math.random() * 70 + 20}%`,
    }));
  }, []);

  useEffect(() => {
    if (!capsuleRef.current) return;

    const capsuleNode = capsuleRef.current;

    // Capsule rotation animation
    const rotation = gsap.to(capsuleNode, {
      rotate: 360,
      duration: 8,
      ease: 'none',
      repeat: -1,
    });

    // Open/close animation timeline
    const openAnim = gsap.timeline({ paused: true });
    openAnim
      .to(topHalfRef.current, { y: '-50px', duration: 0.5, ease: 'power2.out' })
      .to(bottomHalfRef.current, { y: '50px', duration: 0.5, ease: 'power2.out' }, '<');

    // Event handlers (saved references for cleanup)
    const handleMouseEnter = () => openAnim.play();
    const handleMouseLeave = () => openAnim.reverse();

    capsuleNode.addEventListener('mouseenter', handleMouseEnter);
    capsuleNode.addEventListener('mouseleave', handleMouseLeave);

    // Animate powder dots
    dotsRef.current.forEach((dot) => {
      if (dot) {
        gsap.to(dot, {
          y: '-20px',
          duration: 0.45 + Math.random() * 0.15,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: Math.random(),
        });
        gsap.to(dot, {
          opacity: '+=0.2',
          duration: 1 + Math.random(),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }
    });

    // Cleanup
    return () => {
      rotation.kill();
      openAnim.kill();
      capsuleNode.removeEventListener('mouseenter', handleMouseEnter);
      capsuleNode.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [powderDots]);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-black">
      <div
        ref={capsuleRef}
        className="w-80 h-80 relative cursor-pointer"
        role="button"
        aria-label="Animated medicine capsule"
      >
        {/* Top Half */}
        <div
          ref={topHalfRef}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[136px] h-[160px] rounded-t-full z-10 capsule-top"
        />

        {/* Bottom Half */}
        <div
          ref={bottomHalfRef}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[136px] h-[160px] rounded-b-full z-10 capsule-bottom"
        />

        {/* Powder Container */}
        <div className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[128px] h-[160px] rounded-full overflow-hidden z-0">
          <div className="relative w-full h-full">
            {powderDots.map((dot, i) => (
              <div
                key={i}
                ref={(el) => (dotsRef.current[i] = el)} // Attach refs properly here!
                className="absolute powder-dot glow"
                style={{
                  left: dot.left,
                  top: dot.top,
                  width: dot.width,
                  height: dot.height,
                  opacity: dot.opacity,
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  borderRadius: dot.borderRadius,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CapsuleAnimation;
