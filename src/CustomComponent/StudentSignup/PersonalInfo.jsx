import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFormContext } from "react-hook-form";

const PersonalInfo = () => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const formData = watch();

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        <div>
          <Label
            htmlFor="firstName"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            First Name
          </Label>
          <Input
            type="text"
            name="firstName"
            id="firstName"
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="John"
            {...register("firstName")}
          />
          {errors?.firstName && (
            <p className="text-xs text-red-600">{errors.firstName.message}</p>
          )}
        </div>
        <div>
          <Label
            htmlFor="middleName"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Middle Name
          </Label>
          <Input
            type="text"
            name="middleName"
            id="middleName"
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="M."
            {...register("middleName")}
          />
        </div>
        {errors?.middleName && (
          <p className="text-xs text-red-600">{errors.middleName.message}</p>
        )}

        <div>
          <Label
            htmlFor="lastName"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Last Name
          </Label>
          <Input
            type="text"
            name="lastName"
            id="lastName"
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Doe"
            {...register("lastName")}
          />
          {errors?.lastName && (
            <p className="text-xs text-red-600">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
        <div className="w-full sm:w-1/2 ">
          <Label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Preferred Pronouns
          </Label>
          <RadioGroup
            // defaultValue={formData.pronouns || "he/him"}
            name="pronouns"
            className="grid grid-cols-1 gap-2"
            onValueChange={(value) => setValue("pronouns", value)}
          >
            {errors?.pronouns && (
              <p className="text-xs text-red-600">{errors.pronouns.message}</p>
            )}

            {["He/Him", "She/Her", "They/Them"].map((pronoun) => (
              <div key={pronoun} className="flex items-center  space-x-2">
                <RadioGroupItem
                  value={pronoun.toLowerCase()}
                  id={pronoun.toLowerCase()}
                />
                <Label
                  htmlFor={pronoun.toLowerCase()}
                  className="text-sm text-gray-900 dark:text-white"
                >
                  {pronoun}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <div className="w-full sm:w-1/2">
          <Label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Gender Identification
          </Label>
          <RadioGroup
            // defaultValue={formData.gender || "male"}
            name="gender"
            className="grid grid-cols-1 gap-2"
            onValueChange={(value) => setValue("gender", value)}
          >
            {errors?.gender && (
              <p className="text-xs text-red-600">{errors.gender.message}</p>
            )}

            {["Male", "Female", "Non-binary", "Other"].map((gender) => (
              <div key={gender} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={gender.toLowerCase()}
                  id={gender.toLowerCase()}
                />
                <Label
                  htmlFor={gender.toLowerCase()}
                  className="text-sm text-gray-900 dark:text-white"
                >
                  {gender}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
    </>
  );
};

export default PersonalInfo;
