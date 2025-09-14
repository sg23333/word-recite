document.getElementById('minimize-btn').addEventListener('click', () => window.electronAPI.minimizeWindow());
document.getElementById('maximize-btn').addEventListener('click', () => window.electronAPI.maximizeWindow());
document.getElementById('close-btn').addEventListener('click', () => window.electronAPI.closeWindow());

// --- 全局变量 ---
let words = [];
let currentWordIndex = 0;

// --- DOM 元素获取 ---
const reciteBtn = document.getElementById('recite-btn');
const dictateBtn = document.getElementById('dictate-btn');
const reciteModule = document.getElementById('recite-module');
const dictateModule = document.getElementById('dictate-module');
const allModules = [reciteModule, dictateModule];
const wordDisplay = document.getElementById('word-display');
const posDisplay = document.getElementById('pos-display');
const translationDisplay = document.getElementById('translation-display');
const reciteNextBtn = document.getElementById('recite-next-btn');
const togglePosBtn = document.getElementById('toggle-pos-btn');
const toggleTranslationBtn = document.getElementById('toggle-translation-btn');
const dictatePrompt = document.getElementById('dictate-prompt');
const dictateInput = document.getElementById('dictate-input');
const feedback = document.getElementById('feedback');
const checkAnswerBtn = document.getElementById('check-answer-btn');

// --- 模块切换逻辑 ---
function showModule(moduleToShow) {
  allModules.forEach(module => module.style.display = 'none');
  moduleToShow.style.display = 'block';
  [reciteBtn, dictateBtn].forEach(btn => btn.classList.remove('active'));
  if (moduleToShow === reciteModule) {
    reciteBtn.classList.add('active');
    resetReciteView();
  } else if (moduleToShow === dictateModule) {
    dictateBtn.classList.add('active');
    startNewDictateRound();
  }
}
reciteBtn.addEventListener('click', () => showModule(reciteModule));
dictateBtn.addEventListener('click', () => showModule(dictateModule));

// --- “背单词”模块逻辑 ---
function updateReciteContent() {
    if (words.length === 0) return;
    const currentWord = words[currentWordIndex];
    wordDisplay.textContent = currentWord.word;
    posDisplay.textContent = currentWord.pos;
    translationDisplay.textContent = currentWord.translation;
}
function resetReciteView() {
    updateReciteContent();
    posDisplay.style.visibility = 'hidden';
    translationDisplay.style.visibility = 'hidden';
    togglePosBtn.classList.remove('active');
    toggleTranslationBtn.classList.remove('active');
}
reciteNextBtn.addEventListener('click', () => {
  currentWordIndex = (currentWordIndex + 1) % words.length;
  updateReciteContent();
});
togglePosBtn.addEventListener('click', () => {
  const isHidden = posDisplay.style.visibility === 'hidden';
  posDisplay.style.visibility = isHidden ? 'visible' : 'hidden';
  togglePosBtn.classList.toggle('active');
});
toggleTranslationBtn.addEventListener('click', () => {
  const isHidden = translationDisplay.style.visibility === 'hidden';
  translationDisplay.style.visibility = isHidden ? 'visible' : 'hidden';
  toggleTranslationBtn.classList.toggle('active');
});

// --- “默单词”模块逻辑 ---
function startNewDictateRound() {
    if (words.length === 0) return;
    const currentWord = words[currentWordIndex];
    dictatePrompt.textContent = `${currentWord.pos} ${currentWord.translation}`;
    dictateInput.value = '';
    feedback.textContent = '';
    dictateInput.focus();
    checkAnswerBtn.textContent = '检查';
}
checkAnswerBtn.addEventListener('click', () => {
    if (checkAnswerBtn.textContent === '下一个') {
        currentWordIndex = (currentWordIndex + 1) % words.length;
        startNewDictateRound();
        return;
    }
    const userAnswer = dictateInput.value.trim().toLowerCase();
    const correctAnswer = words[currentWordIndex].word.toLowerCase();
    if (userAnswer === correctAnswer) {
        feedback.textContent = '正确！';
        feedback.className = 'correct';
    } else {
        feedback.textContent = `错误，正确答案是: ${words[currentWordIndex].word}`;
        feedback.className = 'wrong';
    }
    checkAnswerBtn.textContent = '下一个';
});
dictateInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        checkAnswerBtn.click();
    }
});

// --- 数据加载和应用初始化 ---
window.electronAPI.onLoadWords((loadedWords) => {
  words = loadedWords;
  words.sort(() => Math.random() - 0.5);
  currentWordIndex = 0;
  showModule(reciteModule);
});

// --- 新增：监听窗口状态变化并切换图标 ---
window.electronAPI.onWindowStateChange((isMaximized) => {
  const maximizeIcon = document.querySelector('#maximize-btn .icon-maximize');
  const restoreIcon = document.querySelector('#maximize-btn .icon-restore');
  
  if (isMaximized) {
    maximizeIcon.style.display = 'none';
    restoreIcon.style.display = 'block';
  } else {
    maximizeIcon.style.display = 'block';
    restoreIcon.style.display = 'none';
  }
});