import { mockedUser } from "../tests-related/mocks/data/mocked.user.data";
import { mockGapiCurrentUser } from "../tests-related/mocks/gapi/auth2.current.user.mock";
import { asPlainObject } from "./conversion.logic";

describe("asPlainObject function", () => {
  it("should return a plain user", () => {
    const basicProfileMock = mockGapiCurrentUser(mockedUser)
      .get()
      .getBasicProfile();

    const user = asPlainObject(basicProfileMock);

    expect(user).toEqual(mockedUser);
  });
});
