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
}) => {
  const { t } = useTranslation();

  return (
    <form className="w-60 z-20" onSubmit={handleSubmit}>
      {!isLogin && (
        <div className="my-2">
          <Input
            color="secondary"
            isRequired
            type="text"
            label={t("intro.un")}
            value={username}
            className="max-w-xs bg-white rounded-2xl"
            onChange={(e) => setUsername(e.target.value)}
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
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="my-2">
        <Input
          color="secondary"
          isRequired
          type="password"
          label={t("intro.pw")}
          value={password}
          autocomplete="current-password"
          className="max-w-xs bg-white rounded-2xl"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div>
        <Button
          className={getBtnClassNames("w-60")}
          color="primary"
          variant="shadow"
          // className="my-2 hover:bg-primary hover:text-primary-foreground animate-pulse"
          type="submit"
        >
          {isLogin ? t("intro.lo") : t("intro.si")}
        </Button>
      </div>
    </form>
  );
};

export default ConnexionForm;
