import {
  Calendar,
  Clock,
  Building2,
  Code2,
  ExternalLink,
  Briefcase,
} from "lucide-react";
import { skillsTools } from "../page";
import type React from "react";

type Project = {
  id: string;
  name: string;
  company: string;
  startDate: string;
  endDate: string;
  duration?: string;
  description: string;
  responsibilities?: string[];
  technologies?: {
    label: string;
    icon: React.ReactNode;
  }[];
  githubUrl?: string;
  liveUrl?: string;
  type: "professional" | "personal" | "freelance";
};

const projects: Project[] = [
  {
    id: "7",
    name: "Title Seeker",
    company: "Pet project",
    startDate: "11.2024",
    endDate: "present",
    description:
      "A platform with a database of titles, where there are many different creative filters for searching, the ability to rate, use a unique analysis system, see statistics, etc. The project was created to quickly find the desired title and reduce false expectations from watching.",
    responsibilities: [
      "Worked across the full development cycle, from frontend and backend to CI/CD setup and deployment.",
      "Implemented multi-language support, light/dark themes, and high-quality mobile responsiveness for a seamless user experience.",
      "Built a complex 8-step form for adding new titles, with validation and saving.",
      "Developed creative approaches for analyzing titles.",
      "I implemented only the first part of my big idea.",
    ],
    technologies: skillsTools.filter((e) =>
      [
        "Next.js",
        "TailWindCSS",
        "Shadcn/UI",
        "Playwright",
        "Flask",
        "FastAPI",
        "PostgreSQL",
        "Testing",
        "AWS",
      ].includes(e.label),
    ),
    liveUrl: "https://titleseeker.com/",
    type: "personal",
  },
  {
    id: "6",
    name: "Kraftjar",
    company: "Simple2B",
    startDate: "07.2024",
    endDate: "11.2024",
    duration: "4 months",
    description:
      "A service for finding specialists for various services from household to business tasks. The opportunity to be both a customer and an executor. The main platform is a mobile application.",
    responsibilities: [
      "Built a landing page designed to introduce users to the core functionality of the main application.",
      "Took full responsibility for the backend, which serves both the landing page and the mobile application.",
      "Implemented the core business logic managing interactions between clients and service providers — from job acceptance to completion.",
      "Integrated Google and Apple authentication, ensuring secure and seamless user login across platforms.",
    ],
    technologies: skillsTools.filter((e) =>
      ["Next.js", "TailWindCSS", "FastAPI", "Flask", "PostgreSQL"].includes(
        e.label,
      ),
    ),
    liveUrl: "https://kraftjar.net/uk",
    type: "professional",
  },
  {
    id: "5",
    name: "Bidhive",
    company: "Simple2B",
    startDate: "12.2024",
    endDate: "07.2024",
    duration: "7 months",
    description:
      "Second iteration of work with this customer. Continued feature implementation and support.",
    liveUrl: "https://bidhive.com/",
    type: "professional",
  },
  {
    id: "4",
    name: "Komunalka",
    company: "Simple2B",
    startDate: "08.2023",
    endDate: "12.2023",
    duration: "4 months",
    description:
      "Project from Ukrainian customers. Platform for paying for utility services, account manager, viewing graphs with statistics, ability to connect more than one apartment, etc. (The work was only with the frontend part because their backend is a business secret.)",
    responsibilities: [
      "Built the entire frontend architecture from scratch, following modern best practices.",
      "Implemented a wide range of client-specific requirements, ensuring precision and usability across all features.",
      "Collaborated closely with backend developers from another company, maintaining clear communication.",
      "Integrated multiple APIs, including address lookup, apartment data and personal account management.",
      "Handled data visualization, performing calculations and displaying complex statistics accurately using interactive charts.",
    ],
    technologies: skillsTools.filter((e) =>
      ["Next.js", "TailWindCSS", "Material UI"].includes(e.label),
    ),
    liveUrl: "https://www.komunalka.ua/",
    type: "professional",
  },
  {
    id: "3",
    name: "Simple2B Portfolio site",
    company: "Simple2B",
    startDate: "06.2023",
    endDate: "08.2023",
    duration: "2 months",
    description:
      "This is an internal project of the company to find potential customers and candidates. To apply, the candidate must pass a small technical quiz. There is also a portfolio with developed projects.",
    responsibilities: [
      "Refactored the entire CSS codebase and migrated styles to TailwindCSS, improving consistency, scalability, and development speed.",
      "Implemented an email sending system.",
      "Developed a quiz flow, including logic for questions, progress tracking, and result handling.",
    ],
    // technologies: simple2bTech,
    technologies: skillsTools.filter((e) =>
      ["Next.js", "TailWindCSS", "FastAPI"].includes(e.label),
    ),
    liveUrl: "https://simple2b.com/en",
    type: "professional",
  },
  {
    id: "2",
    name: "Bidhive",
    company: "Simple2B",
    startDate: "08.2022",
    endDate: "06.2023",
    duration: "11 months",
    description:
      "A long-term project that was already about 6 years old. It is a very rich manager that allows businesses to work more efficiently with bids/contracts/tenders. Tables, analytics, statistics, scrapers, history with timeline and much more. Servers are located in 3 regions – Australia, United Kingdom and US.",
    responsibilities: [
      "Implemented and integrated numerous new features into an existing architecture without breaking legacy functionality.",
      "Fixed many long-standing bugs and improved overall system stability and performance. Notably identified and resolved a critical bug that caused the timeline page to slow down and crash.",
      "Maintained direct communication with the customer, discussing feature requirements and implementation details collaboratively.",
      "Took responsibility for deploying updates across three regional environments, each with its own user base and infrastructure.",
      "Reacted quickly to user-reported issues and delivered timely fixes to minimize downtime and improve user experience.",
    ],
    technologies: skillsTools.filter((e) =>
      ["React", "TypeScript", "Styled Components", "Django", "AWS"].includes(
        e.label,
      ),
    ),
    liveUrl: "https://bidhive.com/",
    type: "professional",
  },
  {
    id: "1",
    name: "Different small projects and assistance",
    company: "Simple2B",
    // role: "Full Stack Developer",
    startDate: "03.2022",
    endDate: "08.2022",
    duration: "5 months",
    description: "In the beginning I participated in various projects.",
    responsibilities: [
      "Studied Python and backend fundamentals while gaining hands-on experience with real tasks",
      "Built a service-based landing page with an image gallery presented as a responsive carousel",
      "Developed a Chrome extension — a fuel cost calculator that estimates trip expenses between two locations based on vehicle model and fuel type",
      "Contributed to several larger projects by assisting teammates with various tasks, bug fixes, and code reviews, gaining exposure to collaborative workflows and real-world codebases",
    ],
    technologies: skillsTools.filter((e) =>
      [
        "HTML",
        "CSS",
        "SASS",
        "JavaScript",
        "React",
        "TypeScript",
        "Python",
        "FastAPI",
      ].includes(e.label),
    ),
    type: "professional",
  },
];

const getTypeColor = (type: Project["type"]) => {
  switch (type) {
    case "professional":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    case "personal":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    case "freelance":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
  }
};

const getTypeIcon = (type: Project["type"]) => {
  switch (type) {
    case "professional":
      return <Building2 className="h-4 w-4" />;
    case "personal":
      return <Code2 className="h-4 w-4" />;
    case "freelance":
      return <Briefcase className="h-4 w-4" />;
    default:
      return <Code2 className="h-4 w-4" />;
  }
};

export default function MyProjectsPage() {
  return (
    <div className="p-4 lg:col-span-2 lg:p-6">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-slate-800 dark:text-white">
          Professional Experience
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          A comprehensive overview of my development projects and professional
          journey
        </p>
      </div>

      <div className="space-y-6">
        {projects.map((project) => (
          <div
            id={project.id}
            key={project.id}
            className="rounded-2xl border border-white/20 bg-white/90 p-6 shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-xl dark:border-slate-700/20 dark:bg-slate-800/90"
          >
            <div className="mb-2 flex items-center justify-between">
              <span
                className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getTypeColor(project.type)}`}
              >
                {getTypeIcon(project.type)}
                {project.type}
              </span>
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-slate-100 p-2 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600"
                >
                  <ExternalLink className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                </a>
              )}
            </div>

            <div className="mb-4 flex flex-col justify-between lg:flex-row lg:items-center">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-3">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                    {project.name}
                  </h2>
                </div>
                <p className="font-medium text-slate-600 dark:text-slate-400">
                  {project.company}
                </p>
              </div>
            </div>

            <div className="mb-6 flex flex-col gap-4 sm:flex-row">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">
                  {project.startDate} - {project.endDate}
                </span>
              </div>
              {project.duration && (
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{project.duration}</span>
                </div>
              )}
            </div>

            <p className="mb-4 leading-relaxed text-slate-700 dark:text-slate-300">
              {project.description}

              {project.id === "5" && (
                <a
                  className="inline text-blue-600 dark:text-blue-400"
                  href="#2"
                >
                  {" "}
                  Go to first
                </a>
              )}
            </p>

            {project.responsibilities && (
              <div className="mb-6">
                <h3 className="mb-3 text-lg font-semibold text-slate-800 dark:text-white">
                  Key Responsibilities
                </h3>
                <ul className="space-y-2">
                  {project.responsibilities.map((responsibility, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600"></div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {responsibility}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.technologies && (
              <div>
                <h3 className="mb-3 text-lg font-semibold text-slate-800 dark:text-white">
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
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
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
