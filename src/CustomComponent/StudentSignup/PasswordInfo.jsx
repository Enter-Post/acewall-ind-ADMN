import { useFormContext } from "react-hook-form";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const PasswordInfo = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const password = watch("password") || "";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Condition checks
  const isMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecialChar = /[#?!@$%^&*-]/.test(password);

  // Dynamic class based on condition
  const getClass = (condition) =>
    `text-xs font-medium ${condition ? "text-green-600" : "text-red-500"}`;

  return (
    <div>
      {/* Password Field */}
      <div className="relative">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Password
        </label>
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          name="password"
          {...register("password")}
          className="mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-[38px] text-gray-500 dark:text-gray-300"
          tabIndex={-1}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
        {errors?.password?.message && (
          <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="mt-4 relative">
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Confirm Password
        </label>
        <input
          type={showConfirmPassword ? "text" : "password"}
          id="confirmPassword"
          name="confirmPassword"
          {...register("confirmPassword")}
          className="mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
       
        {errors?.confirmPassword?.message && (
          <p className="text-xs text-red-600 mt-1">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Dynamic Password Rules */}
      <ol className="list-decimal pl-6 space-y-2 text-gray-700 mt-5 dark:text-gray-300">
        <li className={getClass(isMinLength)}>Minimum 8 characters</li>
        <li className={getClass(hasUppercase)}>At least one uppercase letter</li>
        <li className={getClass(hasLowercase)}>At least one lowercase letter</li>
        <li className={getClass(hasDigit)}>At least one digit</li>
        <li className={getClass(hasSpecialChar)}>
          At least one special character (#?!@$%^&*-)
        </li>
      </ol>
    </div>
  );
};

export default PasswordInfo;
