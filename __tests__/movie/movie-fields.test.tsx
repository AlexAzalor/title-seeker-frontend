import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import messages from "../../messages/en.json";
import {
  MovieFieldsEditor,
  parseMovieDuration,
} from "@/components/movie/movie-page/edit/movie-fields";

const mocks = vi.hoisted(() => ({
  load: vi.fn(),
  title: vi.fn(),
  details: vi.fn(),
  refresh: vi.fn(),
  success: vi.fn(),
  error: vi.fn(),
}));

vi.mock("@/app/(app)/services/admin-api", () => ({
  getMovieEditFields: mocks.load,
  editMovieTitle: mocks.title,
  editMovieDetails: mocks.details,
}));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: mocks.refresh }),
}));
vi.mock("sonner", () => ({
  toast: { success: mocks.success, error: mocks.error },
}));
vi.mock("@/components/my-custom-ui/custom-modal", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

const fields = {
  title_en: "English title",
  title_uk: "Ukrainian title",
  location_en: "London",
  location_uk: "Лондон",
  duration: "2h 22m",
  release_date: "2001-12-19T13:14:15Z",
};

function renderEditor(kind: "title" | "details") {
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <MovieFieldsEditor movieKey="film" kind={kind} />
    </NextIntlClientProvider>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.load.mockResolvedValue({ status: 200, data: fields });
  mocks.title.mockResolvedValue({ status: 200, message: "Updated" });
  mocks.details.mockResolvedValue({ status: 200, message: "Updated" });
});
afterEach(cleanup);

describe("movie field editing", () => {
  test("loads both titles, validates, submits and refreshes", async () => {
    renderEditor("title");
    fireEvent.click(screen.getByRole("button", { name: "Edit title" }));
    const en = await screen.findByLabelText("Title (en)");
    const uk = screen.getByLabelText("Title (uk)");
    expect((en as HTMLInputElement).value).toBe("English title");
    expect((uk as HTMLInputElement).value).toBe("Ukrainian title");
    fireEvent.change(en, { target: { value: "  " } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    await screen.findByText("Title EN is required");
    expect(mocks.title).not.toHaveBeenCalled();
    fireEvent.change(en, { target: { value: " New title " } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() =>
      expect(mocks.title).toHaveBeenCalledWith({
        movie_key: "film",
        title_en: "New title",
        title_uk: "Ukrainian title",
      }),
    );
    await waitFor(() => expect(mocks.refresh).toHaveBeenCalledOnce());
    expect(screen.queryByLabelText("Title (en)")).toBeNull();
  });

  test("submits all details and preserves the original timestamp when the date is unchanged", async () => {
    renderEditor("details");
    fireEvent.click(screen.getByRole("button", { name: "Edit details" }));
    const duration = await screen.findByLabelText("Duration (in minutes)");
    expect((duration as HTMLInputElement).value).toBe("142");
    expect(
      (screen.getByLabelText("Location (uk)") as HTMLInputElement).value,
    ).toBe("Лондон");
    fireEvent.change(duration, { target: { value: "145" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() =>
      expect(mocks.details).toHaveBeenCalledWith({
        movie_key: "film",
        release_date: "2001-12-19T13:14:15.000Z",
        duration: 145,
        location_en: "London",
        location_uk: "Лондон",
      }),
    );
    await waitFor(() => expect(mocks.refresh).toHaveBeenCalledOnce());
  });

  test("converts a changed release date to ISO and reports save errors without refreshing", async () => {
    mocks.details.mockResolvedValue({ status: 500, message: "Save failed" });
    renderEditor("details");
    fireEvent.click(screen.getByRole("button", { name: "Edit details" }));
    const date = await screen.findByLabelText("Release date");
    fireEvent.change(date, { target: { value: "2002-01-02" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() =>
      expect(mocks.details).toHaveBeenCalledWith(
        expect.objectContaining({
          release_date: "2002-01-02T00:00:00.000Z",
        }),
      ),
    );
    expect(mocks.error).toHaveBeenCalledWith("Save failed");
    expect(mocks.refresh).not.toHaveBeenCalled();
    expect(screen.getByLabelText("Release date")).toBeDefined();
  });

  test("requires a duration when the display format cannot be decoded", async () => {
    mocks.load.mockResolvedValue({
      status: 200,
      data: { ...fields, duration: "unknown" },
    });
    renderEditor("details");
    fireEvent.click(screen.getByRole("button", { name: "Edit details" }));
    await screen.findByRole("status");
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    await screen.findByText("Value is required");
    expect(mocks.details).not.toHaveBeenCalled();
  });

  test("rejects fractional duration", async () => {
    renderEditor("details");
    fireEvent.click(screen.getByRole("button", { name: "Edit details" }));
    const duration = await screen.findByLabelText("Duration (in minutes)");
    fireEvent.change(duration, { target: { value: "1.5" } });
    fireEvent.submit(duration.closest("form")!);
    await screen.findByText("Value must be a whole number");
    expect(mocks.details).not.toHaveBeenCalled();
  });

  test("reports loading failures", async () => {
    mocks.load.mockResolvedValue({ status: 403, message: "Forbidden" });
    renderEditor("title");
    fireEvent.click(screen.getByRole("button", { name: "Edit title" }));
    await waitFor(() => expect(mocks.error).toHaveBeenCalledWith("Forbidden"));
    expect(screen.queryByLabelText("Title (en)")).toBeNull();
  });

  test("only parses recognized durations", () => {
    expect(parseMovieDuration("142")).toBe(142);
    expect(parseMovieDuration("2h 22m")).toBe(142);
    expect(parseMovieDuration("2h")).toBe(120);
    expect(parseMovieDuration("2h 99m")).toBeUndefined();
    expect(parseMovieDuration("unknown")).toBeUndefined();
  });
});
