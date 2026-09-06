import { staticDataSource } from "./staticDataSource";
import type { CommunityDataSource } from "./communityDataSource";
export function getDataSource(): CommunityDataSource {
  const source = process.env.DATA_SOURCE ?? "static";
  if (source !== "static")
    throw new Error(
      "Google Sheets is not connected. Implement the adapter before changing DATA_SOURCE.",
    );
  return staticDataSource;
}
