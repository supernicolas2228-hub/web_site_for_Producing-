/** Плавные «вылетающие» блоки: пружина + лёгкий масштаб */
export const fadeUp = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 85,
      damping: 20,
      mass: 0.9,
      delay: i * 0.08,
    },
  }),
};

export const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.11, delayChildren: 0.06 },
  },
};

/** Для карточек в сетке — чуть бодрее */
export const cardReveal = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 20,
      delay: i * 0.06,
    },
  }),
};
