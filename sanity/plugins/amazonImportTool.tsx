import { DownloadIcon } from "@sanity/icons";
import { definePlugin } from "sanity";

import AmazonImportTool from "@/sanity/components/AmazonImportTool";

export const amazonImportTool = definePlugin({
  name: "amazon-import-tool",
  tools: [
    {
      name: "amazon-import",
      title: "Amazon Import",
      icon: DownloadIcon,
      component: AmazonImportTool,
    },
  ],
});
