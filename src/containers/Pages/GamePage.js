import React from "react";
import { Base64 } from "js-base64";
import { withStyles } from "material-ui/styles";
import connect from "hoc/connect";
import { startGame, stopGame } from "game";
import store from "store";
import CustomError from "utils/CustomError";
import { CircularProgress } from "material-ui/Progress";
import Button from "material-ui/Button";
import HUD from "containers/HUD";
import EndPage from "containers/Pages/EndPage";
import MediaPlayer from "components/MediaPlayer";
import { nextSlide } from "game/utils/fetchPictures";
import BackgroundImage from "images/background.jpg";

const styles = theme => ({
  progress: {
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100vw",
    height: "100vh"
  },
  container: {
    height: "100vh",
    width: "100vw"
  },
  startgame: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: `url(${BackgroundImage})`,
    backgroundSize: "cover",
    backgroundAttachment: "fixed"
  },
  buttonMargin: {
    margin: "5px"
  }
});

class GamePage extends React.Component {
  state = {
    gameStarted: false
  };

  constructor(props) {
    super(props);

    const config = Base64.decode(props.match.params.config);

    try {
      store.config = JSON.parse(config);
    } catch (error) {
      throw new CustomError(
        `Unable to decode URL configuration paramaters, ${config}`,
        error
      );
    }

    try {
      // merge local storage config into main config
      store.config.enableVoice = localStorage.getItem("enableVoice")
        ? localStorage.getItem("enableVoice") === "true"
        : true;
    } catch (e) {
      // local storage may not be supported on some devices
    }
    try {
      store.config.enableMoans = localStorage.getItem("enableMoans")
        ? localStorage.getItem("enableMoans") === "true"
        : true;
    } catch (e) {
      // local storage may not be supported on some devices
    }
    try {
      store.config.videoMuted = localStorage.getItem("videoMuted")
        ? localStorage.getItem("videoMuted") === "true"
        : false;
    } catch (e) {
      // local storage may not be supported on some devices
    }

    if (!store.config.version || store.config.version < 2) {
      debugger;
      throw new CustomError("Sorry but version 1 links are incompatible.");
    }
  }

  componentWillUnmount() {
    stopGame();
  }

  backToConfig() {
    this.props.history.push('/');
  }

  renderBackToConfig() {
    if (store.config.allowConfigEdit) {
      return (
        <Button
          onClick={() => {
            this.backToConfig();
          }}
          variant="raised"
          color="secondary"
          className={this.props.classes.buttonMargin}
        >
          Configure game
        </Button>
      );
    }
  }

  render() {
    if (!this.state.gameStarted) {
      return (
        <div className={this.props.classes.startgame}>
          <Button
            onClick={() => {
              startGame();
              this.setState({ gameStarted: true });
            }}
            variant="raised"
            color="secondary"
            className={this.props.classes.buttonMargin}
          >
            start game
          </Button>
          {
            this.renderBackToConfig()
          }
        </div>
      );
    }

    if (!this.props.game || !this.props.game.mediaPlayerUrl) {
      return (
        <div className={this.props.classes.progress}>
          <CircularProgress color="secondary" size={100} thickness={2} />
        </div>
      );
    }

    const {
      game: { orgasms, mediaPlayerUrl },
      config: { maximumOrgasms, slideDuration, loopShortVideos, videoMuted }
    } = this.props;

    return (
      <div className={this.props.classes.container}>
        {parseInt(maximumOrgasms, 10) === parseInt(orgasms, 10) ? (
          <EndPage />
        ) : (
          <React.Fragment>
            <HUD />
            <MediaPlayer
              url={mediaPlayerUrl}
              onEnded={nextSlide}
              duration={slideDuration}
              loopShortVideos={loopShortVideos}
              muted={videoMuted}
            />
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(connect(GamePage));
