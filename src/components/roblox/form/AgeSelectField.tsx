import { useEffect, useId, useRef, useState } from "react";
import type { Control, FieldError } from "react-hook-form";
import { Controller } from "react-hook-form";
import type { LeadFormValues } from "./schema";

const AGES = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17] as const;

function formatAgeLabel(age: number) {
  return `${age} років`;
}

type Props = {
  control: Control<LeadFormValues>;
  error?: FieldError;
};

export default function AgeSelectField({ control, error }: Props) {
  const baseId = useId();
  const listId = `${baseId}-list`;
  const triggerId = `${baseId}-trigger`;
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <Controller
      name="childAge"
      control={control}
      render={({ field }) => (
        <div ref={rootRef} className="age-select">
          <label htmlFor={triggerId}>Вік дитини</label>
          <button
            type="button"
            id={triggerId}
            data-testid="select-child-age"
            className={`age-select__trigger${open ? " is-open" : ""}${error ? " has-error" : ""}`}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={listId}
            aria-invalid={error ? true : undefined}
            onClick={() => setOpen((value) => !value)}
            onBlur={field.onBlur}
          >
            <span className="age-select__value">{formatAgeLabel(field.value)}</span>
            <svg
              className="age-select__chevron"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M4 6l4 4 4-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {open && (
            <ul
              id={listId}
              role="listbox"
              className="age-select__list"
              aria-activedescendant={`${listId}-opt-${field.value}`}
            >
              {AGES.map((age) => {
                const selected = field.value === age;
                return (
                  <li
                    key={age}
                    id={`${listId}-opt-${age}`}
                    role="option"
                    aria-selected={selected}
                    className={selected ? "is-selected" : undefined}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      field.onChange(age);
                      field.onBlur();
                      setOpen(false);
                    }}
                  >
                    {formatAgeLabel(age)}
                    {selected && (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                        <path
                          d="M2.5 7l3 3 6-6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          {error && <p className="field-error">{error.message}</p>}
        </div>
      )}
    />
  );
}
