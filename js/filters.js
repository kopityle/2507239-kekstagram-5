import { renderPictures } from './gallery.js';
import { debounce } from './util.js';

const PICTURES_COUNT = 10;
const RERENDER_DELAY = 500;

const filtersElement = document.querySelector('.img-filters');
const filterFormElement = document.querySelector('.img-filters__form');
const defaultButtonElement = document.querySelector('#filter-default');
const randomButtonElement = document.querySelector('#filter-random');
const discussedButtonElement = document.querySelector('#filter-discussed');

let pictures = [];

const getRandomPictures = () => {
  const picturesCopy = pictures.slice();
  const randomPictures = [];

  while (randomPictures.length < PICTURES_COUNT && picturesCopy.length > 0) {
    const randomIndex = Math.floor(Math.random() * picturesCopy.length);
    randomPictures.push(picturesCopy[randomIndex]);
    picturesCopy.splice(randomIndex, 1);
  }

  return randomPictures;
};

const getDiscussedPictures = () => {
  return pictures.slice().sort((a, b) => b.comments.length - a.comments.length);
};

const removePictures = () => {
  const pictureElements = document.querySelectorAll('.picture');
  pictureElements.forEach((element) => element.remove());
};

const rerenderPictures = (evt) => {
  const clickedButton = evt.target;
  
  if (clickedButton.classList.contains('img-filters__button--active')) {
    return;
  }

  document.querySelector('.img-filters__button--active')
    .classList.remove('img-filters__button--active');
  clickedButton.classList.add('img-filters__button--active');

  let filteredPictures = [];
  switch (clickedButton.id) {
    case 'filter-random':
      filteredPictures = getRandomPictures();
      break;
    case 'filter-discussed':
      filteredPictures = getDiscussedPictures();
      break;
    default:
      filteredPictures = pictures;
  }

  removePictures();
  renderPictures(filteredPictures);
};

const debouncedRerender = debounce(rerenderPictures, RERENDER_DELAY);

const initFilters = (data) => {
  pictures = data;
  filtersElement.classList.remove('img-filters--inactive');
  filterFormElement.addEventListener('click', debouncedRerender);
};

export { initFilters };
