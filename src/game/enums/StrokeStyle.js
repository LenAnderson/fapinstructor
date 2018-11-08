import store from "store";
import createNotification from "engine/createNotification";
import handsOff from "game/actions/speed/handsOff";

const StrokeStyleString = {
  0: "Dominant",
  1: "Nondominant",
  2: "Head Only",
  3: "Shaft Only",
  4: "Overhand Grip",
  5: "Both Hands",
  6: "Hands Off",
};

const StrokeStyleEnum = {
  dominant: 0,
  nondominant: 1,
  headOnly: 2,
  shaftOnly: 3,
  overhandGrip: 4,
  bothHands: 5,
  handsOff: 6,
};

export const StrokeStyleArray = Object.entries(StrokeStyleEnum);

/**
 * Access to the StrokeStyleEnum in reverse direction.
 *
 * @param index
 *   the index according to the StrokeStyleEnum
 * @returns {string} the __name__ of the stroke Style
 */
export const getStrokeStyleName = (index) => {
  return StrokeStyleArray[index][0]
};

export const setDefaultStrokeStyle = async () => {
  await setStrokeStyle(store.config.defaultStrokeStyle);
};

export const setStrokeStyleDominant = async (quiet = false) => {
  if (store.game.strokeStyle !== StrokeStyleEnum.dominant) {
    if (!quiet) {
      createNotification(`Use your dominant hand`);
    }
    store.game.strokeStyle = StrokeStyleEnum.dominant;
  }
};
setStrokeStyleDominant.label = "Dominant Hand";

export const setStrokeStyleNondominant = async (quiet = false) => {
  if (store.game.strokeStyle !== StrokeStyleEnum.nondominant) {
    if (!quiet) {
      createNotification(`Use your nondominant hand`);
    }
    store.game.strokeStyle = StrokeStyleEnum.nondominant;
  }
};
setStrokeStyleNondominant.label = "Nondominant Hand";


export const setStrokeStyleHeadOnly = async (quiet = false) => {
  if (store.game.strokeStyle !== StrokeStyleEnum.headOnly) {
    if (!quiet) {
      createNotification(`Stroke only the head`);
    }
    store.game.strokeStyle = StrokeStyleEnum.headOnly;
  }
};
setStrokeStyleHeadOnly.label = "Head Stroking";

export const setStrokeStyleShaftOnly = async (quiet = false) => {
  if (store.game.strokeStyle !== StrokeStyleEnum.shaftOnly) {
    if (!quiet) {
      createNotification(`Stroke only the shaft`);
    }
    store.game.strokeStyle = StrokeStyleEnum.shaftOnly;
  }
};
setStrokeStyleShaftOnly.label = "Shaft Stroking";

export const setStrokeStyleOverhandGrip = async (quiet = false) => {
  if (store.game.strokeStyle !== StrokeStyleEnum.overhandGrip) {
    if (!quiet) {
      createNotification(`Stroke with the overhand grip`);
    }
    store.game.strokeStyle = StrokeStyleEnum.overhandGrip;
  }
};
setStrokeStyleOverhandGrip.label = "Overhand Grip";

export const setStrokeStyleBothHands = async (quiet = false) => {
  if (store.game.strokeStyle !== StrokeStyleEnum.bothHands) {
    if (!quiet) {
      createNotification(`Use both of your hands`);
    }
    store.game.strokeStyle = StrokeStyleEnum.bothHands;
  }
};
setStrokeStyleBothHands.label = "Both Hands";

/**
 * setStrokeStyleHandsOff is not included in the Enums because it cannot be triggered by the default random action
 * trigger methods as this would result in a random StrokeSpeed along with the HandsOff Style. So the "HandsOff"
 * Task is modeled as a speed Card, rather than a style Card.
 */
export const setStrokeStyleHandsOff = async () => {
  if (store.game.strokeStyle !== StrokeStyleEnum.handsOff) {
    store.game.strokeStyle = StrokeStyleEnum.handsOff;
  }
};
setStrokeStyleHandsOff.label = "Hands Off!!";

/**
 * Enum of the Function calls. Has to have the same indices and order as the StrokeStyleEnum
 */
const StrokeStyleSetterEnum = {
  0: setStrokeStyleDominant,
  1: setStrokeStyleNondominant,
  2: setStrokeStyleHeadOnly,
  3: setStrokeStyleShaftOnly,
  4: setStrokeStyleOverhandGrip,
  5: setStrokeStyleBothHands,
  6: handsOff,
};

const StrokeStyleSetterArray = Object.entries(StrokeStyleSetterEnum);

/**
 * sets the Stroke style
 *
 * @param strokeStyle   a strokeStyle from StrokeStyleEnum to be applied
 *
 * @author the1nstructor
 * @since 15.07.2018
 */
export const setStrokeStyle = async (strokeStyle = StrokeStyleEnum.dominant) => {
  await StrokeStyleSetterArray[strokeStyle][1]();
};

/**
 * sets the Stroke style without forcing a notification
 * Is required for the punishments. The Stroke Style currently needs to be set before the actually punish
 * action is over.
 *
 * @param strokeStyle   a strokeStyle from StrokeStyleEnum to be applied
 *
 * @author the1nstructor
 * @since 27.09.2018
 */
export const setStrokeStyleQuiet = async (strokeStyle = StrokeStyleEnum.dominant) => {
  await StrokeStyleSetterArray[strokeStyle][1](true);
};

/**
 * Get a array with all active stroke styles.
 * [task1, task2, ...]
 * @returns {Array}
 * @param arrayToBeExcluded {Array}   a array of style names (from StrokeStyleEnum) that are to be excluded.
 *
 * @author the1nstructor
 * @since 02.08.2018
 */
const getRandomActivatedStokeStyles = (arrayToBeExcluded = []) => {
  let name;
  let arr = [];
  const tasks = Object.entries(store.config.tasks);
  for (name in StrokeStyleEnum) {
    for (let i = 0; i < tasks.length; i++) {
      // find the specified task
      if (tasks[i][0] === name) {
        // now push only active tasks. And only the names.
        if (tasks[i][1]) {
          //only push if the name is not excluded
          let ToBeExcluded = false;
          for (let j = 0; j < arrayToBeExcluded.length; j++) {
            if (tasks[i][0] === arrayToBeExcluded[j]) {
              ToBeExcluded = true;
            }
          }
          if (!ToBeExcluded) {
            arr.push(tasks[i][0]);  // Append only if not excluded
          }
        }
      }
    }
  }
  if (arr === undefined || arr.length === 0) {
    // array empty or does not exist
    arr.push("dominant");  // To avoid ever getting an empty array
  }
  return arr;
};

/**
 * Calculates an index for a random Style out of the activatedArray.
 *
 * @param activatedArray   the array of active Stroke Style names.
 * @returns {number}       the index of the Style to be set.
 *
 * @author the1nstructor
 * @since 11.07.2018
 */
const getRandomStrokeStyleIndex = (activatedArray) => {
  let styleName = activatedArray[Math.floor(Math.random() * activatedArray.length)];
  for (let i = 0; i < StrokeStyleArray.length; i++) {
    if (StrokeStyleArray[i][0] === styleName) {
      return StrokeStyleArray[i][1];
    }
  }
};

/**
 * Sets a random Stroking Style for you. Only uses styles marked as active in the setup of the game. And does atm not
 * care about the probabilities set in game/actions/index.js
 *
 * @param quiet
 *    whether a message will be shown or not.
 *
 * @author the1nstructor
 * @since 11.07.2018
 */
export const setRandomStrokeStyle = async (quiet = false) => {

  const styles = getRandomActivatedStokeStyles();
  const index = getRandomStrokeStyleIndex(styles);
  // Set the style
  StrokeStyleSetterArray[index][1](quiet);
};

/**
 * Sets a random one-handed stroking style for you.
 *
 * Has to be updated manually. simply extend the exclude array.
 *
 * @author the1nstructor
 * @since 02.08.2018
 */
export const setRandomStrokeStyle_OneHand = async () => {
  const exclude = ["bothHands", "handsOff"]; // StrokeStyleEnum names
  let styles = getRandomActivatedStokeStyles(exclude);
  const index = getRandomStrokeStyleIndex(styles);
  // Set the style
  StrokeStyleSetterArray[index][1]();
};

/**
 *
 * @returns {Number} The current Stroke Style as StrokeStyleEnum.any (a number basically)
 *
 * @author the1nstructor
 * @since 15.07.2018
 */
export const getCurrentStrokeStyle = () => {
  return store.game.strokeStyle;
};

export { StrokeStyleString, StrokeStyleEnum };
