import store from "store";
import createNotification from "engine/createNotification";
import { getRandomStrokeSpeed, setStrokeSpeed } from "game/utils/strokeSpeed";
import { getRandomInclusiveInteger } from "utils/math";
import delay from "utils/delay";
import play from "engine/audio";
import audioLibrary from "audio";

const squeezeBalls = async () => {
  const time = getRandomInclusiveInteger(15, 40);

  createNotification(`Squeeze your balls`, {
    time: time * 1000
  });

  if (store.config.enableVoice) {
    play(audioLibrary.SqueezeBalls);
  }

  setStrokeSpeed(getRandomStrokeSpeed());

  await delay(time * 1000);

  createNotification(`Back to stroking`);

  setStrokeSpeed(getRandomStrokeSpeed());
};
squeezeBalls.label = "Squeeze Balls";

export default squeezeBalls;
