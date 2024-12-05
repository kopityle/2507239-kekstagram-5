import '../vendor/nouislider/nouislider.js';

const Effects = {
  NONE: 'none',
  CHROME: 'chrome',
  SEPIA: 'sepia',
  MARVIN: 'marvin',
  PHOBOS: 'phobos',
  HEAT: 'heat'
};

const effectToFilter = {
  [Effects.CHROME]: {
    filter: 'grayscale',
    units: '',
    range: {
      min: 0,
      max: 1,
    },
    start: 1,
    step: 0.1
  },
  [Effects.SEPIA]: {
    filter: 'sepia',
    units: '',
    range: {
      min: 0,
      max: 1,
    },
    start: 1,
    step: 0.1
  },
  [Effects.MARVIN]: {
    filter: 'invert',
    units: '%',
    range: {
      min: 0,
      max: 100,
    },
    start: 100,
    step: 1
  },
  [Effects.PHOBOS]: {
    filter: 'blur',
    units: 'px',
    range: {
      min: 0,
      max: 3,
    },
    start: 3,
    step: 0.1
  },
  [Effects.HEAT]: {
    filter: 'brightness',
    units: '',
    range: {
      min: 1,
      max: 3,
    },
    start: 3,
    step: 0.1
  }
};

const imagePreview = document.querySelector('.img-upload__preview img');
const effectLevel = document.querySelector('.img-upload__effect-level');
const effectLevelSlider = document.querySelector('.effect-level__slider');
const effectLevelValue = document.querySelector('.effect-level__value');
const effectsList = document.querySelector('.effects__list');

let currentEffect = Effects.NONE;

// Скрываем слайдер изначально
effectLevel.classList.add('hidden');

const isDefault = () => currentEffect === Effects.NONE;

const setImageStyle = (value) => {
  if (isDefault()) {
    imagePreview.style.filter = '';
    return;
  }

  const effect = effectToFilter[currentEffect];
  imagePreview.style.filter = `${effect.filter}(${value}${effect.units})`;
};

const initSlider = () => {
  noUiSlider.create(effectLevelSlider, {
    range: {
      min: 0,
      max: 100
    },
    start: 100,
    step: 1,
    connect: 'lower',
    format: {
      to: (value) => Number(value).toFixed(1),
      from: (value) => parseFloat(value),
    }
  });

  effectLevelSlider.noUiSlider.on('update', () => {
    const value = effectLevelSlider.noUiSlider.get();
    effectLevelValue.value = value;
    
    if (!isDefault()) {
      const effect = effectToFilter[currentEffect];
      // Преобразуем значение слайдера (0-100) в значение эффекта
      const filterValue = (value * (effect.range.max - effect.range.min) / 100) + effect.range.min;
      setImageStyle(filterValue);
    }
  });
};

const updateSlider = () => {
  if (isDefault()) {
    effectLevel.classList.add('hidden');
    imagePreview.style.filter = '';
    effectLevelValue.value = '';
    return;
  }

  effectLevel.classList.remove('hidden');
  
  // Сбрасываем значение слайдера на 100%
  effectLevelSlider.noUiSlider.set(100);
};

const onEffectChange = (evt) => {
  if (!evt.target.classList.contains('effects__radio')) {
    return;
  }

  currentEffect = evt.target.value;

  // Если слайдер еще не создан - создаем
  if (!effectLevelSlider.noUiSlider) {
    initSlider();
  }

  updateSlider();
};

const reset = () => {
  currentEffect = Effects.NONE;
  if (effectLevelSlider.noUiSlider) {
    effectLevelSlider.noUiSlider.destroy();
  }
  effectLevel.classList.add('hidden');
  imagePreview.style.filter = '';
  effectLevelValue.value = '';
};

effectsList.addEventListener('change', onEffectChange);

export { reset };
