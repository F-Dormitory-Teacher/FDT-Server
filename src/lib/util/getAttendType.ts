import AttendType from "../../enum/AttendType";
import attendTime from "../attendTime";

export default (): AttendType | boolean => {
  const today = new Date();

  let type: AttendType;

  const isMorning = attendTime.MORNING_START_TIME <= today.getHours();
  const isNight = attendTime.NIGHT_START_TIME <= today.getHours();

  if (isMorning) {
    type = AttendType.MORNING;
  } else if (isNight) {
    type = AttendType.NIGHT;
  } else {
    return false;
  }

  return type;
};
