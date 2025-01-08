import '../vendor/pristine/pristine.min.js';
import { reset as resetEffects } from './effects.js';
import { reset as resetScale } from './scale.js';
import { sendData } from './api.js';

const HASHTAG_REGEX = /^#[a-zа-яё0-9]{1,19}$/i;
const MAX_HASHTAGS = 5;
const MAX_COMMENT_LENGTH = 140;
const FILE_TYPES = ['jpg', 'jpeg', 'png'];
const SUBMIT_BUTTON_TEXT = {
  IDLE: 'Опубликовать',
  SENDING: 'Публикую...'
};

const form = document.querySelector('.img-upload__form');
const fileInput = document.querySelector('.img-upload__input');
const uploadOverlay = document.querySelector('.img-upload__overlay');
const body = document.querySelector('body');
const cancelButton = document.querySelector('.img-upload__cancel');
const hashtagsInput = form.querySelector('.text__hashtags');
const commentInput = form.querySelector('.text__description');
const submitButton = form.querySelector('.img-upload__submit');
const effectsPreviews = document.querySelectorAll('.effects__preview');

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

const blockSubmitButton = () => {
  submitButton.disabled = true;
  submitButton.textContent = SUBMIT_BUTTON_TEXT.SENDING;
};

const unblockSubmitButton = () => {
  submitButton.disabled = false;
  submitButton.textContent = SUBMIT_BUTTON_TEXT.IDLE;
};

function documentKeydownHandler(evt) {
  const errorMessage = document.querySelector('.error');
  const successMessage = document.querySelector('.success');
  if (evt.key === 'Escape') {
    evt.preventDefault();
    if (errorMessage) {
      errorMessage.querySelector('.error__button').click();
      return;
    }
    if (successMessage) {
      successMessage.querySelector('.success__button').click();
      return;
    }
    if (!isTextFieldFocused()) {
      closeUploadOverlay();
    }
  }
}

const fieldKeydownHandler = (evt) => {
  evt.stopPropagation();
};

const hashtagInputHandler = () => {
  pristine.validate(hashtagsInput);
};

const commentInputHandler = () => {
  pristine.validate(commentInput);
};

function isTextFieldFocused() {
  return document.activeElement === hashtagsInput ||
         document.activeElement === commentInput;
}

function fileChangeHandler() {
  const file = fileInput.files[0];
  const fileName = file.name.toLowerCase();
  const isValidType = FILE_TYPES.some((type) => fileName.endsWith(type));

  if (!isValidType) {
    return;
  }

  const reader = new FileReader();
  reader.addEventListener('load', () => {
    const mainPreview = document.querySelector('.img-upload__preview img');
    mainPreview.src = reader.result;
    effectsPreviews.forEach((effectPreview) => {
      effectPreview.style.backgroundImage = `url('${reader.result}')`;
    });
  });

  reader.readAsDataURL(file);
  uploadOverlay.classList.remove('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keydown', documentKeydownHandler);
}

const resetForm = () => {
  form.reset();
  resetScale();
  resetEffects();
  pristine.reset();
  fileInput.value = '';
  const mainPreview = document.querySelector('.img-upload__preview img');
  mainPreview.src = '';
  effectsPreviews.forEach((effectPreview) => {
    effectPreview.style.backgroundImage = '';
  });
};

function closeUploadOverlay() {
  uploadOverlay.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', documentKeydownHandler);
  resetForm();
}

const formResetHandler = () => {
  resetForm();
  closeUploadOverlay();
};

const closeButtonClickHandler = () => {
  closeUploadOverlay();
};

const formSubmitHandler = async (evt) => {
  evt.preventDefault();
  const isValid = pristine.validate();

  if (!isValid) {
    return;
  }

  blockSubmitButton();

  try {
    const formData = new FormData(form);
    await sendData(formData);
    showMessage('success');
    closeUploadOverlay();
  } catch (err) {
    showMessage('error');
  } finally {
    unblockSubmitButton();
  }
};

const isEscapeKey = (evt) => evt.key === 'Escape';

const messageEscKeydownHandler = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    hideMessageHandler();
  }
};

const outsideClickHandler = (evt) => {
  const message = document.querySelector('.success') || document.querySelector('.error');
  if (message && !evt.target.closest('.success__inner') && !evt.target.closest('.error__inner')) {
    hideMessageHandler();
  }
};

function hideMessageHandler() {
  const message = document.querySelector('.success') || document.querySelector('.error');
  if (message) {
    message.remove();
    document.removeEventListener('keydown', messageEscKeydownHandler);
    document.removeEventListener('click', outsideClickHandler);
  }
}

function showMessage(type) {
  hideMessageHandler();

  const template = document.querySelector(`#${type}`);
  const message = template.content.querySelector(`.${type}`).cloneNode(true);

  document.body.append(message);

  const closeButton = message.querySelector(`.${type}__button`);
  closeButton.addEventListener('click', hideMessageHandler);
  document.addEventListener('keydown', messageEscKeydownHandler);
  document.addEventListener('click', outsideClickHandler);
}

fileInput.addEventListener('change', fileChangeHandler);
cancelButton.addEventListener('click', closeButtonClickHandler);
form.addEventListener('submit', formSubmitHandler);
form.addEventListener('reset', formResetHandler);
hashtagsInput.addEventListener('input', hashtagInputHandler);
commentInput.addEventListener('input', commentInputHandler);
hashtagsInput.addEventListener('keydown', fieldKeydownHandler);
commentInput.addEventListener('keydown', fieldKeydownHandler);

export {form};
