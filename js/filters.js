import { debounce } from './util.js';
import { renderPictures } from './gallery.js';

const RANDOM_PICTURES_COUNT = 10;
const RERENDER_DELAY = 500;

const filtersElement = document.querySelector('.img-filters');
const filterForm = document.querySelector('.img-filters__form');
const defaultBtn = filterForm.querySelector('#filter-default');
const randomBtn = filterForm.querySelector('#filter-random');
const discussedBtn = filterForm.querySelector('#filter-discussed');

const FilterEnum = {
  DEFAULT: 'default',
  RANDOM: 'random',
  DISCUSSED: 'discussed'
};

const getRandomPictures = (pictures) => {
  const picturesCopy = pictures.slice();
  const randomPictures = [];

  while (randomPictures.length < RANDOM_PICTURES_COUNT) {
    const randomIndex = Math.floor(Math.random() * picturesCopy.length);
    const [picture] = picturesCopy.splice(randomIndex, 1);
    randomPictures.push(picture);
  }

  return randomPictures;
};

const sortByComments = (pictureA, pictureB) =>
  pictureB.comments.length - pictureA.comments.length;

const getDiscussedPictures = (pictures) =>
  pictures.slice().sort(sortByComments);

const clearPictures = () => {
  const pictures = document.querySelectorAll('.picture');
  pictures.forEach((picture) => picture.remove());
};

const setActiveButton = (button) => {
  document.querySelector('.img-filters__button--active')
    .classList.remove('img-filters__button--active');
  button.classList.add('img-filters__button--active');
};

const rerender = (filter, pictures) => {
  clearPictures();
  let filteredPictures;

  switch (filter) {
    case FilterEnum.RANDOM:
      filteredPictures = getRandomPictures(pictures);
      break;
    case FilterEnum.DISCUSSED:
      filteredPictures = getDiscussedPictures(pictures);
      break;
    default:
      filteredPictures = pictures;
  }

  renderPictures(filteredPictures);
};

const debouncedRerender = debounce(rerender, RERENDER_DELAY);

const initFilters = (pictures) => {
  filtersElement.classList.remove('img-filters--inactive');

  filterForm.addEventListener('click', (evt) => {
    if (!evt.target.classList.contains('img-filters__button')) {
      return;
    }

    setActiveButton(evt.target);
    debouncedRerender(evt.target.id.replace('filter-', ''), pictures);
  });
};

export { initFilters };
