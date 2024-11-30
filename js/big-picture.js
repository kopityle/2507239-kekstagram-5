const bigPicture = document.querySelector('.big-picture');
const body = document.querySelector('body');
const cancelButton = bigPicture.querySelector('.big-picture__cancel');
const commentsCount = bigPicture.querySelector('.social__comment-count');
const commentsLoader = bigPicture.querySelector('.comments-loader');

const hideBigPicture = () => {
  bigPicture.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onEscKeyDown);
};

const onEscKeyDown = (evt) => {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    hideBigPicture();
  }
};

const renderComments = (comments) => {
  const commentsList = bigPicture.querySelector('.social__comments');
  const commentTemplate = `
    <li class="social__comment">
      <img
        class="social__picture"
        src=""
        alt=""
        width="35" height="35">
      <p class="social__text"></p>
    </li>
  `;

  commentsList.innerHTML = '';
  
  comments.forEach(({avatar, name, message}) => {
    const comment = document.createElement('div');
    comment.innerHTML = commentTemplate;
    const commentElement = comment.firstElementChild;
    
    const img = commentElement.querySelector('.social__picture');
    img.src = avatar;
    img.alt = name;
    commentElement.querySelector('.social__text').textContent = message;
    
    commentsList.append(commentElement);
  });
};

const showBigPicture = (photo) => {
  bigPicture.classList.remove('hidden');
  body.classList.add('modal-open');
  
  // Заполняем данными
  bigPicture.querySelector('.big-picture__img img').src = photo.url;
  bigPicture.querySelector('.likes-count').textContent = photo.likes;
  bigPicture.querySelector('.comments-count').textContent = photo.comments.length;
  bigPicture.querySelector('.social__caption').textContent = photo.description;
  
  // Отрисовываем комментарии
  renderComments(photo.comments);
  
  // Скрываем счетчик комментариев и кнопку загрузки новых
  commentsCount.classList.add('hidden');
  commentsLoader.classList.add('hidden');
  
  // Добавляем обработчики
  document.addEventListener('keydown', onEscKeyDown);
};

cancelButton.addEventListener('click', hideBigPicture);

export { showBigPicture };
