"use strict";

/// 宣告連結 API ///
const BASE_URL = "https://user-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/users/";
/// 分頁新增如下 一次只顯示 20 張卡片 ///
const FRIENDS_PER_PAGE = 20;
/// 設定當前頁面 ///
let currentPage = 1
/// 宣告空陣列 空容器 ///
const myFriendsList = [];
// 將搜尋的監聽器中的 filteredFriends 空陣列 空容器 移到外層變成全域變數
let filteredFriends = [];
// closeFriendsList 
const closeFriendsList = JSON.parse(localStorage.getItem('closeFriendslist')) || []  
/// 宣告 card-panel ///
const cardPanel = document.querySelector("#card-panel");
/// 新增宣告 paginator 分頁 ///
const paginator = document.querySelector("#paginator");
// 新增宣告 searchForm 搜索引擎
const searchForm = document.querySelector('#search-form');
// 新增宣告 search-input 取得 input value
const searchInput = document.querySelector('#search-input');

/// 函式 戴入卡片資料區中 ///
function renderFriendList(results) {
  let htmlContent = "";

  results.forEach((results) => {
    htmlContent += `
    <div class="card text-bg-dark flex-column m-2">
    <img src="${results.avatar}" class="card-img" alt="friends-img data-id="${results.id}">
    <div class="heart-icon card-img-overlay">
            <i type="button" class="fa-sharp fa-solid fa-heart-crack fa-xl btn-heart-crack" data-id="${results.id}"></i>    
          </div>
    <div class="card-img-overlay">
      <h5 class="card-name" data-bs-toggle="modal" data-bs-target="#exampleModal" modal-dialog-centered data-id="${results.id}">${results.name} ${results.surname}</h5>
      
    </div>
  </div> `;
  });
  cardPanel.innerHTML = htmlContent;
}

/// 函式 model id ///
function showResult(id) {
  const friendsImg = document.querySelector("#friends-img");
  const friendsName = document.querySelector("#friends-name");
  const friendsRegion = document.querySelector("#friends-region");
  const friendsGender = document.querySelector("#friends-gender");
  const friendsBirthday = document.querySelector("#friends-birthday");
  const friendsAge = document.querySelector("#friends-age");
  const friendsEmail = document.querySelector("#friends-email");
  /// 為了辨識男生女生 追加宣告 ///
  const modalCard = document.querySelector("#modal-card");
  // console.log(friendsAge);

    friendsImg.src = '';
    friendsName.textContent = '';
    friendsRegion.textContent = '';
    friendsGender.textContent = '';
    friendsBirthday.textContent = '';
    friendsAge.textContent = '';
    friendsEmail.textContent = '';
    /// 使用新功能去分辨男女 ///
    modalCard.setAttribute("data-gender", '');

  
  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data;
    friendsImg.src = `${data.avatar}`;
    friendsName.textContent = `${data.name} ${data.surname}`;
    friendsRegion.textContent = `Region : ${data.region}`;
    friendsGender.textContent = `Gender : ${data.gender}`;
    friendsBirthday.textContent = `Birthday : ${data.birthday}`;
    friendsAge.textContent = `Age : ${data.age}`;
    friendsEmail.textContent = `Email : ${data.email}`;
    /// 使用新功能去分辨男女 ///
    modalCard.setAttribute("data-gender", `${data.gender}`);
  });
}

// 新增刪除好友列表內容
function removeCloseFriends (id) {
  if (!closeFriendsList.length || !closeFriendsList) return
  const closeFriendslistIndex = closeFriendsList.findIndex((myFriend) => myFriend.id === id)
  closeFriendsList.splice(closeFriendslistIndex, 1)
  localStorage.setItem('closeFriendslist', JSON.stringify(closeFriendsList))
  //更新頁面
  renderFriendList(closeFriendsList)
  renderFriendList(getFriendsByPage(currentPage)); // 用於確認 分頁函式 是否成功
  renderPaginator(closeFriendsList.length); // 確認 讀取分頁函式
  badge()
}

// 新增分頁函式 // 輸入 page -> 給我 0-19 的 Movie 資料 ... 以此類推
function getFriendsByPage(page) {
  const data = filteredFriends.length ? filteredFriends : closeFriendsList
  const startIndex = (page - 1) * FRIENDS_PER_PAGE;
  // .slice(切割的起點, 切割終點) 我切割陣列的一部分 傳送回來
  return data.slice(startIndex, startIndex + FRIENDS_PER_PAGE);
}

// 新增 讀取分頁函式
function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / FRIENDS_PER_PAGE);
  let rawHTML = "";
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link text-success" href="#" data-page="${page}">${page}</a></li>`;
    // 要記得綁定 data-page="${page}" 在<a>上面
  }
  paginator.innerHTML = rawHTML;
}

// 新增 badge
function badge() {
  const box = document.querySelector('#badge')
  box.textContent = closeFriendsList.length
}

/// 設定卡片中的監聽事件 ///
cardPanel.addEventListener("click", function onPanelClicked(event) {
  const target = event.target
  if (target.matches('.card-name')) {
    showResult(Number(target.dataset.id));
      } else if (target.matches('.btn-heart-crack')) {
      removeCloseFriends(Number(target.dataset.id))
    } 
  badge()
});


/// 搜尋監聽器 ///
searchForm.addEventListener("submit", function onSearchFormSubmitted(event) {
  event.preventDefault() // 取消預設事件
  const keyword = searchInput.value.trim().toLowerCase() // 取得搜尋關鍵字
  filteredFriends = closeFriendsList.filter((myFriend) =>
    myFriend.name.toLowerCase().includes(keyword) ||
    myFriend.surname.toLowerCase().includes(keyword)
  ) // 條件篩選

  if (filteredFriends.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合的人`)
  }
  //重製分頁器
  renderPaginator(filteredFriends.length)  //新增這裡
  //預設顯示第 1 頁的搜尋結果
  renderFriendList(getFriendsByPage(currentPage))  //修改這裡
  badge()
})


/// 追加分頁按鈕監聽器 ///
paginator.addEventListener("click", function onPaginatorClicked(event) {
  // 用if檢查點擊的元素是否正確 //如果被點擊的不是 a 標籤，結束
  if (event.target.tagName !== "A") return;
  //透過 dataset 取得被點擊的頁數
  const page = Number(event.target.dataset.page);
  //更新畫面
  renderFriendList(getFriendsByPage(page));
  badge()
});

badge()
renderFriendList(closeFriendsList)
renderFriendList(getFriendsByPage(currentPage)); // 用於確認 分頁函式 是否成功
renderPaginator(closeFriendsList.length); // 確認 讀取分頁函式