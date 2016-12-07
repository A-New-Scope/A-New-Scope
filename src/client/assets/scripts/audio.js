//move and transcribe for angularjs

//NEW AUDIO FILE
let audio = new Audio();
audio.controls = true;
audio.autoplay = true;

//LOAD -- GLOBAL letIABLES
let boost, analyser;
window.addEventListener("load", initMp3Player, false);

//INIT
function initMp3Player(){
  document.getElementById('audio').appendChild(audio); // append mp3 file

  let context = new AudioContext();
  analyser = context.createAnalyser(); // --> getByteFrequencyData

  // Re-route audio playback into the processing graph of the AudioContext
  let source = context.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(context.destination);

  animate(); //call animation
}

//ANIMATION
function animate(){
  window.requestAnimationFrame(animate);

  let fbc_array = new Uint8Array(analyser.frequencyBinCount); //audio frequency data to array
  analyser.getByteFrequencyData(fbc_array);
  boost = fbc_array // --> length = 1024
  // --> new AudioContext() --> createAnalyser() --> getByteFrequencyData(frequency array)
}