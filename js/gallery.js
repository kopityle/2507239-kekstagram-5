import { showBigPicture } from './big-picture.js';
import { getData } from './api.js';
import { initFilters } from './filters.js';

const filters = document.querySelector('.img-filters');
const picturesContainer = document.querySelector('.pictures');
const pictureTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');

const createPicture = (photo) => {
  const picture = pictureTemplate.cloneNode(true);
  const image = picture.querySelector('.picture__img');

  image.src = photo.url;
  image.alt = photo.description;
  picture.querySelector('.picture__likes').textContent = photo.likes;
  picture.querySelector('.picture__comments').textContent = photo.comments.length;

  const handlePictureClick = (evt) => {
    evt.preventDefault();
    showBigPicture(photo);
  };

  picture.addEventListener('click', handlePictureClick);

  return picture;
};

const renderPictures = (photos) => {
  const fragment = document.createDocumentFragment();

  photos.forEach((photo) => {
    const picture = createPicture(photo);
    fragment.append(picture);
  });

  picturesContainer.append(fragment);
};

filters.classList.add('img-filters--inactive');

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
