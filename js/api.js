const BASE_URL = 'https://29.javascript.htmlacademy.pro/kekstagram';

const Route = {
  GET_DATA: '/data',
  SEND_DATA: '/',
};

const Method = {
  GET: 'GET',
  POST: 'POST',
};

const ErrorText = {
  GET_DATA: 'Не удалось загрузить данные. Попробуйте обновить страницу',
  SEND_DATA: 'Не удалось отправить форму. Попробуйте ещё раз',
};

const getData = () => fetch(`${BASE_URL}${Route.GET_DATA}`)
  .then((response) => {
    if (!response.ok) {
      throw new Error(ErrorText.GET_DATA);
    }
    return response.json();
  })
  .catch((err) => {
    console.error(err);
    throw new Error(ErrorText.GET_DATA);
  });

const sendData = (body) => fetch(`${BASE_URL}${Route.SEND_DATA}`, {
  method: Method.POST,
  body,
})
  .then((response) => {
    if (!response.ok) {
      throw new Error(ErrorText.SEND_DATA);
    }
    return response;
  })
  .catch((err) => {
    console.error(err);
    throw new Error(ErrorText.SEND_DATA);
  });

export { getData, sendData };
