import store from "store";
import moment from "moment";
import { getRandomStrokeSpeed } from "game/utils/strokeSpeed";
import { getRandomInclusiveInteger } from "utils/math";

export default () => {
  store.game = {
    startTime: new moment(),
    pictures: [],
    pictureIndex: -1,
    mediaPlayerUrl: null,
    mediaFrozen: false,
    strokeSpeed: getRandomStrokeSpeed(),
    actualGameTime: getRandomInclusiveInteger(store.config.minimumGameTime, store.config.maximumGameTime),
    bookmarks: [],
    gripStrength: store.config.initialGripStrength,
    rubberBands: 0,
    clothespins: 0,
    cockAndBallsBound: false,
    ruins: 0,
    edges: 0,
    orgasms: 0,
    strokes: 0,
    strokeWave: [],
    strokeStyle: store.config.defaultStrokeStyle,
    buttPlugInserted: false,

    // orgasm
    orgasm: false,
    // even if only chosen orgasm one may be denied in the end
    chanceForDenial: 0, //percent
    // edging Ladder
    edgingLadder: false,
    edgingLadderLength: 2,
    edgingLadderRung: 0,
    edgingLadderCooldowns: 1,  //every 4 ladder edges one long cooldown is required
  };
};
