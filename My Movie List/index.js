const BASE_URL = 'https://webdev.alphacamp.io/'
const INDEX_URL = BASE_URL + 'api/movies/'
const POSTER_URL = BASE_URL + '/posters/'

// 分頁新增如下 一次只顯示 12 張卡片
const MOVIES_PER_PAGE = 12

// console.log(axios.get(INDEX_URL))
// 宣告 movies 空陣列 空容器
const movies = []
// 將搜尋的監聽器中的 filteredMovies 空陣列 空容器 移到外層變成全域變數
let filteredMovies = []

// 宣告 datapanel 
const dataPanel = document.querySelector('#data-panel')
// 新增宣告 searchForm 搜索引擎
const searchForm = document.querySelector('#search-form')
// 新增宣告 search-input 取得 input value
const searchInput = document.querySelector('#search-input')
// 新增宣告 paginator 分頁
const paginator = document.querySelector('#paginator')

// 設定函式來戴入 HTML (讀取 URL MoviesList)
function renderMovieList(data) {
  let rawHTML = ''
  

    data.forEach(item => {
      
     // ctitle, image, id
      // console.log(item)
      rawHTML += `
      <div class="col-sm-3">
      <div class="mb-2">
        <div class="card">
          <img
            src="${POSTER_URL + item.image}"
            class="card-img-top" alt="Movie Poster" />
          <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
          </div>
          <div class="card-footer">
            <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">
              More
            </button>

            <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
          </div>
        </div>
      </div>
    </div> 
      `
    });

   dataPanel.innerHTML = rawHTML
}

// 新增 讀取分頁函式
function renderPaginator(amount) {
  //  80部電影 / 12部電影 = 6頁 ... 餘數 8 部電影
  // 所以使用 無條件進位的 Math.ceil()
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
  let rawHTML = ''

  for (let page = 1; page <= numberOfPages; page ++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
    // 要記得綁定 data-page="${page}" 在<a>上面
  }
  
  paginator.innerHTML = rawHTML
}

// 新增分頁函式 // 輸入 page -> 給我 0-11 的 Movie 資料 ... 以此類推
function getMoviesByPage(page) {
   // page 1 -> movies 0 - 11
   // page 2 -> movies 12 - 23
   // page 3 -> movies 24 - 35
   // ... 以此類推
   // getMoviesByPage 中的 movies 有2種意思 1. 完整的80部 movies 2. favoriteMovies(使用者搜尋後的 moviesList)
   const data = filteredMovies.length ? filteredMovies : movies
   // 上列程式碼的意思是 如果 filteredMovies.length 是大於 0 是有東西的就給我 filteredMovies 如果沒有 (空陣列) 就給我 movies
   // 如果搜尋結果有東西，條件判斷為 true ，會回傳 filteredMovies，然後用 data 保存回傳值
   const startIndex = (page - 1) * MOVIES_PER_PAGE
   // .slice(切割的起點, 切割終點) 我切割陣列的一部分 傳送回來
   // return movies.slice(startIndex, startIndex + MOVIES_PER_PAGE)
   // 改成以下
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

function showMovieModal(id) {
    // get elements
    const modalTitle = document.querySelector('#movie-modal-title')
    const modalImage = document.querySelector('#movie-modal-image')
    const modalDate = document.querySelector('#movie-modal-date')
    const modalDescription = document.querySelector('#movie-modal-description')
  
    // send request to show api
    axios.get(INDEX_URL + id).then((response) => {
      const data = response.data.results
      console.log(data)
      // insert data into modal ui
      modalTitle.innerText = data.title
      modalDate.innerText = 'Release date: ' + data.release_date
      modalDescription.innerText = data.description
      modalImage.innerHTML = `<img src="${POSTER_URL + data.image
        }" alt="movie-poster" class="img-fluid">`
    })
  }
  

  // 多設定一個函式 為 addToFavorite(id) 加入我的最愛中
function addToFavorite(id) {
  //  console.log(id) // 確認用看是否有無綁對
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || [] 
  // 如果沒有找到就給我空陣列的意思 ( || 左邊優先 )
  // 這裡還是必須改成 JOSN.parse() // 原因 : localStorage.getItem() 只會存取字串 所以必須把它改成 陣列或JS物件
  
  // 先用基本寫法 不要用匿名及箭頭函式寫法 
  //  function isMovieIdMatched(movie) {
  //   return movie.id === id
  //  }
  // const movie = movies.find(isMovieIdMatched) // (誇號)內為函式
  
  // 改成用 匿名函式 箭頭函式
  const movie = movies.find((movie) => movie.id === id)
  
  // 製作如果有重複一樣的movie就不要再增加
  if (list.some((movie) => movie.id === id)) {
     return alert('此電影已經在收藏清單中!')
  }

  // // 舉例了解 find, some 
  // // find 回傳會是值 3
  // let numbers = [1, 2, 3, 4, 5, 6]
  // let newNumber = numbers.find((number) => number === 3)
  // console.log(newNumber) //3
  // // some 回傳會是 布林值 true
  // let numbers = [1, 2, 3, 4, 5, 6]
  // let newNumber = numbers.some((number) => number === 3)
  // console.log(newNumber) //true
  

  //把這部favoriteMovies推到LIST裡面
  list.push(movie)
  // console.log(list) // 確認是否有把資料放入內
  // console.log(movie)
  
  // 用以下方式把字串轉換成JS物件
  // const jsonString = JSON.stringify(list)
  // console.log('json string', jsonString) // 此印出會是JSON 格式的字串 必須用以下方式轉成 JS物件
  // console.log('json object', JSON.parse(jsonString)) //此印出會是 JS物件
  // console.log(JSON.stringify(list))

  localStorage.setItem('favoriteMovies', JSON.stringify(list))
  // 用JSON.stringify(list) 把LIST先改成字串之後 丟進localStorage 裡面
}


  // listen to datapanel
  dataPanel.addEventListener('click', function onPanelClicked(event) {
    if (event.target.matches('.btn-show-movie')) {
      showMovieModal(Number(event.target.dataset.id))
    } else if (event.target.matches('.btn-add-favorite')) {
      // 呼叫addToFavorite函式
      addToFavorite(Number(event.target.dataset.id))
    } 
  })  

  // 追加分頁按鈕監聽器
  paginator.addEventListener('click', function onPaginatorClicked(event) {
    // 用if檢查點擊的元素是否正確 //如果被點擊的不是 a 標籤，結束
    if (event.target.tagName !== 'A') return
    //透過 dataset 取得被點擊的頁數
    const page = Number(event.target.dataset.page)
    //更新畫面
    renderMovieList(getMoviesByPage(page))
  })

  // 搜尋監聽器
  searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
    event.preventDefault() // 新增這裡 // 取消預設事件
    // 以下優化：
    // toLowerCase()：把字串轉成小寫。
    // trim()：把字串頭尾空格去掉。
    const keyword = searchInput.value.trim().toLowerCase() // 取得搜尋關鍵字
    // let filteredMovies = [] // 儲存符合篩選條件的項目 >>>> 改到外面讓他變成全域變數
    
    // if (!keyword.length) { // 錯誤處理：輸入無效字串
    // return alert('請輸入有效字串！') 
    // }
    filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword) 
    ) // 條件篩選
    
    // 兩個簡單的優化：
    // 當使用者沒有輸入任何關鍵字時，畫面顯示全部電影 (在 include () 中傳入空字串，所有項目都會通過篩選）
    // 當使用者輸入的關鍵字找不到符合條件的項目時，跳出提示

    if (filteredMovies.length === 0) {
      return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`)
    }
    
    //重製分頁器
    renderPaginator(filteredMovies.length)  //新增這裡
    //預設顯示第 1 頁的搜尋結果
    renderMovieList(getMoviesByPage(1))  //修改這裡

    // renderMovieList(filteredMovies) // 重新輸出至畫面 (修改這裡改成以上的程式碼)
    // 瀏覽器預設會重整頁面
    // console.log(event) // 測試用
    // console.log(searchInput.value) // 測試輸入值後是否有出現值

  })


//目標：用 .push() 方法把 movies 從空陣列變成 [1,2,3]
// send request to index api

axios.get(INDEX_URL).then(response => {
 //    Array(80)
 //    console.log(response.data.results)
 //    movies.push(response.data.results)
 //    如果.push()直接放入 response.data.results 會印出的是 Array 而不是Array中的內容 //
 //    1.可以直接使用 for 迴圈 一個一個帶入 //
 //    for (const movie of response.data.results) {
 //       movies.push(movie)
 //    }
      
 //    2.可用新語法 展開陣列 加上 ... 「展開運算子 (spread operator)」
 //    注意: .push(可帶入多個參數)
  movies.push( ... response.data.results)
    // console.log(movies) 

    // 務必不要忘記 呼叫函式
  // renderMovieList(movies)
  renderMovieList(getMoviesByPage(1)) // 用於確認 分頁函式 是否成功
  renderPaginator(movies.length) // 確認 讀取分頁函式 
})
// .catch((err) => console.log(err))

// localStorage.setItem('key', 'value') 儲存value資料用 value = 這裡只能放字串
// 資料會被存在 / 檢查(DevTools) / 應用程式(Application) / 本機儲存空間(Local Storage) / ...之中
// localStorage.setItem('default_language', 'english') // JSON.stringify() => 用函式轉成字串

// localStorage.getItem('key') 取出key資料用
// localStorage.getItem('default_language')
// console.log(localStorage.getItem('default_language')) // 確認用 
// // 為何這裡可以取出資料的原因 因為上一步驟已經把資料存入內

// localStorage.removeItem('key') 移除key資料用
// localStorage.removeItem('default_language')
// console.log(localStorage.removeItem('default_language'))

