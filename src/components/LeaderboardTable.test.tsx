import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { LeaderboardPage } from "@/components/LeaderboardPage";

describe("LLM Leaderboard UI", () => {
  it("renders hero, metrics, podium, and global ranking by default", async () => {
    render(<LeaderboardPage />);

    expect(
      await screen.findByRole("heading", { name: "Steganography Algorithm Leaderboard" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Start Exploring →" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Agentic" })).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: "Your Metrics" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Leaderboard Winners" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Global Ranking" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "About StegoEval Leaderboard" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Contact" })).toBeInTheDocument();
    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeInTheDocument();
    const contactCta = screen.getByRole("link", { name: "View StegoEval Repository" });
    expect(contactCta).toHaveAttribute(
      "href",
      "https://github.com/uttufy/StegoEval"
    );
    expect(contactCta).toHaveClass("contact-link-cta");
    expect(within(footer).getByRole("link", { name: "github.com/uttufy/StegoEval" })).toHaveAttribute(
      "href",
      "https://github.com/uttufy/StegoEval"
    );
  });

  it("shows global ranking controls", async () => {
    render(<LeaderboardPage />);

    await screen.findByRole("heading", { name: "Global Ranking" });
    expect(screen.getByLabelText("Ranking controls")).toBeInTheDocument();
    expect(screen.getByRole("searchbox", { name: "Search algorithms" })).toBeInTheDocument();
  });

  it("filters by dataset profile search", async () => {
    const user = userEvent.setup();
    render(<LeaderboardPage />);

    await screen.findByRole("heading", { name: "Global Ranking" });
    await user.type(screen.getByRole("searchbox", { name: "Search algorithms" }), "bossbase");

    const table = screen.getByRole("table", { name: /global ranking table/i });
    expect(within(table).getAllByText(/BOSSBase/).length).toBeGreaterThan(0);
  });

  it("updates ordering when sort key and direction change", async () => {
    const user = userEvent.setup();
    render(<LeaderboardPage />);

    await screen.findByRole("heading", { name: "Global Ranking" });
    await user.selectOptions(screen.getByLabelText("Sort key"), "payloadBpp");
    await user.selectOptions(screen.getByLabelText("Sort direction"), "asc");

    const table = screen.getByRole("table", { name: /global ranking table/i });
    const rows = within(table).getAllByRole("row");
    expect(rows.length).toBeGreaterThan(1);
  });

  it("shows empty state when search has no match", async () => {
    const user = userEvent.setup();
    render(<LeaderboardPage />);

    await screen.findByRole("heading", { name: "Global Ranking" });
    await user.type(screen.getByRole("searchbox", { name: "Search algorithms" }), "no-such-algorithm");

    expect(
      screen.getByText("No algorithms match your search. Try an algorithm or dataset profile.")
    ).toBeInTheDocument();
  });

  it("renders trend badges in global ranking rows", async () => {
    render(<LeaderboardPage />);

    await screen.findByRole("heading", { name: "Global Ranking" });

    const table = screen.getByRole("table", { name: /global ranking table/i });
    expect(within(table).getAllByLabelText(/Trend/).length).toBeGreaterThan(0);
  });
});
