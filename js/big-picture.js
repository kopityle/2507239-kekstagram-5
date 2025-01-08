const COMMENTS_PER_PORTION = 5;
const COMMENT_TEMPLATE = `
    <li class="social__comment">
      <img
        class="social__picture"
        src=""
        alt=""
        width="35" height="35">
      <p class="social__text"></p>
    </li>
  `;

const bigPicture = document.querySelector('.big-picture');
const body = document.querySelector('body');
const cancelButton = bigPicture.querySelector('.big-picture__cancel');
const commentsCount = bigPicture.querySelector('.social__comment-count');
const commentsLoader = bigPicture.querySelector('.comments-loader');
const commentsList = bigPicture.querySelector('.social__comments');

let currentComments = [];
let shownCommentsCount = 0;

function renderComments(comments, isInitial = false) {
  if (isInitial) {
    commentsList.innerHTML = '';
    shownCommentsCount = 0;
  }

  const fragment = document.createDocumentFragment();
  const commentsToRender = comments.slice(shownCommentsCount, shownCommentsCount + COMMENTS_PER_PORTION);

  commentsToRender.forEach(({avatar, name, message}) => {
    const commentContainer = document.createElement('div');
    commentContainer.innerHTML = COMMENT_TEMPLATE;
    const comment = commentContainer.firstElementChild;

    const img = comment.querySelector('.social__picture');
    img.src = avatar;
    img.alt = name;
    comment.querySelector('.social__text').textContent = message;

    fragment.append(comment);
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

function commentsLoaderClickHandler() {
  renderComments(currentComments);
}

function hideBigPicture() {
  bigPicture.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', escKeyDownHandler);
  commentsLoader.removeEventListener('click', commentsLoaderClickHandler);
}

function hideBigPictureHandler() {
  hideBigPicture();
}

function escKeyDownHandler(evt) {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    hideBigPicture();
  }
}

function showBigPicture(photo) {
  bigPicture.classList.remove('hidden');
  body.classList.add('modal-open');

  const img = bigPicture.querySelector('.big-picture__img img');
  const likes = bigPicture.querySelector('.likes-count');
  const commentsCountValue = bigPicture.querySelector('.comments-count');
  const caption = bigPicture.querySelector('.social__caption');

  img.src = photo.url;
  likes.textContent = photo.likes;
  commentsCountValue.textContent = photo.comments.length;
  caption.textContent = photo.description;

  currentComments = photo.comments;
  renderComments(currentComments, true);

  commentsCount.classList.remove('hidden');

  document.addEventListener('keydown', escKeyDownHandler);
  commentsLoader.addEventListener('click', commentsLoaderClickHandler);
}

cancelButton.addEventListener('click', hideBigPictureHandler);

export { showBigPicture };
