import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import FilterForm from "../cards/Filters";
import SearchResults from "../components/SearchResults";
import useSearch from "../utils/useSearch";

interface FormData {
  t: "Today" | "This Week" | "This Month" | "This Year" | "All Time"; // Filter by time
  rlo: number; // Filter by rating lower bound
  rhi: number; // Filter by rating upper bound
  clo: number; // Filter by cost lower bound
  chi: number; // Filter by cost upper bound
  s: "Date" | "Rating" | "Cost"; // Sort by
  o: "Ascending" | "Descending"; // Sort order
  p?: number;
  atags: string[]; // Filter by must-have tags
  ntags: string[]; // Filter by cannot-have tags
  stags: string[]; // Filter by has-some tags
}

const defaults = {
  t: "All Time",
  rlo: 0,
  rhi: 5,
  clo: 0,
  chi: Infinity,
  s: "Date",
  o: "Descending",
  p: 1,
  atags: [],
  ntags: [],
  stags: [],
};

export default function Search() {
  const [results, setResults] = useState([]);
  const [apiString, setApiString] = useState("");
  const [sessionParams, setSessionParams] = useState<FormData>(
    JSON.parse(sessionStorage.getItem("searchParams") ?? "{}")
  );
  const [paramsUsed, setParamsUsed] = useState(false);
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(Number(searchParams.get("p") ?? 1));
  const navigate = useNavigate();

  useEffect(() => {
    const sessionParamsL: FormData = JSON.parse(
      sessionStorage.getItem("searchParams") || "{}"
    );
    for (const [key, value] of Object.entries(sessionParamsL)) {
      if (value != sessionParams[key]) {
        setSessionParams(sessionParamsL);
      }
    }
    const queryString = buildQuery(
      searchParams,
      sessionParamsL,
      paramsUsed,
      page
    );
    setParamsUsed(true);
    const cleanQueryString = cleanQuery(queryString);
    const apiString = prepareForApi(cleanQueryString);
    setApiString(apiString);
    navigate("/search?" + cleanQueryString, {
      replace: true,
    });
  }, [page, searchParams, sessionParams]);

  const { data, isLoading } = useSearch(apiString, page);

  useEffect(() => {
    if (data) setResults(data.products); // need to set image and display it
  }, [data]);

  async function setSearchParams(data: FormData) {
    sessionStorage.setItem("searchParams", JSON.stringify(data || {}));
    setSessionParams(data);
  }

  return (
    <div className="mt-2 flex gap-3">
      <FilterForm onSubmit={setSearchParams} session={sessionParams} />
      {searchParams.entries() && (
        <>
          {isLoading && <div>Loading...</div>}
          {results && (
            <>
              <SearchResults data={results} setPage={setPage} page={page} />
            </>
          )}
        </>
      )}
    </div>
  );
}

function buildQuery(
  searchParams: URLSearchParams,
  sessionParams: FormData,
  paramsUsed: boolean,
  page: number
) {
  const queryParams = [
    ["q", !paramsUsed ? searchParams?.get("q") : ""],
    [
      "t",
      !paramsUsed
        ? searchParams?.get("t") ?? sessionParams?.t ?? defaults.t
        : sessionParams?.t ?? defaults.t,
    ],
    [
      "rlo",
      !paramsUsed
        ? searchParams?.get("rlo") ?? sessionParams?.rlo ?? defaults.rlo
        : sessionParams?.rlo ?? defaults.rlo,
    ],
    [
      "rhi",
      !paramsUsed
        ? searchParams?.get("rhi") ?? sessionParams?.rhi ?? defaults.rhi
        : sessionParams?.rhi ?? defaults.rhi,
    ],
    [
      "clo",
      !paramsUsed
        ? searchParams?.get("clo") ?? sessionParams?.clo ?? defaults.clo
        : sessionParams?.clo ?? defaults.clo,
    ],
    [
      "chi",
      !paramsUsed
        ? searchParams?.get("chi") ?? sessionParams?.chi ?? defaults.chi
        : sessionParams?.chi ?? defaults.chi,
    ],
    [
      "s",
      !paramsUsed
        ? searchParams?.get("s") ?? sessionParams?.s ?? defaults.s
        : sessionParams?.s ?? defaults.s,
    ],
    [
      "o",
      !paramsUsed
        ? searchParams?.get("o") ?? sessionParams?.o ?? defaults.o
        : sessionParams?.o ?? defaults.o,
    ],
    ["p", page],
    [
      "stags",
      !paramsUsed
        ? searchParams?.get("stags") ?? sessionParams?.stags
        : sessionParams?.stags,
    ],
    [
      "atags",
      !paramsUsed
        ? searchParams?.get("atags") ?? sessionParams?.atags
        : sessionParams?.atags,
    ],
    [
      "ntags",
      !paramsUsed
        ? searchParams?.get("ntags") ?? sessionParams?.ntags
        : sessionParams?.ntags,
    ],
  ];
  const queryString = queryParams
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  return queryString ? `${queryString}` : "";
}

function cleanQuery(query: string) {
  const replacements = [
    ["This Week", "thisweek"],
    ["This Month", "thismonth"],
    ["This Year", "thisyear"],
    ["All Time", "alltime"],
    ["Today", "today"],
    ["Time", "time"],
    ["Date", "date"],
    ["Rating", "rating"],
    ["Cost", "price"],
    ["Ascending", "asc"],
    ["Descending", "desc"],
  ];
  let cleanQuery = query;
  for (const [from, to] of replacements)
    cleanQuery = cleanQuery.replaceAll(from, to);
  return cleanQuery;
}

function prepareForApi(query: string) {
  const replacements = [
    ["thisweek", "1683401027064"],
    ["thismonth", "1681376027063"],
    ["thisyear", "1652448227063"],
    ["alltime", "0"],
    ["today", "86400000"],
    ["time", "createdAt"],
    ["date", "createdAt"],
    ["rating", "ratingAvg"],
    ["price", "price"],
  ];
  let cleanQuery = query;
  for (const [from, to] of replacements)
    cleanQuery = cleanQuery.replaceAll(from, to);
  return cleanQuery;
}
