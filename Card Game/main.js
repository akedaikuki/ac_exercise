"use strict"

////////////////////////////////////////////////////////////
// 13.設定遊戲狀態
// 放在文件最上方
const GAME_STATE = {
  FirstCardAwaits: "FirstCardAwaits",
  SecondCardAwaits: "SecondCardAwaits",
  CardsMatchFailed: "CardsMatchFailed",
  CardsMatched: "CardsMatched",
  GameFinished: "GameFinished",
}


////////////////////////////////////////////////////////////
// 3.運算花色與數字  資料設計 //
// 花色圖片 //
const Symbols = [
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17989/__.png', // 黑桃
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17992/heart.png', // 愛心
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17991/diamonds.png', // 方塊
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17988/__.png' // 梅花
]  


////////////////////////////////////////////////////////////
// 1.渲染卡片：view.displayCards // 
// const view = {
//     displayCards() {
//       document.querySelector('#cards').innerHTML = `
//         <div class="card">
//           <p>6</p>
//           <img src="https://assets-lighthouse.alphacamp.co/uploads/image/file/17992/heart.png">
//           <p>6</p>
//         </div>
//   `
//     }
//   }
//   view.displayCards()


////////////////////////////////////////////////////////////
// // 原本的寫法
// const view = {
//     displayCards: function displayCards() { ...  }
//   }
// // 省略後的寫法
// const view = {
//     displayCards() { ...  }
//   }


////////////////////////////////////////////////////////////
// 2.渲染卡片內部元素：view.getCardElement //
// 拆解函式 //
// const view = {
//     getCardElement () {
//       return `
//         <div class="card">
//           <p>6</p>
//           <img src="https://assets-lighthouse.alphacamp.co/uploads/image/file/17992/heart.png">
//           <p>6</p>
//         </div>
//       `
//     },
//     displayCards () {
//       const rootElement = document.querySelector('#cards')
//       rootElement.innerHTML = this.getCardElement()
//   }
// }
//   view.displayCards()


////////////////////////////////////////////////////////////
// 運算邏輯 //
// getCardElement (index) {
//     const number = (index % 13) + 1
//     const symbol = Symbols[Math.floor(index / 13)]
//     return `
//       <div class="card">
//         <p>${number}</p>
//         <img src="${symbol}" />
//         <p>${number}</p>
//       </div>`
//   } 


////////////////////////////////////////////////////////////
// 5.稍微改寫一下 getCardElement，在運算數字時呼叫 transformNumber：//
const view = {
// 和介面有關的程式碼
  
// getCardElement (index) {
//     const number = this.transformNumber((index % 13) + 1)
//     const symbol = Symbols[Math.floor(index / 13)]
//     return `
//       <div class="card">
//         <p>${number}</p>
//         <img src="${symbol}" />
//         <p>${number}</p>
//       </div>`
//   },  //// 12.取得卡片索引：在元素上設定 data-set 改成以下
getCardElement (index) {
  return `<div data-index="${index}" class="card back"></div>`
},
getCardContent (index) {
  const number = this.transformNumber((index % 13) + 1)
  const symbol = Symbols[Math.floor(index / 13)]
  return `
    <p>${number}</p>
    <img src="${symbol}" />
    <p>${number}</p>
  `
},
// 4.特殊數字轉換：transformNumber //
transformNumber (number) {
    switch (number) {
      case 1:
        return 'A'
      case 11:
        return 'J'
      case 12:
        return 'Q'
      case 13:
        return 'K'
      default:
        return number
    }
  },
  displayCards(indexes) {
    const rootElement = document.querySelector("#cards");
    // rootElement.innerHTML = Array.from(Array(52).keys()).map(index => this.getCardElement(index)).join("");
    //// 10.改成以下 
    // rootElement.innerHTML = utility.getRandomNumberArray(52).map(index => this.getCardElement(index)).join("");
    //// 15. 改成以下
    rootElement.innerHTML = indexes.map(index => this.getCardElement(index)).join('');
    }, 
    //// 11.翻牌：view.flipCard 加入此
    // flipCard (card) {
    //   // console.log(card)
    //   if (card.classList.contains('back')) {
    //     // 回傳正面
    //     card.classList.remove('back')
    //     // card.innerHTML = this.getCardContent(10) // 暫時給定 10
    //     card.innerHTML = this.getCardContent(Number(card.dataset.index)) // 10.改這裡
    //     return
    //   }
    //   // 回傳背面
    //   card.classList.add('back')
    //   card.innerHTML = null
    // },
    // pairCard(card) {
    //   card.classList.add('paired')
    // }
    //// 21.改寫 flipCard
    flipCards (...cards) {
      cards.map(card => {
        if (card.classList.contains('back')) {
          card.classList.remove('back')
          card.innerHTML = this.getCardContent(Number(card.dataset.index))
          return
        }
        card.classList.add('back')
        card.innerHTML = null
      })
    },
    /// 22.改寫 pairCard
    pairCards (...cards) {
      cards.map(card => {
        card.classList.add('paired')
      })
    },
    /// 24.新增 renderScore
    renderScore(score) {
      document.querySelector(".score").textContent = `Score: ${score}`;
    },
    /// 24.新增 renderTriedTimes
    renderTriedTimes(times) {
      document.querySelector(".tried").textContent = `You've tried: ${times} times`;
    },
    /// 26-1.新增 view.appendWrongAnimation 函式
    appendWrongAnimation(...cards) {
      cards.map(card => {
        card.classList.add('wrong')
        card.addEventListener('animationend', event =>   event.target.classList.remove('wrong'), { once: true })
        })
      },
    /// 28.新增 view.showGameFinished
      showGameFinished () {
        const div = document.createElement('div')
        div.classList.add('completed')
        div.innerHTML = `
          <p>Complete!</p>
          <p>Score: ${model.score}</p>
          <p>You've tried: ${model.triedTimes} times</p>
        `
        const header = document.querySelector('#header')
        header.before(div)
      },
}

////////////////////////////////////////////////////////////
// 14.建立 MVC 架構
// 宣告 Model
const model = {
  revealedCards: [],
    // 17.加入
  isRevealedCardsMatched() {
    return this.revealedCards[0].dataset.index % 13 === this.revealedCards[1].dataset.index % 13 
  },
  // 24.分數與嘗試次數
  // 新增以下
  score: 0,
  triedTimes: 0,
}

////////////////////////////////////////////////////////////
// 14.建立 MVC 架構
// 宣告 Controller
// 在初始狀態設定為 FirstCardAwaits，也就是「還沒翻牌」。
const controller = {
  currentState: GAME_STATE.FirstCardAwaits,  // 加在第一行
  // ... 
  //// 15. 改成以下
  generateCards () {
    view.displayCards(utility.getRandomNumberArray(52))
  },
  dispatchCardAction (card) {
    if (!card.classList.contains('back')) {
      return
    }
    switch (this.currentState) {
      case GAME_STATE.FirstCardAwaits:
        /// 21. 改寫這裡
        // view.flipCard(card)
        view.flipCards(card)
        model.revealedCards.push(card)
        this.currentState = GAME_STATE.SecondCardAwaits
        break
        case GAME_STATE.SecondCardAwaits:
          view.renderTriedTimes(++model.triedTimes)  /// 24-3.add this 
          /// 21. 改寫這裡
          // view.flipCard(card)
          view.flipCards(card)
          model.revealedCards.push(card)
          // 判斷配對是否成功
          if (model.isRevealedCardsMatched()) {
            // 配對成功
            view.renderScore(model.score += 10)    /// 24-3.add this 
            this.currentState = GAME_STATE.CardsMatched
            /// 22.改寫 pairCard
            // view.pairCard(model.revealedCards[0])
            // view.pairCard(model.revealedCards[1])
            view.pairCards(...model.revealedCards)
            model.revealedCards = []
            /// 28-2.呼叫view.showGameFinished函式
            if (model.score === 260) {
              console.log('showGameFinished')
              this.currentState = GAME_STATE.GameFinished
              view.showGameFinished()  // 加在這裡
              return
            }
            this.currentState = GAME_STATE.FirstCardAwaits
          } else {
            // 配對失敗
            // this.currentState = GAME_STATE.CardsMatchFailed
            // setTimeout(() => {
            //   /// 21. 改寫這裡
            //   // view.flipCard(model.revealedCards[0])
            //   // view.flipCard(model.revealedCards[1])
            //   view.flipCards(...model.revealedCards)
            //   model.revealedCards = []
            //   this.currentState = GAME_STATE.FirstCardAwaits
            // }, 1000)
            /// 23.修改為以下
            this.currentState = GAME_STATE.CardsMatchFailed
            view.appendWrongAnimation(...model.revealedCards)  /// 26-2.add this
            setTimeout(this.resetCards, 1000)
          }
          break
    }
    console.log('this.currentState', this.currentState)
    console.log('revealedCards', model.revealedCards.map(card => card.dataset.index))
  },
  /// 23.新增resetCards
  resetCards () {
    view.flipCards(...model.revealedCards)
    model.revealedCards = []
    controller.currentState = GAME_STATE.FirstCardAwaits
  }
}


//////////////////////////////////////////////////////////
// 7.洗牌演算法：Fisher-Yates Shuffle //
const utility = {
  getRandomNumberArray(count) {
        // 生成連續數字陣列
      const number = Array.from(Array(count).keys())
        // 選定想交換的位置
      for (let index = number.length - 1; index > 0; index--) {
        // let index = number.length - 1 = 取出最後一項。
        let randomIndex = Math.floor(Math.random() * (index + 1))
        // 找到一個隨機項目。
        ;[number[index], number[randomIndex]] = [number[randomIndex], number[index]]
        // 交換陣列元素  //// 等同於 temp = number[index] number[index] = number[randomIndex] number[randomIndex] = temp
      }
      return number
    }
  }


////////////////////////////////////////////////////////////

controller.generateCards() // 取代 view.displayCards()


////////////////////////////////////////////////////////////
// 6.產生 52 個 DOM 元素並拼裝 template //
// 有了連續數字陣列以後，我們可以進一步把 displayCards 完成：//
// displayCards() {
//     const rootElement = document.querySelector("#cards");
//     rootElement.innerHTML = Array.from(Array(52).keys()).map(index => this.getCardElement(index)).join("");
//     },


////////////////////////////////////////////////////////////
//  解構賦值 (destructuring assignment) 
//  let [a, b, c] = [1, 2, 3]

////////////////////////////////////////////////////////////
// 8.每張卡片加上事件監聽器
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', event => {
    // console.log(card)
    // view.flipCard(card) // 改成以下
    controller.dispatchCardAction(card)
  })
})


////////////////////////////////////////////////////////////
// 9.加入牌背 CSS 樣式
////////////////////////////////////////////////////////////
// 10.牌面與牌背分開處理
// 接下來把「取得牌面」和「取得牌背」分工成兩個函式：
// 請改寫 getCardElement 並新增 getCardContent：

// getCardElement (index) {
//   return `<div class="card back"></div>`
// },
// getCardContent (index) {
//   const number = this.transformNumber((index % 13) + 1)
//   const symbol = Symbols[Math.floor(index / 13)]
//   return `
//     <p>${number}</p>
//     <img src="${symbol}" />
//     <p>${number}</p>
//   `
// },


////////////////////////////////////////////////////////////
// 11.翻牌：view.flipCard
// 現在讓我們來撰寫重頭戲——翻牌函式，我們將之命名為 flipCard，它的程式判斷如下：
// 1.點擊一張覆蓋的卡片 → 回傳牌面內容 (數字和花色)
// 2.點擊一張翻開的卡片 → 重新覆蓋卡片，意即把牌面內容清除，重新呼叫牌背樣式(背景)
// 請在 view 中新增 flipCard 函式，並寫下判斷式：

// flipCard (card) {
//   console.log(card)
//   if (card.classList.contains('back')) {
//     // 回傳正面
//     card.classList.remove('back')
//     card.innerHTML = this.getCardContent(10) // 暫時給定 10
//     return
//   }
//   // 回傳背面
//   card.classList.add('back')
//   card.innerHTML = null
// }
//    //// 別忘了改寫事件監聽器 ，讓使用者點擊卡牌時，呼叫 flipCard(card)：

// document.querySelectorAll('.card').forEach(card => {
//   card.addEventListener('click', event => {
//     view.flipCard(card)
//   })
// })


////////////////////////////////////////////////////////////
// 12.取得卡片索引：在元素上設定 data-set
// 透過 event.target 回傳給後端程式做運算。
// getCardElement (index) {
//   return `<div data-index="${index}" class="card back"></div>`
// },

// 然後在翻牌時運用 card.dataset.index 來運算卡片內容
// 別忘了 HTML 回傳的是字串，要改成數字：


////////////////////////////////////////////////////////////
// 15.整理：Controller 在外、view 隱藏於內部
// 不要讓 controller 以外的內部函式暴露在 global 的區域。
// 以下是要改到的函式：

// const view = {
//   displayCards (indexes) {
//     const rootElement = document.querySelector('#cards')
//     rootElement.innerHTML = indexes.map(index => this.getCardElement(index)).join('')
//   },
//   // ...
// }
// const controller = {
//   currentState: GAME_STATE.FirstCardAwaits,
//   generateCards () {
//     view.displayCards(utility.getRandomNumberArray(52))
//   }
// }
// controller.generateCards() // 取代 view.displayCards()



////////////////////////////////////////////////////////////
// 16.Controller 統一發派動作 
// controller.dispatchCardAction
// 由於有多個遊戲狀態，所以這裡我們用 switch 取代 if/else，讓程式碼看起來簡潔一點：

  // dispatchCardAction (card) {
  //   if (!card.classList.contains('back')) {
  //     return
  //   }
  //   switch (this.currentState) {
  //     case GAME_STATE.FirstCardAwaits:
  //       view.flipCard(card)
  //       model.revealedCards.push(card)
  //       this.currentState = GAME_STATE.SecondCardAwaits
  //       break
  //     case GAME_STATE.SecondCardAwaits:
  //       view.flipCard(card)
  //       model.revealedCards.push(card)
  //       // 判斷配對是否成功
  //       break
  //   }
  //   console.log('this.currentState', this.currentState)
  //   console.log('revealedCards', model.revealedCards.map(card => card.dataset.index))
  // }



  ////////////////////////////////////////////////////////////
// 17. 檢查配對：model.isRevealedCardsMatched
// 由於 revealedCards 由 model 管理，因此我們也把檢查配對成功的函式歸類在 model 裡。

// const model = {
//   // ...
//   // 加入
//   isRevealedCardsMatched() {
//     return this.revealedCards[0].dataset.index % 13 === this.revealedCards[1].dataset.index % 13 
//   }
// }



////////////////////////////////////////////////////////////
// 18.修改 controller.dispatchCardAction
// 設定好 model.isRevealedCardsMatched，
// 我們到 controller.dispatchCardAction 裡面呼叫函式，看看是否可行：

// dispatchCardAction (card) {
//   // ...
//     case GAME_STATE.SecondCardAwaits:
//       view.flipCard(card)
//       model.revealedCards.push(card)
//       // 判斷配對是否成功
//       if (model.isRevealedCardsMatched()) {
//         // 配對成功
//         this.currentState = GAME_STATE.CardsMatched
//         view.pairCard(model.revealedCards[0])
//         view.pairCard(model.revealedCards[1])
        
//       } else {
//         // 配對失敗
//         setTimeout(() => {
//           view.flipCard(model.revealedCards[0])
//           view.flipCard(model.revealedCards[1])
//           model.revealedCards = []
//           this.currentState = GAME_STATE.CardsMatchFailed
//         }, 1000)
//       }
//       break
//   }
//   // ...
// }



////////////////////////////////////////////////////////////
// 19.改變卡片底色
////////////////////////////////////////////////////////////
// 20.接著擴充 view 的功能：
// const view = {
//   // ...
//   pairCard(card) {
//     card.classList.add('paired')
//   }
// }


////////////////////////////////////////////////////////////
// 21.改寫 flipCard
// 請把 flipCard 改寫成 flipCards，在這裡不管傳入幾個參數，我們都會用 map 來迭代：
// flipCards (...cards) {
//   cards.map(card => {
//     if (card.classList.contains('back')) {
//       card.classList.remove('back')
//       card.innerHTML = this.getCardContent(Number(card.dataset.index))
//       return
//     }
//     card.classList.add('back')
//     card.innerHTML = null
//   })
// },


////////////////////////////////////////////////////////////
// 22.改寫 pairCard
// pairCards (...cards) {
//   cards.map(card => {
//     card.classList.add('paired')
//   })
// },


////////////////////////////////////////////////////////////
// 23.新增 resetCards
// // 呼叫
// setTimeout(this.resetCards, 1000)
// // 函式
//   resetCards () {
//     view.flipCards(...model.revealedCards)
//     model.revealedCards = []
//     controller.currentState = GAME_STATE.FirstCardAwaits
//   }


////////////////////////////////////////////////////////////
// 24.分數與嘗試次數
// 24-1.這是屬於資料的管理，所以要在 model 裡增加資料屬性：
// const model = {
//   // 新增以下
//   score: 0,
//   triedTimes: 0
// }

// 24-2.接著到 view 新增 renderScore 與 renderTriedTimes 兩個函式
// 選取前面新增的 .score 與 .tried，將分數渲染出來：

// const view = {
//   // ...
//   renderScore(score) {
//     document.querySelector(".score").textContent = `Score: ${score}`;
//   },
  
//   renderTriedTimes(times) {
//     document.querySelector(".tried").textContent = `You've tried: ${times} times`;
//   }
// }

// 24-3.最後要在 controller 分配動作的流程裡，呼叫這兩個函式：
// case GAME_STATE.SecondCardAwaits:
//    view.renderTriedTimes(++model.triedTimes)  // add this 
//    view.flipCards(card)
//    model.revealedCards.push(card)
//    // 判斷配對是否成功
//    if (model.isRevealedCardsMatched()) {
//      // 配對成功
//      view.renderScore(model.score += 10)    // add this 
//      this.currentState = GAME_STATE.CardsMatched
//      view.pairCards(...model.revealedCards)
//      model.revealedCards = []
//      this.currentState = GAME_STATE.FirstCardAwaits
//    } else {
//      // 配對失敗
//      this.currentState = GAME_STATE.CardsMatchFailed
//      setTimeout(this.resetCards, 1000)
//    }
//    break


////////////////////////////////////////////////////////////
// 25.加入CSS 動畫特效：關鍵影格 @keyframes 設定簡易動畫
////////////////////////////////////////////////////////////
// 26.整合 JavaScript

// 26-1.回到 JavaScript 來整合，我們先加入一個函式 view.appendWrongAnimation：

// view
// appendWrongAnimation(...cards) {
//   cards.map(card => {
//     card.classList.add('wrong')
//     card.addEventListener('animationend', event =>   event.target.classList.remove('wrong'), { once: true })
//     })
//   },

// 26-2.最後到 controller.dispatchCardAction 中，
// 在配對失敗的流程中呼叫 view，注意這一行要加在 setTimeout 之前 ：
// 判斷配對是否成功

// if (model.isRevealedCardsMatched()) {
//   // 配對成功
//   view.renderScore(model.score += 10)
//   this.currentState = GAME_STATE.CardsMatched
//   view.pairCards(...model.revealedCards)
//   model.revealedCards = []
//   this.currentState = GAME_STATE.FirstCardAwaits
// } else {
//   // 配對失敗
//   this.currentState = GAME_STATE.CardsMatchFailed
//   view.appendWrongAnimation(...model.revealedCards)  // add this
//   setTimeout(this.resetCards, 1000)
// }
// break


////////////////////////////////////////////////////////////
// 27.遊戲結束畫面  追加 CSS 樣式
////////////////////////////////////////////////////////////
// 28-1.view.showGameFinished 
// 遊戲結束時呼叫這個函式來顯示遊戲結束畫面：

// // 在 view 中新增
// showGameFinished () {
//   const div = document.createElement('div')
//   div.classList.add('completed')
//   div.innerHTML = `
//     <p>Complete!</p>
//     <p>Score: ${model.score}</p>
//     <p>You've tried: ${model.triedTimes} times</p>
//   `
//   const header = document.querySelector('#header')
//   header.before(div)
// }

// 28-2.呼叫函式
 // 判斷配對是否成功
//  if (model.isRevealedCardsMatched()) {
//   // 配對成功
//   view.renderScore(model.score += 10)
//   this.currentState = GAME_STATE.CardsMatched
//   view.pairCards(...model.revealedCards)
//   model.revealedCards = []
//   if (model.score === 260) {
//     console.log('showGameFinished')
//     this.currentState = GAME_STATE.GameFinished
//     view.showGameFinished()  // 加在這裡
//     return
//   }
//   this.currentState = GAME_STATE.FirstCardAwaits
// } else {
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////