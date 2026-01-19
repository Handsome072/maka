import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState, useEffect, Children } from 'react';
import { motion, useInView } from 'motion/react';

interface PropertyCarouselProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  showMoreLink?: boolean;
}

function useWindowWidth() {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
}

export function PropertyCarousel({ title, subtitle, children, showMoreLink = true }: PropertyCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < 745;

  const isInView = useInView(sectionRef, { once: true, margin: "-100px 0px" });
  const childArray = Children.toArray(children);

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    checkScroll();
    container.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);

    return () => {
      container.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8;
    const targetScroll = direction === 'left'
      ? container.scrollLeft - scrollAmount
      : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
  };

  return (
    <motion.section
      ref={sectionRef}
      className="relative py-8"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl" style={{ fontWeight: 600 }}>{title}</h2>
              {showMoreLink && (
                <button className="p-2 rounded-full text-sm text-gray-700 bg-gray-100 hover:underline flex items-center gap-1">
                  <svg
                    viewBox="0 0 18 18"
                    className="w-3 h-3"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 1.5L16.5 9L9 16.5M16.5 9H1.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
            </div>
            {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
          </div>
          {/* Navigation arrows - hidden on mobile (S < 745) */}
          <div className={`flex items-center gap-2 ${isMobile ? 'hidden' : ''}`}>
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`p-2 border border-gray-300 rounded-full hover:shadow-md transition-all ${!canScrollLeft ? 'opacity-30 cursor-not-allowed' : 'hover:scale-105'
                }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`p-2 border border-gray-300 rounded-full hover:shadow-md transition-all ${!canScrollRight ? 'opacity-30 cursor-not-allowed' : 'hover:scale-105'
                }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {childArray.map((child, index) => (
            <div key={index} className="flex-shrink-0 transition-all duration-300">
              {child}
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}