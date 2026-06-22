import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import PopoverContainer from "../common/Popover";

const fixedInputClass =
  "rounded-md bg-white shadow-lg appearance-none block w-full px-3.5 py-2.5 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm p-2.5 ltr:pr-10 rtl:pl-10 ";

export default function InputWithImage({
  handleChange,
  blurChange,
  value,
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
  errorCode,
  maxLength = "",
  regex = "",
  onCombinedValueChange
}) {

  const { t: t1 } = useTranslation("translation", { keyPrefix: i18nKeyPrefix1 });
  const { t: t2 } = useTranslation("translation", { keyPrefix: i18nKeyPrefix2 });

  const [showPassword, setShowPassword] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [labelValue, setLabelValue] = useState("");
  const [showError, setShowError] = useState(false);

  const [errorBanner, setErrorBanner] = useState([]);

  const inputVal = useRef(value);

  const changePasswordState = () => {
    let passwordRef = document.getElementById(id);
    passwordRef.setAttribute("type", !showPassword ? "text" : "password");
    setShowPassword(!showPassword);
  };

  const getValidationError = (val, option) => {
    if (!option || val === "") return null;

    if (option === "tongapassnumber") {
      if (!/^\d+$/.test(val)) {
        return {
          errorCode: "tonga_pass_number_invalid_chars",
          message: "Tonga Pass Number must contain digits only"
        };
      }
      if (val.length !== 10) {
        return {
          errorCode: "tonga_pass_number_invalid",
          message: "Tonga Pass Number must be 10 digits"
        };
      }
    }

    if (option === "nationalidnumber") {
      if (!/^\d+$/.test(val)) {
        return {
          errorCode: "national_id_number_invalid_chars",
          message: "National ID Number must contain digits only"
        };
      }
      if (val.length !== 15) {
        return {
          errorCode: "national_id_number_invalid",
          message: "National ID Number must be 15 digits"
        };
      }
    }

    if (option === "passportnumber") {
      if (val.length !== 7 || !/^[a-zA-Z]\d{6}$/.test(val)) {
        return {
          errorCode: "passport_number_invalid",
          message: "Passport Number must be 1 letter and 6 digits"
        };
      }
    }

    if (option === "drivinglicensenumber") {
      if (!/^\d+$/.test(val)) {
        return {
          errorCode: "driving_license_number_invalid_chars",
          message: "Driving License Number must contain digits only"
        };
      }
      if (val.length !== 6) {
        return {
          errorCode: "driving_license_number_invalid",
          message: "Driving License Number must be 6 digits"
        };
      }
    }

    return null;
  };

  const handleKeyDown = (e) => {
    var keyCode = e.key || e.which;

    // Allow some special keys like Backspace, Tab, Home, End, Left Arrow, Right Arrow, Delete, Enter.
    const allowedKeyCodes =
      ['Backspace', 'Tab', 'Control', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Delete', 'Enter'];

    if (allowedKeyCodes.includes(keyCode)) {
      return;
    }

    // multiKeyChecking function checks if the key is
    // ctrl + a, ctrl + c, ctrl + v
    const multiKeyChecking = (key, ctrl) => {
      if (ctrl && (key === "a" || key === "c" || key === "v")) {
        return true;
      }
      return false;
    };

    if (multiKeyChecking(keyCode, e.ctrlKey)) {
      return;
    }

    const val = e.target.value;
    const isSelectionActive = e.target.selectionStart !== e.target.selectionEnd;

    if (selectedOption) {
      let allowedMax = "";
      if (selectedOption === "tongapassnumber") allowedMax = 10;
      else if (selectedOption === "nationalidnumber") allowedMax = 15;
      else if (selectedOption === "passportnumber") allowedMax = 7;
      else if (selectedOption === "drivinglicensenumber") allowedMax = 6;

      if (allowedMax !== "" && val.length >= allowedMax && !isSelectionActive) {
        e.preventDefault();
        return;
      }

      if (selectedOption === "tongapassnumber" || selectedOption === "nationalidnumber" || selectedOption === "drivinglicensenumber") {
        if (!/^\d$/.test(keyCode)) {
          e.preventDefault();
          return;
        }
      } else if (selectedOption === "passportnumber") {
        const insertIndex = e.target.selectionStart;
        if (insertIndex === 0 && !isSelectionActive) {
          if (!/^[a-zA-Z]$/.test(keyCode)) {
            e.preventDefault();
            return;
          }
        } else {
          if (!/^\d$/.test(keyCode)) {
            e.preventDefault();
            return;
          }
        }
      }
      return;
    }

    // checking max length for the input
    const checkMaxLength = (maxLength) =>
      maxLength === "" ? true : e.target.value.length < parseInt(maxLength);

    // testing with all input type
    // with respective regex
    const patternTest = (type, key) => {
      if (type === "number") {
        // Check if the pressed key is a number
        return /^\d$/.test(key);
      }
      if (type === "letter") {
        // Check if the pressed key is a letter (a-zA-Z)
        return /^[a-zA-Z]$/.test(key);
      }
      if (type === "alpha-numeric") {
        // Check if the pressed key is a number (0-9) or a letter (a-zA-Z)
        return /^[a-zA-Z\d]$/.test(key);
      }

      return true
    }

    // checking max length for the input
    // if greater than the max length then prevent the default action
    if (!checkMaxLength(maxLength)) {
      e.preventDefault();
    }

    // checking patter for number, letter & alpha-numeric
    if (!patternTest(type, keyCode)) {
      e.preventDefault();
    }
  }

  const onBlurChange = (e) => {
    const val = e.target.value;
    const id = e.target.id;
    let tempBanner = errorBanner.map((_) => ({ ..._, show: true }));
    let bannerIndex = tempBanner.findIndex((_) => _.id === id);

    if (selectedOption) {
      const error = getValidationError(val, selectedOption);
      if (error) {
        if (bannerIndex > -1) {
          tempBanner[bannerIndex] = {
            id,
            errorCode: error.errorCode,
            message: error.message,
            show: true
          };
        } else {
          tempBanner.push({
            id,
            errorCode: error.errorCode,
            message: error.message,
            show: true
          });
        }
      } else {
        if (bannerIndex > -1) {
          tempBanner.splice(bannerIndex, 1);
        }
      }
      setErrorBanner(tempBanner);
      blurChange(e, tempBanner);
      return;
    }

    const currentRegex = new RegExp(regex);
    // checking regex matching for username & password
    if (currentRegex.test(val) || val === "") {
      // if username or password is matched
      // then remove error from errorBanner
      if (bannerIndex > -1) {
        tempBanner.splice(bannerIndex, 1);
      }
    } else {
      // if username or password is not matched
      // with regex, then add the error
      if (bannerIndex === -1 && val !== "") {
        tempBanner.push({
          id,
          errorCode,
          show: true,
        });
      }
    }
    // setting the error in errorBanner
    setErrorBanner(tempBanner);
    blurChange(e, tempBanner)
  }

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
    handleChange({ target: { id: id, value: "" } });
    setErrorBanner([]);
    blurChange({ target: { id: id, value: "" } }, []);
  }

  const validateBeforeInput = (event) => {
    let val = event.target.value;

    if (selectedOption) {
      // Sanitize input based on selectedOption
      if (selectedOption === "tongapassnumber" || selectedOption === "nationalidnumber" || selectedOption === "drivinglicensenumber") {
        val = val.replace(/\D/g, "");
        let maxLen = selectedOption === "tongapassnumber" ? 10 : selectedOption === "nationalidnumber" ? 15 : 6;
        val = val.slice(0, maxLen);
      } else if (selectedOption === "passportnumber") {
        let firstChar = val.slice(0, 1);
        if (firstChar && !/^[a-zA-Z]$/.test(firstChar)) {
          firstChar = "";
        }
        let rest = val.slice(1).replace(/\D/g, "");
        val = (firstChar + rest).slice(0, 7);
      }
    }

    event.target.value = val;

    if (selectedOption === "") {
      setShowError(true);
    } else {
      const combinedValue = selectedOption === "tongapassnumber"
          ? val
          : `${val}@${selectedOption}`;
      setShowError(false);
      if (typeof onCombinedValueChange === "function") {
        onCombinedValueChange(combinedValue);
      }

      // If there was an error banner active, validate real-time to remove/update it
      let error = getValidationError(val, selectedOption);
      let tempBanner = errorBanner.map((_) => ({ ..._, show: true }));
      let bannerIndex = tempBanner.findIndex((_) => _.id === id);

      if (!error) {
        if (bannerIndex > -1) {
          tempBanner.splice(bannerIndex, 1);
        }
      } else {
        if (bannerIndex > -1) {
          tempBanner[bannerIndex] = {
            id,
            errorCode: error.errorCode,
            message: error.message,
            show: true
          };
        }
      }
      setErrorBanner(tempBanner);
      if (typeof blurChange === "function") {
        blurChange(event, tempBanner);
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
            <PopoverContainer child={<img src={infoIcon} className="mx-1 mt-[2px] w-[15px] h-[14px] relative bottom-[1px]" />} content={id.includes("Otp") ? t1("otp_info") : id.includes("sbi") ? t1("bio_info") : id.includes("Pin") ? t1("pin_info") : t1("username_info")} position="right" contentSize="text-xs" />
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
      <div className={`relative input-box ${errorBanner && errorBanner.length > 0 && errorBanner.find(val => val.id === id) && "errorInput"}`}>
        {imgPath &&
          <div className="flex absolute inset-y-0 items-center p-3 pointer-events-none ltr:right-0 rtl:left-0 z-[11]">
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
          onBlur={onBlurChange}
          onKeyDown={handleKeyDown}
          value={value}
          type={type}
          id={id}
          name={name}
          required={isRequired}
          className={fixedInputClass + customClass}
          placeholder={labelValue || placeholder}
          title={t1(tooltipMsg)}
        />
        {id.includes("password") && (
          <span
            id="password-eye"
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
        errorBanner && errorBanner.length > 0 && errorBanner.map(item => {
          if (item.id === id) {
            return (
              <div className="bg-[#FAEFEF] text-[#D52929] text-sm pb-1 pt-[2px] px-2 rounded-b-md font-semibold" key={id}>
                {t2(item.errorCode, item.message || item.errorCode)}
              </div>
            )
          }
          else return null;
        })
      }
    </>
  );
}
