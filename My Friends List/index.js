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
// console.log(myFriendsList)
// console.log(myFriendsList.length)
// const randomfriend = myFriendsList[(Math.random() * myFriendsList.length) | 0]
const randomlist = [];
console.log(randomlist)
/// 將搜尋的監聽器中的 filteredFriends 空陣列 空容器 移到外層變成全域變數
let filteredFriends = [];
/// closeFriendsList 
const closeFriendsList = JSON.parse(localStorage.getItem('closeFriendslist')) || []
/// 宣告 card-panel ///
const cardPanel = document.querySelector("#card-panel");
/// 新增宣告 paginator 分頁 ///
const paginator = document.querySelector("#paginator");
/// 新增宣告 searchForm 搜索引擎
const searchForm = document.querySelector('#search-form');
/// 新增宣告 search-input 取得 input value
const searchInput = document.querySelector('#search-input');

/// 新增宣告幻燈片的變數 ///
const firstCarousel = document.querySelector("#first-carousel")
const secondCarousel = document.querySelector("#second-carousel")
const thirdCarousel = document.querySelector("#third-carousel")

/// 新增carousel-container ///
const carouselContainer = document.querySelector("#carousel-container")
// console.log(carouselContainer)

/// 函式 戴入卡片資料區中 ///
function renderFriendList(results) {
  let htmlContent = "";

  results.forEach((results) => {
    htmlContent += `
    <div class="card text-bg-dark flex-column m-2">
    <img src="${results.avatar}" class="card-img" alt="friends-img data-id="${results.id}">
    <div class="heart-icon card-img-overlay">
            <i type="button" class="fa-sharp fa-regular fa-heart fa-xl btn-favorite" data-id="${results.id}"></i> 
          </div>
    <div class="card-img-overlay">
      <h5 class="card-name" data-bs-toggle="modal" data-bs-target="#exampleModal" modal-dialog-centered data-id="${results.id}">${results.name} ${results.surname}</h5>
      
    </div>
  </div> `;
  });

  cardPanel.innerHTML = htmlContent;
}

/// 新增分頁函式 /// 輸入 page -> 給我 0-19 的 Movie 資料 ... 以此類推
function getFriendsByPage(page) {
  const data = filteredFriends.length ? filteredFriends : myFriendsList
  const startIndex = (page - 1) * FRIENDS_PER_PAGE;
  // .slice(切割的起點, 切割終點) 我切割陣列的一部分 傳送回來
  return data.slice(startIndex, startIndex + FRIENDS_PER_PAGE);
}

/// 新增 讀取分頁函式 ///
function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / FRIENDS_PER_PAGE);
  let rawHTML = "";

  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link text-success" href="#" data-page="${page}">${page}</a></li>`;
    // 要記得綁定 data-page="${page}" 在<a>上面
  }
  paginator.innerHTML = rawHTML;
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
  const modalHeart = document.querySelector("#modal-heart");
  // console.log(modalHeart);
  friendsImg.src = '';
  friendsName.textContent = '';
  friendsRegion.textContent = '';
  friendsGender.textContent = '';
  friendsBirthday.textContent = '';
  friendsAge.textContent = '';
  friendsEmail.textContent = '';
  /// 使用新功能去分辨男女 ///
  modalCard.setAttribute("data-gender", '');
  modalHeart.setAttribute("data-id", '');
  modalHeart.setAttribute("data-heartid", ''); // id 務必要小寫
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
    modalHeart.setAttribute("data-id", `${data.id}`);
    modalHeart.setAttribute("data-heartid", `${data.id}`);
    updatemodalBtn()
  });
}

/// 多設定一個函式 為 addToCloseFriends(id) 加入我的最愛中 ///
function addToCloseFriends(id) {
  //  console.log(id) // 確認用看是否有無綁對
  const myFriend = myFriendsList.find((myFriend) => myFriend.id === id)
  // 製作如果有重複一樣的myFriend就不要再增加
  if (closeFriendsList.some((myFriend) => myFriend.id === id)) {
    return
  }
  // 把filteredFriends推到LIST裡面
  closeFriendsList.push(myFriend)
  localStorage.setItem('closeFriendslist', JSON.stringify(closeFriendsList))
  // 用JSON.stringify(closeFriendslist) 把LIST先改成字串之後 丟進localStorage 裡面
}

/// 新增刪除好友列表內容 ///
function removeCloseFriends(id) {
  if (!closeFriendsList.length || !closeFriendsList) return
  const closeFriendslistIndex = closeFriendsList.findIndex((myFriend) => myFriend.id === id)
  closeFriendsList.splice(closeFriendslistIndex, 1)
  localStorage.setItem('closeFriendslist', JSON.stringify(closeFriendsList))
}

/// updateFavoriteBtn (愛心變化) ///
function updateFavoriteBtn() {
  const favoriteBtn = document.querySelectorAll('.btn-favorite')
  // console.log(favoriteBtn)
  const closeFriendsList = JSON.parse(localStorage.getItem('closeFriendslist'))
  // console.log(closeFriendsList)
  favoriteBtn.forEach((btn) => {
    if (closeFriendsList.find((myFriend) => myFriend.id === Number(btn.dataset.id))) {
      btn.classList.replace("fa-regular", "fa-solid");
      btn.classList.add("redHeart");
    } else {
      btn.classList.replace("fa-solid", "fa-regular");
      btn.classList.remove("redHeart");
    }
  })
}

/// updatemodalBtn (愛心變化) ///
function updatemodalBtn() {
  const modalBtn = document.querySelectorAll('.modal-btn-favorite')
  // console.log(modalBtn)
  const closeFriendsList = JSON.parse(localStorage.getItem('closeFriendslist'))
  // console.log(closeFriendsList)
  modalBtn.forEach((btn) => {
    if (closeFriendsList.find((myFriend) => myFriend.id === Number(btn.dataset.id))) {
      btn.classList.replace("fa-regular", "fa-solid");
      btn.classList.add("redHeart");
    } else {
      btn.classList.replace("fa-solid", "fa-regular");
      btn.classList.remove("redHeart");
    }
  })
}

// 新增 badge
function badge() {
  const box = document.querySelector('#badge')
  const newNumber = parseInt(box.textContent);
  if (closeFriendsList.length !== 0) {
    box.textContent = closeFriendsList.length
  } else {
    if (newNumber <= 0) {
      box.textContent = 0
    }
  }
}


// 新增隨機取號
function randomFriend() {
  return myFriendsList[(Math.random() * myFriendsList.length) | 0]
}


/// 設定CloseFriendsList 第1位名單 ///
function renderFirstCarousel() {
  const firstCarouselImg = document.querySelector("#first-carousel-img");
  const firstCarouselRegion = document.querySelector("#first-carousel-region");
  const firstCarouselBirthday = document.querySelector("#first-carousel-birthday");
  const firstCarouselAge = document.querySelector("#first-carousel-age");
  const firstH3 = document.querySelector("#first-h3");
  if (closeFriendsList.length === 0) {
    let randomfriend = randomFriend(1)
    // console.log(randomfriend)
    randomlist.push(randomfriend)

    firstH3.textContent = `First Referral Friend`
    firstCarouselImg.src = `${randomfriend.avatar}`
    firstCarouselRegion.textContent = `${randomfriend.region}`
    firstCarouselBirthday.textContent = `${randomfriend.birthday}`
    firstCarouselAge.textContent = `${randomfriend.age}`
    firstH3.setAttribute("data-id", `${randomfriend.id}`)
    firstCarouselImg.setAttribute("data-id", `${randomfriend.id}`)
  } else if (closeFriendsList.length !== 0) {
    const closeFriendsList = JSON.parse(localStorage.getItem('closeFriendslist')) || []
    let firstClFrd = closeFriendsList[0]
    // console.log(firstClFrd)
    randomlist.push(firstClFrd)
    firstH3.textContent = `First Close Friend`
    firstCarouselImg.src = `${firstClFrd.avatar}`
    firstCarouselRegion.textContent = `${firstClFrd.region}`
    firstCarouselBirthday.textContent = `${firstClFrd.birthday}`
    firstCarouselAge.textContent = `${firstClFrd.age}`
    firstH3.setAttribute("data-id", `${firstClFrd.id}`)
    firstCarouselImg.setAttribute("data-id", `${firstClFrd.id}`)
  };
}

/// 設定CloseFriendsList 第2位名單 ///
function renderSecondCarousel() {
  const secondCarouselImg = document.querySelector("#second-carousel-img");
  const secondCarouselRegion = document.querySelector("#second-carousel-region");
  const secondCarouselBirthday = document.querySelector("#second-carousel-birthday");
  const secondCarouselAge = document.querySelector("#second-carousel-age");
  const secondH3 = document.querySelector("#second-h3");
  if (closeFriendsList.length === 0) {
    const randomfriend = randomFriend(1)
    // console.log(randomfriend)
    // randomlist.push(randomfriend)
    if (randomlist.some((randomfriend) => randomfriend.id === randomlist.id)) {
      return randomfriend(1)
    }
    randomlist.push(randomfriend)
    secondH3.textContent = `Second Referral Friend`
    secondCarouselImg.src = `${randomfriend.avatar}`
    secondCarouselRegion.textContent = `${randomfriend.region}`
    secondCarouselBirthday.textContent = `${randomfriend.birthday}`
    secondCarouselAge.textContent = `${randomfriend.age}`
    secondH3.setAttribute("data-id", `${randomfriend.id}`)
    secondCarouselImg.setAttribute("data-id", `${randomfriend.id}`)
  } else if (closeFriendsList.length === 1) {
    let randomfriend = randomFriend(1)
    // console.log(randomfriend)
    if (randomlist.some((randomfriend) => randomfriend.id === randomlist.id)) {
      return randomfriend(1)
    }
    randomlist.push(randomfriend)

    secondH3.textContent = `First Referral Friend`
    secondCarouselImg.src = `${randomfriend.avatar}`
    secondCarouselRegion.textContent = `${randomfriend.region}`
    secondCarouselBirthday.textContent = `${randomfriend.birthday}`
    secondCarouselAge.textContent = `${randomfriend.age}`
    secondH3.setAttribute("data-id", `${randomfriend.id}`)
    secondCarouselImg.setAttribute("data-id", `${randomfriend.id}`)
  } else if (closeFriendsList.length >= 2) {
    const closeFriendsList = JSON.parse(localStorage.getItem('closeFriendslist')) || []
    let secondClFrd = closeFriendsList[1]
    // console.log(secondClFrd)
    randomlist.push(secondClFrd)

    secondH3.textContent = `Second Close Friend`
    secondCarouselImg.src = `${secondClFrd.avatar}`
    secondCarouselRegion.textContent = `${secondClFrd.region}`
    secondCarouselBirthday.textContent = `${secondClFrd.birthday}`
    secondCarouselAge.textContent = `${secondClFrd.age}`
    secondH3.setAttribute("data-id", `${secondClFrd.id}`)
    secondCarouselImg.setAttribute("data-id", `${secondClFrd.id}`)
  }
}

/// 設定CloseFriendsList 第3位名單 ///
function renderThirdCarousel() {
  const thirdCarouselImg = document.querySelector("#third-carousel-img");
  const thirdCarouselRegion = document.querySelector("#third-carousel-region");
  const thirdCarouselBirthday = document.querySelector("#third-carousel-birthday");
  const thirdCarouselAge = document.querySelector("#third-carousel-age");
  const thirdH3 = document.querySelector("#third-h3");
  if (closeFriendsList.length === 0) {
    let randomfriend = randomFriend(1)
    // console.log(randomfriend)
    if (randomlist.some((randomfriend) => randomfriend.id === randomlist.id)) {
      return randomfriend(1)
    }
    randomlist.push(randomfriend)

    thirdH3.textContent = `Third Referral Friend`
    thirdCarouselImg.src = `${randomfriend.avatar}`
    thirdCarouselRegion.textContent = `${randomfriend.region}`
    thirdCarouselBirthday.textContent = `${randomfriend.birthday}`
    thirdCarouselAge.textContent = `${randomfriend.age}`
    thirdH3.setAttribute("data-id", `${randomfriend.id}`)
    thirdCarouselImg.setAttribute("data-id", `${randomfriend.id}`)
  } else if (closeFriendsList.length === 1) {
    let randomfriend = randomFriend(1)
    // console.log(randomfriend)
    if (randomlist.some((randomfriend) => randomfriend.id === randomlist.id)) {
      return randomfriend(1)
    }
    randomlist.push(randomfriend)

    thirdH3.textContent = `Second Referral Friend`
    thirdCarouselImg.src = `${randomfriend.avatar}`
    thirdCarouselRegion.textContent = `${randomfriend.region}`
    thirdCarouselBirthday.textContent = `${randomfriend.birthday}`
    thirdCarouselAge.textContent = `${randomfriend.age}`
    thirdH3.setAttribute("data-id", `${randomfriend.id}`)
    thirdCarouselImg.setAttribute("data-id", `${randomfriend.id}`)
  } else if (closeFriendsList.length === 2) {
    let randomfriend = randomFriend(1)
    // console.log(randomfriend)
    if (randomlist.some((randomfriend) => randomfriend.id === randomlist.id)) {
      return randomfriend(1)
    }
    randomlist.push(randomfriend)

    thirdH3.textContent = `First Referral Friend`
    thirdCarouselImg.src = `${randomfriend.avatar}`
    thirdCarouselRegion.textContent = `${randomfriend.region}`
    thirdCarouselBirthday.textContent = `${randomfriend.birthday}`
    thirdCarouselAge.textContent = `${randomfriend.age}`
    thirdH3.setAttribute("data-id", `${randomfriend.id}`)
    thirdCarouselImg.setAttribute("data-id", `${randomfriend.id}`)
  } else if (closeFriendsList.length >= 3) {
    const closeFriendsList = JSON.parse(localStorage.getItem('closeFriendslist')) || []
    let thirdClFrd = closeFriendsList[2]
    // console.log(thirdClFrd)
    randomlist.push(thirdClFrd)

    thirdH3.textContent = `Third Close Friend`
    thirdCarouselImg.src = `${thirdClFrd.avatar}`
    thirdCarouselRegion.textContent = `${thirdClFrd.region}`
    thirdCarouselBirthday.textContent = `${thirdClFrd.birthday}`
    thirdCarouselAge.textContent = `${thirdClFrd.age}`
    thirdH3.setAttribute("data-id", `${thirdClFrd.id}`)
    thirdCarouselImg.setAttribute("data-id", `${thirdClFrd.id}`)
  }
}

/// 設定卡片中的監聽事件 ///
cardPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches('.card-name')) {
    showResult(Number(event.target.dataset.id));
  }
  if (event.target.matches('.fa-regular') && event.target.matches('.btn-favorite')) {
    addToCloseFriends(Number(event.target.dataset.id)) // 呼叫addToCloseFriends函式
    renderFirstCarousel(Number(event.target.dataset.id))
    renderSecondCarousel(Number(event.target.dataset.id))
    renderThirdCarousel(Number(event.target.dataset.id))
  } else if (event.target.matches('.fa-solid') && event.target.matches('.btn-favorite')) {
    removeCloseFriends(Number(event.target.dataset.id))
    renderFirstCarousel(Number(event.target.dataset.id))
    renderSecondCarousel(Number(event.target.dataset.id))
    renderThirdCarousel(Number(event.target.dataset.id))
  }
  updateFavoriteBtn()
});
/// 設定卡片中的監聽事件 對應badge ///
cardPanel.addEventListener("click", updateBadge)
function updateBadge(event) {
  const target = event.target
  console.log(target)
  if (target.matches('.btn-favorite')) {
    const box = target.parentElement.parentElement.parentElement.parentElement.children[0].children[0].children[3].children[0].children[1].children[0].children[1];
    // console.log(box)
    let number = parseInt(box.textContent);
    if (target.matches('.fa-solid')) {
      box.textContent = number + 1
    } else if(target.matches('.fa-regular')) {
      box.textContent = number - 1
    } 
  }
}


/// 設定幻燈片中的監聽事件 ///
carouselContainer.addEventListener("click", showModel)
function showModel(event) {
  const target = event.target
  if (target.matches('.first-h3') || target.matches('.second-h3') || target.matches('.third-h3') || target.matches('.carousel-img')) {
    showResult(Number(target.dataset.id))
  }
};


/// 追加分頁按鈕監聽器 ///
paginator.addEventListener("click", function onPaginatorClicked(event) {
  // 用if檢查點擊的元素是否正確 //如果被點擊的不是 a 標籤，結束
  if (event.target.tagName !== "A") return;
  //透過 dataset 取得被點擊的頁數
  const page = Number(event.target.dataset.page);
  //更新畫面

  renderFriendList(getFriendsByPage(page));
  updateFavoriteBtn()
  updatemodalBtn()
  renderFirstCarousel()
  renderSecondCarousel()
  renderThirdCarousel()
  badge()
});

/// 搜尋監聽器 ///
searchForm.addEventListener("submit", function onSearchFormSubmitted(event) {
  event.preventDefault() // 取消預設事件
  const keyword = searchInput.value.trim().toLowerCase() // 取得搜尋關鍵字
  filteredFriends = myFriendsList.filter((myFriend) =>
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
  updateFavoriteBtn()
  updatemodalBtn()
  badge()
})

/// 設定modalBtn ///
const modalHBtn = document.querySelector("#modal-heart");
// console.log(modalHBtn)
modalHBtn.addEventListener("click", modalHeart);
function modalHeart(event) {
  const target = event.target;
  const targetModalHeart = document.querySelector(`[data-heartID= "${target.dataset.id}"]`);
  if (target.matches('.fa-regular') && target.matches('.modal-btn-favorite')) {
    // console.log(target)
    // targetModalHeart.classList.add("redHeart");
    addToCloseFriends(Number(target.dataset.id))
    // alert('Add into Close friend list!')
    renderFirstCarousel(Number(target.dataset.id))
    renderSecondCarousel(Number(target.dataset.id))
    renderThirdCarousel(Number(target.dataset.id))
  } else if (target.matches('.fa-solid') && target.matches('.modal-btn-favorite')) {
    // targetModalHeart.classList.remove("redHeart");
    removeCloseFriends(Number(target.dataset.id))
    // alert('Remove Close from friend list!')
    renderFirstCarousel(Number(target.dataset.id))
    renderSecondCarousel(Number(target.dataset.id))
    renderThirdCarousel(Number(target.dataset.id))
  }
  updateFavoriteBtn()
  updatemodalBtn()
  renderFirstCarousel()
  renderSecondCarousel()
  renderThirdCarousel()
}

modalHBtn.addEventListener("click", updateModalBadge)
function updateModalBadge(event) {
  const target = event.target
  console.log(target)
  if (target.matches('.modal-btn-favorite')) {
    const box = target.document.querySelector('#badge')
    console.log(box)
    let number = parseInt(box.textContent);
    if (target.matches('.fa-solid')) {
      box.textContent = number + 1
    } else if(target.matches('.fa-regular')) {
      box.textContent = number - 1
    } 
  }
}



axios
  .get(INDEX_URL)
  .then((response) => {
    myFriendsList.push(...response.data.results);
    // console.log(myFriendList)
    
    renderFriendList(getFriendsByPage(currentPage)); // 用於確認 分頁函式 是否成功
    renderPaginator(myFriendsList.length); // 確認 讀取分頁函式
    updateFavoriteBtn()
    updatemodalBtn()
    renderFirstCarousel()
    renderSecondCarousel()
    renderThirdCarousel()
    badge()
  })


