import { joinDropdownChoices } from "@/utils/join-dropdown-choices";

describe("joinDropdownChoices", () => {
  const prompt = "Prompt text";

  it("when no options selected", () => {
    const options = [
      { label: "Option 1", value: "option1", selected: false },
      { label: "Option 2", value: "option2", selected: false },
      { label: "Option 3", value: "option3", selected: false },
    ];

    expect(joinDropdownChoices(options, prompt)).toEqual(prompt);
  });

  it("when some options selected", () => {
    const options = [
      { label: "Option 1", value: "option1", selected: false },
      { label: "Option 2", value: "option2", selected: true },
      { label: "Option 3", value: "option3", selected: true },
    ];

    expect(joinDropdownChoices(options, prompt)).toEqual("Option 2, Option 3");
  });
});
