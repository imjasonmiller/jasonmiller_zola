class VideoPlayer {
  #video: HTMLVideoElement;
  #control: HTMLElement;
  #controlPlay: HTMLElement;
  #progressPlay: HTMLElement;

  constructor(private player: Element | null) {
    if (!this.player) {
      throw new ReferenceError("element with class .player is null");
    }

    this.#video = this.player.querySelector(
      ".player__video"
    ) as HTMLVideoElement;
    this.#control = this.player.querySelector(
      ".player__control"
    ) as HTMLElement;
    this.#controlPlay = this.player.querySelector(
      ".player__control-play"
    ) as HTMLElement;
    this.#progressPlay = this.player.querySelector(
      ".player__progress-play"
    ) as HTMLElement;

    this.#video.addEventListener("timeupdate", this.handleUpdate);
    this.#controlPlay.addEventListener("click", this.handleClick);
  }

  handleClick = (): void => {
    if (this.#video.paused || this.#video.ended) {
      this.#control.setAttribute("data-state", "play");
      this.#video.play();
    } else {
      this.#control.setAttribute("data-state", "pause");
      this.#video.pause();
    }
  };

  handleUpdate = (): void => {
    // Set current video progress
    this.#progressPlay.style.transform = `scaleX(${
      this.#video.currentTime / this.#video.duration
    })`;
  };
}

export default VideoPlayer;
