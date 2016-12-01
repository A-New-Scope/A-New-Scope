
//NEW AUDIO FILE
var audio = new Audio();
audio.src = 'track1.mp3';
audio.controls = true;
audio.autoplay = true;


//ALL VARIABLES
var boost;
var canvas, ctx, source, context, analyser, fbc_array, bars, bar_x, bar_width, bar_height;


//INIT
window.addEventListener("load", initMp3Player, false);

function initMp3Player(){
  document.getElementById('audio_box').appendChild(audio); // append mp3 file

  context = new AudioContext();
  analyser = context.createAnalyser(); // --> getByteFrequencyData

  // Re-route audio playback into the processing graph of the AudioContext
  source = context.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(context.destination);

  frameLooper(); //call animation
}


//ANIMATION
function frameLooper(){

  window.requestAnimationFrame(frameLooper);

  fbc_array = new Uint8Array(analyser.frequencyBinCount); //audio frequency data to array
  analyser.getByteFrequencyData(fbc_array);
  boost = fbc_array[0]

  // --> new AudioContext() --> createAnalyser() --> getByteFrequencyData(frequency array)

}