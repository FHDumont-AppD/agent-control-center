import i18next from "i18next";
import en from "./navigation-i18n/en";
import pt from "./navigation-i18n/pt";

i18next.addResourceBundle("en", "navigation", en);
i18next.addResourceBundle("pt", "navigation", pt);

const navigationConfig = [
  {
    id: "appdd",
    title: "appd",
    subtitle: "AppDynamics options",
    type: "group",
    icon: "heroicons-outline:home",
    translate: "APPDYNAMICS",
    children: [
      {
        id: "appd.agents",
        title: "Agents",
        translate: "APPD_AGENTS",
        type: "item",
        icon: "heroicons-outline:collection",
        url: "/agents",
      },
      {
        id: "appd.task",
        title: "Tasks",
        translate: "APPD_TASKS",
        type: "item",
        icon: "heroicons-outline:document-download",
        url: "/tasks",
      },
    ],
  },
  {
    id: "setup",
    title: "setup",
    subtitle: "General preferences",
    type: "group",
    icon: "heroicons-outline:home",
    translate: "SETUP",
    children: [
      {
        id: "setup.keys",
        title: "Keys",
        translate: "SETUP_KEYS",
        type: "item",
        icon: "heroicons-outline:key",
        url: "/keys",
      },
      {
        id: "setup.controllers",
        title: "Controllers",
        translate: "SETUP_CONTROLLERS",
        type: "item",
        icon: "heroicons-outline:server",
        url: "/controller",
      },
    ],
  },
];

export default navigationConfig;
