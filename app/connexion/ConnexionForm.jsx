"use client";

import { Button, Input } from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import { getBtnClassNames } from "../lib/styles";

const ConnexionForm = ({
  handleSubmit,
  isLogin,
  username,
  setUsername,
  email,
  setEmail,
  password,
  setPassword,
  fieldErrors = {},
  onFieldChange,
}) => {
  const { t } = useTranslation();

  const handleChange = (field, setter) => (e) => {
    setter(e.target.value);
    if (onFieldChange) onFieldChange(field);
  };

  return (
    <form className="w-80 z-20" onSubmit={handleSubmit}>
      {!isLogin && (
        <div className="my-2">
          <Input
            color="secondary"
            isRequired
            type="text"
            label={t("intro.un")}
            value={username}
            className="max-w-xs bg-white rounded-2xl"
            onChange={handleChange("username", setUsername)}
            isInvalid={!!fieldErrors.username}
            errorMessage={fieldErrors.username}
          />
        </div>
      )}
      <div className="my-2">
        <Input
          color="secondary"
          isRequired
          type="email"
          label={t("intro.em")}
          value={email}
          className="max-w-xs bg-white rounded-2xl"
          onChange={handleChange("email", setEmail)}
          isInvalid={!!fieldErrors.email}
          errorMessage={fieldErrors.email}
        />
      </div>
      <div className="my-2">
        <Input
          color="secondary"
          isRequired
          type="password"
          label={t("intro.pw")}
          value={password}
          autoComplete="current-password"
          className="max-w-xs bg-white rounded-2xl"
          onChange={handleChange("password", setPassword)}
          isInvalid={!!fieldErrors.password}
          errorMessage={fieldErrors.password}
        />
      </div>

      <div>
        <Button
          className={getBtnClassNames("w-80 h-12")}
          color="primary"
          variant="shadow"
          type="submit"
        >
          {isLogin ? t("intro.lo") : t("intro.si")}
        </Button>
      </div>
    </form>
  );
};

export default ConnexionForm;
