import { MockToastProvider, render, screen } from "@/utils/test-utils";

import { toast } from "..";

const mockMessage = "Toasted!";

describe("Toast", () => {
  it("renders correctly in success variant", async () => {
    render(<MockToastProvider />);

    toast.success(mockMessage);

    expect(await screen.findByText(mockMessage));
  });

  it("renders correctly in info variant", async () => {
    render(<MockToastProvider />);

    toast.info(mockMessage);

    expect(await screen.findByText(mockMessage));
  });

  it("renders correctly in warn variant", async () => {
    render(<MockToastProvider />);

    toast.warn(mockMessage);

    expect(await screen.findByText(mockMessage));
  });

  it("renders correctly in error variant", async () => {
    render(<MockToastProvider />);

    toast.error(mockMessage);

    expect(await screen.findByText(mockMessage));
  });
});
