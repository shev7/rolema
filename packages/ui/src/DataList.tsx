import { DataList as RadixDataList } from "@radix-ui/themes";

export const DataList = (props: RadixDataList.RootProps) => (
  <RadixDataList.Root {...props} />
);

DataList.Item = RadixDataList.Item;
DataList.Label = RadixDataList.Label;
DataList.Value = RadixDataList.Value;
