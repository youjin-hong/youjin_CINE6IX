const error = ($imgCon1) => {
  $imgCon1.innerHTML = "";
  const errorMsg = document.createElement("div");
  errorMsg.textContent = "검색하신 영화 정보가 없습니다.";
  errorMsg.style.cssText = `position: absolute; left: 42.5%`;
  $imgCon1.appendChild(errorMsg);
};
export default error;
