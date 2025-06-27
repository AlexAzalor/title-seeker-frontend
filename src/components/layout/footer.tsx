import { CircleHelp, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export const Footer = () => {
  const t = useTranslations("HomePage.footer");
  const helpCenter = useTranslations("MenuItems.helpCenter");
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-blue-400">Title Seeker</h3>
            <p className="text-sm text-gray-300">{t("shortText")}</p>
            <div className="text-sm text-gray-400">
              Version {process.env.NEXT_PUBLIC_APP_VERSION}
            </div>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-blue-400">
              {t("contact")}
            </h4>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                {/* <span className="text-blue-400">📧</span> */}
                <a
                  href="mailto:yablunovsky.a@gmail.com"
                  className="flex gap-1 transition-colors hover:text-blue-400"
                >
                  <Mail size={18} />
                  <span>yablunovsky.a@gmail.com</span>
                </a>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-blue-400">
              {t("support")}
            </h4>
            <div className="space-y-2 text-sm text-gray-300">
              <Link
                href="/help-center"
                className="flex gap-1 transition-colors hover:text-blue-400"
              >
                <CircleHelp size={18} />
                <span>{helpCenter("label")}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t border-gray-700 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-xs text-gray-400">
              © 2025 Title Seeker. All rights reserved.
            </p>
            <div className="flex gap-4 text-xs text-gray-400">
              <Link
                href="/privacy-policy"
                className="transition-colors hover:text-blue-400"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
