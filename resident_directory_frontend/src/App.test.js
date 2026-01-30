import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";

test("renders resident directory header and search", () => {
  render(<App />);
  expect(screen.getByText(/resident directory/i)).toBeInTheDocument();
  expect(
    screen.getByPlaceholderText(/search by name, unit, or email/i)
  ).toBeInTheDocument();
});

test("filters residents by search query", () => {
  render(<App />);

  // Baseline: multiple residents shown.
  expect(screen.getByText("Avery Johnson")).toBeInTheDocument();
  expect(screen.getByText("Mina Patel")).toBeInTheDocument();

  const input = screen.getByPlaceholderText(/search by name, unit, or email/i);
  fireEvent.change(input, { target: { value: "Mina" } });

  expect(screen.getByText("Mina Patel")).toBeInTheDocument();
  expect(screen.queryByText("Avery Johnson")).not.toBeInTheDocument();
});

test("opens and closes resident details", () => {
  render(<App />);

  fireEvent.click(
    screen.getByRole("button", { name: /view details for mina patel/i })
  );

  // Details should render either as a modal dialog (mobile) or as a side panel (desktop).
  expect(
    screen.queryByRole("dialog", { name: /resident details for mina patel/i }) ||
      screen.getByLabelText(/resident details panel/i)
  ).toBeInTheDocument();

  fireEvent.click(
    screen.getByRole("button", { name: /close resident details/i })
  );

  // After close, neither dialog nor panel should be present.
  expect(
    screen.queryByRole("dialog", { name: /resident details for mina patel/i })
  ).not.toBeInTheDocument();
  expect(screen.queryByLabelText(/resident details panel/i)).not.toBeInTheDocument();
});
