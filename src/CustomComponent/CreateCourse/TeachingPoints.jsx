import React from "react";
import { Controller } from "react-hook-form";

const TeachingPointInput = React.memo(
  ({
    field,
    index,
    remove,
    error,
    control,
    register,
    teachingPointsFields,
  }) => (
    <div key={field.id} className="mb-4">
      <div className="flex items-center mb-2">
        <span className="text-sm font-medium text-gray-700">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <div className="flex flex-2 gap-2 w-[100%]">
        <input
          {...register(`teachingPoints.${index}.value`)}
          placeholder="What you will teach in this course..."
          className={`pr-16 bg-gray-50 w-full relative border border-gray-300 rounded-sm px-3 py-1 ${
            error ? "border border-red-500" : ""
          }`}
        />

        <button
          type="button"
          onClick={() => remove(index)}
          className={`text-red-500 cursor-pointer border border-gray-300 px-2 py-1 rounded-lg ${
            teachingPointsFields.length === 1 ? "hidden" : ""
          }`}
        >
          Remove
        </button>
      </div>

      {error && <p className="text-xs text-red-500 mt-1">{error.message}</p>}
    </div>
  )
);

export default TeachingPointInput;
