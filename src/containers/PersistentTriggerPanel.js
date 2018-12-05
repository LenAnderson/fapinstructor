import React from "react";
import { withStyles } from "material-ui/styles";
import store from "store";
import createNotification from "engine/createNotification";
import Button from "material-ui/Button";
import IconButton from "material-ui/IconButton";
import executeAction from "engine/executeAction";
import { ruinedOrgasm } from "game/actions/orgasm/ruin";
import ThumbUp from "material-ui-icons/ThumbUp";
import ThumbDown from "material-ui-icons/ThumbDown";
import { nextSlide } from "game/utils/fetchPictures";
import punishment from "../game/actions/punishment";

const styles = theme => ({
  root: {
    pointerEvents: "auto"
  }
});

class PersistentTriggerPanel extends React.Component {
  state = {
    ruinedOrgasmDisabled: false,
    edgeDisabled: false
  };

  bookmark = () => {
    const url = store.game.mediaPlayerUrl;

    createNotification(`Bookmarked Image`);

    if (!store.game.bookmarks.includes(url)) {
      store.game.bookmarks.push(url);
    }
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Button
          variant="raised"
          color="primary"
          size="medium"
          style={{ opacity: 0.8, margin: 10 }}
          disabled={this.state.ruinedOrgasmDisabled}
          onClick={() => {
            this.setState({ ruinedOrgasmDisabled: true });
            executeAction(ruinedOrgasm, true).then(() => {
              this.setState({ ruinedOrgasmDisabled: false });
            });
          }}
        >
          Ruin
        </Button>
        <Button
          variant="raised"
          color="inherit"
          size="medium"
          style={{ opacity: 0.8, margin: 10 }}
          disabled={this.state.edgeDisabled}
          onClick={() => {
            this.setState({ edgeDisabled: true });
            store.game.edges++;
            classes.root.Button.Edge.edgeDisabled = false;
            executeAction(punishment, true).then(() => {
              this.setState({ edgeDisabled: false });
            });
          }}
        >
          Edge
        </Button>
        <IconButton color="secondary" variant="raised" onClick={this.bookmark}>
          <ThumbUp />
        </IconButton>
        <IconButton color="secondary" variant="raised" onClick={nextSlide}>
          <ThumbDown />
        </IconButton>
      </div>
    );
  }
}

export default withStyles(styles)(PersistentTriggerPanel);
