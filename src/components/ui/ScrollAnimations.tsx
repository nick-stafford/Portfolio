import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ScrollAnimations() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Wait for DOM to be ready
    const initAnimations = () => {
      // Animate section headers
      gsap.utils.toArray('.section-header').forEach((header: any) => {
        gsap.from(header, {
          scrollTrigger: {
            trigger: header,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
        });
      });

      // Animate glass cards
      gsap.utils.toArray('.glass-card').forEach((card: any, i: number) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          y: 60,
          opacity: 0,
          duration: 0.6,
          delay: i * 0.1,
          ease: 'power2.out',
        });
      });

      // Animate skill tags
      gsap.utils.toArray('.skill-tag').forEach((tag: any, i: number) => {
        gsap.from(tag, {
          scrollTrigger: {
            trigger: tag,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
          scale: 0.8,
          opacity: 0,
          duration: 0.4,
          delay: i * 0.03,
          ease: 'back.out(1.7)',
        });
      });

      // Animate buttons
      gsap.utils.toArray('.btn').forEach((btn: any) => {
        gsap.from(btn, {
          scrollTrigger: {
            trigger: btn,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
          y: 20,
          opacity: 0,
          duration: 0.5,
          ease: 'power2.out',
        });
      });

      // Parallax effect on sections
      gsap.utils.toArray('section').forEach((section: any) => {
        const bg = section.querySelector('.absolute');
        if (bg) {
          gsap.to(bg, {
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
            y: -50,
            ease: 'none',
          });
        }
      });

      // Stagger animation for stats
      const stats = document.querySelectorAll('.grid-cols-3 .glass-card');
      if (stats.length > 0) {
        gsap.from(stats, {
          scrollTrigger: {
            trigger: stats[0],
            start: 'top 80%',
          },
          y: 40,
          opacity: 0,
          duration: 0.5,
          stagger: 0.15,
          ease: 'power2.out',
        });
      }

      // Text reveal animation
      gsap.utils.toArray('h2, h3').forEach((heading: any) => {
        gsap.from(heading, {
          scrollTrigger: {
            trigger: heading,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          y: 30,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
        });
      });

      // Line drawing animation for timeline
      const timelineLine = document.querySelector('.absolute.left-0.md\\:left-1\\/2');
      if (timelineLine) {
        gsap.from(timelineLine, {
          scrollTrigger: {
            trigger: timelineLine,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1,
          },
          scaleY: 0,
          transformOrigin: 'top',
          ease: 'none',
        });
      }
    };

    // Small delay to ensure DOM is ready
    setTimeout(initAnimations, 100);

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return null;
}
