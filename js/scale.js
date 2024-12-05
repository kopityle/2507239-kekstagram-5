const SCALE_STEP = 25;
const MIN_SCALE = 25;
const MAX_SCALE = 100;
const DEFAULT_SCALE = 100;

const scaleControlSmaller = document.querySelector('.scale__control--smaller');
const scaleControlBigger = document.querySelector('.scale__control--bigger');
const scaleControlValue = document.querySelector('.scale__control--value');
const imagePreview = document.querySelector('.img-upload__preview img');

const scaleImage = (value) => {
  imagePreview.style.transform = `scale(${value / 100})`;
  scaleControlValue.value = `${value}%`;
};

const onSmallerClick = () => {
  const currentValue = parseInt(scaleControlValue.value, 10);
  const newValue = Math.max(MIN_SCALE, currentValue - SCALE_STEP);
  scaleImage(newValue);
};

const onBiggerClick = () => {
  const currentValue = parseInt(scaleControlValue.value, 10);
  const newValue = Math.min(MAX_SCALE, currentValue + SCALE_STEP);
  scaleImage(newValue);
};

const reset = () => {
  scaleImage(DEFAULT_SCALE);
};

scaleControlSmaller.addEventListener('click', onSmallerClick);
scaleControlBigger.addEventListener('click', onBiggerClick);

export { reset };
