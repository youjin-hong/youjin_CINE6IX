const createModal = (movieId, $modalWrapper) => {
  const $contentSec = document.createElement("div");
  const $commentSec = document.createElement("div");

  $contentSec.setAttribute("class", "content-sec");
  $commentSec.setAttribute("class", "comment-sec");

  // Cast 배열이 있는지 확인하고, 없는 경우 빈 배열로 처리
  const cast =
    movieId.credits && movieId.credits.cast ? movieId.credits.cast : [];

  // 최대 4명의 배우만 표시하고, 나머지는 ...로 표시
  const displayedCast = cast
    .slice(0, 4)
    .map((item) => item.name)
    .join(", ");
  const hasMoreActors = cast.length > 4 ? "..." : "";

  $contentSec.innerHTML = `
    <div class="movie-poster">
      <img
        src="https://image.tmdb.org/t/p/w500${movieId.backdrop_path}"
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

  $commentSec.innerHTML = `
    <div class="my-comment-con">
      <p class="comment-title">나의 한줄평</p>
      <p class="my-comment">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quasi
        numquam, qui cupiditate et corrupti saepe, excepturi neque accusamus
        eius veritatis ipsa odit, voluptatem sunt repellendus iste maiores
        illo! Adipisci, rerum?
      </p>
      <p class="my-comment">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quasi
        numquam, qui cupiditate et corrupti saepe, excepturi neque accusamus
        eius veritatis ipsa odit, voluptatem sunt repellendus iste maiores
        illo! Adipisci, rerum?
      </p>
    </div>
    <div class="comment-con">
      <input type="input" id="comment" placeholder=" 글을 입력해주세요" />
      <button class="comment-btn">댓글달기</button>
    </div>
  `;

  $modalWrapper.appendChild($contentSec);
  $modalWrapper.appendChild($commentSec);

  return $modalWrapper;
};
export default createModal;
