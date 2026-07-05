import { useRef, useEffect, useMemo, useState } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import './StickerPeel.css';

gsap.registerPlugin(Draggable);

const StickerPeel = ({
  imageSrc,
  stickerId,
  rotate = 30,
  peelBackHoverPct = 30,
  peelBackActivePct = 40,
  peelEasing = 'power3.out',
  peelHoverEasing = 'power2.out',
  width = 200,
  shadowIntensity = 0.6,
  initialPosition = 'center',
  onRemove,
}) => {
  const containerRef = useRef(null);
  const dragTargetRef = useRef(null);
  const draggableInstanceRef = useRef(null);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    const target = dragTargetRef.current;
    if (!target) return;
    if (typeof initialPosition === 'object' && initialPosition.x !== undefined && initialPosition.y !== undefined) {
      gsap.set(target, { x: initialPosition.x, y: initialPosition.y });
    }
  }, [initialPosition]);

  useEffect(() => {
    const target = dragTargetRef.current;
    if (!target) return;

    const clampToBounds = () => {
      const rect = target.getBoundingClientRect();
      const parentRect = target.parentNode.getBoundingClientRect();
      const maxX = parentRect.width - rect.width;
      const maxY = parentRect.height - rect.height;
      const curX = gsap.getProperty(target, 'x');
      const curY = gsap.getProperty(target, 'y');
      const newX = Math.max(0, Math.min(curX, maxX));
      const newY = Math.max(0, Math.min(curY, maxY));
      if (newX !== curX || newY !== curY) {
        gsap.to(target, { x: newX, y: newY, duration: 0.3, ease: 'power2.out' });
      }
    };

    draggableInstanceRef.current = Draggable.create(target, {
      type: 'x,y',
      edgeResistance: 1,
      inertia: true,
      onDragStart() {
        clampToBounds();
      },
      onDrag() {
        const rot = gsap.utils.clamp(-24, 24, this.deltaX * 0.4);
        gsap.to(target, { rotation: rot, duration: 0.15, ease: 'power1.out' });
      },
      onDragEnd() {
        gsap.to(target, { rotation: 0, duration: 0.8, ease: 'power2.out' });
      },
    })[0];

    const handleResize = () => {
      if (draggableInstanceRef.current) {
        draggableInstanceRef.current.update();
        clampToBounds();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (draggableInstanceRef.current) {
        draggableInstanceRef.current.kill();
      }
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleTouchStart = () => container.classList.add('touch-active');
    const handleTouchEnd = () => container.classList.remove('touch-active');
    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchend', handleTouchEnd);
    container.addEventListener('touchcancel', handleTouchEnd);
    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, []);

  const handleRemove = () => {
    setRemoved(true);
    if (draggableInstanceRef.current) {
      draggableInstanceRef.current.kill();
    }
    gsap.to(dragTargetRef.current, {
      scale: 0, opacity: 0, duration: 0.3, ease: 'back.in(1.5)',
      onComplete: () => onRemove?.(stickerId),
    });
  };

  const cssVars = useMemo(
    () => ({
      '--sticker-rotate': `${rotate}deg`,
      '--sticker-peelback-hover': `${peelBackHoverPct}%`,
      '--sticker-peelback-active': `${peelBackActivePct}%`,
      '--sticker-peel-easing': peelEasing,
      '--sticker-peel-hover-easing': peelHoverEasing,
      '--sticker-width': `${width}px`,
      '--sticker-shadow-opacity': shadowIntensity,
    }),
    [rotate, peelBackHoverPct, peelBackActivePct, peelEasing, peelHoverEasing, width, shadowIntensity]
  );

  if (removed) return null;

  return (
    <div className="sticker-draggable" ref={dragTargetRef} style={cssVars}>
      <div className="sticker-container" ref={containerRef}>
        <button className="sticker-remove-btn" onClick={(e) => { e.stopPropagation(); handleRemove(); }}>
          ✕
        </button>
        <div className="sticker-main">
          <img src={imageSrc} alt="" className="sticker-image" draggable="false"
            onContextMenu={(e) => e.preventDefault()} />
        </div>
        <div className="flap">
          <img src={imageSrc} alt="" className="flap-image" draggable="false"
            onContextMenu={(e) => e.preventDefault()} />
        </div>
      </div>
    </div>
  );
};

export default StickerPeel;
