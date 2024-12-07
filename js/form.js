import '../vendor/pristine/pristine.min.js';
import { reset as resetEffects } from './effects.js';
import { reset as resetScale } from './scale.js';

const form = document.querySelector('.img-upload__form');
const fileInput = document.querySelector('.img-upload__input');
const uploadOverlay = document.querySelector('.img-upload__overlay');
const body = document.querySelector('body');
const cancelButton = document.querySelector('.img-upload__cancel');
const hashtagsInput = form.querySelector('.text__hashtags');
const commentInput = form.querySelector('.text__description');

const HASHTAG_REGEX = /^#[a-zа-яё0-9]{1,19}$/i;
const MAX_HASHTAGS = 5;
const MAX_COMMENT_LENGTH = 140;

const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__field-wrapper--error',
});

const validateHashtags = (value) => {
  if (!value) {
    return true;
  }

  const hashtags = value.trim().split(' ').filter((tag) => tag.length > 0);
  
  if (hashtags.length === 0) {
    return true;
  }

  if (hashtags.length > MAX_HASHTAGS) {
    return false;
  }

  const uniqueHashtags = new Set(hashtags.map((tag) => tag.toLowerCase()));
  if (uniqueHashtags.size !== hashtags.length) {
    return false;
  }

  return hashtags.every((hashtag) => HASHTAG_REGEX.test(hashtag));
};

const getHashtagErrorMessage = (value) => {
  if (!value) {
    return '';
  }

  const hashtags = value.trim().split(' ').filter((tag) => tag.length > 0);

  if (hashtags.length === 0) {
    return '';
  }

  if (hashtags.length > MAX_HASHTAGS) {
    return `Нельзя указать больше ${MAX_HASHTAGS} хэш-тегов`;
  }

  const uniqueHashtags = new Set(hashtags.map((tag) => tag.toLowerCase()));
  if (uniqueHashtags.size !== hashtags.length) {
    return 'Один и тот же хэш-тег не может быть использован дважды';
  }

  const invalidTag = hashtags.find((hashtag) => !HASHTAG_REGEX.test(hashtag));
  if (invalidTag) {
    if (invalidTag === '#') {
      return 'Хэш-тег не может состоять только из одной решётки';
    }
    if (!invalidTag.startsWith('#')) {
      return 'Хэш-тег должен начинаться с символа #';
    }
    if (invalidTag.length > 20) {
      return 'Максимальная длина одного хэш-тега 20 символов, включая решётку';
    }
    return 'Хэш-тег должен состоять только из букв и чисел';
  }
  return '';
};

const validateComment = (value) => !value || value.length <= MAX_COMMENT_LENGTH;

const getCommentErrorMessage = () => 
  `Длина комментария не может составлять больше ${MAX_COMMENT_LENGTH} символов`;

pristine.addValidator(hashtagsInput, validateHashtags, getHashtagErrorMessage);
pristine.addValidator(commentInput, validateComment, getCommentErrorMessage);

function onDocumentKeydown(evt) {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closeUploadOverlay();
  }
}

const onFieldKeydown = (evt) => {
  evt.stopPropagation();
};

const onHashtagInput = () => {
  pristine.validate(hashtagsInput);
};

const onCommentInput = () => {
  pristine.validate(commentInput);
};

const isTextFieldFocused = () => 
  document.activeElement === hashtagsInput ||
  document.activeElement === commentInput;

const onFileInputChange = () => {
  uploadOverlay.classList.remove('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
};

const closeUploadOverlay = () => {
  uploadOverlay.classList.add('hidden');
  body.classList.remove('modal-open');
  fileInput.value = '';
  form.reset();
  pristine.reset();
  resetScale();
  resetEffects();
  document.removeEventListener('keydown', onDocumentKeydown);
};

const onCloseButtonClick = () => {
  closeUploadOverlay();
};

const onFormSubmit = (evt) => {
  evt.preventDefault();
  const isValid = pristine.validate();
  if (isValid) {
    form.submit();
  }
};

fileInput.addEventListener('change', onFileInputChange);
cancelButton.addEventListener('click', onCloseButtonClick);
form.addEventListener('submit', onFormSubmit);
hashtagsInput.addEventListener('input', onHashtagInput);
commentInput.addEventListener('input', onCommentInput);
hashtagsInput.addEventListener('keydown', onFieldKeydown);
commentInput.addEventListener('keydown', onFieldKeydown);

export {form};
