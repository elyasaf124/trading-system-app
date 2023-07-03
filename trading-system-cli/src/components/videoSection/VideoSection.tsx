import "./videoSection.css";
import video from "./TradingView-video.mp4";

const VideoSection = () => {
  return (
    <div className="video-section">
      <div className="video-section-container">
        <h1 className="video-section-title">Where the world does markets</h1>
        <p className="video-section-desc">
          Join 50 million traders and investors taking the future into their own
          hands.
        </p>
        <button className="video-section-btn">Explore features</button>
        <div className="space-white"></div>
        <video
          className="video"
          src={video}
          // src="https://static.tradingview.com/static/bundles/chart-big.5ddfd85030f4ba213936.mp4"
          width="100%"
          autoPlay
          playsInline
          loop
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default VideoSection;
