# 🎞️📽️영화 추천 사이트 CINE6IX

배포 URL: https://youjin-hong.github.io/youjin_CINE6IX/
<br />
시연 영상: https://youtu.be/RTzwB4wfCas?si=RC-Xmv6rYurUdost

CINE6IX는 보고 싶은 영화를 손쉽게 검색하고, 최신 영화나 특정 장르의 영화를 인기순으로 추천받을 수 있는 사이트입니다. 영화 상세 정보를 확인하고, 나만의 영화평을 기록할 수 있어 영화 감상 후 간단한 의견을 남기기에 편리합니다.

## 🎇프로젝트 개요

## 📃목차

- [프로젝트 개요](#프로젝트-개요)
- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [개발 기간](#개발-기간)
- [향후 개선 사항](#향후-개선-사항)
- [느낀점](느낀점)

## 💡주요 기능

**✔️영화 검색**

- 사용자가 원하는 영화 제목을 검색하면 해당 키워드를 포함한 영화 리스트가 표시됩니다.

<img src="https://github.com/user-attachments/assets/d80ffd93-b5b9-45ba-a0b6-d8346bd1c80a" width="600" />

**✔️최신 영화**

- 최신 영화를 인기 순으로 정렬하여 보여줍니다. 영화는 페이지네이션으로 확인할 수 있으며, 카드 형태의 UI로 썸네일, 제목, 간단한 설명, 평점 등을 제공합니다.

<img src="https://github.com/user-attachments/assets/13a94ce6-06e7-474b-8ba3-c4d020f482ad" width="600" />

**✔️장르별 영화**

- 액션, 모험, 애니메이션 등 다양한 장르의 영화들을 카테고리화하여 각 장르별로 영화 목록을 탐색할 수 있습니다.

<img src="https://github.com/user-attachments/assets/364b78a1-6d2c-4cfc-9d1c-a8d9e1392590" width="600"/>

**✔️영화 정보 상세 보기 및 영화평 남기기**

- 영화 썸네일을 클릭하면 상세 모달 창이 열리며, 영화의 스틸컷, 제목, 평점, 개봉일자, 장르, 줄거리 등 자세한 정보를 볼 수 있습니다. 또한, localStorage를 사용하여 사용자만의 한줄평을 남기고 관리할 수 있어 리뷰 작성 및 관리가 용이합니다.

<img src="https://github.com/user-attachments/assets/a09b95dd-11e3-4703-ab65-8ea751584b09" width="600"/>

<br />

## 🛠기술 스택

### 📌 Front-end

<div style={{display: "flex"}}>
<img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=HTML5&logoColor=white">
<img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=CSS3&logoColor=white">
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=black">
<img src="https://img.shields.io/badge/Fetch_API-4285F4?style=for-the-badge&logo=Google-Chrome&logoColor=white">
<img src="https://img.shields.io/badge/LocalStorage-007ACC?style=for-the-badge&logo=Web&logoColor=white">
</div>

### 📌버전 관리

<div style={{display: "flex"}}>
<img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=Git&logoColor=white">
<img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=GitHub&logoColor=white">
</div>

<br />

## 📆개발 기간

- 기획: 2024.8.9~2024.8.12
- 개발: 2024.8.13~2024.11.19

<br />

## 🔧향후 개선 사항

- 다양한 카테고리 추가하여 사용자 경험 개선
- 예외 처리 보강
- 스크랩 기능 추가 찜한 영화 리스트 한 눈에 관리
- 코드 리팩토링 (코드 모듈화, 폴더 구조 정리)

<br />

## 👥느낀점

Vanilla Javascript로 처음 코드를 작성해서 영화 추천 사이트를 만들어보았는데, 어떠한 프레임워크 없이 HTML, CSS, Javascript로 기능을 구현을 하는 것이 뜻깊은 시간이었던 것 같다.

특히, localStorage를 이용해 영화평을 저장하고 관리하는 기능을 구현하면서 크를라이언트 측의 데이터 저장의 장점과 DB 부재라는 한계를 느꼈던 것 같다.
이 것을 통해 백엔드 서버 없이도 사용자 데이터를 간단히 유지할 수 있는 방법을 익혔지만, 데이터 보존과 또 보안면에서 개선할 부분이 있다는 것을 느꼈다.

그리고 fetch를 사용해 open API로 영화 데이터를 불러오면서 Api로 fetching 하는 방법과, 비동기 처리에 대해 조금이나마 전보다 이해가 되었던 것 같다.
