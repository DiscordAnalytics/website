export default {
  particles: {
    color: { value: '#fff' },
    move: {
      direction: 'bottom',
      enable: true,
      outModes: 'out',
      speed: 0.5,
    },
    number: {
      density: {
        enable: true,
        area: 100,
      },
      value: 50,
    },
    opacity: {
      value: 0.7,
    },
    shape: {
      type: ['image'],
      options: {
        image: {
          src: '/snow.svg',
          width: 10,
          height: 10,
          replaceColor: true,
        },
      },
    },
    size: {
      value: 10,
    },
    wobble: {
      enable: true,
      distance: 10,
      speed: 10,
    },
    zIndex: {
      value: { min: 0, max: 100 },
    },
  },
}
