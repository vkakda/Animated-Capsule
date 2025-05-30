import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';


 const CapsuleAnimation = () => {
  const capsuleRef = useRef(null);
  const topHalfRef = useRef(null);
  const bottomHalfRef = useRef(null);

  useGSAP(() => {
    const rotation = gsap.to(capsuleRef.current, {
      rotate: 360,
      duration: 4,
      ease: 'none',
      repeat: -1,
    });

    const openAnim = gsap.timeline({ paused: true });
    openAnim
      .to(topHalfRef.current, { y: '-50px', duration: 0.5, ease: 'power2.out' })
      .to(bottomHalfRef.current, { y: '50px', duration: 0.5, ease: 'power2.out' }, '<');

    const capsule = capsuleRef.current;
    capsule.addEventListener('mouseenter', () => openAnim.play());
    capsule.addEventListener('mouseleave', () => openAnim.reverse());

    return () => {
      rotation.kill();
      openAnim.kill();
      capsule.removeEventListener('mouseenter', () => openAnim.play());
      capsule.removeEventListener('mouseleave', () => openAnim.reverse());
    };
  }, []);

  // Powder dots
  const powderDots = Array.from({ length: 250 }).map(() => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: `${Math.random() * 3 + 1.5}px`,
    opacity: Math.random() * 0.4 + 0.3,
  }));

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-black">
      <div ref={capsuleRef} className="w-80 h-80 relative cursor-pointer">
        {/* Top Half */}
        <div
          ref={topHalfRef}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-34 h-40 rounded-t-full z-10 capsule-top"/>

        {/* Bottom Half */}
        <div
          ref={bottomHalfRef}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-34 h-40 rounded-b-full z-10 capsule-bottom"/>
        {/* Powder Container */}
        <div className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-40 rounded-full overflow-hidden z-0">
          <div className="relative w-full h-full">
            {powderDots.map((dot, index) => (
              <div
                key={index}
                className="absolute rounded-full"
                style={{
                  left: dot.left,
                  top: dot.top,
                  width: dot.size,
                  height: dot.size,
                  opacity: dot.opacity,
                  backgroundColor: 'rgba(255, 255, 255, 0.6)',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


export default CapsuleAnimation;