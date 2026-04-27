/**
 * Единая система движения сайта: одни и те же пружины/кривые,
 * чтобы блоки, герой и навигация ощущались одной «качественной» анимацией.
 */

/** Быстрый старт, длинный мягкий хвост — подходит к большинству UI */
export const easePremium = [0.22, 1, 0.36, 1] as const;

/** Медленные циклы (левитация, свечения): без резкого рывка */
export const easeFloat = [0.45, 0, 0.55, 1] as const;

/** Пружины: именованные пресеты для `transition={spring.*}` */
export const spring = {
  panel: { type: "spring" as const, stiffness: 76, damping: 22, mass: 0.7 },
  hero: { type: "spring" as const, stiffness: 82, damping: 21, mass: 0.65 },
  heroDelayed: { type: "spring" as const, stiffness: 82, damping: 21, mass: 0.65, delay: 0.2 },
  portrait: { type: "spring" as const, stiffness: 70, damping: 20, mass: 0.72, delay: 0.05 },
  ctaRow: { type: "spring" as const, stiffness: 86, damping: 21, mass: 0.62, delay: 0.18 },
  /** Лента под героем — чуть позже основного блока */
  marquee: { type: "spring" as const, stiffness: 78, damping: 21, mass: 0.68, delay: 0.35 },
  nav: { type: "spring" as const, stiffness: 96, damping: 22 },
  navDrawer: { type: "spring" as const, stiffness: 108, damping: 22, delay: 0.1 },
  /** Мелкие всплески внутри секций (плашка, лид) */
  sectionMicro: { type: "spring" as const, stiffness: 100, damping: 21, mass: 0.7 },
  /** Короткая «пружина» для подписи/бейджа (scale) */
  sectionPunch: { type: "spring" as const, stiffness: 200, damping: 20, mass: 0.6, delay: 0.15 },
  /** Модалки и оверлеи */
  modal: { type: "spring" as const, stiffness: 320, damping: 28 },
  /** Тумблеры, круглые переключатели */
  toggle: { type: "spring" as const, stiffness: 400, damping: 22 },
} as const;

/** Плавные «вылетающие» блоки: пружина + лёгкий масштаб */
export const fadeUp = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 90,
      damping: 20,
      mass: 0.78,
      delay: i * 0.085,
    },
  }),
};

export const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.04 },
  },
};

/** Быстрее — для героя и мелких элементов */
export const staggerSnappy = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.072, delayChildren: 0.03 },
  },
};

/** Линии и декор: появление по оси X */
export const growFromLeft = {
  hidden: { opacity: 0, scaleX: 0 },
  show: {
    opacity: 1,
    scaleX: 1,
    transition: { type: "spring" as const, stiffness: 118, damping: 22, mass: 0.5 },
  },
};

export const growFromRight = {
  hidden: { opacity: 0, scaleX: 0 },
  show: {
    opacity: 1,
    scaleX: 1,
    transition: { type: "spring" as const, stiffness: 118, damping: 22, mass: 0.5 },
  },
};

/** Карточки в сетке */
export const cardReveal = {
  hidden: { opacity: 0, y: 20, scale: 0.99 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 98,
      damping: 20,
      mass: 0.72,
      delay: i * 0.065,
    },
  }),
};

/** Только прозрачность — для подсказок под кнопками */
export const fadeGentle = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.5, ease: easePremium },
  },
};

/** Карточки / кнопки при hover — лёгкий отклик */
export const springHover = { type: "spring" as const, stiffness: 340, damping: 26 };
export const springHoverStrong = { type: "spring" as const, stiffness: 380, damping: 26 };

/** Появление целой секции при скролле (framer, не spring — легче согласовывать длительность) */
export const sectionEnter = {
  duration: 0.55,
  ease: easePremium,
} as const;
