import { MeetingType } from "../types";
import { CreateMeetingDto } from "./meetings";
import { validateOrReject } from "class-validator";

const getSampleCreateMeetingDto = () => {
  let createMeetingDto = new CreateMeetingDto();
  createMeetingDto.name = "My Meeting";
  createMeetingDto.dates = ["2021-01-01T00:00:00.000Z", "2021-01-02T00:00:00.000Z"];
  createMeetingDto.type = MeetingType.dateType;
  createMeetingDto.password = "1234";

  return createMeetingDto;
};

describe("CreateMeetingDto field validation", () => {
  it("Rejects if name length is 0", async () => {
    let meeting = getSampleCreateMeetingDto();
    meeting.name = "";

    await expect(validateOrReject(meeting)).rejects.toBeTruthy();
  });
  it("Rejects dates array length is 0", async () => {
    let meeting = getSampleCreateMeetingDto();
    meeting.dates = [];

    await expect(validateOrReject(meeting)).rejects.toBeTruthy();
  });
  it("Rejects if dates are not an ISO8601 strings", async () => {
    let meeting = getSampleCreateMeetingDto();
    meeting.dates = ["2021/01/01"];

    await expect(validateOrReject(meeting)).rejects.toBeTruthy();
  });
  it('Rejects if type is not "date" or "meal"', async () => {
    let meeting = getSampleCreateMeetingDto();
    (meeting.type as any) = "invalid";

    await expect(validateOrReject(meeting)).rejects.toBeTruthy();
  });
  it("Rejects if password is not a 4 digit number", async () => {
    let meeting = getSampleCreateMeetingDto();
    meeting.password = "123";

    await expect(validateOrReject(meeting)).rejects.toBeTruthy();
  });
});
