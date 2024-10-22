function checkStringLength(str, maxLength) {
  return str.length <= maxLength;
}

function isPalindrome(str) {
  const normalizedStr = str.replaceAll(' ', '').toLowerCase();
  let reversedStr = '';

  for (let i = normalizedStr.length - 1; i >= 0; i--) {
    reversedStr += normalizedStr[i];
  }

  return normalizedStr === reversedStr;
}

function checkMeetingTime(workStart, workEnd, meetingStart, meetingDuration) {
  const [workStartHour, workStartMin] = workStart.split(':').map(Number);
  const [workEndHour, workEndMin] = workEnd.split(':').map(Number);
  const [meetingStartHour, meetingStartMin] = meetingStart.split(':').map(Number);

  const workStartTimeInMinutes = workStartHour * 60 + workStartMin;
  const workEndTimeInMinutes = workEndHour * 60 + workEndMin;
  const meetingStartTimeInMinutes = meetingStartHour * 60 + meetingStartMin;
  const meetingEndTimeInMinutes = meetingStartTimeInMinutes + meetingDuration;

  return meetingStartTimeInMinutes >= workStartTimeInMinutes &&
         meetingEndTimeInMinutes <= workEndTimeInMinutes;
}

