import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function SocialInputs() {
  const form = useFormContext();

  return (
    <div className="flex flex-col gap-6 my-3">
      <FormField
        control={form.control}
        name="social.instagram"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-light">Instagram</FormLabel>
            <FormControl>
              <Input
                placeholder="https://www.instagram.com/username"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="social.twitter"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-light">Twitter</FormLabel>
            <FormControl>
              <Input placeholder="ttps://www.x.com/username" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
