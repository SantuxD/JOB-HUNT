import { AlertCircle, ChevronDown } from "lucide-react";

const SelectField = ({
    label,
    id,
    options = [],
    value,
    onChange,
    error,
    helperText,
    required = false,
    disabled = false,
    icon: Icon,
    placeholder = "Select an option",
    ...props
}) => {
    // Fallback if someone passes Options instead of options
    const selectOptions = options || props.Options || [];

    return (
        <div className="space-y-2">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className="h-5 w-5 text-gray-400" />
                    </div>
                )}
                
                <select
                    id={id}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className={`w-full appearance-none ${Icon ? "pl-10" : "pl-3"} pr-10 py-2.5 border rounded-lg text-base transition-colors duration-200 disabled:bg-gray-50 disabled:text-gray-500 ${
                        error
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    } focus:outline-none focus:ring-2 focus:ring-opacity-20 bg-white`}
                    {...props}
                >
                    <option value="" disabled hidden>
                        {placeholder}
                    </option>
                    {selectOptions.map((option, index) => (
                        <option key={index} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                </div>
            </div>
            
            {error && (
                <div className="flex items-center space-x-1 text-red-600 mt-1">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{error}</span>
                </div>
            )}
            {helperText && !error && (
                <p className="text-sm text-gray-500 mt-1">{helperText}</p>
            )}
        </div>
    );
};

export default SelectField;