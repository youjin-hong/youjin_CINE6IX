// API URL 생성 함수
import API_KEY from "../config.js";
const BASE_URL = "https://api.themoviedb.org/3";

const fetchUrl = async (endpoint, params = {}) => {
  // api 호출에 쓰이는 객체 (전역으로 쓰임)
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMGJjOTFlYTlmNzRiZWU3Y2JiNGQ5NjNjYzljZTM1YyIsIm5iZiI6MTczMTI5NDk0My40OTE2MjM0LCJzdWIiOiI2NmI5NWUwYzJmYjQwMzY4NjEyNTZiOWIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.gQgofzeCWHj0SUYov4IDLuO_9e-YaUONiiIqk6sCsRg",
    },
  };
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set("api_key", API_KEY);

  Object.keys(params).forEach((key) => url.searchParams.set(key, params[key]));

  try {
    const res = await fetch(url, options);
    const tmData = await res.json();
    return tmData;
  } catch (error) {
    console.error(error);
    return { results: [] };
  }
};

export default fetchUrl;
