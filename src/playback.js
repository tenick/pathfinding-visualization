export default class Playback {
    constructor(visualizer){
        this.visualizer = visualizer;

        this.startOverBtn = document.getElementById('startOverBtn');
        this.startOverBtn.addEventListener('click', this.startOver.bind(this));

        this.endBtn = document.getElementById('endBtn');
        this.endBtn.addEventListener('click', this.end.bind(this));

        this.stepBackBtn = document.getElementById('stepBackBtn');
        this.stepBackBtn.addEventListener('click', this.stepBack.bind(this));

        this.stepForwardBtn = document.getElementById('stepForwardBtn');
        this.stepForwardBtn.addEventListener('click', this.stepForward.bind(this));

        this.playbackRange = document.getElementById('playbackRange');
        this.playbackRange.addEventListener('input', this.rangeInput.bind(this));

        document.addEventListener('keydown', this.#keyboard.bind(this));

        // play controls
        this.animationFrameId = null;
        this.isPlaying = false;
        this.lastTime = 0;

        this.speedInput = document.getElementById('speedInput');
        
        this.playBtn = document.getElementById('playBtn');
        this.playBtn.addEventListener('click', this.play.bind(this));
        
        this.pauseBtn = document.getElementById('pauseBtn');
        this.pauseBtn.addEventListener('click', this.pause.bind(this));
    }

    #keyboard(key){
        if (document.activeElement instanceof HTMLButtonElement  || document.activeElement instanceof HTMLInputElement )
            return;
        
        switch(key.code){
            case "Space":
                if (this.playBtn.style.display == "none") // means visualizer is currently playing
                    this.pause();
                else 
                    this.play();
                break;
            case "ArrowLeft":
                this.stepBack();
                break;
            case "ArrowRight":
                this.stepForward();
                break;
            case "Home":
                this.startOver();
                break;
            case "End":
                this.end();
                break;
            case "BracketRight":
                {
                    let currVal = parseInt(this.speedInput.value);
                    this.speedInput.value = currVal + 10 - currVal % 10;
                    break;
                }
            case "BracketLeft":
                let currVal = parseInt(this.speedInput.value);
                this.speedInput.value = currVal - 10 - currVal % 10;
                
                if (parseInt(this.speedInput.value) < 1)
                    this.speedInput.value = 1;
                break;
        }
    }

    playAnimate(time){
        // return if the desired time hasn't elapsed
        let delta = time - this.lastTime;
        if (delta < parseInt(this.speedInput.value)) {
            this.animationFrameId = requestAnimationFrame(this.playAnimate.bind(this));
            return;
        }

        this.lastTime = time;

        let newVal = parseInt(this.playbackRange.value) + 1;

        let frameIndex = this.playbackRange.value;
        this.visualizer.algorithm.drawFrame(frameIndex);

        this.playbackRange.value = newVal;
        this.animationFrameId = requestAnimationFrame(this.playAnimate.bind(this));
        
        if (newVal > this.playbackRange.max)
            this.pause();
    }

    play(){
        if (this.visualizer.isAlgorithmRunning)
            return;

        this.isPlaying = true;
        this.playbackRange.min = 0;
        this.playbackRange.max = this.visualizer.algorithm.frames.length - 1;
        
        this.playBtn.style.display = 'none';
        this.pauseBtn.style.display = 'block';

        // check if playback is already at the end, start over.
        if (this.playbackRange.value == this.playbackRange.max)
            this.playbackRange.value = this.playbackRange.min;

        this.animationFrameId = requestAnimationFrame(this.playAnimate.bind(this));
    }

    pause(){
        if(!this.animationFrameId)
            return;
        
        this.isPlaying = false;

        this.playBtn.style.display = 'block';
        this.pauseBtn.style.display = 'none';

        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
    }

    startOver(){
        if (this.visualizer.isAlgorithmRunning)
            return;

        this.playbackRange.min = 0;
        this.playbackRange.max = this.visualizer.algorithm.frames.length - 1;

        this.playbackRange.value = this.playbackRange.min;
        this.visualizer.algorithm.drawFrame(newVal);
    }

    end(){
        if (this.visualizer.isAlgorithmRunning)
            return;

        this.playbackRange.min = 0;
        this.playbackRange.max = this.visualizer.algorithm.frames.length - 1;
    
        this.playbackRange.value = this.playbackRange.max;
        this.visualizer.algorithm.drawFrame(newVal);
    }

    stepBack(){
        if (this.visualizer.isAlgorithmRunning)
            return;

        this.playbackRange.min = 0;
        this.playbackRange.max = this.visualizer.algorithm.frames.length - 1;
    
        let newVal = parseInt(this.playbackRange.value) - 1;
        if (newVal < this.playbackRange.min)
            newVal = this.playbackRange.min;
    
        this.playbackRange.value = newVal;
        this.visualizer.algorithm.drawFrame(newVal);
    }

    stepForward(){
        if (this.visualizer.isAlgorithmRunning)
            return;
            
        this.playbackRange.min = 0;
        this.playbackRange.max = this.visualizer.algorithm.frames.length - 1;
        
        let newVal = parseInt(this.playbackRange.value) + 1;
        if (newVal > this.playbackRange.max)
            newVal = this.playbackRange.max;

        this.playbackRange.value = newVal;
        this.visualizer.algorithm.drawFrame(newVal);
    }

    rangeInput(){
        this.playbackRange.min = 0;
        this.playbackRange.max = this.visualizer.algorithm.frames.length - 1;
        
        let frameIndex = this.playbackRange.value;
        
        this.visualizer.algorithm.drawFrame(frameIndex);
    }
}

