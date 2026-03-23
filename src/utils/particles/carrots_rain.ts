export default {
  fullScreen: { zIndex: 1 },
  particles: {
    move: {
      direction: 'bottom',
      enable: true,
      outModes: { default: 'out' },
      size: true,
      speed: { min: 1, max: 3 },
    },
    number: {
      value: 50,
      density: { enable: true, area: 800 },
    },
    opacity: {
      value: 1,
      animation: {
        enable: false,
        startValue: 'max',
        destroy: 'min',
        speed: 0.3,
        sync: true,
      },
    },
    rotate: {
      value: {
        min: 0,
        max: 360,
      },
      direction: 'random',
      move: true,
      animation: {
        enable: true,
        speed: 60,
      },
    },
    tilt: {
      direction: 'random',
      enable: true,
      move: true,
      value: {
        min: 0,
        max: 360,
      },
      animation: {
        enable: true,
        speed: 60,
      },
    },
    shape: {
      type: ['emoji'],
      options: {
        emoji: {
          particles: {
            size: {
              value: 8,
            },
          },
          value: ['🥕'],
        },
      },
    },
    size: {
      value: {
        min: 2,
        max: 4,
      },
    },
  },
}
