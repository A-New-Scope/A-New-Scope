
//NEW AUDIO FILE
var audio = new Audio();
audio.controls = true;
audio.autoplay = true;

//LOAD -- GLOBAL VARIABLES
var boost, analyser;
window.addEventListener("load", initMp3Player, false);

//INIT
function initMp3Player(){
  document.getElementById('audio_box').appendChild(audio); // append mp3 file

  var context = new AudioContext();
  analyser = context.createAnalyser(); // --> getByteFrequencyData

  // Re-route audio playback into the processing graph of the AudioContext
  var source = context.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(context.destination);

  animate(); //call animation
}

//ANIMATION
function animate(){
  window.requestAnimationFrame(animate);

  var fbc_array = new Uint8Array(analyser.frequencyBinCount); //audio frequency data to array
  analyser.getByteFrequencyData(fbc_array);
  boost = fbc_array // --> length = 1024
  // --> new AudioContext() --> createAnalyser() --> getByteFrequencyData(frequency array)
}