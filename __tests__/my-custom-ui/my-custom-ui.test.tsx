import { expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import type { FieldValues, UseFormRegister } from "react-hook-form";

import { ThemeProvider } from "next-themes";
import { Language, SortBy, SortOrder } from "@/orval_api/model";
import { NextIntlClientProvider } from "next-intl";
import messages from "../../messages/en.json";

import { FormButtons } from "@/components/my-custom-ui/form-ui-parts/form-buttons";
import { FormField } from "@/components/my-custom-ui/form-ui-parts/form-field";
import { FormStep } from "@/components/my-custom-ui/form-ui-parts/form-step";
import { FormWrapper } from "@/components/my-custom-ui/form-ui-parts/form-wrapper";
import { PaginationContoller } from "@/components/my-custom-ui/pagination/pagination-contoller";
import { SignOut } from "@/components/my-custom-ui/sign-out";
import { ActorsCarousel } from "@/components/actors-carousel";
import { ExpandableText } from "@/components/my-custom-ui/expandable-text";
import { Spinner } from "@/components/my-custom-ui/spinner";
import { MovieMoney } from "@/components/movie/movie-page/movie-money";
import { RateSlider } from "@/components/movie/rating/rate-slider";
import { ResponsiveWrapper } from "@/components/my-custom-ui/responsive-wrapper";
import { TooltipWrapper } from "@/components/my-custom-ui/tooltip-wrapper";
import { SortingControls } from "@/components/my-custom-ui/pagination/sorting-controls";
import { SessionProvider } from "next-auth/react";

const ProjectProviders = ({ children }: PropsWithChildren) => (
  <ThemeProvider
    attribute="class"
    defaultTheme="light"
    enableSystem
    disableTransitionOnChange
  >
    <NextIntlClientProvider messages={messages} locale="en">
      <SessionProvider session={null}>{children}</SessionProvider>
    </NextIntlClientProvider>
  </ThemeProvider>
);

test("Should render SignOut", () => {
  const buttonName = "Test Sign out";
  render(<SignOut name={buttonName} />, {
    wrapper: ProjectProviders,
  });

  expect(screen.getByText(buttonName)).toBeDefined();
});

test("Should render PaginationContoller", () => {
  render(
    <PaginationContoller
      currentPage={1}
      pageSize={1}
      sortBy={SortBy.id}
      sortOrder={SortOrder.asc}
      totalPages={1}
      uriKey="test"
      query="test"
    />,
    {
      wrapper: ProjectProviders,
    },
  );

  expect(screen.getByLabelText("pagination")).toBeDefined();
});

test("Should render ActorsCarousel", () => {
  render(<ActorsCarousel actors={[]} avatarURL="test" lang={Language.en} />, {
    wrapper: ProjectProviders,
  });

  expect(screen.getByLabelText("actors-carousel")).toBeDefined();
});

test("Should render FormButtons", async () => {
  const buttonName = "Test form buttons";
  render(<FormButtons title={buttonName} />, {
    wrapper: ProjectProviders,
  });

  expect(screen.getByText(buttonName)).toBeDefined();
});

test("Should render FormField", async () => {
  const register: UseFormRegister<FieldValues> = vi.fn();
  const labelName = "Test form field";
  render(
    <FormField
      label={labelName}
      name="test"
      register={register}
      type="text"
      error={undefined}
    />,
    {
      wrapper: ProjectProviders,
    },
  );

  expect(screen.getByText(labelName)).toBeDefined();
});

test("Should render FormStep", () => {
  const title = "Test form step";
  render(
    <FormStep
      completedSteps={[1, 2]}
      currentStep={3}
      step={1}
      title={title}
      goToStep={() => {}}
    />,
    {
      wrapper: ProjectProviders,
    },
  );

  expect(screen.getByText(title)).toBeDefined();
});

test("Should render FormWrapper", () => {
  const title = "Test form wrapper";
  const childrenContent = "Test children content";
  render(
    <FormWrapper isSubmitting={false} onSubmit={() => {}} buttonTitle={title}>
      <h1>{childrenContent}</h1>
    </FormWrapper>,
    {
      wrapper: ProjectProviders,
    },
  );

  expect(screen.getByText(title)).toBeDefined();
  expect(
    screen.getByRole("heading", { level: 1, name: childrenContent }),
  ).toBeDefined();
});

test("Should render Spinner", async () => {
  render(<Spinner />);
  expect(screen.getByLabelText("spinner")).toBeDefined();
});

test("Should render ExpandableText", async () => {
  const text = "Test expandable text";
  render(<ExpandableText text={text} />);
  expect(screen.getByText(text)).toBeDefined();
});

test("Should render MovieMoney", () => {
  const budget = "100";
  const domesticGross = "200";
  const worldwideGross = "300";
  render(
    <MovieMoney
      budget={budget}
      domesticGross={domesticGross}
      worldwideGross={worldwideGross}
    />,
    {
      wrapper: ProjectProviders,
    },
  );

  expect(screen.getByText(budget)).toBeDefined();
  expect(screen.getByText(domesticGross)).toBeDefined();
  expect(screen.getByText(worldwideGross)).toBeDefined();
});

test("Should render RateSlider", () => {
  const title = "Test slider";
  render(
    <RateSlider
      defaultValue={50}
      max={100}
      onValueChange={() => {}}
      showValue
      title={title}
      type="acting"
      value={70}
    />,
    {
      wrapper: ProjectProviders,
    },
  );

  expect(screen.getByText(title)).toBeDefined();
});

test("Should render ResponsiveWrapper", async () => {
  const title = "Test wrapper";
  render(
    <ResponsiveWrapper title={title}>
      <h1>Test children</h1>
    </ResponsiveWrapper>,
  );
  expect(screen.getByText(title)).toBeDefined();
});

test("Should render TooltipWrapper", async () => {
  render(
    <TooltipWrapper content="Test title tooltip">
      <h1>Test tooltip content</h1>
    </TooltipWrapper>,
  );

  expect(screen.getByText("Test tooltip content")).toBeDefined();
  expect(
    screen.getByRole("heading", { level: 1, name: "Test tooltip content" }),
  ).toBeDefined();
});

test("Should render SortingControls", () => {
  const content = "Test sorting controls";
  render(
    <SortingControls
      currentPage={1}
      pageSize={10}
      query="test"
      sortBy={SortBy.id}
      sortByID={false}
      sortOrder={SortOrder.asc}
      uriKey="test"
    >
      <h1>{content}</h1>
    </SortingControls>,
    { wrapper: ProjectProviders },
  );

  expect(screen.getByText(content)).toBeDefined();
});
