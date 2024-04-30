const body = document.body;
const settings = document.querySelector('.settings');
const colorPicker = document.getElementById('color-picker');
const presetColors = document.getElementById('preset-colors');
const cancelButton = document.getElementById('cancel-button');

let clickCount = 0;
let clickTimer;
let hideSettingsTimeout;

// ボディ要素がクリックまたはタップされたときの処理
function handleBodyInteraction(event) {
    if (settings.classList.contains('hidden')) {
        clickCount++;
        if (clickCount === 1) {
            clickTimer = setTimeout(() => {
                clickCount = 0;
            }, 3000);
        } else if (clickCount === 3) {
            clearTimeout(clickTimer);
            settings.classList.remove('hidden');
            clickCount = 0;
        }
    }
}

// 色ピッカーの値が変更されたときの処理
function handleColorPickerChange(event) {
    body.style.backgroundColor = event.target.value;
    startHideSettingsTimeout();
}

// プリセット色が選択されたときの処理
function handlePresetColorChange(event) {
    if (event.target.value) {
        body.style.backgroundColor = event.target.value;
        colorPicker.value = event.target.value;
        startHideSettingsTimeout();
    }
}

// キャンセルボタンがクリックまたはタップされたときの処理
function handleCancelButtonInteraction(event) {
    settings.classList.add('hidden');
}

// 設定画面を非表示にするタイムアウトを開始する関数
function startHideSettingsTimeout() {
    clearTimeout(hideSettingsTimeout);
    hideSettingsTimeout = setTimeout(() => {
        settings.classList.add('hidden');
    }, 1000);
}

// colors.jsonファイルから色のプリセットを読み込む関数
function loadPresetColors() {
    fetch('colors.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(color => {
                const option = document.createElement('option');
                option.value = color.value;
                option.textContent = color.name;
                presetColors.appendChild(option);
            });
        });
}

// スクロールを無効にする関数
function disableScroll(event) {
    event.preventDefault();
}

let mouseTimer;

// マウスが動いたときの処理
function handleMouseMove() {
    body.style.cursor = 'default';
    body.classList.remove('fade-out');
    body.classList.add('fade-in');
    clearTimeout(mouseTimer);
    mouseTimer = setTimeout(() => {
        body.classList.remove('fade-in');
        body.classList.add('fade-out');
        setTimeout(() => {
            body.style.cursor = 'none';
        }, 100);
    }, 1000);
}
// イベントリスナーの設定
body.addEventListener('click', handleBodyInteraction);
body.addEventListener('touchstart', handleBodyInteraction);
body.addEventListener('mousemove', handleMouseMove);
colorPicker.addEventListener('change', handleColorPickerChange);
presetColors.addEventListener('change', handlePresetColorChange);
cancelButton.addEventListener('click', handleCancelButtonInteraction);
cancelButton.addEventListener('touchstart', handleCancelButtonInteraction);
document.addEventListener('touchmove', disableScroll, { passive: false });
document.addEventListener('wheel', disableScroll, { passive: false });
// 初期化処理
loadPresetColors();