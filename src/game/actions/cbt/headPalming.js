import store from "store";
import createNotification from "engine/createNotification";
import { getAverageStrokeSpeed, getRandomStrokeSpeed, setStrokeSpeed } from "game/utils/strokeSpeed";
import { getRandomArbitrary, getRandomInclusiveInteger } from "utils/math";
import delay from "utils/delay";

const headPalming = async () => {
  const palmCircleCount = getRandomInclusiveInteger(5, 20);
  const delayTime = 2;
  const palmSpeed = getRandomArbitrary(
    store.config.slowestStrokeSpeed,
    getAverageStrokeSpeed()
  );
  const palmTime = palmCircleCount / palmSpeed;
  const totalTime = palmTime + delayTime;

  createNotification(
    `Palm the head of your cock.  One full circle for each beat.`,
    {
      time: totalTime * 1000
    }
  );

  setStrokeSpeed(0);
  await delay(delayTime * 1000);

  setStrokeSpeed(palmSpeed);
  await delay(palmTime * 1000);

  setStrokeSpeed(0);
  await delay(delayTime * 1000);

  createNotification(`Back to stroking`);

  setStrokeSpeed(getRandomStrokeSpeed());
};
headPalming.label = "Head Palming";

export default headPalming;
