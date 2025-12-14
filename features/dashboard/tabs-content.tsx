import { TabsContent } from "@/components/ui/tabs";
import SocialInputs from "./inputs/social-inputs";
import ProfessionalInputs from "./inputs/professional-inputs";
import CreativeInputs from "./inputs/creative-inputs";
import StorefrontInputs from "./inputs/storefont-inputs";
import MessagingInputs from "./inputs/messaging-inputs";
import MiscInputs from "./inputs/misc-inputs";

export const TabsContents = () => {
  return (
    <div>
      <TabsContent value="social">
        <SocialInputs />
      </TabsContent>
      <TabsContent value="professional">
        <ProfessionalInputs />
      </TabsContent>
      <TabsContent value="creative">
        <CreativeInputs />
      </TabsContent>
      <TabsContent value="messaging">
        <MessagingInputs />
      </TabsContent>
      <TabsContent value="storefront">
        <StorefrontInputs />
      </TabsContent>
      <TabsContent value="miscellaneous">
        <MiscInputs />
      </TabsContent>
    </div>
  );
};
