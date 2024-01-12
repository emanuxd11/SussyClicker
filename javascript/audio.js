/*
 * Audio functionality
 * This works ok, would probably want to change the way audio is played,
 * making use of the html <audio> tag. Also make the slider number dynamic.
 * But it's good for now.
 */

function getVolumeLevel() {
    return parseFloat(localStorage.getItem("volume_level")) || 0.5;
}

function getVolumeMute() {
    return localStorage.getItem("volume_mute") === "true";
}

let volume_level = getVolumeLevel();
let volume_mute = getVolumeMute();
updateVolumeUI();

let volume_slider = document.getElementById('volume_slider');
volume_slider.addEventListener("change", function(e) {
  volume_level = e.currentTarget.value / 100;

  updateVolumeUI();
})

let mute_button = document.getElementById('mute_button');
mute_button.addEventListener("click", function() {
  volume_mute = !volume_mute;

  updateVolumeUI();
})

function playAudio(path) {
  if (!volume_mute) {
    let audio = new Audio(path);
    audio.volume = volume_level;
    audio.play();
  }
}

function playHelperBuySFX(helper) {
  if (helper.sfx_quantity > 0) {
    let file_number = Math.floor(Math.random() * helper.sfx_quantity) + 1;
    playAudio(helper.sound_path + file_number + '.mp3')
  }
}

function updateVolumeUI() {
  let volume_slider = document.getElementById("volume_slider");
  let volume_label = document.getElementById("volume_label");
  let mute_button = document.getElementById("mute_button");

  volume_slider.value = volume_level * 100;
  if (volume_mute == false) {
    volume_label.textContent = "Volume: " + parseInt(volume_level * 100);
    mute_button.textContent = "Mute";
  } else {
    volume_label.textContent = "Volume: " + "Muted";
    mute_button.textContent = "Unmute";
  }
}