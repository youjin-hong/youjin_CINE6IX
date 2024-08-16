import createHtml from "./components/createList.js";
import createModal from "./components/createModal.js";
import error from "./components/error.js";

// API_KEY
const TM_API_KEY = "20bc91ea9f74bee7cbb4d963cc9ce35c";
const KM_API_KEY = "5Q1M27DL4J13354IH60Y";
const KOBIS_API_KEY = "b8f4241ca2079e65b44f4fd7974b1681";

// header
const $searchMenu = document.getElementById("search-menu");
const $latestMenu = document.getElementById("latest-menu");
const $genreMenu = document.getElementById("genre-menu");
const $headerUl = document.getElementById("header-ul");

const $section1 = document.getElementById("section1");
const $sectionWrap1 = document.getElementById("section1-wrapper");
const $section2 = document.getElementById("section2");
const $section3 = document.getElementById("section3");

// section1
const $searchInput = document.getElementById("search");
const $searchBtn = document.getElementById("search-btn");
const $imgCon1 = document.querySelector(".img-con1");
const $posterCon = document.getElementById("poster-con");
const $modalCon = document.getElementById("modal-con");
const $modalWrapper = document.getElementById("modal-wrapper");
const $closeBtn = document.querySelector(".fa-close");
const $pagination = document.querySelector(".pagination-con");
const $prev = document.getElementById("prev");
// TODO: button 만들어야 함
const $next = document.getElementById("next");

// url 객체 생성
const tmUrl = new URL(
  `https://api.themoviedb.org/3/discover/movie?language=ko-KR`
);
// const kmUrl = new URL(
//   `http://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp?collection=kmdb_new2`
// );
// const kobisUrl = new URL(
//   "http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json"
// );

// 필요한 목록

let resultsPerPage = 12;
let groupSize = 5;
let page = 1;
let totalData = 0;
let totalPage = 0;

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMGJjOTFlYTlmNzRiZWU3Y2JiNGQ5NjNjYzljZTM1YyIsIm5iZiI6MTcyMzQyNDQ0Mi41MDgxNTYsInN1YiI6IjY2Yjk1ZTBjMmZiNDAzNjg2MTI1NmI5YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7EKPhYlBBQMXzo_fJog13U-t-WXUEdR33FQxuJO5XqU",
  },
};

// 영화 list section1
const fetchHomeData = async (options) => {
  try {
    tmUrl.searchParams.set("api_key", TM_API_KEY);
    tmUrl.searchParams.set("sort_by", "popularity.desc");
    tmUrl.searchParams.set("page", page);

    const res = await fetch(tmUrl, options);
    const tmData = await res.json();

    // totalData = tmData.total_results;
    // totalPage = Math.ceil(totalData / resultsPerPage);
    console.log(tmData);

    createPagination();
    return tmData;
  } catch (e) {
    console.log(e);
  }
};

// 검색
const fetchInputData = async (query, options) => {
  try {
    const searchUrl = new URL(
      "https://api.themoviedb.org/3/search/movie?language=ko-KR"
    );
    searchUrl.searchParams.set("api_key", TM_API_KEY);
    searchUrl.searchParams.set("query", query);

    const res = await fetch(searchUrl, options);
    const tmData = await res.json();
    return tmData;
  } catch (e) {
    console.log(e);
  }
};

// 모달
const fetchModalData = async (movieId) => {
  try {
    const modalUrl = new URL(
      `https://api.themoviedb.org/3/movie/${movieId}?append_to_response=credits&language=ko-KR`
    );
    modalUrl.searchParams.set("api_key", TM_API_KEY);

    const res = await fetch(modalUrl, options);
    const tmData = await res.json();

    return tmData;
  } catch (e) {
    console.log(e);
  }
};

// 페이지네이션
const createPagination = () => {
  let pageGroup = Math.ceil(page / groupSize);

  let firstPagePerGroup = (pageGroup - 1) * groupSize + 1;
  let lastPagePerGroup = pageGroup * groupSize;
};

// section1 영화 포스터 리스트 불러오기
const renderMovie = async (query = "") => {
  const data = query ? await fetchInputData(query) : await fetchHomeData();

  if (!data || !data.results || !data.results.length)
    return error($sectionWrap1);

  const movieCount = data.results.filter(
    (poster) => poster.poster_path !== null
  );
  // .slice(0, resultsPerPage);

  data.results = movieCount;
  console.log(movieCount);

  createHtml(movieCount, $imgCon1, openModal);
};
// renderMovie();/
const openModal = async (movieId) => {
  $modalCon.classList.add("on");
  const data = await fetchModalData(movieId);
  movieId = data;
  createModal(movieId, $modalWrapper);
  console.log(movieId);
};

const searchMovie = async () => {
  const inputValue = $searchInput.value;
  await renderMovie(inputValue);
  $searchInput.value = "";
};

// 헤더 메뉴 클릭 시 해당 섹션으로 이동
$searchMenu.addEventListener("click", () => {
  $section1.scrollIntoView({ behavior: "smooth" });
});
$latestMenu.addEventListener("click", () => {
  $section2.scrollIntoView({ behavior: "smooth" });
});
$genreMenu.addEventListener("click", () => {
  $section3.scrollIntoView({ behavior: "smooth" });
});

// 검색창에 제목 입력 시 관련 영화 포스터 나오게 하기
$searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    searchMovie();
  }
});
$searchBtn.addEventListener("click", searchMovie);

$closeBtn.addEventListener("click", () => {
  $modalCon.classList.remove("on");
  $modalWrapper.innerHTML = "";
});
renderMovie();
