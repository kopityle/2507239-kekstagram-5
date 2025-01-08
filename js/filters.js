import { renderPictures } from './gallery.js';
import { debounce } from './util.js';

const PICTURES_COUNT = 10;
const RERENDER_DELAY = 500;

const filters = document.querySelector('.img-filters');
const filterForm = document.querySelector('.img-filters__form');

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

const getDiscussedPictures = () => pictures.slice().sort((a, b) => b.comments.length - a.comments.length);

const removePictures = () => {
  const thumbnails = document.querySelectorAll('.picture');
  thumbnails.forEach((thumbnail) => thumbnail.remove());
};

const rerenderPicturesHandler = (evt) => {
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

const debouncedClickHandler = debounce(rerenderPicturesHandler, RERENDER_DELAY);

const initFilters = (data) => {
  if (!data || data.length === 0) {
    filters.classList.add('img-filters--inactive');
    return;
  }

  pictures = data;
  filters.classList.remove('img-filters--inactive');
  filterForm.addEventListener('click', debouncedClickHandler);
};

export { initFilters };
