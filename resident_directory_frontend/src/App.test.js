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

  fireEvent.click(screen.getByRole("button", { name: /view details for mina patel/i }));
  expect(screen.getByText("Unit 4A")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /close resident details/i })).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: /close resident details/i }));
  expect(screen.queryByText("Unit 4A")).not.toBeInTheDocument();
});
