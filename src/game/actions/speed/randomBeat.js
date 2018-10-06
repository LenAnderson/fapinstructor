import store from "store";
import createNotification from "engine/createNotification";
import { getAverageStrokeSpeed, getRandomStrokeSpeed, setStrokeSpeed } from "game/utils/strokeSpeed";
import { getRandomArbitrary, getRandomInclusiveInteger } from "utils/math";
import delay from "utils/delay";

const randomBeat = async () => {
  // set count
  const setCount = getRandomInclusiveInteger(3, 6);

  // stroke speed of sets
  const fastSpeed = getRandomArbitrary(
    getAverageStrokeSpeed(),
    store.config.fastestStrokeSpeed
  );
  const slowSpeed = getRandomArbitrary(
    store.config.slowestStrokeSpeed,
    getAverageStrokeSpeed()
  );

  // rep count
  const fastReps = getRandomInclusiveInteger(2, 10);
  const slowReps = getRandomInclusiveInteger(1, 5);

  // time to complete set
  const fastTime = fastReps / fastSpeed;
  const slowTime = slowReps / slowSpeed;

  const startDelayTime = 2;
  const setGapTime = 0.25;
  const totalTime =
    fastTime * setCount +
    slowTime * setCount +
    setGapTime * setCount +
    startDelayTime;

  createNotification(`Random Beat [${fastReps}, ${slowReps}]`, {
    time: totalTime * 1000
  });

  setStrokeSpeed(0);
  await delay(startDelayTime * 1000);

  for (let i = 0; i < setCount; i++) {
    setStrokeSpeed(fastSpeed);
    await delay(fastTime * 1000);

    setStrokeSpeed(slowSpeed);
    await delay(slowTime * 1000);

    setStrokeSpeed(0);
    await delay(setGapTime * 1000);
  }

  setStrokeSpeed(getRandomStrokeSpeed());
};
randomBeat.label = "Random Beat";

export default randomBeat;
