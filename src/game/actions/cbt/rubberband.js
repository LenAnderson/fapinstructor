import store from "store";
import createNotification, { dismissNotification } from "engine/createNotification";
import { getRandomBoolean, getRandomInclusiveInteger } from "utils/math";
import { strokerRemoteControl } from "game/loops/strokerLoop";
import { getRandomStrokeSpeed, setStrokeSpeed } from "game/utils/strokeSpeed";
import delay from "utils/delay";

export const addRubberBand = async () => {
  strokerRemoteControl.pause();
  const newRubberBands = store.game.rubberBands + 1;

  let location = "Put a rubberband ";
  switch (getRandomInclusiveInteger(1, 4)) {
    case 1: {
      location += "onto the base of your shaft";
      break;
    }
    case 2: {
      location += "onto the middle of your shaft";
      break;
    }
    case 3: {
      location += "underneath your cock head";
      break;
    }
    default: {
      location += "anywhere on your cock";
    }
  }

  const notificationId = createNotification(location, {
    autoDismiss: false
  });

  const done = async () => {
    strokerRemoteControl.play();
    store.game.rubberBands = newRubberBands;
    dismissNotification(notificationId);
  };
  done.label = "Added";

  return [done];
};
addRubberBand.label = "Add Rubberband";

export const removeRubberBand = async () => {
  const currentRubberBands = store.game.rubberBands;

  if (currentRubberBands !== 0) {
    strokerRemoteControl.pause();
    const newRubberBands = store.game.rubberBands - 1;
    const notificationId = createNotification(`Remove a rubberband`, {
      autoDismiss: false
    });

    const done = async () => {
      strokerRemoteControl.play();
      store.game.rubberBands = newRubberBands;
      dismissNotification(notificationId);
    };
    done.label = "Removed";

    return [done];
  }
};
removeRubberBand.label = "Remove Rubberband";

export const snapRubberBand = async () => {
  if (store.game.rubberBands > 0) {
    const snapCount = getRandomInclusiveInteger(3, 10);
    const delayTime = 2;
    const snapSpeed = getRandomStrokeSpeed({ fast: 2 });
    const snapTime = snapCount / snapSpeed;
    const totalTime = snapTime + delayTime;

    createNotification(
      `Pull and snap a rubberband ${snapCount} times to the beat`,
      {
        time: totalTime * 1000
      }
    );

    setStrokeSpeed(0);
    await delay(delayTime * 1000);

    setStrokeSpeed(snapSpeed);
    await delay(snapTime * 1000);

    setStrokeSpeed(0);
    await delay(delayTime * 1000);

    createNotification(`Back to stroking`);

    setStrokeSpeed(getRandomStrokeSpeed());
  }
};
snapRubberBand.label = "Rubberband Snaps";

const randomRubberBandAdjustment = async () => {
  if (getRandomBoolean()) {
    return addRubberBand();
  } else {
    return removeRubberBand();
  }
};
randomRubberBandAdjustment.label = "Random Rubberband Adjustment";

export default randomRubberBandAdjustment;
