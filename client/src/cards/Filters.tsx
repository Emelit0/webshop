import { useMisc } from "../contexts/MiscContext";
import Form from "../formElements/Form";
import Input from "../formElements/Input";
import Select from "../formElements/Select";

export default function FilterForm({
  onSubmit,
  session,
}: {
  onSubmit: (data: {
    t: "Today" | "This Week" | "This Month" | "This Year" | "All Time";
    rlo: number;
    rhi: number;
    clo: number;
    chi: number;
    s: "Date" | "Rating" | "Cost";
    o: "Ascending" | "Descending";
    atags: string[];
    ntags: string[];
    stags: string[];
  }) => Promise<void>;
  session: any;
}) {
  const { isSm, filtersOpen, toggleFilters } = useMisc();
  return (
    <div
      className={`
    z-10 flex ${!isSm ? "w-[17rem]" : "fixed w-full"} absolute flex-col
    items-center rounded-2xl bg-neutral-200 p-4
    shadow-[3px_3px_10px_1px_#00000060] transition-all
    duration-200 dark:bg-neutral-900
    ${filtersOpen ? "translate-x-0" : "-translate-x-full"}
    `}
    >
      {!isSm && (
        <span
          className={`absolute top-0 bottom-0 m-auto h-fit w-fit ${
            filtersOpen ? "right-1" : "-right-1 translate-x-full"
          } cursor-pointer rounded-lg p-2 transition-all duration-200 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black`}
          onClick={toggleFilters}
        >
          {filtersOpen ? "Close" : "Filters"}
        </span>
      )}
      <h2 className="text-lg font-semibold">Filters</h2>
      <div className="flex justify-between gap-20 p-3">
        <div className="flex gap-2">
          <Form
            onChange={onSubmit}
            className="flex h-full flex-col items-center gap-2"
          >
            <label htmlFor="t">Results from..</label>
            <Select
              id="t"
              name="t"
              initialValue={session.t ? session.t.toString() : undefined}
            >
              <option value="All Time" />
              <option value="Today" />
              <option value="This Week" />
              <option value="This Month" />
              <option value="This Year" />
            </Select>
            <label htmlFor="rlo">Rating</label>
            <div className="flex gap-2">
              <Input
                id="rlo"
                name="rlo"
                type="number"
                min="0"
                max="5"
                placeholder="0"
                className="mx-0 w-16"
                initialValue={session.rlo ? session.rlo.toString() : undefined}
              />
              <Input
                id="rhi"
                name="rhi"
                type="number"
                min="0"
                max="5"
                placeholder="5"
                className="mx-0 w-16"
                initialValue={session.rhi ? session.rhi.toString() : undefined}
              />
            </div>
            <label htmlFor="clo">Cost</label>
            <div className="flex gap-2">
              <Input
                id="clo"
                name="clo"
                type="number"
                min="0"
                placeholder="0"
                className="mx-0 w-16"
                initialValue={session.clo ? session.clo.toString() : undefined}
              />
              _
              <Input
                id="chi"
                name="chi"
                type="number"
                min="0"
                placeholder="∞"
                className="mx-0 w-16"
                initialValue={session.chi ? session.chi.toString() : undefined}
              />
            </div>
            <label htmlFor="s">Sort By</label>
            <Select
              id="s"
              name="s"
              className="mx-0 w-32"
              placeholder="Rating"
              initialValue={session.s ? session.s.toString() : undefined}
            >
              <option value="Rating" />
              <option value="Time" />
              <option value="Cost" />
            </Select>
            <label htmlFor="o">Order</label>
            <Select
              id="o"
              name="o"
              className="mx-0 w-32"
              placeholder="Ascending"
              initialValue={session.o ? session.o.toString() : undefined}
            >
              <option value="Descending" />
              <option value="Ascending" />
            </Select>
            {/* <label htmlFor="tags">Tags</label> */}
          </Form>
        </div>
      </div>
    </div>
  );
}
