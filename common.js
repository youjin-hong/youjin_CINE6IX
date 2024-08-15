// API_KEY
const TM_API_KEY = "20bc91ea9f74bee7cbb4d963cc9ce35c";
const KM_API_KEY = "5Q1M27DL4J13354IH60Y";
const KOBIS_API_KEY = "b8f4241ca2079e65b44f4fd7974b1681";

// 변수 설정

// header
const $searchMenu = document.getElementById("search-menu");
const $latestMenu = document.getElementById("latest-menu");
const $genreMenu = document.getElementById("genre-menu");
const $headerUl = document.getElementById("header-ul");

const $section1 = document.getElementById("section1");
const $section2 = document.getElementById("section2");
const $section3 = document.getElementById("section3");

// section1
const $searchInput = document.getElementById("search");
const $searchBtn = document.getElementById("search-btn");
const $imgCon1 = document.querySelector(".img-con1");
const $posterCon = document.getElementById("poster-con");
const $pagination = document.getElementById("pagination-con");
const $prev = document.getElementById("prev");
// TODO: button 만들어야 함
const $next = document.getElementById("next");

// url 객체 생성
const tmUrl = new URL(
  `https://api.themoviedb.org/3/discover/movie?language=ko-KR`
);
const kmUrl = new URL(
  `http://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp?collection=kmdb_new2`
);
const kobisUrl = new URL(
  "http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json"
);

// 필요한 목록
// let movieList = [];
let resultsPerPage = 12;
let page = 1;

// 데이터 fetch 함수
const fetchData = async () => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMGJjOTFlYTlmNzRiZWU3Y2JiNGQ5NjNjYzljZTM1YyIsIm5iZiI6MTcyMzQyNDQ0Mi41MDgxNTYsInN1YiI6IjY2Yjk1ZTBjMmZiNDAzNjg2MTI1NmI5YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7EKPhYlBBQMXzo_fJog13U-t-WXUEdR33FQxuJO5XqU",
    },
  };

  try {
    // include_adult=true&include_video=true&language=ko-KR&sort_by=popularity.desc
    tmUrl.searchParams.set("api_key", TM_API_KEY);
    tmUrl.searchParams.set("include_adult", true);
    tmUrl.searchParams.set("include_video", true);
    tmUrl.searchParams.set("page", page);
    tmUrl.searchParams.set("sort_by", "popularity.desc");

    const res = await fetch(tmUrl, options);
    const tmData = await res.json();
    console.log(tmData);
    return tmData;
  } catch (e) {
    console.log(e);
  }
};

// section1 영화 스틸컷 리스트 불러오기
const renderMovie = async () => {
  const data = await fetchData();
  if (!data || !data.results || !data.results.length) return;

  const movieCount = data.results.slice(0, resultsPerPage);
  data.results = movieCount;

  movieCount.forEach((movie) => {
    const $movieCard = document.createElement("li");
    $movieCard.setAttribute("class", "poster-con");
    $movieCard.innerHTML = `
      <div class="movieImg">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="" />
      </div>
      <div class="detail-sec1" id="detail-sec1">
        <p class="vote_average" id="vote_average">평점 ${movie.vote_average.toFixed(
          1
        )}</p>
        <p class="title" id="title">${movie.title}</p>
        <p class="release_date" id="release_date">${movie.release_date.substring(
          0,
          4
        )}</p>
      </div>
    `;
    $imgCon1.appendChild($movieCard);
    return $movieCard;
  });
};
renderMovie();

// section1 이미지 클릭하면 상세 페이지
const sec1Detail = () => {};

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

const searchMovie = async () => {
  const inputValue = $searchInput.value;
  $searchInput.value = "";
  await renderMovie();
};

// section1 상세 페이지

// 검색창 입력 로직
$searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    searchMovie();
  }
});
$searchBtn.addEventListener("click", searchMovie);
