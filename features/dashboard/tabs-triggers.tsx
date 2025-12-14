import { TabsList, TabsTrigger } from "@/components/ui/tabs";

export const TabsTriggers = () => {
  return (
    <TabsList>
      <TabsTrigger value="social">Social</TabsTrigger>
      <TabsTrigger value="professional">Professional</TabsTrigger>
      <TabsTrigger value="creative">Creative</TabsTrigger>
      <TabsTrigger value="messaging">Messaging</TabsTrigger>
      <TabsTrigger value="storefront">Storefront</TabsTrigger>
      <TabsTrigger value="miscellaneous">Miscellaneous</TabsTrigger>
    </TabsList>
  );
};
