const time = document.querySelector('.time')
const dateTime = document.querySelector('.date')
const greeting = document.querySelector('.greeting')
const name = document.querySelector('.name')
const body = document.querySelector('body')
const slideNext = document.querySelector('.slide-next')
const slidePrev = document.querySelector('.slide-prev')
let randomNum
let currentTranslateLanguage = 0
const greetingTranslation = [
  //translation
  ['Good morning', 'Good afternoon', 'Good evening', 'Good night', '[Enter name]', 'en-US'],
  ['Доброе утро,', 'Добрый день,', 'Добрый вечер,', 'Доброй ночи,', '[Введите имя]', 'ru-RU'],
]

function showTime() {
  const date = new Date()
  const currentTime = date.toLocaleTimeString()
  time.textContent = currentTime
  showDate(currentTranslateLanguage)
  showGreeting(greetingTranslation[currentTranslateLanguage]) // greetings
  setTimeout(showTime, 1000)
}
showTime()

function showDate(language) {
  const date = new Date()
  const options = { weekday: 'long', month: 'long', day: 'numeric' }
  const currentDate = date.toLocaleDateString(greetingTranslation[currentTranslateLanguage][5], options)
  dateTime.textContent = currentDate
}

// -----------------------------------------------greeting

function getTimeOfDay() {
  const date = new Date()
  const hours = date.getHours()

  if (hours >= 6 && hours < 12) {
    return 'morning'
  } else if (hours >= 12 && hours < 18) {
    return 'afternoon'
  } else if (hours >= 18 && hours < 24) {
    return 'evening'
  } else if (hours >= 0 && hours < 6) {
    return 'night'
  }
}
function convertTimeOfDay() {
  if (getTimeOfDay() === 'morning') return 0
  else if (getTimeOfDay() === 'afternoon') return 1
  else if (getTimeOfDay() === 'evening') return 2
  else return 3
}

function showGreeting(language) {
  const timeOfDay = convertTimeOfDay()
  const greetingText = language[timeOfDay]
  greeting.textContent = greetingText
  name.placeholder = language[4]
}

// -------------------------------------------------------------------local storage
function setLocalStorage() {
  localStorage.setItem('name', name.value)
  localStorage.setItem('city', city.value)
  localStorage.setItem('language', languageToggle.value)
  localStorage.setItem('api', api.value)
  localStorage.setItem('bgTag', tags.value)
  localStorage.setItem('hideTime', hideTime.checked)
  localStorage.setItem('hideDate', hideDate.checked)
  localStorage.setItem('hideGreeting', hideGreeting.checked)
  localStorage.setItem('hideQuotes', hideQuotes.checked)
  localStorage.setItem('hideWeather', hideWeather.checked)
  localStorage.setItem('hideAudio', hideAudio.checked)
  localStorage.setItem('hideTodo', hideTodo.checked)
}
window.addEventListener('beforeunload', setLocalStorage)

function getLocalStorage() {
  if (localStorage.getItem('name')) {
    name.value = localStorage.getItem('name')
  }
  if (localStorage.getItem('city')) {
    city.value = localStorage.getItem('city')
  }
  if (localStorage.getItem('language')) {
    languageToggle.value = localStorage.getItem('language')
  }
  if (localStorage.getItem('api')) {
    api.value = localStorage.getItem('api')
  }
  if (localStorage.getItem('bgTag')) {
    tags.value = localStorage.getItem('bgTag')
  }
  if (localStorage.getItem('hideTime') !== 'false') {
    hideTime.checked = localStorage.getItem('hideTime')
  }
  if (localStorage.getItem('hideDate') !== 'false') {
    hideDate.checked = localStorage.getItem('hideDate')
  }
  if (localStorage.getItem('hideGreeting') !== 'false') {
    hideGreeting.checked = localStorage.getItem('hideGreeting')
  }
  if (localStorage.getItem('hideQuotes') !== 'false') {
    hideQuotes.checked = localStorage.getItem('hideQuotes')
  }
  if (localStorage.getItem('hideWeather') !== 'false') {
    hideWeather.checked = localStorage.getItem('hideWeather')
  }
  if (localStorage.getItem('hideAudio') !== 'false') {
    hideAudio.checked = localStorage.getItem('hideAudio')
  }
  if (localStorage.getItem('hideTodo') !== 'false') {
    hideTodo.checked = localStorage.getItem('hideTodo')
  }
}
window.addEventListener('load', getLocalStorage)

//--------------------------------------------------------------------------bg-slider
function getRandomNum() {
  randomNum = getRandomIntInclusive(1, 20)
}
getRandomNum()

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min //Максимум и минимум включаются
}

function setBg() {
  const timeOfDay = getTimeOfDay()
  const bgNum = `${randomNum}`.padStart(2, '0')
  const img = new Image()
  img.src = `https://raw.githubusercontent.com/tchigi/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`
  img.onload = () => {
    body.style.backgroundImage = `url(${img.src})`
  }
}
function getSlideNext() {
  if (randomNum == 20) {
    randomNum = 1
  } else {
    randomNum += 1
  }
  setBg()
}

function getSlidePrev() {
  if (randomNum == 1) {
    randomNum = 20
  } else {
    randomNum -= 1
  }
  setBg()
}

// -------------------------------------------------------------------------------weather
const weatherIcon = document.querySelector('.weather-icon')
const temperature = document.querySelector('.temperature')
const weatherDescription = document.querySelector('.weather-description')
const city = document.querySelector('.city')
const wind = document.querySelector('.wind')
const humidity = document.querySelector('.humidity')
const weatherError = document.querySelector('.weather-error')
const weatherTranslation = [
  ['en', 'Error! City not found for', 'Error! Nothing to geocode for', 'Wind speed', 'm/s', 'Humidity', '[Enter city]'],
  [
    'ru',
    'Ошибка! Не найден город ',
    'Ошибка! Не найден геокод для',
    'Скорость ветра',
    'м/с',
    'Влажность',
    '[Введите город]',
  ],
]
async function getWeather(language) {
  let currentLang = weatherTranslation[language]
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=${String(
    currentLang[0]
  )}&appid=d85a8ad3bb8fcc1bd80799ea56928a81&units=metric`
  const res = await fetch(url)
  const data = await res.json()
  city.placeholder = currentLang[6]
  if (data.cod === '404') {
    weatherError.textContent = `${currentLang[1]} '${city.value}'!`
    temperature.textContent = ``
    wind.textContent = ``
    humidity.textContent = ``
    weatherDescription.textContent = ''
    weatherIcon.className = 'weather-icon'
  } else if (data.cod === '400') {
    weatherError.textContent = `${currentLang[2]} '${city.value}'!`
    temperature.textContent = ``
    wind.textContent = ``
    humidity.textContent = ``
    weatherDescription.textContent = ''
    weatherIcon.className = 'weather-icon'
  } else {
    weatherError.textContent = ``
    weatherIcon.className = 'weather-icon owf'
    weatherIcon.classList.add(`owf-${data.weather[0].id}`)
    wind.textContent = `${currentLang[3]}: ${Math.round(data.wind.speed)} ${currentLang[4]}`
    humidity.textContent = `${currentLang[5]}: ${Math.round(data.main.humidity)}%`
    weatherDescription.textContent = data.weather[0].description
    temperature.textContent = `${Math.round(data.main.temp)}°C`
  }
}
setTimeout(() => getWeather(currentTranslateLanguage), 1000)
city.addEventListener('change', () => getWeather(currentTranslateLanguage))

// -----------------------------------------------------------------quotes
const quote = document.querySelector('.quote')
const author = document.querySelector('.author')
const changeQuoteButton = document.querySelector('.change-quote')

async function getQuotes(currentTranslateLanguage) {
  const quotes = ['data.json', 'dataRu.json']
  const res = await fetch(quotes[currentTranslateLanguage])
  const data = await res.json()
  let random = data[Math.floor(Math.random() * data.length)]
  quote.innerText = `"${random.text}"`
  author.innerText = random.author
}
getQuotes(currentTranslateLanguage)
changeQuoteButton.addEventListener('click', () => getQuotes(currentTranslateLanguage))
// --------------------------------------------------------------------audioplayer
const audio = new Audio()
let isPlay = false
let playNum = 0
const playButton = document.querySelector('.play')
const playPrevButton = document.querySelector('.play-prev')
const playNextButton = document.querySelector('.play-next')
const playList = [
  {
    title: 'Aqua Caelestis',
    src: './assets/sounds/Aqua_Caelestis.mp3',
    duration: '00:39',
  },
  {
    title: 'River Flows In You',
    src: './assets/sounds/River_Flows_In_You.mp3',
    duration: '01:37',
  },
  {
    title: 'Ennio Morricone',
    src: './assets/sounds/Ennio_Morricone.mp3',
    duration: '01:37',
  },
  {
    title: 'Summer Wind',
    src: './assets/sounds/Summer_Wind.mp3',
    duration: '01:50',
  },
]

function playAudio() {
  if (!isPlay) {
    audio.src = playList[playNum].src
    audio.currentTime = 0
    audio.play()
    isPlay = true
  } else {
    audio.pause()
    isPlay = false
  }
  toggleActiveAudio()
}
function toggleBtn() {
  if (!isPlay) {
    playButton.classList.add('pause')
  } else {
    playButton.classList.remove('pause')
  }
  playAudio()
}
playButton.addEventListener('click', toggleBtn)

function playNext() {
  audio.pause()
  isPlay = false
  playButton.classList.add('pause')
  if (playNum == 3) {
    playNum = 0
  } else {
    playNum++
  }
  playAudio()
}
audio.addEventListener('ended', playNext)

function playPrev() {
  audio.pause()
  isPlay = false
  playButton.classList.add('pause')
  if (playNum == 0) {
    playNum = 3
  } else {
    playNum--
  }
  playAudio()
}
playNextButton.addEventListener('click', playNext)
playPrevButton.addEventListener('click', playPrev)

playList.forEach((el) => {
  const li = document.createElement('li')
  const playListContainer = document.querySelector('.play-list')
  li.classList.add('play-item')
  playListContainer.append(li)
  li.textContent = el.title
})

function toggleActiveAudio() {
  const li = document.querySelectorAll('.play-item')
  for (let i = 0; i < li.length; i++) {
    li[i].classList.remove('item-active')
  }
  li[playNum].classList.add('item-active')
}

function chooseAudio() {
  const plist = document.querySelector('.play-list')
  for (let i = 0; i < plist.childElementCount; i++) {
    plist.children[i].addEventListener('click', () => {
      playNum = i
      audio.pause()
      isPlay = false
      playButton.classList.add('pause')
      playAudio()
    })
  }
}
chooseAudio()
// --------------------------------------------------------------------------advanced audio player

const volume = document.querySelector('.volume')
let isMute = false
const volumeProgress = document.querySelector('.volume-progress')
const audioProgress = document.querySelector('.audio-progress')
const audioTime = document.querySelector('.audio-time')
const audioName = document.querySelector('.audio-name')

//click volumeToggle
function volumeToggle() {
  if (!isMute) {
    volume.classList.add('mute')
    volumeProgress.value = 0
    audio.volume = 0
    isMute = true
  } else {
    volume.classList.remove('mute')
    volumeProgress.value = 100
    audio.volume = 1
    isMute = false
  }
}
volume.addEventListener('click', volumeToggle)
//change volumeProgress
function volumeScrub(e) {
  let scrubVolume = e.offsetX / volumeProgress.offsetWidth
  if (scrubVolume < 0.02) {
    scrubVolume = 0
    volume.classList.add('mute')
  } else if (scrubVolume > 0.99) {
    scrubVolume = 1
  } else {
    volume.classList.remove('mute')
  }
  audio.volume = scrubVolume
}
function volumeScrubTouch(e) {
  var rectV = e.target.getBoundingClientRect()
  var tV = e.targetTouches[0].pageX - rectV.left
  let scrubVolumeTouch = tV / volumeProgress.offsetWidth
  if (scrubVolumeTouch < 0.02) {
    scrubVolumeTouch = 0
    volume.classList.add('mute')
  } else if (scrubVolumeTouch > 0.99) {
    scrubVolumeTouch = 1
  } else {
    volume.classList.remove('mute')
  }
  audio.volume = scrubVolumeTouch
}
function audioVolume() {
  let v = this.value
  audio.volume = v / 100
  if (v === '0') {
    volume.classList.add('mute')
  } else {
    volume.classList.remove('mute')
  }
}
let mousedownVolume = false
volumeProgress.addEventListener('mousemove', (e) => mousedownVolume && volumeScrub(e))
volumeProgress.addEventListener('mousedown', () => (mousedownVolume = true))
volumeProgress.addEventListener('mouseup', () => (mousedownVolume = false))
volumeProgress.addEventListener('change', audioVolume)
volumeProgress.addEventListener('touchstart', volumeScrubTouch)
volumeProgress.addEventListener('touchmove', volumeScrubTouch)

//change audioProgress
function handleProgress() {
  let percent = (audio.currentTime / audio.duration) * 100
  audioProgress.value = percent || 0
}
function setAudioTime() {
  let currentDuration = Math.round(audio.currentTime) * 1000
  let date = new Date(currentDuration)
  let seconds = date.getSeconds()
  let minutes = date.getMinutes()
  let fullDuration = Math.round(audio.duration) * 1000 || 0
  let dateDur = new Date(fullDuration)
  let secondsDur = dateDur.getSeconds()
  let minutesDur = dateDur.getMinutes()
  let result = `${String(minutes).padStart(2, 0)}:${String(seconds).padStart(2, 0)}/${String(minutesDur).padStart(
    2,
    0
  )}:${String(secondsDur).padStart(2, 0)}`

  return result
}
function setAudioName() {
  let curAudio = document.querySelector('.item-active')
  curAudio = curAudio ? curAudio.innerText : ''
  return curAudio
}
setInterval(() => {
  audioTime.textContent = setAudioTime()
  audioName.textContent = setAudioName()
}, 500)

function timeUpdate() {
  audio.addEventListener('timeupdate', handleProgress)
}
timeUpdate()

function audioScrub(e) {
  let scrubTime = (e.offsetX / audioProgress.offsetWidth) * audio.duration
  audio.currentTime = scrubTime
}
function audioScrubTouch(e) {
  var rect = e.target.getBoundingClientRect()
  var t = e.targetTouches[0].pageX - rect.left
  let scrubTouch = (t / audioProgress.offsetWidth) * audio.duration
  audio.currentTime = scrubTouch
}
let mousedown = false
audioProgress.addEventListener('click', audioScrub)
audioProgress.addEventListener('mousemove', (e) => mousedown && audioScrub(e))
audioProgress.addEventListener('mousedown', () => (mousedown = true))
audioProgress.addEventListener('mouseup', () => (mousedown = false))
audioProgress.addEventListener('touchstart', audioScrubTouch)
audioProgress.addEventListener('touchmove', audioScrubTouch)

//--------------------------------------------------------------------------translate
const languageText = document.querySelector('.language')
const bgText = document.querySelector('#bgText')
const tagsText = document.querySelector('#tagsText')
const timeText = document.querySelector('#timeText')
const dateText = document.querySelector('#dateText')
const greetingText = document.querySelector('#greetingText')
const quotesText = document.querySelector('#quotesText')
const weatherText = document.querySelector('#weatherText')
const audioText = document.querySelector('#audioText')
const todoText = document.querySelector('#todoText')
const settingsInfo = [
  [
    'Language:',
    'Background source:',
    'Background tag:',
    'Time',
    'Date',
    'Greeting',
    'Quotes',
    'Weather',
    'Audioplayer',
    'ToDoList',
  ],
  [
    'Язык:',
    'Источник фото:',
    'Тег фото:',
    'Время',
    'Дата',
    'Приветствие',
    'Цитаты',
    'Погода',
    'Аудиоплеер',
    'Список задач',
  ],
]

function translateSettings(language) {
  languageText.textContent = settingsInfo[language][0]
  bgText.textContent = settingsInfo[language][1]
  tagsText.textContent = settingsInfo[language][2]
  timeText.textContent = settingsInfo[language][3]
  dateText.textContent = settingsInfo[language][4]
  greetingText.textContent = settingsInfo[language][5]
  quotesText.textContent = settingsInfo[language][6]
  weatherText.textContent = settingsInfo[language][7]
  audioText.textContent = settingsInfo[language][8]
  todoText.textContent = settingsInfo[language][9]
}
translateSettings(currentTranslateLanguage)

function translateRu() {
  currentTranslateLanguage = 1
  showTime()
  translateSettings(currentTranslateLanguage)
  getWeather(currentTranslateLanguage)
  getQuotes(currentTranslateLanguage)
  translateTodo(currentTranslateLanguage)
}
function translateEn() {
  currentTranslateLanguage = 0
  showTime()
  translateSettings(currentTranslateLanguage)
  getWeather(currentTranslateLanguage)
  getQuotes(currentTranslateLanguage)
  translateTodo(currentTranslateLanguage)
}
//--------------------------------------------------------------api images

async function getLinkToImageUns(tag) {
  const url = `https://api.unsplash.com/photos/random?query=${tag}&client_id=6trhLMpwHuk70b_bcOrWxJ0SOIGtYVNj0YfnmYxbAr8`
  const res = await fetch(url)
  const data = await res.json()
  const img = new Image()
  img.src = data.urls.regular
  img.onload = () => {
    body.style.backgroundImage = `url(${img.src})`
  }
}
function imageFromUns() {
  if (!tags.value) {
    getLinkToImageUns(getTimeOfDay())
  } else {
    getLinkToImageUns(tags.value)
  }
}

async function getLinkToImageFlickr(tag) {
  const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=60ccd5c8e0920c882ee8c6d7ee369a2e&tags=${tag}&extras=url_h&format=json&nojsoncallback=1`
  const res = await fetch(url)
  const data = await res.json()
  const img = new Image()
  img.src = data.photos.photo[getRandomIntInclusive(1, 7)].url_h
  img.onload = () => {
    body.style.backgroundImage = `url(${img.src})`
  }
}
function imageFromFlickr() {
  if (!tags.value) {
    getLinkToImageFlickr(getTimeOfDay())
  } else {
    getLinkToImageFlickr(tags.value)
  }
}

// ----------------------------------------------settings

const settings = document.querySelector('.settings')
const settingsToggle = document.querySelector('.settings-button')
let settingsFlag = false
settingsToggle.addEventListener('click', () => {
  if (!settingsFlag) {
    settings.classList.add('active')
    settingsFlag = true
  } else {
    settings.classList.remove('active')
    settingsFlag = false
  }
})

const languageToggle = document.querySelector('#language')
function setLanguage() {
  if (languageToggle.value === 'en') {
    translateEn()
  } else {
    translateRu()
  }
}
window.addEventListener('load', setLanguage)
languageToggle.addEventListener('change', setLanguage)

const hideTime = document.querySelector('#hiddenTime')
const hideDate = document.querySelector('#hiddenDate')
const hideGreeting = document.querySelector('#hiddenGreeting')
const hideQuotes = document.querySelector('#hiddenQuotes')
const hideWeather = document.querySelector('#hiddenWeather')
const hideAudio = document.querySelector('#hiddenAudio')
const hideTodo = document.querySelector('#hiddenTodo')
const weather = document.querySelector('.weather')
const player = document.querySelector('.player')

function hideItems(toggle, item) {
  toggle.addEventListener('change', function () {
    if (this.checked) {
      item.classList.add('hidden')
      item.classList.remove('visible')
    } else {
      item.classList.remove('hidden')
      item.classList.add('visible')
    }
  })
  window.addEventListener('load', function () {
    if (toggle.checked) {
      item.classList.add('hidden')
      item.classList.remove('visible')
    } else {
      item.classList.remove('hidden')
      item.classList.add('visible')
    }
  })
}
hideItems(hideTime, time)
hideItems(hideDate, dateTime)
hideItems(hideGreeting, greeting)
hideItems(hideGreeting, name)
hideItems(hideQuotes, quote)
hideItems(hideQuotes, author)
hideItems(hideQuotes, changeQuoteButton)
hideItems(hideWeather, weather)
hideItems(hideAudio, player)

// choose api

const api = document.querySelector('#api')
const tags = document.querySelector('#tag')
let tagFromGetTime = getTimeOfDay()

function removeEvListFromAll() {
  slideNext.removeEventListener('click', getSlideNext)
  slidePrev.removeEventListener('click', getSlidePrev)
  slideNext.removeEventListener('click', imageFromUns)
  slidePrev.removeEventListener('click', imageFromUns)
  slideNext.removeEventListener('click', imageFromFlickr)
  slidePrev.removeEventListener('click', imageFromFlickr)
}
function checkApiValue() {
  if (api.value === 'git') {
    tags.setAttribute('readonly', true)
    removeEvListFromAll()
    setBg()
    slideNext.addEventListener('click', getSlideNext)
    slidePrev.addEventListener('click', getSlidePrev)
  } else if (api.value === 'uns') {
    tags.removeAttribute('readOnly')
    removeEvListFromAll()
    imageFromUns()
    slideNext.addEventListener('click', imageFromUns)
    slidePrev.addEventListener('click', imageFromUns)
  } else {
    tags.removeAttribute('readOnly')
    removeEvListFromAll()
    imageFromFlickr()
    slideNext.addEventListener('click', imageFromFlickr)
    slidePrev.addEventListener('click', imageFromFlickr)
  }
}

function chooseBg() {
  api.addEventListener('change', checkApiValue)
  window.addEventListener('load', checkApiValue)
}
chooseBg()

tags.addEventListener('change', () => {
  if (!tags.value) {
    if (api.value === 'uns') {
      getLinkToImageUns(tagFromGetTime)
    } else {
      getLinkToImageFlickr(tagFromGetTime)
    }
  } else {
    if (api.value === 'uns') {
      getLinkToImageUns(tags.value)
    } else {
      getLinkToImageFlickr(tags.value)
    }
  }
})
tags.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    tags.blur()
  }
})

//--------------------------todo
const inputTodoText = document.querySelector('.input-todo-text')
const buttonForInput = document.querySelector('.button-container')
const todosContainer = document.querySelector('.todos-container')

let tasks
!localStorage.tasks ? (tasks = []) : (tasks = JSON.parse(localStorage.getItem('tasks')))

let todoItemElems = []

function Task(description) {
  this.description = description
  this.completed = false
}

const updateLocal = () => {
  localStorage.setItem('tasks', JSON.stringify(tasks))
}

function createTemplate(task, index) {
  return `<div class="todo-item ${task.completed ? 'completed' : ''}">
  <div class="todoDescription">${task.description}</div>
  <input onclick="completeTask(${index})" type="checkbox" class="btn-complete" ${task.completed ? 'checked' : ''}/>
  <button onclick="deleteTask(${index})" class="btn-delete">✕</button></div>`
}

function filterTasks() {
  const activeTasks = tasks.length && tasks.filter((item) => item.completed == false)
  const completedTasks = tasks.length && tasks.filter((item) => item.completed == true)
  tasks = [...activeTasks, ...completedTasks]
}

function fillHTMLList() {
  todosContainer.innerHTML = ''
  if (tasks.length > 0) {
    filterTasks()
    tasks.forEach((item, index) => {
      todosContainer.innerHTML += createTemplate(item, index)
    })
    todoItemElems = document.querySelectorAll('.todo-item')
  }
}
fillHTMLList()

function completeTask(index) {
  tasks[index].completed = !tasks[index].completed
  if (tasks[index].completed) {
    todoItemElems[index].classList.add('completed')
  } else {
    todoItemElems[index].classList.remove('completed')
  }
  updateLocal()
  fillHTMLList()
}

function deleteTask(index) {
  todoItemElems[index].classList.add('delition')
  setTimeout(() => {
    tasks.splice(index, 1)
    updateLocal()
    fillHTMLList()
  }, 500)
}

buttonForInput.addEventListener('click', () => {
  if (!inputTodoText.value) return
  tasks.push(new Task(inputTodoText.value))
  updateLocal()
  fillHTMLList()
  inputTodoText.value = ''
})

const todoButton = document.querySelector('.todo-button')
const closeTodo = document.querySelector('.close-btn')
const todoBlock = document.querySelector('.todo')

todoButton.addEventListener('click', () => {
  todoBlock.classList.add('active')
  todoButton.classList.add('active')
})

closeTodo.addEventListener('click', () => {
  todoBlock.classList.remove('active')
  todoButton.classList.remove('active')
})

function offTodo(toggle, item) {
  toggle.addEventListener('change', function () {
    if (this.checked) {
      item.classList.add('active')
    } else {
      item.classList.remove('active')
    }
  })
  window.addEventListener('load', function () {
    if (toggle.checked) {
      item.classList.add('active')
    } else {
      item.classList.remove('active')
    }
  })
}

offTodo(hideTodo, todoButton)

const todoTranslation = [
  ['ToDoList', 'Add', 'Tasks:'],
  ['Список задач', 'Добавить', 'Задачи:'],
]
const todoTitle = document.querySelector('.todo-title')
const taskTitle = document.querySelector('.today-title')
const btnText = document.querySelector('.button-container')

function translateTodo(language) {
  todoTitle.textContent = todoTranslation[language][0]
  btnText.textContent = todoTranslation[language][1]
  taskTitle.textContent = todoTranslation[language][2]
}

console.log(`
Общий балл 157/160
1. Часы и календарь +15 
2. Приветствие +10 
3. Смена фонового изображения +20
4. Виджет погоды +15 
5. Виджет цитата дня +10 
6. Аудиоплеер +15 
7. Продвинутый аудиоплеер (реализуется без использования библиотек) +18,5
- можно запустить и остановить проигрывания трека кликом по кнопке Play/Pause рядом с ним в плейлисте +1,5 P.S. Можно запустить трек кликом по треку, остановить нельзя(можно остановить только кликом на главную кнопку Play/Stop). При повторном клике трек запустится заново.
8. Перевод приложения на два языка (en/ru или en/be) +13,5
- переводится прогноз погоды в т.ч описание погоды (OpenWeatherMap API предоставляет такую возможность) и город по умолчанию +1,5 P.S. Прогноз погоды переводится. Город по умолчанию не переводится.
9. Получение фонового изображения от API +10
- в качестве источника изображений может использоваться Unsplash API +5 (Присутствует ограничение на 50 запросов в час, так что если изоображение не ставится, то значит, что лимит исчерпан)
- в качестве источника изображений может использоваться Flickr API +5 (Иногда очень долго загружает изоображения, но работает в соответствии с требованиями)
10. Настройки приложения +20
11. Дополнительный функционал на выбор +10
- ToDo List - список дел (как в оригинальном приложении)

Если возникнут вопросы по работе, пишите в дискорд Tchigi#7163
`)
