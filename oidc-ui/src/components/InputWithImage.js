import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import PopoverContainer from "../common/Popover";

const fixedInputClass =
  "rounded-md bg-white appearance-none block w-full px-3.5 py-2.5 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm p-2.5 ltr:pr-10 ";

export default function InputWithImage({
  handleChange,
  blurChange,
  value = "",
  labelText,
  labelFor,
  id,
  name,
  type,
  isRequired = false,
  placeholder,
  customClass,
  imgPath,
  tooltipMsg = "vid_info",
  disabled = false,
  formError = "",
  passwordShowIcon = "images/password_show.svg",
  passwordHideIcon = "images/password_hide.svg",
  infoIcon = "images/info_icon.svg",
  i18nKeyPrefix1 = "tooltips",
  i18nKeyPrefix2 = "errors",
  icon,
  prefix,
  error,
  onCombinedValueChange
}) {

  const { t: t1 } = useTranslation("translation", { keyPrefix: i18nKeyPrefix1 });
  const { t: t2 } = useTranslation("translation", { keyPrefix: i18nKeyPrefix2 });

  const [showPassword, setShowPassword] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [labelValue, setLabelValue] = useState("");
  const [showError, setShowError] = useState(false);
  const inputVal = useRef(value);

  const changePasswordState = () => {
    let passwordRef = document.getElementById(id);
    passwordRef.setAttribute("type", !showPassword ? "text" : "password");
    setShowPassword(!showPassword);
  };

  const handleSelectChange = (event) => {
    clearInput();
    const value = event.target.value;
    const label = event.target.options[event.target.selectedIndex].text;
    setLabelValue(label);
    setSelectedOption(value);
    setIsDropdownOpen((prev) => !prev);
    setShowError(event.target.value === "");
    if(event.target.value === ""){
      onCombinedValueChange("");
    }
  };

  const clearInput = () => {
    setInputValue("");
  }

  const validateBeforeInput = (event) => {
    setInputValue(event.target.value);
    if (selectedOption === "") {
      setShowError(true);
    } else {
      const combinedValue = selectedOption === "tongapassnumber"
          ? event.target.value
          : `${event.target.value}@${selectedOption}`;
      setShowError(false);
      if (typeof onCombinedValueChange === "function") {
        onCombinedValueChange(combinedValue);
      }
    }
  };

  return (
    <>
      <div className="relative flex items-center justify-between mb-4">
        <select
            value={selectedOption}
            onChange={handleSelectChange}
            onFocus={() => setIsDropdownOpen(true)}
            onBlur={() => setIsDropdownOpen(false)}
            className="w-full appearance-none p-2 login-list-box-style"
        >
          <option value="">Select mode of login</option>
          <option value="tongapassnumber">Tonga Pass Number</option>
          <option value="birthcertificatenumber">Birth Certificate Number</option>
          <option value="nationalidnumber">National ID Number</option>
          <option value="passportnumber">Passport Number</option>
          <option value="drivinglicensenumber">Driving License Number</option>
        </select>

        {/* Arrow Icon */}
        <span className="pointer-events-none absolute right-3 top-3 text-gray-600">
          {isDropdownOpen ? "▲" : "▼"}
        </span>
      </div>

      {selectedOption === "" && showError && (
          <div className="text-red-500 text-sm mt-1 pb-2">
            Please select a mode of login before entering input.
          </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex justify-start">
        <label
          htmlFor={labelFor}
          className="block mb-2 text-xs font-medium text-gray-900 text-opacity-70"
        >
          {labelValue || labelText}
        </label>
          {icon && (
          <PopoverContainer child={<img src={infoIcon} className="mx-1 mt-[2px] w-[15px] h-[14px]"/>} content={t1("username_info")} position="right" contentSize="text-xs"/>
          )}
        </div>
        {formError && (
          <label
            htmlFor={labelFor}
            className="font-medium text-xs text-red-600"
          >
            {formError}
          </label>
        )}
      </div>
      <div className={`relative input-box ${error && error.length > 0 && error.find(val => val.id === id) && "errorInput"}`}>
        {imgPath &&
          <div className="flex absolute inset-y-0 items-center p-3 pointer-events-none ltr:right-0 rtl:left-0">
            <img className="w-6 h-6" src={imgPath} />
          </div>
        }
        {prefix && prefix !== "" && <span className="prefix">{prefix}</span>}
        <input
          ref={inputVal}
          disabled={disabled}
          onChange={(e) => {
            handleChange(e);
            validateBeforeInput(e);
          }}
          onBlur={blurChange}
          value={inputValue}
          type={type}
          id={id}
          name={name}
          required={isRequired}
          className={fixedInputClass + customClass}
          placeholder={placeholder}
          title={t1(tooltipMsg)}
        />
        {id.includes("password") && (
          <span
            type="button"
            className="flex absolute inset-y-0 p-3 pt-2 ltr:right-0 rtl:left-0 hover:cursor-pointer z-50"
            onClick={changePasswordState}
          >
            {showPassword ? (
              <img className="w-6 h-6" src={passwordShowIcon} />
            ) : (
              <img className="w-6 h-6" src={passwordHideIcon} />
            )}
          </span>
        )}
      </div>
      {
        error && error.length > 0 && error.map(item => {
          if(item.id === id) {
            return (
              <div className="bg-[#FAEFEF] text-[#D52929] text-sm pb-1 pt-[2px] px-2 rounded-b-md font-semibold" key={id}>
              {t2(`${item.errorCode}`)}
              </div>
            )
          }
          else return null;
        })
      }
    </>
  );
}
