"use client";

import { Select, SelectItem } from "@nextui-org/react";
import { getColorName } from "../lib/colorNames";
import { getOptionName } from "../lib/optionNames";
import i18n from "../lib/i18n";

const isColorAttribute = (path) => path.endsWith("Color");

const ProfileSelect = ({ path, label, options, currentValue, setAvState }) => {
  const lang = i18n.language ? i18n.language.substring(0, 2) : "en";
  const isColor = isColorAttribute(path);

  const getDisplayName = (option) => {
    if (isColor) return getColorName(option, lang);
    return getOptionName(path, option, lang);
  };

  const updateState = (keys) => {
    const option = keys.values().next().value;
    setAvState((prevAvatar) => ({
      ...prevAvatar,
      [path]: option,
    }));
  };

  const renderValue = (items) => {
    const item = items[0];
    if (!item) return null;
    const value = item.key;
    if (isColor) {
      return (
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-4 h-4 rounded-full border border-white/30 flex-shrink-0"
            style={{ backgroundColor: `#${value}` }}
          />
          <span>{getColorName(value, lang)}</span>
        </div>
      );
    }
    return <span>{getOptionName(path, value, lang)}</span>;
  };

  return (
    <Select
      label={label}
      selectedKeys={currentValue ? new Set([currentValue]) : new Set()}
      onSelectionChange={updateState}
      variant="bordered"
      className="w-full text-white/70"
      classNames={{
        trigger: "bg-white/10 border-white/20 hover:bg-white/20 data-[hover=true]:bg-white/20",
        value: "text-white",
        label: "!text-white"
      }}
      renderValue={renderValue}
    >
      {options.map((option) => (
        <SelectItem key={option} value={option} textValue={getDisplayName(option)} className="text-black">
          {isColor ? (
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
                style={{ backgroundColor: `#${option}` }}
              />
              <span>{getColorName(option, lang)}</span>
            </div>
          ) : (
            getOptionName(path, option, lang)
          )}
        </SelectItem>
      ))}
    </Select>
  );
};

export default ProfileSelect;
