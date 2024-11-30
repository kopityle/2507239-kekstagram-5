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

export { renderPictures };
