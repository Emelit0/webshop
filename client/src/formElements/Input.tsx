import { ErrorMessage } from "@hookform/error-message";
import { InputHTMLAttributes, useEffect, useRef, useState } from "react";
import { FieldErrors, RegisterOptions, useFormContext } from "react-hook-form";
import Warning from "../assets/WarningIcon";
import { useMisc } from "../contexts/MiscContext";
import File from "./File";

interface FancyInputProps extends InputHTMLAttributes<HTMLInputElement> {
  errors?: FieldErrors;
  name: string;
  options?: RegisterOptions;
  initialValue?: string | File | FileList;
  type: string;
  placementClassName?: string;
  placeholder?: string;
  setFileNamesOutlet?: Function;
}

export default function FancyInput({
  name,
  options,
  className: cOverrides,
  type,
  placeholder,
  initialValue,
  placementClassName,
  setFileNamesOutlet,
  ...rest
}: FancyInputProps) {
  const { isSm } = useMisc();
  if (type === "file")
    return (
      <File
        name={name}
        options={options}
        initialValue={initialValue}
        className={cOverrides}
        setFileNamesOutlet={setFileNamesOutlet}
        {...rest}
      />
    );
  else {
    if (setFileNamesOutlet)
      throw new Error(
        "Input.tsx:30 fileNamesOutlet is not supported in FancyInput."
      );
    if (initialValue && typeof initialValue !== "string")
      throw new Error("Input.tsx:31 initialValue must be a string.");
  }
  const form = useFormContext();
  let formState, register, errors, ref: any, regRest: any;
  if (form) {
    formState = form.formState;
    register = form.register;
    errors = formState.errors;
  }
  const inputRef = useRef<HTMLInputElement | HTMLSelectElement | null>(null);
  const [labelSmall, setLabelSmall] = useState(false);
  const [isNumber] = useState(type === "number");
  if (name && register) {
    const reg = register(name, options || {});
    ref = reg.ref;
    regRest = reg;
    regRest.ref = undefined;
  }
  const handleFocus = (focus: boolean) => {
    if (isNumber) return;
    inputRef.current?.value === "" ? setLabelSmall(focus) : setLabelSmall(true);
  };
  useEffect(() => {
    if (initialValue) setLabelSmall(true);
  });
  return (
    <div className={`mb-2 flex flex-col ${placementClassName}`}>
      <div className="relative flex flex-col gap-1">
        <input
          {...rest}
          {...(ref ? regRest : {})}
          type={type}
          ref={(e) => {
            if (!ref) {
              inputRef.current = e;
              return inputRef;
            }
            ref(e);
            inputRef.current = e;
          }}
          onFocus={() => handleFocus(true)}
          onBlur={() => handleFocus(false)}
          className={`
            rounded-md bg-white-bright shadow-blue-200 transition-all duration-200 
            focus-within:shadow-[0_0_10px_2px_#bfdbfe] focus-within:ring-[2px] hover:shadow-[0_0_10px_2px_#bfdbfe] 
            focus:shadow-[0_0_10px_2px_#bfdbfe] focus:outline-none focus:ring-2 
            dark:bg-neutral-800 dark:focus-within:shadow-[0_0_5px_#bfdbfe] dark:focus-within:ring-1 
            dark:hover:shadow-[0_0_10px_0px_#bfdbfe] dark:focus:shadow
            ${
              name && errors && errors[name]
                ? " border-1 border-red-500 ring-red-300"
                : " ring-blue-300"
            }
            ${
              isNumber
                ? " appearance-none pt-2 [-moz-appearance:textfield]"
                : ""
            }
            ${isSm ? " p-2 pt-3 pb-1 text-xs" : " p-4 pb-2 text-base"}
            ${cOverrides ?? ""}
          `}
          placeholder={
            isNumber
              ? placeholder ??
                name
                  ?.split("")
                  .map((val, i) => (i == 0 ? val.toUpperCase() : val))
                  .join("")
              : ""
          }
          aria-placeholder={placeholder ?? ""}
          defaultValue={initialValue ?? ""}
        />
        {!isNumber && (
          <label
            className={`
              pointer-events-none absolute top-1/2 -translate-y-1/2 
              select-none pl-3 capitalize opacity-60 
              transition-all duration-300 ease-out
              ${
                labelSmall
                  ? (isSm ? "text-[.5rem]" : "text-xs") +
                    " top-2 pl-2 opacity-80"
                  : (isSm ? "text-xs" : "text-base") + " top-6 pl-2 opacity-60"
              }
              `}
            htmlFor={placeholder ?? name}
          >
            {placeholder ?? name}
          </label>
        )}
      </div>
      {name && errors && errors[name] && (
        <div className="flex items-center gap-2 p-1 text-red-500">
          <Warning className="h-5 w-5" />
          <span className="text-sm">
            <ErrorMessage errors={errors} name={name} />
          </span>
        </div>
      )}
    </div>
  );
}
