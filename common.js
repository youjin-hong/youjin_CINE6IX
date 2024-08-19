import createHtml from "./components/createList.js";
import createModal from "./components/createModal.js";
import error from "./components/error.js";

// API_KEY
const TM_API_KEY = "20bc91ea9f74bee7cbb4d963cc9ce35c";

// header
const $searchMenu = document.getElementById("search-menu");
const $latestMenu = document.getElementById("latest-menu");
const $genreMenu = document.getElementById("genre-menu");

const $section1 = document.getElementById("section1");
const $section2 = document.getElementById("section2");
const $section3 = document.getElementById("section3");

// pagination
const $searchPagination = document.getElementById("search-pagination");
const $genrePagination = document.getElementById("genre-pagination");

// section1
const $searchInput = document.getElementById("search");
const $searchBtn = document.getElementById("search-btn");
const $imgCon1 = document.querySelector(".img-con1");
const $modalCon = document.getElementById("modal-con");
const $modalWrapper = document.getElementById("modal-wrapper");
const $closeBtn = document.querySelector(".fa-close");

// section2
const $sec2Wrapper = document.querySelector(".section2-wrapper");
const $prev = document.getElementById("prev");
const $next = document.getElementById("next");

// section3
const $genreCategoryCon = document.querySelector(".category-con");
const $genreImg = document.querySelector(".genreImg-con");

// url 객체 생성

// 페이지 관련된 변수 설정
let resultsPerPage = 0;
let groupSize = 5;
let page = 1;
let totalData = 0;
let totalPage = 0;
let movieList = [];

// 카드 슬라이드에 필요한 변수 설정
let currentActiveCard = 0;
let allMovies = [];

// api 호출에 쓰이는 객체 (전역으로 쓰임)
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMGJjOTFlYTlmNzRiZWU3Y2JiNGQ5NjNjYzljZTM1YyIsIm5iZiI6MTcyMzQyNDQ0Mi41MDgxNTYsInN1YiI6IjY2Yjk1ZTBjMmZiNDAzNjg2MTI1NmI5YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7EKPhYlBBQMXzo_fJog13U-t-WXUEdR33FQxuJO5XqU",
  },
};

// section1 //
// 영화 list fetch
const fetchHomeData = async (options) => {
  let sec1ImgUrl = new URL(
    `https://api.themoviedb.org/3/discover/movie?language=ko-KR`
  );
  try {
    sec1ImgUrl.searchParams.set("api_key", TM_API_KEY);
    sec1ImgUrl.searchParams.set("sort_by", "popularity.desc");
    sec1ImgUrl.searchParams.set("page", page);

    const res = await fetch(sec1ImgUrl, options);
    const tmData = await res.json();

    return tmData;
  } catch (e) {
    console.log(e);
  }
};

// 검색 fetch
const fetchInputData = async (query, options) => {
  try {
    const searchUrl = new URL(
      "https://api.themoviedb.org/3/search/movie?language=ko-KR"
    );
    searchUrl.searchParams.set("api_key", TM_API_KEY);
    searchUrl.searchParams.set("query", query);
    searchUrl.searchParams.set("page", page);

    const res = await fetch(searchUrl, options);
    const tmData = await res.json();

    return tmData;
  } catch (e) {
    console.log(e);
    return { result: [] };
  }
};

// section1 영화 포스터 리스트 불러오기
const renderMovie = async (query = "") => {
  $imgCon1.innerHTML = "";
  const data = query ? await fetchInputData(query) : await fetchHomeData();

  if (!data || !data.results || !data.results.length) {
    return error($imgCon1);
  }
  console.log(data);

  // 총 데이터, 총 페이지 수 계산
  resultsPerPage = 12;
  totalData = data.total_results;
  totalPage = Math.ceil(totalData / resultsPerPage);

  // 전체 데이터 total_results의 각 아이템에 인덱스 생성
  const totalMovies = Array.from({ length: data.total_results }, (_, index) => {
    const item = data.results[index % data.results.length];
    return {
      ...item, // 현재 인덱스에 해당하는 item의 데이터 전개
      globalIndex: index + 1, // 0부터 시작하는 globalIndex
    };
  });

  console.log("total", totalMovies);

  // 현재 페이지의 첫번째, 마지막 영화 인덱스 계산
  const startPerPageIndex = (page - 1) * resultsPerPage;
  const endPerPageIndex = startPerPageIndex + resultsPerPage;

  console.log(startPerPageIndex);
  console.log(endPerPageIndex);

  // 전체 영화에서 현재 페이지만 해당하는 영화를 slice
  const countPerPageMovie = totalMovies.slice(
    startPerPageIndex,
    endPerPageIndex
  );

  createSearchPagination(page);
  createHtml(countPerPageMovie, $imgCon1, openModal);
};

const searchMovie = async () => {
  // 어느 페이지에서 검색하든 1 페이지부터 보여질 수 있게 초기화
  page = 1;
  const inputValue = $searchInput.value;

  if (inputValue) {
    await renderMovie(inputValue);
  } else {
    await renderMovie();
  }
  $searchInput.value = "";
};

// 페이지네이션 ui 만들기
const createSearchPagination = (currentPage) => {
  $searchPagination.innerHTML = "";

  // 페이지 그룹 계산
  let pageGroup = Math.ceil(page / groupSize);

  // 페이지 그룹의 첫번째, 마지막 페이지 번호 계산
  let firstPagePerGroup = (pageGroup - 1) * groupSize + 1;
  let lastPagePerGroup = pageGroup * groupSize;

  // 이전 그룹으로 이동하는 버튼 생성
  const prevGroupBtn = document.createElement("span");
  prevGroupBtn.textContent = "<";
  prevGroupBtn.classList.add("prev");
  if (firstPagePerGroup > 1) {
    prevGroupBtn.addEventListener("click", () => {
      page = firstPagePerGroup - 1;
      renderMovie($searchInput.value);
      createSearchPagination(page);
    });
  }
  $searchPagination.appendChild(prevGroupBtn);

  // 페이지 버튼 생성
  for (let i = firstPagePerGroup; i <= lastPagePerGroup; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    if (i === currentPage) pageButton.classList.add("on");
    pageButton.addEventListener("click", () => {
      page = i;
      renderMovie($searchInput.value);
      createSearchPagination(page);
    });
    $searchPagination.appendChild(pageButton);
  }

  // 다음 그룹으로 이동하는 버튼 생성
  const nextGroupBtn = document.createElement("span");
  nextGroupBtn.textContent = ">";
  nextGroupBtn.classList.add("next");
  if (lastPagePerGroup < totalPage) {
    nextGroupBtn.addEventListener("click", () => {
      page = lastPagePerGroup + 1;
      renderMovie($searchInput.value);
      createSearchPagination(page);
    });
  }
  if (lastPagePerGroup > totalPage) lastPagePerGroup = totalPage;
  $searchPagination.appendChild(nextGroupBtn);
};

// section2 //
const fetchLatestData = async () => {
  const currentUrl = new URL(
    "https://api.themoviedb.org/3/movie/now_playing?language=ko-KR&page=1"
  );
  try {
    currentUrl.searchParams.set("api_key", TM_API_KEY);

    const res = await fetch(currentUrl, options);
    const tmData = await res.json();

    // 데이터를 allMovies 배열에 저장
    allMovies = tmData.results;

    // 데이터 가져온 후 슬라이드를 생성하도록 renderSlide 호출
    renderSlide();
  } catch (e) {
    console.log(e);
    return { result: [] };
  }
};

const createSlideMovieCon = () => {
  $sec2Wrapper.innerHTML = "";
  resultsPerPage = 3;

  const moviesToShow = allMovies.slice(
    currentActiveCard,
    currentActiveCard + resultsPerPage
  );

  moviesToShow.forEach((movie, index) => {
    const latestMovie = document.createElement("li");
    latestMovie.setAttribute("class", "card");
    latestMovie.classList.add(
      index === 1 ? "active" : index === 0 ? "left" : "card"
    );
    latestMovie.innerHTML = `
      <div class='inner-card'>
        <div class='front'>
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${
      movie.title
    }" />
        </div>
        <div class='back'>
          <div class="title-score">
            <p class="title">${movie.title}</p>
            <div class="score">
              <span>👍</span>
              <p>${movie.vote_average.toFixed(1)}</p>
            </div>
          </div>
          <p class="plot">${movie.overview}</p>
          <p class="detail">더보기></p>
        </div>
      </div>
    `;
    $sec2Wrapper.appendChild(latestMovie);

    latestMovie.addEventListener("click", () => openModal(movie.id));
  });
};

const renderSlide = () => {
  createSlideMovieCon();
};

const moveCard = (direction) => {
  currentActiveCard += direction;

  if (currentActiveCard < 0) {
    currentActiveCard = 0;
  } else if (currentActiveCard > allMovies.length - resultsPerPage) {
    currentActiveCard = allMovies.length - resultsPerPage;
  }

  renderSlide();
};

$prev.addEventListener("click", () => moveCard(-1));
$next.addEventListener("click", () => moveCard(1));

fetchLatestData(); // fetchLatestData에서 데이터 로드 후 renderSlide 호출

// section3 //
// 장르 카테고리 불러오기
const fetchGenreCategoryData = async () => {
  const categoryUrl = new URL("https://api.themoviedb.org/3/genre/movie/list");
  categoryUrl.searchParams.set("api_key", TM_API_KEY);
  categoryUrl.searchParams.set("language", "ko");

  const res = await fetch(categoryUrl);
  const data = await res.json();
  const tmData = data.genres;

  return tmData;
};

const fetchGenreData = async (genreId) => {
  let genreImgUrl = new URL(
    `https://api.themoviedb.org/3/discover/movie?language=ko-KR`
  );
  genreImgUrl.searchParams.set("api_key", TM_API_KEY);
  genreImgUrl.searchParams.set("sort_by", "popularity.desc");
  genreImgUrl.searchParams.set("page", page);
  genreImgUrl.searchParams.set("with_genres", genreId);

  const res = await fetch(genreImgUrl);
  const tmData = await res.json();

  return tmData.results;
};

const createGenreBtn = async () => {
  const genreData = await fetchGenreCategoryData();
  let defaultGenre = null;
  genreData.forEach((genre) => {
    const genreBtn = document.createElement("button");
    genreBtn.textContent = genre.name;

    if (genre.name === "액션") {
      defaultGenre = genre.id;
      genreBtn.classList.add("on");
    }

    genreBtn.addEventListener("click", () => {
      document
        .querySelectorAll(".category-con button")
        .forEach((categoryBtn) => {
          categoryBtn.classList.remove("on");
        });
      genreBtn.classList.add("on");

      renderGenre(genre.id);
    });
    $genreCategoryCon.appendChild(genreBtn);
  });

  if (defaultGenre) renderGenre(defaultGenre);
};

const createGenreImg = async (countPerPageMovie, openModal) => {
  $genreImg.innerHTML = "";

  countPerPageMovie
    .filter((item) => item.backdrop_path)
    .forEach((movie) => {
      const genreImg = document.createElement("li");
      genreImg.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500${movie.backdrop_path}" alt="${movie.title}" />
      <div class="title">${movie.title}</div>`;
      $genreImg.appendChild(genreImg);
      genreImg.addEventListener("click", () => openModal(movie.id));
    });
};

const renderGenre = async (genreId = 28) => {
  const movies = await fetchGenreData(genreId);
  if (!movies || !movies.length) return;

  resultsPerPage = 10;
  totalData = movies.length;
  totalPage = Math.ceil(totalData / resultsPerPage);

  const totalMovies = movies.map((movie, index) => ({
    ...movie,
    globalIndex: index + 1,
  }));

  const startPerPageIndex = (page - 1) * resultsPerPage;
  const endPerPageIndex = startPerPageIndex + resultsPerPage;

  const countPerPageMovie = totalMovies.slice(
    startPerPageIndex,
    endPerPageIndex
  );
  createGenreImg(countPerPageMovie, openModal);
  createSearchPagination(page);
};
createGenreBtn();
renderGenre();

const createGenrePagination = () => {};

// 모달 fetch
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

const openModal = async (movieId) => {
  $modalCon.classList.add("on");
  const data = await fetchModalData(movieId);
  createModal(data, $modalWrapper);
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
