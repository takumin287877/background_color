const body = document.body;
const settings = document.querySelector('.settings');
const colorPicker = document.getElementById('color-picker');
const colorPreview = document.getElementById('color-preview');
const presetColors = document.getElementById('preset-colors');
const cancelButton = document.getElementById('cancel-button');
const autoCloseCheckbox = document.getElementById('auto-close-checkbox');
const header = document.getElementById('header');
const fullscreenButton = document.getElementById('fullscreen-button');
const shareButtons = document.getElementById('share-buttons');
const twitterShare = document.getElementById('twitter-share');
const misskeyShare = document.getElementById('misskey-share');
const facebookShare = document.getElementById('facebook-share');

let clickCount = 0;
let clickTimer;
let hideSettingsTimeout;

let mouseHasMoved = false;
const mouseMoveTimeout = 1200;
let mouseMoveTimer;

function handleBodyInteraction(event) {
    if (settings.classList.contains('hidden') && header.classList.contains('hidden')) {
        clickCount++;
        if (clickCount === 1) {
            clickTimer = setTimeout(() => {
                clickCount = 0;
            }, 3000);
        } else if (clickCount === 3) {
            clearTimeout(clickTimer);
            document.body.classList.remove('hide-cursor');
            settings.classList.remove('hidden');
            header.classList.remove('hidden');
            clickCount = 0;
        }
    }
}

const instructions = document.getElementById('instructions');
const closeInstructionsButton = document.getElementById('close-instructions');
const showInstructionsButton = document.getElementById('show-instructions');

function handleCloseInstructionsInteraction(event) {
    instructions.style.display = 'none';
}

function handleShowInstructionsInteraction(event) {
    instructions.style.display = 'block';
}

function showInstructionsOnAccess() {
    instructions.style.display = 'block';
}

function handleColorPickerChange(event) {
    body.style.backgroundColor = event.target.value;
    colorPreview.style.backgroundColor = event.target.value;
    document.querySelectorAll('.preset-color').forEach(c => c.classList.remove('selected'));
    updateColorInfo();
    updateShareLinks();
    if (autoCloseCheckbox.checked) {
        startHideSettingsTimeout();
    }
}

function handlePresetColorClick(color, colorName) {
    body.style.backgroundColor = color;
    colorPicker.value = color;
    colorPreview.style.backgroundColor = color;
    document.getElementById('color-name').textContent = colorName;
    document.getElementById('color-code').textContent = color;
    document.querySelectorAll('.preset-color').forEach(c => c.classList.remove('selected'));
    event.target.closest('.preset-color').classList.add('selected');
    updateShareLinks();
    if (autoCloseCheckbox.checked) {
        startHideSettingsTimeout();
    }
}

function displayPresetColors(colors) {
    presetColors.innerHTML = '';
    colors.forEach(color => {
        const presetColor = document.createElement('div');
        presetColor.classList.add('preset-color');
        presetColor.style.backgroundColor = color.value;
        const checkIcon = document.createElement('i');
        checkIcon.classList.add('fas', 'fa-check');
        presetColor.appendChild(checkIcon);
        presetColor.addEventListener('click', (event) => {
            event.stopPropagation();
            handlePresetColorClick(color.value, color.name);
        });
        presetColor.addEventListener('mouseover', () => {
            colorPreview.style.backgroundColor = color.value;
            document.getElementById('color-name').textContent = color.name;
            document.getElementById('color-code').textContent = color.value;
        });
        presetColor.addEventListener('mouseout', () => {
            colorPreview.style.backgroundColor = colorPicker.value;
            updateColorInfo();
        });
        presetColors.appendChild(presetColor);
    });
}

function handleCancelButtonInteraction(event) {
    settings.classList.add('hidden');
    header.classList.add('hidden');
    shareButtons.classList.add('hidden');
}

function startHideSettingsTimeout() {
    clearTimeout(hideSettingsTimeout);
    document.body.classList.add('hide-cursor');
    hideSettingsTimeout = setTimeout(() => {
        settings.classList.add('hidden');
        header.classList.add('hidden');
        shareButtons.classList.add('hidden');
    }, 1000);
}

function loadPresetColors() {
    fetch('colors.json')
        .then(response => response.json())
        .then(data => {
            displayPresetColors(data);
        });
}

function disableScroll(event) {
    event.preventDefault();
}

function updateColorInfo() {
    const selectedColor = document.querySelector('.preset-color.selected');
    if (selectedColor) {
        const colorName = selectedColor.dataset.colorName;
        const colorCode = selectedColor.dataset.colorCode;
        document.getElementById('color-name').textContent = colorName;
        document.getElementById('color-code').textContent = colorCode;
    } else {
        document.getElementById('color-name').textContent = '';
        document.getElementById('color-code').textContent = colorPicker.value;
    }
}

colorPicker.addEventListener('change', updateColorInfo);

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        }
        fullscreenButton.classList.add('active');
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        fullscreenButton.classList.remove('active');
    }
}

function handleKeyPress(event) {
    if (event.key === 'f' || event.key === 'F') {
        event.preventDefault();
        toggleFullScreen();
    }
}



function updateShareLinks() {
    const shareText = '今の背景色は' + encodeURIComponent(colorPicker.value) + 'です!';
    // const shareUrl = encodeURIComponent(window.location.href);
    const shareUrl = "https://takumin287877.github.io/background_color/"
    twitterShare.href = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`;
    misskeyShare.href = `https://misskey-hub.net/share/?text=${shareText}&url=${shareUrl}&visibility=public&localOnly=0`;
    facebookShare.href = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${shareText}`;
}

function toggleShareButtons() {
    shareButtons.classList.toggle('hidden');
}

document.addEventListener('mousemove', handleMouseMove);

function handleMouseMove() {
    mouseHasMoved = true;
    document.body.classList.remove('hide-cursor');
    clearTimeout(mouseMoveTimer);
    mouseMoveTimer = setTimeout(() => {
        mouseHasMoved = false;
        if (settings.classList.contains('hidden')) {
            document.body.classList.add('hide-cursor');
        }
    }, mouseMoveTimeout);
}

body.addEventListener('click', handleBodyInteraction);
body.addEventListener('touchstart', handleBodyInteraction);
colorPicker.addEventListener('change', handleColorPickerChange);
cancelButton.addEventListener('click', handleCancelButtonInteraction);
cancelButton.addEventListener('touchstart', handleCancelButtonInteraction);
document.addEventListener('touchmove', disableScroll, { passive: false });
document.addEventListener('wheel', disableScroll, { passive: false });
closeInstructionsButton.addEventListener('click', handleCloseInstructionsInteraction);
closeInstructionsButton.addEventListener('touchstart', handleCloseInstructionsInteraction);
showInstructionsButton.addEventListener('click', handleShowInstructionsInteraction);
showInstructionsButton.addEventListener('touchstart', handleShowInstructionsInteraction);
colorPicker.addEventListener('change', updateColorInfo);
fullscreenButton.addEventListener('click', toggleFullScreen);
document.addEventListener('keypress', handleKeyPress);
updateShareLinks();
const shareButton = document.getElementById('share-button');
shareButton.addEventListener('click', toggleShareButtons);
colorPicker.addEventListener('change', updateShareLinks);

loadPresetColors();
showInstructionsOnAccess();