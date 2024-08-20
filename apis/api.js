// API URL 생성 함수
const API_KEY = "20bc91ea9f74bee7cbb4d963cc9ce35c";
const BASE_URL = "https://api.themoviedb.org/3";

const fetchUrl = async (endpoint, params = {}) => {
  // api 호출에 쓰이는 객체 (전역으로 쓰임)
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMGJjOTFlYTlmNzRiZWU3Y2JiNGQ5NjNjYzljZTM1YyIsIm5iZiI6MTcyMzQyNDQ0Mi41MDgxNTYsInN1YiI6IjY2Yjk1ZTBjMmZiNDAzNjg2MTI1NmI5YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7EKPhYlBBQMXzo_fJog13U-t-WXUEdR33FQxuJO5XqU",
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
