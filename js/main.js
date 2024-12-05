import {getRandomInteger, getRandomArrayElement} from './util.js';
import {generatePhotos} from './mock.js';
import {renderPictures} from './gallery.js';
import './form.js';

const photos = generatePhotos(25);
renderPictures(photos);
