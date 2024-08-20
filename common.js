// ---------- 모듈 불러오기 ---------- //
import fetchUrl from "./apis/api.js";
import error from "./components/error.js";

// ---------- 변수 설정 ---------- //
// API_KEY
const TM_API_KEY = "";

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

// 페이지 관련된 변수 설정
let groupSize = 5;
let page = 1;
let totalPage = 0;
let currentQuery = ""; // 현재 검색어를 저장할 변수 (검색 후 페이지네이션이 제대로 안돼서 추가한 변수)

// 카드 슬라이드에 필요한 변수 설정
let currentActiveCard = 0;
let allMovies = [];

// ---------- fetch 함수 모아두기 (sec1 ~ sec3) ---------- //
// section1 //
const fetchHomeData = async () => {
  return await fetchUrl("/discover/movie", {
    language: "ko-KR",
    sort_by: "popularity.desc",
    page: page,
  });
};

const fetchInputData = async (query) => {
  return await fetchUrl("/search/movie", {
    language: "ko-KR",
    query: query,
    page: page,
  });
};

// section2 //
const fetchLatestData = async () => {
  const data = await fetchUrl("/movie/now_playing", {
    language: "ko-KR",
    page: page,
  });
  allMovies = data.results;
  renderSlide(3);
};

// section3 //
const fetchGenreCategoryData = async () => {
  return await fetchUrl("/genre/movie/list", {
    language: "ko",
  });
};

const fetchGenreData = async (genreId) => {
  return await fetchUrl("/discover/movie", {
    language: "ko-KR",
    sort_by: "popularity.desc",
    page: page,
    with_genres: genreId,
  });
};

// modal fetch //
const fetchModalData = async (movieId) => {
  return await fetchUrl(`/movie/${movieId}`, {
    append_to_response: "credits",
    language: "ko-KR",
  });
};

// ---------- 컴포넌트 만들기 ---------- //
// section1
const createSearchMovieList = (countPerPageMovie, openModal) => {
  // 이미지 리스트 초기화
  $imgCon1.innerHTML = "";

  // li 만들기
  countPerPageMovie.forEach((movie) => {
    const $movieCard = document.createElement("li");
    $movieCard.setAttribute("class", "poster-con");

    const posterImgUrl = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "./images/no-img.PNG";

    $movieCard.innerHTML = `
      <div class="movieImg">
        <img src="${posterImgUrl}" alt="" />
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

    // li 클릭하면 openModal 함수 호출
    $movieCard.addEventListener("click", (e) => {
      // console.log(movie.id);
      openModal(movie.id);
    });
    return $movieCard;
  });
};

const renderMovie = async (query = "") => {
  $imgCon1.innerHTML = "";

  if (query) {
    currentQuery = query;
    page = 1;
  }

  const data = currentQuery
    ? await fetchInputData(currentQuery)
    : await fetchHomeData();

  if (!data || !data.results || !data.results.length) {
    return error($imgCon1);
  }

  totalPage = Math.ceil(data.total_results / data.results.length);

  createSearchPagination(page);
  createSearchMovieList(data.results, openModal);
};

const searchMovie = async () => {
  const inputValue = $searchInput.value;
  await renderMovie(inputValue);
  $searchInput.value = "";
};

const createSearchPagination = (currentPage) => {
  $searchPagination.innerHTML = "";

  let pageGroup = Math.ceil(page / groupSize);
  let firstPagePerGroup = (pageGroup - 1) * groupSize + 1;
  let lastPagePerGroup = Math.min(pageGroup * groupSize, totalPage);

  if (firstPagePerGroup > 1) {
    const prevGroupBtn = document.createElement("span");
    prevGroupBtn.textContent = "<";
    prevGroupBtn.classList.add("prev");
    prevGroupBtn.addEventListener("click", () => {
      page = firstPagePerGroup - 1;
      renderMovie();
      createSearchPagination(page);
    });
    $searchPagination.appendChild(prevGroupBtn);
  }

  for (let i = firstPagePerGroup; i <= lastPagePerGroup; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    if (i === currentPage) pageButton.classList.add("on");
    pageButton.addEventListener("click", () => {
      page = i;
      renderMovie();
      createSearchPagination(page);
    });
    $searchPagination.appendChild(pageButton);
  }

  if (lastPagePerGroup < totalPage) {
    const nextGroupBtn = document.createElement("span");
    nextGroupBtn.textContent = ">";
    nextGroupBtn.classList.add("next");
    nextGroupBtn.addEventListener("click", () => {
      page = lastPagePerGroup + 1;
      renderMovie();
      createSearchPagination(page);
    });
    $searchPagination.appendChild(nextGroupBtn);
  }
};

// section2
const createSlideMovieCon = (resultsPerPage) => {
  $sec2Wrapper.innerHTML = "";

  const slideMovies = allMovies.slice(
    currentActiveCard,
    currentActiveCard + resultsPerPage
  );

  slideMovies.forEach((movie, index) => {
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

const renderSlide = (resultsPerPage) => {
  createSlideMovieCon(resultsPerPage);
};

const moveCard = (direction, resultsPerPage) => {
  currentActiveCard += direction;

  if (currentActiveCard < 0) {
    currentActiveCard = 0;
  } else if (currentActiveCard > allMovies.length - resultsPerPage) {
    currentActiveCard = allMovies.length - resultsPerPage;
  }

  renderSlide(resultsPerPage);
};

fetchLatestData(); // fetchLatestData에서 데이터 로드 후 renderSlide 호출

// section3
const createGenreBtn = async () => {
  const genreData = await fetchGenreCategoryData();
  let defaultGenre = null;
  genreData.genres.forEach((genre) => {
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

const createGenreImg = async (movies, openModal) => {
  $genreImg.innerHTML = "";

  movies.forEach((movie) => {
    const genreImg = document.createElement("li");
    genreImg.classList.add("genre-item");

    const backdropImgUrl = movie.backdrop_path
      ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
      : "./images/no-img.PNG";

    genreImg.innerHTML = `
      <img src="${backdropImgUrl}" alt="${movie.title}" />
      <div class="title">${movie.title}</div>`;

    $genreImg.appendChild(genreImg);
    genreImg.addEventListener("click", () => openModal(movie.id));
  });
};

const renderGenre = async (genreId = 28) => {
  const movies = await fetchGenreData(genreId);
  if (!movies.results || !movies.results.length) return;

  totalPage = Math.ceil(movies.total_results / movies.results.length);

  createGenreImg(movies.results, openModal);
  createGenrePagination(page, genreId);
};

const createGenrePagination = (currentPage, genreId) => {
  $genrePagination.innerHTML = "";

  // 페이지 그룹 계산
  let pageGroup = Math.ceil(page / groupSize);

  // 페이지 그룹의 첫번째, 마지막 페이지 번호 계산
  let firstPagePerGroup = (pageGroup - 1) * groupSize + 1;
  let lastPagePerGroup = Math.min(pageGroup * groupSize, totalPage);

  if (firstPagePerGroup > 1) {
    // 이전 그룹으로 이동하는 버튼 생성
    const prevGroupBtn = document.createElement("span");
    prevGroupBtn.textContent = "<";
    prevGroupBtn.classList.add("prev");
    prevGroupBtn.addEventListener("click", () => {
      page = firstPagePerGroup - 1;
      renderGenre(genreId);
      createGenrePagination(page);
    });
    $genrePagination.appendChild(prevGroupBtn);
  }

  // 페이지 버튼 생성
  for (let i = firstPagePerGroup; i <= lastPagePerGroup; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    if (i === currentPage) pageButton.classList.add("on");
    pageButton.addEventListener("click", () => {
      page = i;
      renderGenre(genreId);
      createGenrePagination(page);
    });
    $genrePagination.appendChild(pageButton);
  }

  if (lastPagePerGroup < totalPage) {
    // 다음 그룹으로 이동하는 버튼 생성
    const nextGroupBtn = document.createElement("span");
    nextGroupBtn.textContent = ">";
    nextGroupBtn.classList.add("next");
    nextGroupBtn.addEventListener("click", () => {
      page = lastPagePerGroup + 1;
      renderGenre(genreId);
      createGenrePagination(page);
    });
    $genrePagination.appendChild(nextGroupBtn);
  }
};
createGenreBtn();
renderGenre();

// modal
const createModal = (movieId) => {
  const $contentSec = document.createElement("div");
  const $commentSec = document.createElement("div");
  const backdropImgUrl = movieId.backdrop_path
    ? `https://image.tmdb.org/t/p/w500${movieId.backdrop_path}`
    : "./images/no-img.PNG";

  $contentSec.setAttribute("class", "content-sec");
  $commentSec.setAttribute("class", "comment-sec");

  // Cast 배열이 있는지 확인하고, 없는 경우 빈 배열로
  const cast =
    movieId.credits && movieId.credits.cast ? movieId.credits.cast : [];

  // 최대 4명의 배우만 표시하고, 나머지는 ...로 표시
  const displayedCast = cast
    .slice(0, 4)
    .map((item) => item.name)
    .join(", ");
  const hasMoreActors = cast.length > 4 ? "..." : "";

  // 모달을 열 때 저장된 댓글을 업로드
  let comments =
    JSON.parse(localStorage.getItem(`comments_${movieId.id}`)) || [];

  $contentSec.innerHTML = `
    <div class="movie-poster">
      <img
        src="${backdropImgUrl}"
        alt=""
      />
    </div>
    <div class="movie-contents-con">
      <div class="title-content">
        <p class="modal-title">${movieId.title}</p>
        <div class="score">
          <i class="fa fa-star"></i>
          <p class="star">${movieId.vote_average.toFixed(1)}</p>
        </div>
      </div>
      <p class="show-date">개봉일자: ${movieId.release_date}</p>
      <div class="people-content">
        <p class="genre">장르: ${movieId.genres
          .map((item) => item.name)
          .join(", ")}</p>
        <p class="director">감독: ${movieId.credits.crew
          .filter((crew) => crew.job === "Director")
          .map((director) => director.name)
          .join(", ")}</p>
        <p class="run-time">상영시간: ${movieId.runtime}분</p>
        <p class="actors">배우: ${displayedCast}${hasMoreActors}</p>
      </div>
      <p class="plot">
        ${movieId.overview}
      </p>
    </div>
  `;

  const renderComments = () => {
    $commentSec.innerHTML = `
      <div class="my-comment-con">
        <p class="comment-title">나의 한줄평</p>
        <div id="comments-list">
          ${
            comments.length > 0
              ? comments
                  .map((comment) => `<p class="my-comment">${comment}</p>`)
                  .join("<br />")
              : "<p>작성하신 글이 없습니다. 영화에 대한 한줄평을 남겨보세요</p>"
          }
        </div>
      </div>
      <div class="comment-con">
        <input type="text" id="comment" placeholder=" 글을 입력해주세요" />
        <button class="comment-btn" id="comment-btn">댓글달기</button>
      </div>
    `;
  };

  renderComments();

  $modalWrapper.appendChild($contentSec);
  $modalWrapper.appendChild($commentSec);

  // 댓글 올리기 이벤트 리스너
  document.getElementById("comment-btn").addEventListener("click", () => {
    const newComment = document.getElementById("comment").value.trim();
    if (newComment) {
      comments.push(newComment);
      localStorage.setItem(`comments_${movieId.id}`, JSON.stringify(comments));
      document.getElementById("comment").value = "";
      renderComments();
    }
  });

  document.getElementById("comment").addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      document.getElementById("comment-btn").click();
    }
  });

  return $modalWrapper;
};

const openModal = async (movieId) => {
  $modalCon.classList.add("on");
  const data = await fetchModalData(movieId);
  createModal(data);
};

// ---------- 이벤트 리스너 ---------- //
// header
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

// section1
// 검색창에 제목 입력 시 관련 영화 포스터 나오게 하기
$searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    searchMovie();
  }
});
$searchBtn.addEventListener("click", searchMovie);

// section2
$prev.addEventListener("click", () => moveCard(-1, 3));
$next.addEventListener("click", () => moveCard(1, 3));

// modal
$closeBtn.addEventListener("click", () => {
  $modalCon.classList.remove("on");
  $modalWrapper.innerHTML = "";
});

renderMovie();
