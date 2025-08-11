import axios from "axios";

const tmdbClient = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NDI5ZTk2NjM0MjZkYTI3NzAxYTFiNzI5ZTFhYjI4NiIsIm5iZiI6MTczNzY1MDg5Ni4xODU5OTk5LCJzdWIiOiI2NzkyNzJkMGVhNjQ2ODIzNGVlYWQxYmUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.X9OMStrcWC9IeHFbMd7_s7qWFhwlB5Lol_T65QEMULY`, // Replace with your TMDB Bearer Token
    Accept: "application/json",
  },
});

export default tmdbClient;
