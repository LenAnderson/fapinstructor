import createNotification from "engine/createNotification";
import { getRandomStrokeSpeed, setStrokeSpeed } from "game/utils/strokeSpeed";
import { getRandomInclusiveInteger } from "utils/math";
import delay from "utils/delay";

export const flickCockHead = async () => {
  const flickCount = getRandomInclusiveInteger(3, 6);
  const delayTime = 2;
  const flickSpeed = getRandomStrokeSpeed({ fast: 2 });
  const flickTime = flickCount / flickSpeed;
  const totalTime = flickTime + delayTime;

  createNotification(`Flick the head of your cock ${flickCount} times`, {
    time: totalTime * 1000
  });

  setStrokeSpeed(0);
  await delay(delayTime * 1000);

  setStrokeSpeed(flickSpeed);
  await delay(flickTime * 1000);

  setStrokeSpeed(0);
  await delay(delayTime * 1000);

  createNotification(`Back to stroking`);

  setStrokeSpeed(getRandomStrokeSpeed());
};
flickCockHead.label = "Flick Cock Head";

export const flickNipples = async () => {
  const flickCount = getRandomInclusiveInteger(3, 6);
  const delayTime = 2;
  const flickSpeed = getRandomStrokeSpeed({ fast: 2 });
  const flickTime = flickCount / flickSpeed;
  const totalTime = flickTime + delayTime;

  createNotification(`Flick your nipples ${flickCount} times`, {
    time: totalTime * 1000
  });

  setStrokeSpeed(0);
  await delay(delayTime * 1000);

  setStrokeSpeed(flickSpeed);
  await delay(flickTime * 1000);

  setStrokeSpeed(0);
  await delay(delayTime * 1000);

  createNotification(`Back to stroking`);

  setStrokeSpeed(getRandomStrokeSpeed());
};
flickNipples.label = "Flick Nipples";
