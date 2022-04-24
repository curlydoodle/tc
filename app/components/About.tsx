import { useState } from "react";
import { Portal } from "react-portal";
import type {
  CallBackProps,
  Step,
  Placement,
  TooltipRenderProps,
} from "react-joyride";
import Joyride, { ACTIONS, EVENTS, STATUS } from "react-joyride";

const defaultStepProps = {
  disableBeacon: true,
  placement: "right" as Placement,
  floaterProps: {
    disableAnimation: true,
  },
};

export const defaultSteps: Step[] = [
  {
    ...defaultStepProps,
    target: ".title-section",
    content: (
      <>
        <p>
          The term <strong>Total Compensation</strong> captures all the
          different ways you are financially compensated by your employer: base
          salary, bonus, equity, benefits, etc.
        </p>
        <p className="mt-2">
          Because of the differences in these forms of compensation, it can be
          hard to know ahead of time what compensation package is truly paying
          you.
        </p>
        <p className="mt-2 font-bold text-emerald-500">
          This calculator tries to normalize all these differences into numbers
          you can truly understand (at a private or public company)
        </p>
      </>
    ),
  },
  {
    ...defaultStepProps,
    target: ".cash-section",
    content: (
      <>
        <p>
          Cash compensation is the simplest category to understand because it's
          what gets directly deposited into your bank account.
        </p>
        <p className="mt-4 text-xs uppercase text-slate-400">
          Types of cash compensation:
        </p>
        <ul>
          <li className="mt-2">
            <strong>Base Salary</strong> - amount of money you receive just for
            being employed (regardless of the performance of the company or your
            performance)
          </li>
          <li className="mt-2">
            <strong>Bonuses</strong> - a single lump sum of cash (sometimes it's
            a yearly bonus, other times it could be a one time bonus at certain
            milestones)
          </li>
        </ul>
      </>
    ),
  },
  {
    ...defaultStepProps,
    target: ".equity-section",
    content: (
      <>
        <p>
          Equity compensation is more complex because it's difficult to get the
          exact dollar value of your equity.
        </p>
      </>
    ),
  },
  {
    ...defaultStepProps,
    target: ".equity-value-section",
    content: (
      <>
        <p>We can estimate the value of your equity in a few ways:</p>
      </>
    ),
  },
];

export const useAbout = () => {
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [steps] = useState(defaultSteps);

  const handleJoyrideCallback = ({
    action,
    index,
    type,
    status,
  }: CallBackProps) => {
    if (
      action === ACTIONS.CLOSE ||
      ([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)
    ) {
      setRun(false);
      setStepIndex(0);
    } else if (
      ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND] as string[]).includes(type)
    ) {
      const stepIndex = index + (action === ACTIONS.PREV ? -1 : 1);
      setStepIndex(stepIndex);
    }
  };

  return {
    run,
    setRun,
    stepIndex,
    setStepIndex,
    steps,
    handleJoyrideCallback,
  };
};

const Tooltip = ({
  index,
  step,
  backProps,
  primaryProps,
  tooltipProps,
  isLastStep,
}: TooltipRenderProps) => (
  <div
    className="text-slate-200 text-sm shadow-xl bg-black rounded p-6 max-w-sm"
    {...tooltipProps}
  >
    {step.title && (
      <h1 className="text-2xl font-bold leading-6 text-slate-50 mb-5">
        {step.title}
      </h1>
    )}
    {step.content}
    <footer className="mt-5 flex items-center justify-between">
      <div className="flex gap-1">
        {defaultSteps.map((_s, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full border border-slate-200 ${
              i === index ? "bg-slate-200" : "bg-transparent"
            }`}
            aria-hidden="true"
          />
        ))}
      </div>
      <div>
        {index > 0 && (
          <button
            className="inline-flex items-center px-4 py-1.5 text-xs font-medium rounded text-emerald-600"
            type="button"
            {...backProps}
          >
            Back
          </button>
        )}
        <button
          className="inline-flex items-center px-4 py-1.5 text-xs font-medium rounded text-emerald-100 bg-emerald-900 hover:bg-emerald-700"
          type="button"
          {...primaryProps}
        >
          {isLastStep ? "Done" : "Next"}
        </button>
      </div>
    </footer>
  </div>
);

type Props = ReturnType<typeof useAbout>;

export const About = ({
  run,
  stepIndex,
  steps,
  handleJoyrideCallback,
}: Props) => (
  <Portal>
    <Joyride
      continuous
      tooltipComponent={Tooltip}
      callback={handleJoyrideCallback}
      run={run}
      stepIndex={stepIndex}
      steps={steps}
      styles={{
        options: {
          arrowColor: "transparent",
        },
      }}
    />
  </Portal>
);
