import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import Select, { components } from "react-select";
import { Modal } from "~/components/Modal";
import { FormField } from "~/components/FormField";
import type { OptionProps, MultiValue } from "react-select";
import type { Props as ModalProps } from "~/components/Modal";
import type { CompHooksType } from "~/lib/comp";

type Props = {
  shareType: CompHooksType["shareType"];
  shareCalcType: CompHooksType["shareCalcType"];
} & Omit<ModalProps, "title" | "children">;

const Option = ({ children, ...rest }: OptionProps<any>) => {
  return (
    <components.Option {...rest}>
      <span className="mr-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-slate-800">
        {rest.data.symbol}
      </span>
      <span>{children}</span>
    </components.Option>
  );
};

export const CompModal = ({
  isOpen,
  closeModal,
  openModal,
  shareType,
  shareCalcType,
}: Props) => {
  const [view, setView] = useState("estimate");

  const search = useFetcher();
  const companies = useFetcher();

  const loadOptions = (value: string) => {
    if (value) search.load(`/api/search?q=${value}`);
  };

  const loadCompaniesData = (selected: MultiValue<any>) => {
    if (selected.length) {
      const query = selected.map((s) => s.symbol).join(",");
      companies.load(`/api/stock?s=${query}`);
    }
  };

  console.log("companies:", companies);

  const isoCurrent = shareType === "iso" && shareCalcType == "current";
  const rsuCurrent = shareType === "rsu" && shareCalcType == "current";
  const isoRevenue = shareType === "iso" && shareCalcType == "revenue";
  const rsuRevenue = shareType === "rsu" && shareCalcType == "revenue";

  return (
    <Modal
      isOpen={isOpen}
      openModal={openModal}
      closeModal={closeModal}
      title={
        <div className="flex justify-between items-end">
          <h1>
            {view === "estimate" ? "Estimate Equity Value" : "Terminology"}
          </h1>
          <span className="relative z-0 inline-flex shadow-sm rounded-md">
            <button
              type="button"
              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-600 bg-black text-sm hover:bg-emerald-900 focus:z-10 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 ${
                view === "estimate" ? "bg-slate-800" : ""
              }`}
              onClick={() => setView("estimate")}
            >
              <span className="sr-only">Estimate Equity Value</span>
              <svg
                className="w-3 h-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" y1="21" x2="4" y2="14"></line>
                <line x1="4" y1="10" x2="4" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12" y2="3"></line>
                <line x1="20" y1="21" x2="20" y2="16"></line>
                <line x1="20" y1="12" x2="20" y2="3"></line>
                <line x1="1" y1="14" x2="7" y2="14"></line>
                <line x1="9" y1="8" x2="15" y2="8"></line>
                <line x1="17" y1="16" x2="23" y2="16"></line>
              </svg>
            </button>
            <button
              type="button"
              className={`-ml-px relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-600 bg-black text-sm hover:bg-emerald-900 focus:z-10 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 ${
                view === "terminology" ? "bg-slate-800" : ""
              }`}
              onClick={() => setView("terminology")}
            >
              <span className="sr-only">Terminology</span>
              <svg
                className="w-3 h-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="4 7 4 4 20 4 20 7"></polyline>
                <line x1="9" y1="20" x2="15" y2="20"></line>
                <line x1="12" y1="4" x2="12" y2="20"></line>
              </svg>
            </button>
          </span>
        </div>
      }
    >
      {view === "terminology" && (
        <div className="mt-3">
          {isoCurrent && (
            <div>
              <h2 className="text-slate-50 font-bold">Preferred Stock Price</h2>
              <p className="mt-1">
                The preferred stock price is the price at which investors
                currently pay for shares of the company. You can ask your
                recruiter what the current price is.
              </p>
            </div>
          )}
          {rsuCurrent && (
            <div className="mt-3">
              <h2 className="text-slate-50 font-bold">Current Market Price</h2>
              <p className="mt-1">
                This is the stock price at which the company is currently
                trading
              </p>
            </div>
          )}
          {(isoRevenue || rsuRevenue) && (
            <div className="mt-3">
              <h2 className="text-slate-50 font-bold">Shares Outstanding</h2>
              <p className="mt-1">
                The shares outstanding is the number of shares that the company
                has available in the market.
              </p>
            </div>
          )}
          <div className="mt-3">
            {isoCurrent && (
              <>
                <h2 className="text-slate-50 font-bold">
                  Expected Growth over 4 years
                </h2>
                <p className="mt-1">
                  Depending on the stage of the company expected growth can
                  vary. Investors typically expect a 10x return on what they put
                  in.
                </p>
              </>
            )}
            {rsuCurrent && (
              <>
                <h2 className="text-slate-50 font-bold">
                  Expected Market Growth
                </h2>
                <p className="mt-1">
                  How much do you expect the stock price to change every year?
                  Anualized growth over the last 4 years is a good estimate.
                </p>
              </>
            )}
            {(isoRevenue || rsuRevenue) && (
              <>
                <h2 className="text-slate-50 font-bold">
                  Expected Company Revenue
                </h2>
                <p className="mt-1">
                  How much do you expect the company to make every year? Divide
                  this number by the number of shares outstanding to get the
                  revenue multiple.
                </p>
                <h2 className="text-slate-50 font-bold mt-3">
                  Revenue Multiple
                </h2>
                <p className="mt-1">
                  The revenue multiple is the ratio of the company's revenue
                  relative to its stock price. You can use your competitors
                  revenue multiple to estimate what your share value would be.
                </p>
              </>
            )}
          </div>
        </div>
      )}
      {view === "estimate" && (
        <div className="mt-3 min-h-[500px]">
          <p>
            Estimate reasonable numbers for your equity value by looking at
            competitors:
          </p>
          <div className="mt-2">
            <FormField
              className="rounded"
              label="Add your company or a competitor"
              name="competitor"
              placeholder="Google"
            >
              <Select
                className="react-select-container"
                classNamePrefix="react-select"
                components={{ Option, IndicatorsContainer: () => null }}
                isMulti
                isLoading={search.state !== "idle"}
                defaultValue={[]}
                onInputChange={loadOptions}
                options={search.data}
                onChange={loadCompaniesData}
                isOptionDisabled={() =>
                  companies.data && companies.data.length >= 3
                }
                openMenuOnFocus={false}
                openMenuOnClick={false}
              />
            </FormField>
          </div>
          {!!companies.data && (
            <table className="relative min-w-full divide-y divide-slate-600 text-sm mt-2">
              <thead className="font-semibold">
                <tr>
                  <th scope="col" className="px-3 py-3.5 text-left table-cell">
                    Company
                  </th>
                  {isoCurrent && (
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-right table-cell"
                    >
                      Growth over last 4 years
                    </th>
                  )}
                  {rsuCurrent && (
                    <>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left table-cell"
                      >
                        Current Market Value
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left table-cell"
                      >
                        Average Growth per year
                      </th>
                    </>
                  )}
                  {(isoRevenue || rsuRevenue) && (
                    <>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left table-cell"
                      >
                        Shares Outstanding
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left table-cell"
                      >
                        Revenue
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left table-cell"
                      >
                        Revenue Multiple
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="text-slate-500">
                {companies.data.map((c: any) => (
                  <tr key={c.companyName}>
                    <td className="px-3 py-3.5 table-cell">{c.companyName}</td>
                    {isoCurrent && (
                      <td className="px-3 py-3.5 table-cell text-right">
                        {c.year1ChangePercent}
                      </td>
                    )}
                    {rsuCurrent && (
                      <>
                        <td className="px-3 py-3.5 table-cell">
                          {c.marketcap / c.sharesOutstanding}
                        </td>
                        <td className="px-3 py-3.5 table-cell text-right">
                          {c.year1ChangePercent}
                        </td>
                      </>
                    )}
                    {(isoRevenue || rsuRevenue) && (
                      <>
                        <td className="px-3 py-3.5 table-cell">
                          {c.sharesOutstanding}
                        </td>
                        <td className="px-3 py-3.5 table-cell">{c.revenue}</td>
                        <td className="px-3 py-3.5 table-cell">
                          {c.revenuePerShare}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </Modal>
  );
};
