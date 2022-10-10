import "./api/auth-api";
import "./api/notifications-api";

import history from "@history";
import mock from "./mock";

mock.onAny().passThrough();

if (module?.hot?.status() === "apply") {
  const { pathname } = history.location;
  history.push("/loading");
  history.push({ pathname });
}

// https://github.com/axios/axios#config-defaults
// https://github.com/ctimmerm/axios-mock-adapter
// https://www.sergiojunior.com.br/mockando-suas-requisicoes-like-a-pro
// https://gorest.co.in/
