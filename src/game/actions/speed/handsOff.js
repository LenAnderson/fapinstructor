import createNotification from "engine/createNotification";
import { getRandomStrokeSpeed, setStrokeSpeed, } from "game/utils/strokeSpeed";
import { getRandomInclusiveInteger } from "utils/math";
import delay from "utils/delay";
import { getCurrentStrokeStyle, setStrokeStyle, setStrokeStyleHandsOff, StrokeStyleEnum } from "game/enums/StrokeStyle";
import { getRandom_handsOff_message } from "game/texts/messages";

const HANDS_OFF_DURATION_MIN = 10;  // Seconds
const HANDS_OFF_DURATION_MAX = 25;  // Seconds
const SECONDS_IN_MILLI_SECONDS = 1000;  // Factor

/**
 * Task to not touch ones cock
 * catches current strokeStyle and applies it after *duration* again.
 * Except the current strokeStyle is already HandsOff, in this specific case the caller has to deal with the style.
 * This avoids cascading function calls.
 *
 * @param duration
 *   The duration how long the break shall last in s
 *
 * @since       07.10.2018
 * @author      the1nstructor
 *
 * @alias       handsOff
 * @memberof    actions
 */
const handsOff = async (duration = getRandomInclusiveInteger(HANDS_OFF_DURATION_MIN, HANDS_OFF_DURATION_MAX)) => {

  const style = getCurrentStrokeStyle();
  // task duration (= total time in this case)
  const m = getRandom_handsOff_message();
  createNotification(m, {
    time: duration * SECONDS_IN_MILLI_SECONDS
  });

  setStrokeSpeed(0);
  await setStrokeStyleHandsOff();
  await delay((duration + 1) * SECONDS_IN_MILLI_SECONDS);
  // As I wrote this on 15.07.2018 the duration + 1 seemed to be appropriate. Now I'm not so sure about that.
  // TODO: investigate

  createNotification("Start stroking again");

  setStrokeSpeed(getRandomStrokeSpeed());
  if (style !== StrokeStyleEnum.handsOff) {
    await setStrokeStyle(style);
  } // else the caller has to take care!
  await delay(SECONDS_IN_MILLI_SECONDS);

};
handsOff.label = "Hands Off";

export default handsOff;
