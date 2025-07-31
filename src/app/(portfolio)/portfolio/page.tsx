import { TestTubeDiagonal } from "lucide-react";
import {
  AWSIcon,
  ChatGPTIcon,
  CSSIcon,
  DjangoIcon,
  DockerIcon,
  FastAPIIcon,
  FigmaIcon,
  FlaskIcon,
  GithubIcon,
  GitIcon,
  HTMLIcon,
  JavaScriptIcon,
  MaterialUiIcon,
  NextJsIcon,
  NPMIcon,
  PlaywrightIcon,
  PostgreSQLIcon,
  PythonIcon,
  ReactIcon,
  RestApiIcon,
  SassIcon,
  ShadcnIcon,
  StyledComponentstIcon,
  TailwindCSSIcon,
  TypeScriptIcon,
  UbuntuIcon,
  VSCodeIcon,
  WindowsIcon,
  YarnIcon,
} from "@/lib/portfolio/tech-icons";

export const skillsTools = [
  {
    label: "Next.js",
    icon: <NextJsIcon />,
  },
  {
    label: "React",
    icon: <ReactIcon />,
  },
  {
    label: "JavaScript",
    icon: <JavaScriptIcon />,
  },
  {
    label: "TypeScript",
    icon: <TypeScriptIcon />,
  },
  {
    label: "HTML",
    icon: <HTMLIcon />,
  },
  {
    label: "CSS",
    icon: <CSSIcon />,
  },
  {
    label: "SASS",
    icon: <SassIcon />,
  },
  {
    label: "Tailwind CSS",
    icon: <TailwindCSSIcon />,
  },
  {
    label: "Styled Components",
    icon: <StyledComponentstIcon />,
  },

  {
    label: "Shadcn/UI",
    icon: <ShadcnIcon />,
  },
  {
    label: "Material UI",
    icon: <MaterialUiIcon />,
  },
  {
    label: "npm",
    icon: <NPMIcon />,
  },
  {
    label: "yarn",
    icon: <YarnIcon />,
  },
  {
    label: "Playwright",
    icon: <PlaywrightIcon />,
  },
  {
    label: "Python",
    icon: <PythonIcon />,
  },
  {
    label: "Flask",
    icon: <FlaskIcon />,
  },
  {
    label: "Django",
    icon: <DjangoIcon />,
  },
  {
    label: "FastAPI",
    icon: <FastAPIIcon />,
  },
  {
    label: "PostgreSQL",
    icon: <PostgreSQLIcon />,
  },
  {
    label: "Testing",
    icon: <TestTubeDiagonal />,
  },
  {
    label: "Docker",
    icon: <DockerIcon />,
  },
  {
    label: "VS Code",
    icon: <VSCodeIcon />,
  },
  {
    label: "Figma",
    icon: <FigmaIcon />,
  },
  {
    label: "Git",
    icon: <GitIcon />,
  },
  {
    label: "GitHub",
    icon: <GithubIcon />,
  },
  {
    label: "ChatGPT",
    icon: <ChatGPTIcon />,
  },
  {
    label: "Windows",
    icon: <WindowsIcon />,
  },
  {
    label: "WSL / Ubuntu",
    icon: <UbuntuIcon />,
  },
  {
    label: "AWS",
    icon: <AWSIcon />,
  },
  // {
  //   label: "REST API",
  //   icon: <RestApiIcon />,
  // },

  // Vitest, Pytest
];

const softSkills = [
  "Self-Discipline",
  "Responsibility",
  "Problem Solving",
  "Teamwork",
  "Curiosity",
  "Learning Agility",
  "Creativity",
  "Time Management",
  "Decision Making",
  "Attention to Detail",
  "Adaptability",
  "Self-Motivation",
  "Stress Management",
];

export default function PortfolioPage() {
  return (
    <div className="lg:col-span-2">
      <div className="mx-2 flex h-full flex-col rounded-2xl border border-white/20 bg-white/90 p-8 shadow-xl backdrop-blur-md dark:border-slate-700/20 dark:bg-slate-800/90">
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-bold text-slate-800 dark:text-white">
            About Me
          </h2>
          <div className="flex flex-col gap-2">
            <p className="leading-relaxed text-slate-600 dark:text-slate-300">
              I discovered web development in 2021 while searching for my true
              passion. After building my first project using HTML and CSS, I
              realized how much I enjoyed the process and decided to pursue it
              seriously. Joining a frontend development course was a major
              turning point in my life — it gave me valuable knowledge and
              hands-on experience from industry professionals.
            </p>
            <p className="leading-relaxed text-slate-600 dark:text-slate-300">
              My first job was at an outsourcing company, where I had the
              opportunity to work on a wide variety of projects. Each project
              challenged me in new ways and became not just a task list, but a
              creative space where I could learn and experiment. I’ve always had
              a lot of ideas, and software development became the perfect way to
              bring them to life.
            </p>

            <p className="leading-relaxed text-slate-600 dark:text-slate-300">
              That company gave me the freedom to grow beyond frontend: I got
              practical experience in backend development and even DevOps.
            </p>

            <p className="leading-relaxed text-slate-600 dark:text-slate-300">
              After finishing that chapter, I started building my own project —
              an idea I had been nurturing for years. Thanks to the experience
              and skills I gained during my first job, I was able to turn that
              dream into a real product.
            </p>
          </div>
        </div>

        <div className="flex-1">
          <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-white">
            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-300 to-blue-500"></div>
            Key Technologies
          </h3>
          <div className="flex flex-wrap gap-2">
            {skillsTools.map((tech) => (
              <span
                key={tech.label}
                className="flex items-center gap-1 rounded-full bg-gradient-to-r from-slate-100 to-slate-200 px-3 py-2 font-medium text-slate-700 transition-all duration-300 hover:from-blue-100 hover:to-blue-200"
              >
                {tech.icon}
                <span>{tech.label}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-white">
            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
            Soft Skills
          </h3>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {softSkills.map((skill) => (
              <div
                key={skill}
                className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 p-3 text-center shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md dark:from-slate-700/50 dark:to-slate-600/50"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <span className="relative z-10 text-sm font-medium text-slate-700 dark:text-slate-300">
                  {skill}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
