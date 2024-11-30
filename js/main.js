import {getRandomInteger, getRandomArrayElement} from './util.js';
import {generatePhotos} from './mock.js';
import {renderPictures} from './gallery.js';

const photos = generatePhotos(25);
renderPictures(photos);
