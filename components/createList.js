const createHtml = (movieCount, $imgCon1, openModal) => {
  // 이미지 리스트 초기화
  $imgCon1.innerHTML = "";

  // li 만들기
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

    // li 클릭하면 openModal 함수 호출
    $movieCard.addEventListener("click", (e) => {
      // console.log(movie.id);
      openModal(movie.id);
    });
    return $movieCard;
  });
};

export default createHtml;
