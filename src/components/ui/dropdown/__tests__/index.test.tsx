import React from "react";

import { render, screen, userEvent } from "@/utils/test-utils";

let id = 0;

const mockUseId = () => `${id++}`;
const resetMockUseId = () => (id = 0);

jest.spyOn(React, "useId").mockImplementation(mockUseId);

import { joinDropdownChoices } from "@/utils/join-dropdown-choices";

import Dropdown, { DropdownItem } from "..";

const label = "Dropdown label";
const prompt = "Select options";
const options = [
  { label: "Option 1", value: "option1", selected: false },
  { label: "Option 2", value: "option2", selected: false },
  { label: "Option 3", value: "option3", selected: false },
  { label: "Option 4", value: "option4", selected: false },
];

const markOptionsSelected = (indexes: number[]) =>
  options.map((option, index) => ({
    ...option,
    selected: indexes.includes(index),
  }));

describe("Dropdown", () => {
  it("is focusable", () => {
    const user = userEvent.setup();

    render(
      <Dropdown label={label} prompt={prompt} multiple>
        {options.map((option, index) => (
          <DropdownItem
            key={index}
            label={option.label}
            value={option.value}
            selected={option.selected}
          />
        ))}
      </Dropdown>,
    );
    user.keyboard("[Tab]");
    expect(screen.getByTestId("dropdown-wrapper")).toEqual(document.activeElement);
  });

  it("renders closed initially", () => {
    render(
      <Dropdown label={label} prompt={prompt} multiple>
        {options.map((option, index) => (
          <DropdownItem
            key={index}
            label={option.label}
            value={option.value}
            selected={option.selected}
          />
        ))}
      </Dropdown>,
    );

    const optionsNodes = screen.queryAllByText(/Option [0-9]/);
    const promptElement = screen.getByText(prompt);

    optionsNodes.forEach(option => expect(option).not.toBeVisible());
    expect(promptElement).toBeVisible();
  });

  it("lists selected options instead of prompt", () => {
    const optionsWithSelection = markOptionsSelected([0, 1]);

    render(
      <Dropdown label={label} prompt={prompt} multiple>
        {optionsWithSelection.map((option, index) => (
          <DropdownItem
            key={index}
            label={option.label}
            value={option.value}
            selected={option.selected}
          />
        ))}
      </Dropdown>,
    );

    const displayedValueElement = screen.getByText(joinDropdownChoices(optionsWithSelection, ""));

    expect(displayedValueElement).toBeInTheDocument();
  });

  it("opens options when clicked", async () => {
    const user = userEvent.setup();

    render(
      <Dropdown label={label} prompt={prompt} multiple>
        {options.map((option, index) => (
          <DropdownItem
            key={index}
            label={option.label}
            value={option.value}
            selected={option.selected}
          />
        ))}
      </Dropdown>,
    );

    await user.click(screen.getByText(prompt));

    const optionsNodes = screen.queryAllByText(/Option [0-9]/);
    const value = screen.getByText(prompt);

    optionsNodes.forEach(option => expect(option).toBeVisible());
    expect(value).not.toBeVisible();
  });

  it("opens options when focused and Spacebar is pressed", () => {
    const user = userEvent.setup();

    render(
      <Dropdown label={label} prompt={prompt} multiple>
        {options.map((option, index) => (
          <DropdownItem
            key={index}
            label={option.label}
            value={option.value}
            selected={option.selected}
          />
        ))}
      </Dropdown>,
    );

    user.keyboard("[Tab]");
    user.keyboard("[Space]");

    const optionsNodes = screen.queryAllByText(/Option [0-9]/);
    const value = screen.getByText(prompt);

    optionsNodes.forEach(option => expect(option).toBeVisible());
    expect(value).not.toBeVisible();
  });

  it("when open it allows selecting option by clicking on it", async () => {
    const user = userEvent.setup();
    const optionsWithSelection = markOptionsSelected([0, 1]);

    render(
      <Dropdown label={label} prompt={prompt} multiple>
        {options.map((option, index) => (
          <DropdownItem
            key={index}
            label={option.label}
            value={option.value}
            selected={option.selected}
          />
        ))}
      </Dropdown>,
    );

    await user.click(screen.getByText(prompt));
    await user.click(screen.getByText(options[0].label));
    await user.click(screen.getByText(options[1].label));
    await user.click(global.document.body);

    const optionsNodes = screen.queryAllByText(/^Option [0-9]$/);
    const value = screen.getByText(joinDropdownChoices(optionsWithSelection, ""));

    optionsNodes.forEach(option => expect(option).not.toBeVisible());
    expect(value).toBeVisible();
  });

  it("when open it allows selecting option by arrow + space", async () => {
    const user = userEvent.setup();
    const optionsWithSelection = markOptionsSelected([0, 1]);

    render(
      <Dropdown label={label} prompt={prompt} multiple>
        {options.map((option, index) => (
          <DropdownItem
            key={index}
            label={option.label}
            value={option.value}
            selected={option.selected}
          />
        ))}
      </Dropdown>,
    );

    await user.click(screen.getByText(prompt));
    await user.keyboard("[Space]");
    await user.keyboard("[ArrowDown]");
    await user.keyboard("[Space]");
    await user.click(global.document.body);

    const optionsNodes = screen.queryAllByText(/^Option [0-9]$/);
    const value = screen.getByText(joinDropdownChoices(optionsWithSelection, ""));

    optionsNodes.forEach(option => expect(option).not.toBeVisible());
    expect(value).toBeVisible();
  });

  describe("single-choice dropdown", () => {
    beforeEach(() => resetMockUseId());

    describe("with selection", () => {
      it("renders unchanged", () => {
        const optionsWithSelection = markOptionsSelected([1]);
        const { container } = render(
          <Dropdown label="Options dropdown">
            {optionsWithSelection.map((option, index) => (
              <DropdownItem
                key={index}
                label={option.label}
                value={option.value}
                selected={option.selected}
              />
            ))}
          </Dropdown>,
        );

        expect(container).toMatchSnapshot();
      });
    });

    describe("without selection", () => {
      it("renders unchanged with prompt", () => {
        const { container } = render(
          <Dropdown label="Options dropdown" prompt="Pick one">
            {options.map((option, index) => (
              <DropdownItem
                key={index}
                label={option.label}
                value={option.value}
                selected={option.selected}
              />
            ))}
          </Dropdown>,
        );

        expect(container).toMatchSnapshot();
      });

      it("renders unchanged without prompt", () => {
        const { container } = render(
          <Dropdown label="Options dropdown">
            {options.map((option, index) => (
              <DropdownItem
                key={index}
                label={option.label}
                value={option.value}
                selected={option.selected}
              />
            ))}
          </Dropdown>,
        );

        expect(container).toMatchSnapshot();
      });
    });
  });

  describe("multi-choice dropdown", () => {
    beforeEach(() => resetMockUseId());

    describe("with selection", () => {
      it("renders unchanged", () => {
        const { container } = render(
          <Dropdown label="Options dropdown" multiple>
            {options.map((option, index) => (
              <DropdownItem
                key={index}
                label={option.label}
                value={option.value}
                selected={option.selected}
              />
            ))}
          </Dropdown>,
        );

        expect(container).toMatchSnapshot();
      });
    });

    describe("without selection", () => {
      it("renders unchanged with prompt", () => {
        const { container } = render(
          <Dropdown label="Options dropdown" prompt="Pick multiple" multiple>
            {options.map((option, index) => (
              <DropdownItem
                key={index}
                label={option.label}
                value={option.value}
                selected={option.selected}
              />
            ))}
          </Dropdown>,
        );

        expect(container).toMatchSnapshot();
      });

      it("renders unchanged without prompt", () => {
        const { container } = render(
          <Dropdown label="Options dropdown" multiple>
            {options.map((option, index) => (
              <DropdownItem
                key={index}
                label={option.label}
                value={option.value}
                selected={option.selected}
              />
            ))}
          </Dropdown>,
        );

        expect(container).toMatchSnapshot();
      });
    });
  });
});
