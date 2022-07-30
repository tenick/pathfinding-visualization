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
    }

    startOver(){
        this.playbackRange.min = 0;
        this.playbackRange.max = this.visualizer.algorithm.frames.length - 1;

        this.playbackRange.value = this.playbackRange.min;
        this.rangeInput();
    }

    end(){
        this.playbackRange.min = 0;
        this.playbackRange.max = this.visualizer.algorithm.frames.length - 1;
    
        this.playbackRange.value = this.playbackRange.max;
        this.rangeInput();
    }

    stepBack(){
        this.playbackRange.min = 0;
        this.playbackRange.max = this.visualizer.algorithm.frames.length - 1;
    
        let newVal = parseInt(this.playbackRange.value) - 1;
        if (newVal < this.playbackRange.min)
            newVal = this.playbackRange.min;
    
        this.playbackRange.value = newVal;
        this.rangeInput();
    }

    stepForward(){
        this.playbackRange.min = 0;
        this.playbackRange.max = this.visualizer.algorithm.frames.length - 1;
        
        let newVal = parseInt(this.playbackRange.value) + 1;
        if (newVal > this.playbackRange.max)
            newVal = this.playbackRange.max;

        this.playbackRange.value = newVal;
        this.rangeInput();
    }

    rangeInput(){
        this.playbackRange.min = 0;
        this.playbackRange.max = this.visualizer.algorithm.frames.length - 1;
        
        let frameIndex = this.playbackRange.value;
        
        this.visualizer.algorithm.drawFrame(frameIndex);
    }
}

