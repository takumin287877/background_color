const body = document.body;
const settings = document.querySelector('.settings');
const colorPicker = document.getElementById('color-picker');
const colorPreview = document.getElementById('color-preview');
const presetColors = document.getElementById('preset-colors');
const cancelButton = document.getElementById('cancel-button');
const autoCloseCheckbox = document.getElementById('auto-close-checkbox');

let clickCount = 0;
let clickTimer;
let hideSettingsTimeout;

let mouseHasMoved = false;
const mouseMoveTimeout = 1200;
let mouseMoveTimer;

function handleBodyInteraction(event) {
    if (settings.classList.contains('hidden')) {
        clickCount++;
        if (clickCount === 1) {
            clickTimer = setTimeout(() => {
                clickCount = 0;
            }, 3000);
        } else if (clickCount === 3) {
            clearTimeout(clickTimer);
            document.body.classList.remove('hide-cursor');
            settings.classList.remove('hidden');
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
    if (autoCloseCheckbox.checked) {
        startHideSettingsTimeout();
    }
}

function handlePresetColorClick(color) {
    body.style.backgroundColor = color;
    colorPicker.value = color;
    colorPreview.style.backgroundColor = color;
    document.querySelectorAll('.preset-color').forEach(c => c.classList.remove('selected'));
    event.target.closest('.preset-color').classList.add('selected');
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
            handlePresetColorClick(color.value);
        });
        presetColor.addEventListener('mouseover', () => {
            colorPreview.style.backgroundColor = color.value;
        });
        presetColor.addEventListener('mouseout', () => {
            colorPreview.style.backgroundColor = colorPicker.value;
        });
        presetColors.appendChild(presetColor);
    });
}

function handleCancelButtonInteraction(event) {
    settings.classList.add('hidden');
}

function startHideSettingsTimeout() {
    clearTimeout(hideSettingsTimeout);
    document.body.classList.add('hide-cursor');
    hideSettingsTimeout = setTimeout(() => {
        settings.classList.add('hidden');
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

function updateColorPreview() {
    colorPreview.style.backgroundColor = colorPicker.value;
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
colorPicker.addEventListener('change', updateColorPreview);

loadPresetColors();
showInstructionsOnAccess();