// Content form for one section, driven by its schema.
// Built-in sections: shows the original content, stores only changed fields,
// and each changed field can be reset. Generic blocks: stores everything.
import React from "react";
import { mergeContent } from "../../../cms/merge";
import FieldInput from "./FieldInput";
import { Badge, Field } from "./ui";

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

export default function SectionForm({ schema, content, onChange }) {
  const overrides = content && typeof content === "object" ? content : {};
  const values = schema.generic ? overrides : mergeContent(schema.defaults, overrides);

  const setField = (name, value) => {
    const next = { ...overrides };
    if (!schema.generic && same(value, schema.defaults[name])) delete next[name];
    else next[name] = value;
    onChange(next);
  };

  const resetField = (name) => {
    const next = { ...overrides };
    delete next[name];
    onChange(next);
  };

  return (
    <div className="space-y-5">
      {schema.fields.map((field) => {
        const changed = !schema.generic && overrides[field.name] !== undefined;
        return (
          <Field
            key={field.name}
            label={field.label}
            hint={field.hint}
            action={
              changed ? (
                <span className="flex items-center gap-2">
                  <Badge color="amber">Edited</Badge>
                  <button
                    type="button"
                    className="text-xs text-gray-400 hover:text-white underline cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      resetField(field.name);
                    }}
                  >
                    Reset to original
                  </button>
                </span>
              ) : null
            }
          >
            <FieldInput field={field} value={values[field.name]} onChange={(v) => setField(field.name, v)} />
          </Field>
        );
      })}
    </div>
  );
}
