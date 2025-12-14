import {
  Instagram,
  Facebook,
  MessageCircle,
  Link,
  Twitter,
  Gamepad2,
} from "lucide-react";
import { JSX } from "react";

export const iconMap: Record<string, JSX.Element> = {
  instagram: <Instagram size={20} />,
  facebook: <Facebook size={20} />,
  snapchat: <MessageCircle size={20} />,
  threads: <Link size={20} />,
  twitter: <Twitter size={20} />,
  discord: <Gamepad2 size={20} />,
};
