import { render, screen } from "@/utils/test-utils";

import HomeView from "..";

describe("HomeView", () => {
  it("renders correctly all buttons as links", async () => {
    render(<HomeView />, {
      user: {
        last_edited_project_id: 133,
      },
    });

    expect(await screen.findByRole("link", { name: "home.continue_editing" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "home.create_new_edition" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "home.go_to_library" })).toBeInTheDocument();
    expect(await screen.findByRole("link", { name: "home.manage_users" })).toBeInTheDocument();
  });

  it("does not render manage users link when not admin", async () => {
    render(<HomeView />, {
      user: {
        last_edited_project_id: 133,
        role: undefined,
      },
    });

    expect(await screen.findByRole("link", { name: "home.continue_editing" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "home.create_new_edition" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "home.go_to_library" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "home.manage_users" })).not.toBeInTheDocument();
  });

  it("does not render continue editing link when last_edited_project is null", async () => {
    render(<HomeView />);

    expect(await screen.findByRole("link", { name: "home.manage_users" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "home.create_new_edition" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "home.go_to_library" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "home.continue_editing" })).not.toBeInTheDocument();
  });
});
