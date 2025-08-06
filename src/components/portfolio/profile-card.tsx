import { TelegramIcon } from "@/lib/portfolio/tech-icons";
import { Download, Github, Linkedin, Mail, MapPin } from "lucide-react";
import Image from "next/image";

export const ProfileCard = () => {
  return (
    <div className="lg:col-span-1">
      <div className="sticky top-0 mx-2 h-auto rounded-2xl border border-white/20 bg-white/90 p-6 shadow-xl backdrop-blur-md dark:border-slate-700/20 dark:bg-slate-800/90">
        {/* Profile Image */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
            <Image
              src="https://static.titleseeker.com/other/Me.webp"
              width={112}
              height={112}
              alt="Me"
              className="rounded-full"
            />
          </div>
        </div>

        {/* Name & Position */}
        <div className="mb-6 text-center">
          <h1 className="mb-2 text-2xl font-bold text-slate-800 dark:text-white">
            Oleksandr Yablunovsky
          </h1>
          <p className="text-xl font-medium text-blue-600 dark:text-blue-400">
            Full Stack developer
          </p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Passionate Full Stack Developer with 3+ years of experience, driven
            by a love for coding and a constant desire to grow.
          </p>
        </div>

        {/* Contact Info */}
        <div className="mb-6 space-y-3">
          <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
            <a
              href="mailto:yablunovsky.a@gmail.com"
              className="flex items-center gap-1 font-semibold hover:text-blue-600"
            >
              <Mail size={18} />
              <span>yablunovsky.a@gmail.com</span>
            </a>
          </div>
          {/* <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
              <Phone className="h-4 w-4" />
              <span className="text-sm">+1 (555) 123-4567</span>
            </div> */}
          <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">Lviv, Ukraine</span>
          </div>
        </div>

        {/* Social Links */}
        <div className="mb-6 flex justify-center gap-4">
          <a
            href="https://www.linkedin.com/in/oleksandr-yablunovsky-9a459122a"
            target="_blank"
            className="rounded-lg bg-slate-100 p-2 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600"
          >
            <Linkedin className="h-5 w-5 text-blue-600" />
          </a>
          <a
            href="https://github.com/AlexAzalor"
            target="_blank"
            className="rounded-lg bg-slate-100 p-2 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600"
          >
            <Github className="h-5 w-5 text-slate-700 dark:text-slate-300" />
          </a>
          <a
            href="https://telegram.me/yablunovsky_alexandr"
            target="_blank"
            className="rounded-lg bg-slate-100 p-2 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600"
          >
            <TelegramIcon />
          </a>
        </div>

        <div className="mb-6 text-center">
          <p className="text-lg font-medium text-blue-600 dark:text-blue-400">
            Languages
          </p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            English (Intermediate)
          </p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Ukrainian (Native)
          </p>
        </div>

        <a
          href="https://static.titleseeker.com/other/Oleksandr_Yablunovsky_CV_Full_Stack_developer.pdf"
          target="_blank"
          download
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-3 font-medium text-white shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
        >
          <Download className="h-4 w-4" />
          Download CV
        </a>
      </div>
    </div>
  );
};
