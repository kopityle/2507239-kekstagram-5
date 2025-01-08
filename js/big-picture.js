const bigPicture = document.querySelector('.big-picture');
const body = document.querySelector('body');
const cancelButton = bigPicture.querySelector('.big-picture__cancel');
const commentsCount = bigPicture.querySelector('.social__comment-count');
const commentsLoader = bigPicture.querySelector('.comments-loader');

const COMMENTS_PER_PORTION = 5;
let currentComments = [];
let shownCommentsCount = 0;

function renderComments(comments, isInitial = false) {
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

  if (isInitial) {
    commentsList.innerHTML = '';
    shownCommentsCount = 0;
  }

  const fragment = document.createDocumentFragment();
  const commentsToRender = comments.slice(shownCommentsCount, shownCommentsCount + COMMENTS_PER_PORTION);

  commentsToRender.forEach(({avatar, name, message}) => {
    const comment = document.createElement('div');
    comment.innerHTML = commentTemplate;
    const commentElement = comment.firstElementChild;

    const img = commentElement.querySelector('.social__picture');
    img.src = avatar;
    img.alt = name;
    commentElement.querySelector('.social__text').textContent = message;

    fragment.append(commentElement);
  });

  commentsList.append(fragment);
  shownCommentsCount += commentsToRender.length;

  commentsCount.innerHTML = `${shownCommentsCount} из <span class="comments-count">${comments.length}</span> комментариев`;

  if (shownCommentsCount >= comments.length || comments.length <= COMMENTS_PER_PORTION) {
    commentsLoader.classList.add('hidden');
  } else {
    commentsLoader.classList.remove('hidden');
  }
}

function handleCommentsLoaderClick() {
  renderComments(currentComments);
}

function hideBigPicture() {
  bigPicture.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', handleEscKeyDown);
  commentsLoader.removeEventListener('click', handleCommentsLoaderClick);
}

function handleEscKeyDown(evt) {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    hideBigPicture();
  }
}

function showBigPicture(photo) {
  bigPicture.classList.remove('hidden');
  body.classList.add('modal-open');

  bigPicture.querySelector('.big-picture__img img').src = photo.url;
  bigPicture.querySelector('.likes-count').textContent = photo.likes;
  bigPicture.querySelector('.comments-count').textContent = photo.comments.length;
  bigPicture.querySelector('.social__caption').textContent = photo.description;

  currentComments = photo.comments;
  renderComments(currentComments, true);

  commentsCount.classList.remove('hidden');

  document.addEventListener('keydown', handleEscKeyDown);
  commentsLoader.addEventListener('click', handleCommentsLoaderClick);
}

cancelButton.addEventListener('click', hideBigPicture);

export { showBigPicture };
