import { showBigPicture } from './big-picture.js';
import { getData } from './api.js';
import { initFilters } from './filters.js';

const picturesContainer = document.querySelector('.pictures');
const pictureTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');

const createPicture = (photo) => {
  const pictureElement = pictureTemplate.cloneNode(true);
  const img = pictureElement.querySelector('.picture__img');
  
  img.src = photo.url;
  img.alt = photo.description;
  pictureElement.querySelector('.picture__likes').textContent = photo.likes;
  pictureElement.querySelector('.picture__comments').textContent = photo.comments.length;

  // Добавляем обработчик клика
  pictureElement.addEventListener('click', (evt) => {
    evt.preventDefault();
    showBigPicture(photo);
  });

  return pictureElement;
};

const renderPictures = (photos) => {
  const fragment = document.createDocumentFragment();
  
  photos.forEach((photo) => {
    const pictureElement = createPicture(photo);
    fragment.append(pictureElement);
  });

  picturesContainer.append(fragment);
};

const renderGallery = async () => {
  try {
    const pictures = await getData();
    renderPictures(pictures);
    initFilters(pictures);
  } catch (err) {
    showMessage('Не удалось загрузить фотографии. Попробуйте обновить страницу');
  }
};

export { renderGallery, renderPictures };
