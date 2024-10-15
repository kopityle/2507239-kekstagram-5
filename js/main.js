function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomArrayElement(elements) {
  return elements[getRandomInteger(0, elements.length - 1)];
}

function generateComments(count) {
  const comments = [];
  const messages = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ];
  const names = ['Иван', 'Мария', 'Пётр', 'Анна', 'Сергей', 'Елена'];

  for (let i = 0; i < count; i++) {
    const comment = {
      id: getRandomInteger(1, 1000),
      avatar: `img/avatar-${getRandomInteger(1, 6)}.svg`,
      message: `${getRandomArrayElement(messages)} ${getRandomArrayElement(messages) ? getRandomArrayElement(messages) : ''}`,
      name: getRandomArrayElement(names)
    };
    comments.push(comment);
  }

  return comments;
}

function generatePhotos(count) {
  const photos = [];
  const descriptions = [
    'Красивый закат',
    'Уютное кафе',
    'Веселая компания',
    'Интересная архитектура',
    'Вкусный ужин',
    'Путешествие по миру',
    'Милый котенок',
    'Захватывающий вид',
    'Яркий фестиваль'
  ];

  for (let i = 1; i <= count; i++) {
    const photo = {
      id: i,
      url: `photos/${i}.jpg`,
      description: getRandomArrayElement(descriptions),
      likes: getRandomInteger(15, 200),
      comments: generateComments(getRandomInteger(0, 30))
    };
    photos.push(photo);
  }

  return photos;
}

const photos = generatePhotos(25);
console.log(photos);
