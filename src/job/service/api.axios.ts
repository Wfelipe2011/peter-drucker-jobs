// schema api mock teste
import axios from "axios";
const URL = process.env.URL;
const TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsIm5hbWUiOiJqb3NlIiwiZW1haWwiOiJqb3NlLm1vdHRhQHRlZ3JhLmNvbS5iciIsInByb2ZpbGVJZCI6MywiaWF0IjoxNjI5OTE1MDk2LCJleHAiOjMzMTU1OTU3NDk2fQ.tdzf5Rj6sdfXgcP5Q_Ab8Q1aR6bhAJKMcuoWYalbtbY";

const get = (url) => {
  return axios({
    url: `${process.env.URL}/${url}`,
    method: "get",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
      Authorization: TOKEN,
    },
  })
    .then((res) => res.data)
    .catch((err) => console.error(err));
};

const getJob = (url) => {
  return axios({
    url: `${url}`,
    method: "get",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
  })
    .then((res) => res.data)
    .catch((err) => console.error(err));
};

// const post = (url) => {
//   return axios({
//     method: 'post',
//     url: `${URL}/${url}`,
//     headers: {
//       'Content-Type': 'application/json',
//       'Cache-Control': 'no-cache',
//       Authorization: TOKEN,
//     },
//     data: {},
//   }).then(res => res);
// };

// const put = (url, body) => {
//   return axios({
//     method: 'put',
//     url: `${URL}/${url}`,
//     headers: {
//       'Content-Type': 'application/json',
//       'Cache-Control': 'no-cache',
//       Authorization: TOKEN,
//     },
//     data: body,
//   }).then(res => res);
// };

// const del = (url) => {
//   return axios({
//     method: 'delete',
//     url: `${URL}/${url}`,
//     headers: {
//       'Content-Type': 'application/json',
//       'Cache-Control': 'no-cache',
//       Authorization: TOKEN,
//     },
//   }).then(res => res);
// };

export { get, getJob };
