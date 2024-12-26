import { showBigPicture } from './big-picture.js';
import { getData } from './api.js';
import { initFilters } from './filters.js';

const picturesContainerElement = document.querySelector('.pictures');
const pictureTemplateElement = document.querySelector('#picture')
  .content
  .querySelector('.picture');

const createPictureElement = (photo) => {
  const pictureElement = pictureTemplateElement.cloneNode(true);
  const imageElement = pictureElement.querySelector('.picture__img');

  imageElement.src = photo.url;
  imageElement.alt = photo.description;
  pictureElement.querySelector('.picture__likes').textContent = photo.likes;
  pictureElement.querySelector('.picture__comments').textContent = photo.comments.length;

  const handlePictureClick = (evt) => {
    evt.preventDefault();
    showBigPicture(photo);
  };

  pictureElement.addEventListener('click', handlePictureClick);

  return pictureElement;
};

const renderPictures = (photos) => {
  const fragment = document.createDocumentFragment();

  photos.forEach((photo) => {
    const pictureElement = createPictureElement(photo);
    fragment.append(pictureElement);
  });

  picturesContainerElement.append(fragment);
};

const filtersElement = document.querySelector('.img-filters');
filtersElement.classList.add('img-filters--inactive');

const renderGallery = async () => {
  try {
    const photos = await getData();
    if (!Array.isArray(photos)) {
      throw new Error('Неверный формат данных');
    }
    renderPictures(photos);
    initFilters(photos);
  } catch (err) {
    throw new Error('Не удалось загрузить фотографии');
  }
};

export { renderGallery, renderPictures };
