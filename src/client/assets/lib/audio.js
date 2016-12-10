//move and transcribe for angularjs
//window and document are supposed to be interacted with
//through angular as $window and $document

//NEW AUDIO FILE
let audio = new Audio();
audio.autoplay = true;

//LOAD -- GLOBAL variables
let boost;
let analyser;

//ANIMATION
let animate = function () {
  window.requestAnimationFrame(animate);

  let fbcArray = new Uint8Array(analyser.frequencyBinCount); //audio frequency data to array
  analyser.getByteFrequencyData(fbcArray);
  boost = fbcArray; // --> length = 1024
  // --> new AudioContext() --> createAnalyser() --> getByteFrequencyData(frequency array)
};

//INIT
let initMp3Player = function () {
  document.getElementById('audio').appendChild(audio); // append mp3 file

  let context = new AudioContext();
  analyser = context.createAnalyser(); // --> getByteFrequencyData

  // Re-route audio playback into the processing graph of the AudioContext
  let source = context.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(context.destination);

  animate(); //call animation
};

window.addEventListener('load', initMp3Player, false);

document.onkeypress = function (e) {
  e = e || window.event;
  if(e.keyCode === 47){
    if(audio.src){
      if(audio.paused){
        audio.play()
      } else {
        audio.pause()
      }
    }
  }
  if(e.keyCode === 92){
    resetPos()
  }
};