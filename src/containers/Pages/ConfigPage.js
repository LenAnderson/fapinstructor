import React from "react";
import { Base64 } from "js-base64";
import { withRouter } from "react-router-dom";
// mui
import { Button, Grid, Paper, Select, Switch, Tooltip } from "material-ui";
import Typography from "material-ui/Typography";
import { withStyles } from "material-ui/styles";
import Input, { InputAdornment, InputLabel } from "material-ui/Input";
import { FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel } from "material-ui/Form";
import { MenuItem } from "material-ui/Menu";
import ExpansionPanel, { ExpansionPanelDetails, ExpansionPanelSummary } from "material-ui/ExpansionPanel";
import ExpandMoreIcon from "material-ui-icons/ExpandMore";
// internal
import store from "store";
import Feedback from "components/Feedback";
import BackgroundImage from "images/background.jpg";
import ForkMe from "components/ForkMe";
import { getRandomBoolean } from "utils/math";
import Group from "components/Group";
import TaskList from "containers/TaskList";
import { GripStrengthEnum, GripStrengthString } from "game/enums/GripStrength";
import copyToClipboard from "utils/copyToClipboard";
import connect from "hoc/connect";
import { getStrokeStyleName, StrokeStyleArray, StrokeStyleEnum, StrokeStyleString } from "game/enums/StrokeStyle";


const ONE_HUNDRED_PERCENT = 100;  // Maximum Percentage that Can be achieved

const styles = theme => ({
  control: {
    width: "100%"
  },
  button: {
    marginRight: theme.spacing.unit
  },
  background: {
    background: `url(${BackgroundImage})`,
    backgroundSize: "cover",
    backgroundAttachment: "fixed"
  },
  title: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#222",
    padding: 80
  },
  formContainer: {
    display: "flex",
    justifyContent: "center",
    padding: "0px 5vw 5vh 5vw"
  },
  form: {
    padding: 20,
    marginBottom: 20,
    width: "90vw",
    backgroundColor: "rgba(255, 255, 255, 0.9)"
  }
});

class ConfigPage extends React.Component {
  state = {
    copyToolTipOpen: false,
    errors: {}
  };

  validateConfig = () => {
    const errors = {};

    for (let name in store.config) {
      let value = store.config[name];
      switch (name) {
        case "tumblrId":
        case "redditId": {
          delete errors.mediaSource;
          if (
            store.config.tumblrId.length === 0 &&
            store.config.redditId.length === 0
          ) {
            errors.mediaSource = "Must have at least one media source";
          }
          break;
        }
        case "gifs":
        case "pictures": {
          delete errors.imageType;
          if (
            !store.config.gifs &&
            !store.config.pictures &&
            !store.config.videos
          ) {
            errors.imageType = "Must select at least one value";
          }
          break;
        }
        case "slideDuration": {
          delete errors[name];
          if (!value || value < 3) {
            errors[name] = "Slide Duration is less than 3 seconds";
          }
          break;
        }
        case "minimumGameTime":
        case "maximumGameTime": {
          delete errors["minimumGameTime"];
          delete errors["maximumGameTime"];
          if (!value || store.config.minimumGameTime < 3) {
            errors["minimumGameTime"] = "Minimum Game Time must be at least 3 minutes";
          }
          if (!value || value < 5) {
            errors["maximumGameTime"] = "Maximum Game Time must be at least 5 minutes";
          }
          if (parseInt(store.config.maximumGameTime, 10) < parseInt(store.config.minimumGameTime, 10)) {
            errors["minimumGameTime"] = "Minimum Game Time has to be smaller than Maximum Game Time";
            errors["maximumGameTime"] = "Maximum Game Time has to be greater than Minimum Game Time";
          }
          break;
        }
        case "finalOrgasmAllowed":
        case "finalOrgasmDenied":
        case "finalOrgasmRuined": {
          delete errors.finialOrgasm;
          if (
            !store.config.finalOrgasmAllowed &&
            !store.config.finalOrgasmDenied &&
            !store.config.finalOrgasmRuined
          ) {
            errors.finialOrgasm = "Must select at least one value";
          }

          break;
        }
        case "allowedProbability":
        case "deniedProbability":
        case "ruinedProbability": {
          delete errors[name];
          value = parseInt(value, 10);
          if (isNaN(value) || value < 0 || value > ONE_HUNDRED_PERCENT) {
            errors[name] = "Please insert a valid number between 0 and 100";
          }
          break;
        }
        case "finalOrgasmRandom": {
          delete errors.finalOrgasmRandom;
          const {
            config: {
              allowedProbability,
              deniedProbability,
              ruinedProbability,
            }
          } = store;
          if (parseInt(deniedProbability, 10) + parseInt(ruinedProbability, 10) + parseInt(allowedProbability, 10) !== ONE_HUNDRED_PERCENT) {
            errors.finalOrgasmRandom = "The probabilities have to sum up to 100%"
          }
          break;
        }

        // TODO: Why has maximumOrgasms to be at least 1? why not can't it be 0 what would logically be possible?
        // TODO: The inputProps does specify a min of 1 ...
        case "maximumOrgasms": {
          delete errors[name];
          value = parseInt(value, 10);
          if (!value) {
            errors[name] = "Please specify a value";
          } else if (value < 0) {
            errors[name] = "Has to be positive";
          }
          break;
        }
        case "postOrgasmTortureMinimumTime": {
          delete errors[name];
          if (value < 1) {
            errors[name] = "Cannot be less than 3";
          }
          break;
        }
        case "postOrgasmTortureMaximumTime": {
          delete errors[name];
          value = parseInt(value, 10);
          if (value < parseInt(store.config.postOrgasmTortureMinimumTime, 10)) {
            errors[name] = "Must be greater than the minimum";
          }
          if (!value || value < 5) {
            errors[name] = "Must be greater than 5 seconds";
          }
          break;
        }
        case "minimumEdges": {
          delete errors[name];
          value = parseInt(value, 10);
          if (isNaN(value) || value < 0) {
            errors[name] = "Cannot be less than 0";
          }
          break;
        }
        case "edgeCooldown": {
          delete errors[name];
          value = parseInt(value, 10);
          if (isNaN(value) || value < 0) {
            errors[name] = "Cannot be less than 0";
          }
          break;
        }
        case "edgeFrequency": {
          delete errors[name];
          value = parseInt(value, 10);
          if (isNaN(value) || value < 0) {
            errors[name] = "Cannot be less than 0";
          }
          break;
        }
        case "minimumRuinedOrgasms": {
          delete errors[name];
          value = parseInt(value, 10);
          if (isNaN(value) || value < 0) {
            errors[name] = "Cannot be less than 0";
          }
          break;
        }
        case "maximumRuinedOrgasms": {
          delete errors[name];
          if (parseInt(value, 10) < parseInt(store.config.minimumRuinedOrgasms, 10)) {
            errors[name] = "Maximum Ruined Orgasms cannot be less than Minimum Ruined Orgasms";
          }
          break;
        }
        case "ruinCooldown": {
          delete errors[name];
          value = parseInt(value, 10);
          if (isNaN(value) || value < 0) {
            errors[name] = "Cannot be less than 0";
          }
          break;
        }
        case "slowestStrokeSpeed": {
          delete errors[name];
          if (isNaN(value) || value < 0.25) {
            errors[name] = "Cannot be less than 0.25";
          }
          if (value > 6) {
            errors[name] = "Cannot be greater than 6";
          }
          break;
        }
        case "fastestStrokeSpeed": {
          delete errors[name];
          if (isNaN(value) || value < store.config.slowestStrokeSpeed) {
            errors[name] = "Cannot be less than the slowest stroke speed";
          }
          if (value > 6) {
            errors[name] = "Cannot be greater than 6";
          }
          break;
        }
        case "defaultStrokeStyle": { // New UI makes this error never happen :)
          delete errors[name];
          if (!store.config.tasks[StrokeStyleArray[value][0]]) {
            errors[name] = "You disabled '" + StrokeStyleString[value] + "' below. " +
              "Only active Styles can be set as default Style!";
          }
          break;
        }
        default: {
        }
      }
    }

    return errors;
  };

  /**
   * handles most changes by the user that can happen on the ConfigPage.
   * It either casts the value by useing the specified function or does not cast anything if no cast function is specified.
   *
   * After every single change the complete Page is validated.
   *
   * @param name
   *    the name of the variable in the location  **store.config.name**
   * @param cast
   *    a function that converts the input field's value to its intended type (e.g. Number, String, ...)
   */
  handleChange = (name, cast) => event => {
    if (cast) {
      store.config[name] = (cast)(event.target.value);
    } else {
      store.config[name] = event.target.value;
    }

    this.setState({ errors: this.validateConfig() });
  };

  handleFinalOrgasmGroupCheck = name => event => {
    store.config[name] = event.target.value;
    this.setState({ errors: this.validateConfig() });
  };

  handleFinalOrgasmGroupCheckChange = name => (event, checked) => {
    store.config[name] = checked;

    const {
      config: {
        finalOrgasmAllowed,
        finalOrgasmDenied,
        finalOrgasmRuined,
        finalOrgasmRandom
      }
    } = store;

    if (finalOrgasmRandom) {
      let options = [];
      if (finalOrgasmAllowed) {
        options.push("allowedProbability");
      } else {
        store.config.allowedProbability = 0;
      }
      if (finalOrgasmDenied) {
        options.push("deniedProbability");
      } else {
        store.config.deniedProbability = 0;
      }
      if (finalOrgasmRuined) {
        options.push("ruinedProbability");
      } else {
        store.config.ruinedProbability = 0;
      }
      // equalize share of options for initial display
      let sum = 0;
      for (let i = 1; i < options.length; i++) {
        let o = options[i];
        store.config[o] = Math.floor(ONE_HUNDRED_PERCENT / options.length);
        sum += store.config[o];
      }
      store.config[options[0]] = ONE_HUNDRED_PERCENT - sum;
    }
    else {
      if (finalOrgasmAllowed) {
        store.config.allowedProbability = ONE_HUNDRED_PERCENT;
        store.config.deniedProbability = 0;
        store.config.ruinedProbability = 0;
      } else if (finalOrgasmDenied) {
        store.config.allowedProbability = 0;
        store.config.deniedProbability = ONE_HUNDRED_PERCENT;
        store.config.ruinedProbability = 0;
      } else if (finalOrgasmRuined) {
        store.config.allowedProbability = 0;
        store.config.deniedProbability = 0;
        store.config.ruinedProbability = ONE_HUNDRED_PERCENT;
      }
    }

    this.setState({ errors: this.validateConfig() });
  };

  handleCheckChange = name => (event, checked) => {
    store.config[name] = checked;
    this.setState({ errors: this.validateConfig() });
  };

  handleTaskRandomize = except => event => {
    Object.keys(store.config.tasks).forEach(task => {
      if (!except.includes(task)) {
        store.config.tasks[task] = getRandomBoolean();
      }
    });

    event.stopPropagation();
  };

  generateLink(isAbsolute = true) {
    const encodedValues = Base64.encodeURI(JSON.stringify(store.config));

    let url = "";
    if (isAbsolute) {
      url = window.location.host;
    }
    url += `/game/${encodedValues}`;

    return url;
  }

  handleGenerateLink = () => {
    this.setState({
      copyToolTipOpen: true
    });
    copyToClipboard(this.generateLink());
  };

  handleStart = () => {
    this.props.history.push(this.generateLink(false));
  };

  render() {
    const { classes } = this.props;
    const { copyToolTipOpen, errors } = this.state;

    return (
      <div className={classes.background}>
        <ForkMe />
        <div className={classes.title}>
          <Typography
            variant="display3"
            color="inherit"
            style={{ fontFamily: "'Damion', cursive", whiteSpace: "nowrap" }}
          >
            Fap Instructor
          </Typography>
          <Typography variant="body2" color="inherit" gutterBottom>
            Make each fap session a unique and challenging experience
          </Typography>
          <Feedback iconWidth={20} />
        </div>
        <div className={classes.formContainer}>
          <Paper className={classes.form}>
            <Group title="Media">
              <Grid container>
                <Grid item xs={12}>
                  <FormControl
                    className={classes.control}
                    required
                    error={!!errors.mediaSource}
                  >
                    <InputLabel>Tumblrs</InputLabel>
                    <Input
                      id="tumblrId"
                      required
                      value={store.config.tumblrId}
                      onChange={this.handleChange("tumblrId")}
                    />
                    {errors.mediaSource ? (
                      <FormHelperText>{errors.mediaSource}</FormHelperText>
                    ) : (
                      <FormHelperText>
                        You can add multiple tumblrs each separated by a comma, you can also add tags inside square
                        brackets eg: tumblr[tag1,tag2]
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl
                    className={classes.control}
                    required
                    error={!!errors.mediaSource}
                  >
                    <InputLabel>Subreddits</InputLabel>
                    <Input
                      id="redditId"
                      required
                      value={store.config.redditId}
                      onChange={this.handleChange("redditId")}
                    />
                    {errors.mediaSource ? (
                      <FormHelperText>{errors.mediaSource}</FormHelperText>
                    ) : (
                      <FormHelperText>
                        You can add multiple subreddits each seperated by a
                        comma
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl
                    className={classes.control}
                    required
                    error={!!errors.slideDuration}
                  >
                    <InputLabel>Slide Duration</InputLabel>
                    <Input
                      id="slideDuration"
                      value={store.config.slideDuration}
                      onChange={this.handleChange("slideDuration", Number)}
                      type="number"
                      inputProps={{ step: "1", min: "3" }}
                      endAdornment={
                        <InputAdornment position="end">seconds</InputAdornment>
                      }
                    />
                    {errors.slideDuration ? (
                      <FormHelperText>{errors.slideDuration}</FormHelperText>
                    ) : (
                      <FormHelperText>
                        Applies to static images and gifs
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={store.config.loopShortVideos}
                        onChange={this.handleCheckChange("loopShortVideos")}
                        value="loopShortVideos"
                      />
                    }
                    label="Loop Short Videos"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl
                    component="fieldset"
                    required
                    error={!!errors.imageType}
                  >
                    <FormLabel component="legend">Media Type</FormLabel>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={store.config.gifs}
                            onChange={this.handleCheckChange("gifs")}
                            value="gifs"
                          />
                        }
                        label="Gifs"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={store.config.pictures}
                            onChange={this.handleCheckChange("pictures")}
                            value="pictures"
                          />
                        }
                        label="Pictures"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={store.config.videos}
                            onChange={this.handleCheckChange("videos")}
                            value="videos"
                          />
                        }
                        label="Videos"
                      />
                    </FormGroup>
                    <FormHelperText>{errors.imageType}</FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
            </Group>
            <Group title="Time">
              <Grid container spacing={16}>
                <Grid item xs={12} md={6}>
                  <FormControl
                    className={classes.control}
                    required
                    error={!!errors.minimumGameTime}
                  >
                    <InputLabel>Minimum Game Time</InputLabel>
                    <Input
                      id="minimumGameTime"
                      value={store.config.minimumGameTime}
                      required
                      onChange={this.handleChange("minimumGameTime", Number)}
                      type="number"
                      inputProps={{ step: "1", min: "3" }}
                      endAdornment={
                        <InputAdornment position="end">minutes</InputAdornment>
                      }
                    />
                    <FormHelperText>{errors.minimumGameTime}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl
                    className={classes.control}
                    required
                    error={!!errors.maximumGameTime}
                  >
                    <InputLabel>Maximum Game Time</InputLabel>
                    <Input
                      id="maximumGameTime"
                      value={store.config.maximumGameTime}
                      required
                      onChange={this.handleChange("maximumGameTime", Number)}
                      type="number"
                      inputProps={{ step: "1", min: "5" }}
                      endAdornment={
                        <InputAdornment position="end">minutes</InputAdornment>
                      }
                    />
                    {errors.maximumGameTime ? (
                      <FormHelperText>{errors.maximumGameTime}</FormHelperText>
                    ) : (
                      <FormHelperText>
                        Just an estimate, other config options may impact this
                        setting
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
            </Group>
            <Group title="Orgasm">
              <Grid container>
                <Grid item xs={12}>
                  <FormControl
                    fullWidth
                    component="fieldset"
                    required
                    error={!!errors.finialOrgasm || !!errors.finalOrgasmRandom}
                  >
                    <FormLabel component="legend">Final Orgasm</FormLabel>
                    <Grid container xs={12} direction={"row"} alignItems={"center"}>

                      <Grid container xs={12} md={3} direction={"column"}>
                        <Grid item xs={10}>
                          <FormControlLabel
                            title={"Whether you will be allowed to have a full orgasm in the end"}
                            control={
                              <Switch
                                checked={store.config.finalOrgasmAllowed}
                                onChange={this.handleFinalOrgasmGroupCheckChange("finalOrgasmAllowed")}
                                value="finalOrgasmAllowed"
                              />
                            }
                            label="Allowed"
                          />
                        </Grid>
                        <Grid item xs={10}>
                          <FormControl
                            className={classes.control}
                            required={!!store.config.finalOrgasmRandom}
                            error={!!errors.allowedProbability || (!!store.config.finalOrgasmRandom && !!errors.finialOrgasm)}
                          >
                            <InputLabel>Probability</InputLabel>
                            <Input
                              id="allowedProbability"
                              value={store.config.allowedProbability}
                              onChange={this.handleFinalOrgasmGroupCheck("allowedProbability")}
                              disabled={!store.config.finalOrgasmRandom || !store.config.finalOrgasmAllowed}
                              endAdornment={
                                <InputAdornment position="end">%</InputAdornment>
                              }
                            />
                          </FormControl>
                          <FormHelperText>{errors.allowedProbability}</FormHelperText>
                        </Grid>
                      </Grid>
                      <Grid container xs={12} md={3} direction={"column"}>
                        <Grid item xs={10}>
                          <FormControlLabel
                            title={"Whether you will be denied in the end"}
                            control={
                              <Switch
                                checked={store.config.finalOrgasmDenied}
                                onChange={this.handleFinalOrgasmGroupCheckChange("finalOrgasmDenied")}
                                value="finalOrgasmDenied"
                              />
                            }
                            label="Denied"
                          />
                        </Grid>
                        <Grid item xs={10}>
                          <FormControl
                            className={classes.control}
                            required={!!store.config.finalOrgasmRandom}
                            error={!!errors.deniedProbability || (!!store.config.finalOrgasmRandom && !!errors.finialOrgasm)}
                          >
                            <InputLabel>Probability</InputLabel>
                            <Input
                              id="deniedProbability"
                              value={store.config.deniedProbability}
                              onChange={this.handleFinalOrgasmGroupCheck("deniedProbability")}
                              disabled={!store.config.finalOrgasmRandom || !store.config.finalOrgasmDenied}
                              endAdornment={
                                <InputAdornment position="end">%</InputAdornment>
                              }
                            />
                            <FormHelperText>{errors.deniedProbability}</FormHelperText>
                          </FormControl>
                        </Grid>
                      </Grid>
                      <Grid container xs={12} md={3} direction={"column"}>
                        <Grid item xs={10}>
                          <FormControlLabel
                            title={"Whether you will be asked to ruin in the end"}
                            control={
                              <Switch
                                checked={store.config.finalOrgasmRuined}
                                onChange={this.handleFinalOrgasmGroupCheckChange("finalOrgasmRuined")}
                                value="finalOrgasmRuined"
                              />
                            }
                            label="Ruined"
                          />
                        </Grid>
                        <Grid item xs={10}>
                          <FormControl
                            className={classes.control}
                            required={!!store.config.finalOrgasmRandom}
                            error={!!errors.ruinedProbability || (!!store.config.finalOrgasmRandom && !!errors.finialOrgasm)}
                          >
                            <InputLabel>Probability</InputLabel>
                            <Input
                              id="ruinedProbability"
                              value={store.config.ruinedProbability}
                              onChange={this.handleFinalOrgasmGroupCheck("ruinedProbability")}
                              disabled={!store.config.finalOrgasmRandom || !store.config.finalOrgasmRuined}
                              endAdornment={
                                <InputAdornment position="end">%</InputAdornment>
                              }
                            />
                            <FormHelperText>{errors.ruinedProbability}</FormHelperText>
                          </FormControl>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <FormControlLabel
                          title={"Chooses at random from the left hand side selected game ends"}
                          control={
                            <Switch
                              checked={store.config.finalOrgasmRandom}
                              onChange={this.handleFinalOrgasmGroupCheckChange(
                                "finalOrgasmRandom"
                              )}
                              value="finalOrgasmRandom"
                            />
                          }
                          label={"Random (applies to selected)"}
                        />
                      </Grid>
                      {errors.finalOrgasmRandom ?
                        <FormHelperText>{errors.finalOrgasmRandom}</FormHelperText>
                        :
                        <FormHelperText>{errors.finialOrgasm}</FormHelperText>
                      }
                    </Grid>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={16}>
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    title={"Makes the game ending more challenging by: \n" +
                    "   - enabling more advanced orgasm tasks, like a time limit to orgasm in or \n" +
                    "     a specific stroke style and speed that may not be changed to orgasm.\n" +
                    "   - invoking a chance to be denied in the end if failing on 'Advanced Edge' tasks"}
                    control={
                      <Switch
                        checked={store.config.advancedOrgasm}
                        onChange={this.handleCheckChange("advancedOrgasm")}
                        value="advancedOrgasm"
                      />
                    }
                    label="Advanced Orgasm"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl
                    className={classes.control}
                    required
                    error={!!errors.maximumOrgasms}
                  >
                    <InputLabel>Maximum Number of Orgasms</InputLabel>
                    <Input
                      id="maximumOrgasms"
                      value={store.config.maximumOrgasms}
                      onChange={this.handleChange("maximumOrgasms", Number)}
                      fullWidth
                      type="number"
                      inputProps={{ step: "1", min: "1" }}
                    />
                    {errors.maximumOrgasms ? (
                      <FormHelperText>{errors.maximumOrgasms}</FormHelperText>
                    ) : (
                      <FormHelperText>
                        The number of Orgasms that will occur at max during the game
                      </FormHelperText>
                    )}
                  </FormControl>

                </Grid>

              </Grid>
              <Grid container spacing={16}>
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={store.config.postOrgasmTorture}
                        onChange={this.handleCheckChange("postOrgasmTorture")}
                        value="postOrgasmTorture"
                      />
                    }
                    label="Post Orgasm Torture"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl
                    className={classes.control}
                    disabled={!store.config.postOrgasmTorture}
                    error={!!errors.postOrgasmTortureMinimumTime}
                  >
                    <InputLabel>Post Orgasm Torture Minimum Time</InputLabel>
                    <Input
                      id="postOrgasmTortureMinimumTime"
                      value={store.config.postOrgasmTortureMinimumTime}
                      onChange={this.handleChange("postOrgasmTortureMinimumTime", Number)}
                      fullWidth
                      type="number"
                      inputProps={{ step: "1", min: "3" }}
                      endAdornment={
                        <InputAdornment position="end">seconds</InputAdornment>
                      }
                    />
                    <FormHelperText>
                      {errors.postOrgasmTortureMinimumTime}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl
                    className={classes.control}
                    disabled={!store.config.postOrgasmTorture}
                    error={!!errors.postOrgasmTortureMaximumTime}
                  >
                    <InputLabel>Post Orgasm Torture Maximum Time</InputLabel>
                    <Input
                      id="postOrgasmTortureMaximumTime"
                      value={store.config.postOrgasmTortureMaximumTime}
                      onChange={this.handleChange("postOrgasmTortureMaximumTime", Number)}
                      fullWidth
                      type="number"
                      inputProps={{ step: "1", min: "5" }}
                      endAdornment={
                        <InputAdornment position="end">seconds</InputAdornment>
                      }
                    />
                    <FormHelperText>
                      {errors.postOrgasmTortureMaximumTime}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl
                    className={classes.control}
                    error={!!errors.minimumRuinedOrgasms}
                  >
                    <InputLabel>Minimum Ruined Orgasms</InputLabel>
                    <Input
                      id="minimumRuinedOrgasms"
                      value={store.config.minimumRuinedOrgasms}
                      onChange={this.handleChange("minimumRuinedOrgasms", Number)}
                      fullWidth
                      type="number"
                      inputProps={{ step: "1", min: "0" }}
                    />
                    <FormHelperText>
                      {errors.minimumRuinedOrgasms}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl
                    className={classes.control}
                    error={!!errors.maximumRuinedOrgasms}
                  >
                    <InputLabel>Maximum Ruined Orgasms</InputLabel>
                    <Input
                      id="maximumRuinedOrgasms"
                      value={store.config.maximumRuinedOrgasms}
                      onChange={this.handleChange("maximumRuinedOrgasms", Number)}
                      fullWidth
                      type="number"
                      inputProps={{ step: "1", min: "0" }}
                    />
                    <FormHelperText>
                      {errors.maximumRuinedOrgasms}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl
                    className={classes.control}
                    error={!!errors.ruinCooldown}
                  >
                    <InputLabel>Ruin Cooldown</InputLabel>
                    <Input
                      id="ruinCooldown"
                      value={store.config.ruinCooldown}
                      onChange={this.handleChange("ruinCooldown", Number)}
                      fullWidth
                      type="number"
                      inputProps={{ step: "1", min: "0" }}
                      endAdornment={
                        <InputAdornment position="end">seconds</InputAdornment>
                      }
                    />
                    <FormHelperText>{errors.ruinCooldown}</FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
            </Group>
            <Group title="Edging">
              <Grid container spacing={16}>
                <Grid item xs={12} md={3}>
                  <FormControlLabel
                    title={"Makes edging more interesting. If this is active, there is a chance for harder " +
                    "edging tasks. This does not affect the other edging options like frequency, minimum edges " +
                    "and cooldown."}
                    control={
                      <Switch
                        checked={store.config.advancedEdging}
                        onChange={this.handleCheckChange("advancedEdging")}
                        value="advancedEdging"
                      />
                    }
                    label="Advanced Edging"
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl
                    className={classes.control}
                    error={!!errors.minimumEdges}
                    title={"Specify how many edges you will have to fulfill before the game may end"}
                  >
                    <InputLabel>Minimum Edges</InputLabel>
                    <Input
                      id="minimumEdges"
                      value={store.config.minimumEdges}
                      onChange={this.handleChange("minimumEdges", Number)}
                      fullWidth
                      type="number"
                      inputProps={{ step: "1", min: "0" }}
                    />
                    <FormHelperText>{errors.minimumEdges}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl
                    className={classes.control}
                    error={!!errors.edgeCooldown}
                  >
                    <InputLabel>Edge Cooldown</InputLabel>
                    <Input
                      id="edgeCooldown"
                      value={store.config.edgeCooldown}
                      onChange={this.handleChange("edgeCooldown", Number)}
                      fullWidth
                      type="number"
                      inputProps={{ step: "1", min: "0" }}
                      endAdornment={
                        <InputAdornment position="end">seconds</InputAdornment>
                      }
                    />
                    <FormHelperText>{errors.edgeCooldown}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl
                    className={classes.control}
                    error={!!errors.edgeFrequency}
                  >
                    <InputLabel>Increase Edge Frequency</InputLabel>
                    <Input
                      id="edgeFrequency"
                      value={store.config.edgeFrequency}
                      onChange={this.handleChange("edgeFrequency", Number)}
                      fullWidth
                      type="number"
                      inputProps={{ step: "1", min: "0" }}
                      endAdornment={
                        <InputAdornment position="end">%</InputAdornment>
                      }
                    />
                    <FormHelperText>{errors.edgeFrequency}</FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
            </Group>
            <Group title="Stroke">
              <Grid container spacing={16}>
                <Grid item xs={12} md={3}>
                  <FormControl
                    className={classes.control}
                    error={!!errors.defaultStrokeStyle}
                    title={"Select the most occurring stroke style during this game. Only active Stroke Styles " +
                    "can be chosen. 'Hands Off' can not be chosen."}
                  >
                    <InputLabel>Default Stroke Style</InputLabel>
                    <Select
                      value={store.config.defaultStrokeStyle}
                      onChange={this.handleChange("defaultStrokeStyle", Number)}
                    >
                      {Object.keys(StrokeStyleEnum).map(key => (
                        <MenuItem key={key} value={StrokeStyleEnum[key]}
                                  disabled={
                                    !store.config.tasks[key] || key === "handsOff"}>
                          {StrokeStyleString[StrokeStyleEnum[key]]}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{errors.defaultStrokeStyle}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl className={classes.control}>
                    <InputLabel>Initial Grip Strength</InputLabel>
                    <Select
                      value={store.config.initialGripStrength}
                      onChange={this.handleChange("initialGripStrength", Number)}
                    >
                      {Object.keys(GripStrengthEnum).map(key => (
                        <MenuItem key={key} value={GripStrengthEnum[key]}>
                          {GripStrengthString[GripStrengthEnum[key]]}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl
                    className={classes.control}
                    error={!!errors.slowestStrokeSpeed}
                  >
                    <InputLabel>Slowest Stroke Speed</InputLabel>
                    <Input
                      id="slowestStrokeSpeed"
                      value={store.config.slowestStrokeSpeed}
                      onChange={this.handleChange("slowestStrokeSpeed", Number)}
                      fullWidth
                      type="number"
                      inputProps={{ step: "0.25", min: "0.25", max: "6" }}
                      endAdornment={
                        <InputAdornment position="end">seconds</InputAdornment>
                      }
                    />
                    <FormHelperText>{errors.slowestStrokeSpeed}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl
                    className={classes.control}
                    error={!!errors.fastestStrokeSpeed}
                  >
                    <InputLabel>Fastest Stroke Speed</InputLabel>
                    <Input
                      id="fastestStrokeSpeed"
                      value={store.config.fastestStrokeSpeed}
                      onChange={this.handleChange("fastestStrokeSpeed", Number)}
                      fullWidth
                      type="number"
                      inputProps={{ step: "0.25", min: "0.25", max: "6" }}
                      endAdornment={
                        <InputAdornment position="end">seconds</InputAdornment>
                      }
                    />
                    <FormHelperText>{errors.fastestStrokeSpeed}</FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
            </Group>
            <Group title="Tasks">
              <ExpansionPanel defaultExpanded>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}
                                       title={"Chooses from all options below at random."}
                >
                  <Button
                    variant="raised"
                    color="primary"
                    className={classes.button}
                    onClick={this.handleTaskRandomize([getStrokeStyleName(store.config.defaultStrokeStyle)])}
                  >
                    Randomize
                  </Button>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Grid container>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormControl
                        className={classes.control}
                        error={!!errors.speed}
                      >
                        <TaskList
                          title="Speed"
                          error={errors.speed}
                          tasks={{
                            doubleStrokes: "Double Strokes",
                            halvedStrokes: "Halved Strokes",
                            teasingStrokes: "Teasing Strokes",
                            accelerationCycles: "Acceleration Cycles",
                            randomBeat: "Random Beats",
                            randomStrokeSpeed: "Random Stroke Speed",
                            redLightGreenLight: "Red Light Green Light",
                            clusterStrokes: "Cluster Strokes",
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormControl
                        className={classes.button}
                        error={!!errors.style}
                        title={"Select the Stroking Styles that shall appear during the game here. \n" +
                        "At least the default Stroke Style has to be active. \n" +
                        "You can change the default Stroke Style above. Only active Styles can be chosen."}
                      >
                        <TaskList
                          title="Style"
                          error={errors.style}
                          except={[getStrokeStyleName(store.config.defaultStrokeStyle)]}
                          tasks={{
                            dominant: "Dominant",
                            nondominant: "Nondominant",
                            headOnly: "Head Only",
                            shaftOnly: "Shaft Only",
                            gripAdjustments: "Grip Adjustments",
                            overhandGrip: "Overhand Grip",
                            bothHands: "Both Hands",
                            handsOff: "Hands Off"
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TaskList
                        title="Cock & Ball Torture"
                        tasks={{
                          bindCockBalls: "Bind Cock and Balls",
                          rubberBands: "Rubber Bands",
                          clothespins: "Clothespins",
                          headPalming: "Head Palming",
                          icyHot: "Icy Hot",
                          toothpaste: "Toothpaste",
                          ballSlaps: "Ball Slaps",
                          squeezeBalls: "Squeeze Balls",
                          breathPlay: "Breath Play",
                          scratching: "Scratching",
                          flicking: "Flicking",
                          cbtIce: "Icecubes"
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TaskList
                        title="Cum Eating"
                        tasks={{
                          precum: "Precum"
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TaskList
                        title="Anal"
                        tasks={{
                          buttplug: "Butt Plug"
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TaskList
                        title="Misc."
                        tasks={{
                          pickYourPoison: "Pick your Poison",
                          rubNipples: "Rub Nipples",
                          nipplesAndStroke: "Nipples and Stroking"

                        }}
                      />
                    </Grid>
                  </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </Group>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="raised"
                color="primary"
                className={classes.button}
                onClick={this.handleStart}
                disabled={Object.keys(errors).length > 0}
              >
                Start
              </Button>
              <Tooltip
                id="generate-link-tooltip"
                title="Copied to Clipboard"
                leaveDelay={2000}
                open={copyToolTipOpen}
                onClose={() => {
                  this.setState({
                    copyToolTipOpen: false
                  });
                }}
                placement="bottom"
              >
                <Button
                  variant="raised"
                  color="secondary"
                  className={classes.button}
                  onClick={this.handleGenerateLink}
                  disabled={Object.keys(errors).length > 0}
                >
                  Generate Link
                </Button>
              </Tooltip>
              <FormControlLabel
                control={
                  <Switch
                    checked={store.config.allowConfigEdit}
                    onChange={this.handleCheckChange(
                      "allowConfigEdit"
                    )}
                    value="allowConfigEdit"
                  />
                }
                label="Editable?"
              />
            </div>
          </Paper>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(withRouter(connect(ConfigPage)));
