const BASE_URL = 'https://webdev.alphacamp.io/'
const INDEX_URL = BASE_URL + 'api/movies/'
const POSTER_URL = BASE_URL + '/posters/'

// console.log(axios.get(INDEX_URL))
// 宣告 movies 空陣列 空容器
const movies = JSON.parse(localStorage.getItem('favoriteMovies')) || [] 

// 宣告 datapanel 
const dataPanel = document.querySelector('#data-panel')
// 新增宣告 searchForm 搜索引擎
const searchForm = document.querySelector('#search-form')
// 新增宣告 search-input 取得 input value
const searchInput = document.querySelector('#search-input')

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
            
            <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
          </div>
        </div>
      </div>
    </div> 
      `
    });

   dataPanel.innerHTML = rawHTML
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



function removeFromFavorite(id) {
    if (!movies || !movies.length) return  //防止 movies 是空陣列的狀況
  
    //透過 id 找到要刪除電影的 index
    const movieIndex = movies.findIndex((movie) => movie.id === id)
    if(movieIndex === -1) return
  
    //刪除該筆電影
    movies.splice(movieIndex,1)
  
    //存回 local storage
    localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  
    //更新頁面
    renderMovieList(movies)
}  


  // listen to datapanel  // 修改這裡就可以加上移除按鈕的事件監聽器
  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.btn-show-movie')) {
      showMovieModal(Number(event.target.dataset.id))
      // 修改以下
    } else if (event.target.matches('.btn-remove-favorite')) {
      // 呼叫addToFavorite函式
      removeFromFavorite(Number(event.target.dataset.id))
    } 
  })  
  renderMovieList(movies) // 要記得呼叫


// 刪除電影資料的方法 使用 findIndex 取得 index
// findIndex 只告訴我們那個項目的 index。 若沒能找到符合的項目，則會回傳 -1。 
// 舉例： 會回傳 2 為第2項目
// let numbers = [1, 2, 3, 4, 5, 6]
// let index = numbers.findIndex((number) => number === 3)
// console.log(index) //2 

// 刪除元素
// 得知 index 之後，就能使用陣列的 splice 方法來移除該項目，例如：
// numbers.splice(index, 1)
// console.log(numbers)  //[1,2,4,5,6]





// // 說明程式碼
// function removeFromFavorite(id) { 
//   if (!movies || !movies.length) return //防止 movies 是空陣列的狀況
// // 如果 movies 回傳為 undefined 或是 陣列中沒有東西 就停止函式

//   const movieIndex = movies.findIndex((movie) => movie.id === id)
// // 宣告 movieIndex = 從 movies 陣列中 比對該 movie 的 id 並找出此 movie 對應陣列中的位置 

//   if(movieIndex === -1) return
// // 如果 movieIndex 完全等於 -1 就停止函式 

//   movies.splice(movieIndex,1)
// // 刪除 movies 陣列 從 movieIndex 指定項目 1 刪除  

//   localStorage.setItem('favoriteMovies', JSON.stringify(movies))
// // 將資料存到localStorage中 
// // 但localStorage中只能是字串 
// // 所以 把key = 字串'favoriteMovies' Value = 用JSON.stringify()轉換成JSON格式字串

//   renderMovieList(movies)
// // 處理完後並重新渲染頁面  
// }