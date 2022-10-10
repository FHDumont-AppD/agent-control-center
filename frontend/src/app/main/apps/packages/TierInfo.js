import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import clsx from "clsx";
import { Chip } from "@mui/material";

function TierInfo({ tier, className }) {
  if (!tier) {
    return null;
  }

  return (
    <div className={clsx("w-full", className)}>
      <Typography className="text-16 font-medium">{tier.tierName}</Typography>

      <Typography className="text-13 mt-2 line-clamp-2" color="text.secondary">
        {tier.description}
      </Typography>

      <Divider className="w-48 my-8 border-1" light />

      <Typography
        className="flex items-center space-x-6 text-13"
        color="text.secondary"
      >
        <span className="whitespace-nowrap leading-none w-120">
          <i>Type</i>
        </span>
        <span className="whitespace-nowrap leading-none">
          {tier.tierType.toUpperCase()}
        </span>
      </Typography>
      {tier.tierType == "java" && (
        <Typography
          className="flex items-center space-x-6 text-13 mt-8"
          color="text.secondary"
        >
          <span className="whitespace-nowrap leading-none w-120">
            <i>Application Server</i>
          </span>
          <span className="whitespace-nowrap leading-none">
            {tier.applicationServer.toUpperCase()}
          </span>
        </Typography>
      )}
      {/* {tier.applicationServer != "none" && (
        <Typography
          className="flex items-center space-x-6 text-13 mt-8"
          color="text.secondary"
        >
          <span className="whitespace-nowrap leading-none w-120">
            <i>Config File</i>
          </span>
          <span className="whitespace-nowrap leading-none">
            {tier.applicationServerConfigFile}
          </span>
        </Typography>
      )} */}
      <Typography
        className="flex items-center space-x-6 text-13 mt-8"
        color="text.secondary"
      >
        <span className="whitespace-nowrap leading-none w-120">
          <i>Inventory</i>
        </span>
        <span className="whitespace-nowrap leading-none">
          {tier.inventoryType == "file" ? tier.inventory : "STATIC"}
        </span>
      </Typography>
      <div className="flex items-center space-x-6 text-13 mt-8">
        <Typography
          color="text.secondary"
          className="whitespace-nowrap leading-none w-120"
        >
          <span>
            <i>Restart App</i>
          </span>
        </Typography>
        <Chip
          className="font-semibold text-12"
          label={tier.restartApp ? "YES" : "NO"}
          color="secondary"
          size="small"
          variant="outlined"
        />
      </div>
    </div>
  );
}

export default TierInfo;
