import {
  Calendar,
  Clock,
  Building2,
  Code2,
  ExternalLink,
  Github,
  Briefcase,
} from "lucide-react";
import {
  bidhiveTech,
  komunalka,
  kraftjar,
  simple2bTech,
  smallProjects,
  titleSeeker,
} from "../page";

interface Project {
  id: string;
  name: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  duration: string;
  description: string;
  responsibilities: string[];
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  type: "professional" | "personal" | "freelance";
}

const projects: Project[] = [
  {
    id: "1",
    name: "Title Seeker Platform",
    company: "Personal Project",
    role: "Full Stack Developer",
    startDate: "2024-01",
    endDate: "2024-12",
    duration: "12 months",
    description:
      "A comprehensive movie discovery platform with advanced search capabilities, user profiles, and personalized recommendations.",
    responsibilities: [
      "Designed and implemented the entire frontend architecture",
      "Built responsive UI components with modern design patterns",
      "Integrated with backend APIs using auto-generated clients",
      "Implemented comprehensive testing with Playwright and Vitest",
      "Set up CI/CD pipeline with Docker containerization",
    ],
    technologies: [
      "Next.js 14",
      "TypeScript",
      "TailwindCSS",
      "Shadcn/ui",
      "Orval",
      "Playwright",
      "Vitest",
      "Docker",
      "PostgreSQL",
      "REST APIs",
    ],
    githubUrl: "https://github.com/AlexAzalor/title-seeker-frontend",
    type: "personal",
  },
  {
    id: "2",
    name: "E-Commerce Dashboard",
    company: "TechCorp Solutions",
    role: "Senior Frontend Developer",
    startDate: "2023-06",
    endDate: "2024-01",
    duration: "7 months",
    description:
      "Built a comprehensive admin dashboard for managing products, orders, and analytics for a large e-commerce platform.",
    responsibilities: [
      "Developed reusable component library",
      "Implemented complex data visualization charts",
      "Optimized application performance and loading times",
      "Mentored junior developers on React best practices",
      "Collaborated with UX team on user interface improvements",
    ],
    technologies: [
      "React",
      "TypeScript",
      "Redux Toolkit",
      "Material-UI",
      "Chart.js",
      "Webpack",
      "Jest",
      "React Testing Library",
      "Storybook",
    ],
    type: "professional",
  },
  {
    id: "3",
    name: "Real Estate Management System",
    company: "PropertyTech Inc.",
    role: "Full Stack Developer",
    startDate: "2022-09",
    endDate: "2023-05",
    duration: "9 months",
    description:
      "Developed a complete property management system with tenant management, payment processing, and maintenance tracking.",
    responsibilities: [
      "Built RESTful APIs with Node.js and Express",
      "Designed database schema and relationships",
      "Implemented user authentication and authorization",
      "Created responsive frontend with React",
      "Integrated third-party payment processing APIs",
    ],
    technologies: [
      "Node.js",
      "Express",
      "PostgreSQL",
      "React",
      "JavaScript",
      "JWT",
      "Stripe API",
      "AWS S3",
      "Docker",
      "Nginx",
    ],
    liveUrl: "https://propertytech-demo.com",
    type: "professional",
  },
  {
    id: "4",
    name: "Task Management App",
    company: "Freelance Project",
    role: "Frontend Developer",
    startDate: "2022-05",
    endDate: "2022-08",
    duration: "4 months",
    description:
      "Created a collaborative task management application with real-time updates and team collaboration features.",
    responsibilities: [
      "Implemented real-time collaboration using WebSockets",
      "Built drag-and-drop interface for task management",
      "Developed notification system",
      "Optimized for mobile responsiveness",
      "Integrated with calendar applications",
    ],
    technologies: [
      "Vue.js",
      "Vuex",
      "Socket.io",
      "Tailwind CSS",
      "Node.js",
      "MongoDB",
      "Express",
      "JWT",
      "Cloudinary",
    ],
    type: "freelance",
  },
  {
    id: "5",
    name: "Portfolio Website",
    company: "Personal Project",
    role: "Full Stack Developer",
    startDate: "2022-01",
    endDate: "2022-04",
    duration: "4 months",
    description:
      "Personal portfolio website showcasing projects and skills with modern design and smooth animations.",
    responsibilities: [
      "Designed modern UI/UX with Figma",
      "Implemented smooth animations and transitions",
      "Built responsive design for all devices",
      "Optimized for SEO and performance",
      "Set up analytics and contact forms",
    ],
    technologies: [
      "React",
      "Gatsby",
      "GraphQL",
      "Styled Components",
      "Framer Motion",
      "Netlify",
      "Contentful CMS",
      "Google Analytics",
    ],
    githubUrl: "https://github.com/AlexAzalor/portfolio",
    liveUrl: "https://alexazalor.dev",
    type: "personal",
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
        <div className="rounded-2xl border border-white/20 bg-white/90 p-6 shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-xl dark:border-slate-700/20 dark:bg-slate-800/90">
          {/* Project Header */}
          <div className="mb-4 flex flex-col justify-between lg:flex-row lg:items-center">
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-3">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                  Different small projects
                </h2>
                <span
                  className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getTypeColor("professional")}`}
                >
                  {getTypeIcon("professional")}
                  {/* {project.type} */}
                </span>
              </div>
              <p className="font-medium text-slate-600 dark:text-slate-400">
                Simple2B
              </p>
            </div>

            {/* <div className="mt-4 flex items-center gap-4 lg:mt-0">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-slate-100 p-2 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600"
                    >
                      <Github className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                    </a>
                  )}
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
                </div> */}
          </div>

          {/* Timeline Info */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">03.2022 - 08.2022</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Clock className="h-4 w-4" />
              <span className="text-sm">5 months</span>
            </div>
          </div>

          {/* Description */}
          <p className="mb-4 leading-relaxed text-slate-700 dark:text-slate-300">
            In the beginning I participated in various projects.
          </p>

          {/* Responsibilities */}
          <div className="mb-6">
            <h3 className="mb-3 text-lg font-semibold text-slate-800 dark:text-white">
              Key Responsibilities
            </h3>
            <ul className="space-y-2">
              {[
                "Studied Python and backend fundamentals while gaining hands-on experience with real tasks",
                "Built a service-based landing page with an image gallery presented as a responsive carousel",
                "Developed a Chrome extension — a fuel cost calculator that estimates trip expenses between two locations based on vehicle model and fuel type",
                "Contributed to several larger projects by assisting teammates with various tasks, bug fixes, and code reviews, gaining exposure to collaborative workflows and real-world codebases",
              ].map((responsibility, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600"></div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {responsibility}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Technologies */}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-slate-800 dark:text-white">
              Technologies Used
            </h3>
            <div className="flex flex-wrap gap-2">
              {smallProjects.map((tech) => (
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
        </div>

        {/* ---------------------------------------------------------------------------------------- */}

        <div className="rounded-2xl border border-white/20 bg-white/90 p-6 shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-xl dark:border-slate-700/20 dark:bg-slate-800/90">
          {/* Project Header */}
          <div className="mb-4 flex flex-col justify-between lg:flex-row lg:items-center">
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-3">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                  Bidhive
                </h2>
                <span
                  className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getTypeColor("professional")}`}
                >
                  {getTypeIcon("professional")}
                  professional
                </span>
              </div>
              <p className="font-medium text-slate-600 dark:text-slate-400">
                Simple2B
              </p>
            </div>

            <div className="mt-4 flex items-center gap-4 lg:mt-0">
              {/* {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-slate-100 p-2 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600"
                    >
                      <Github className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                    </a>
                  )} */}
              <a
                href="https://bidhive.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-slate-100 p-2 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600"
              >
                <ExternalLink className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              </a>
            </div>
          </div>

          {/* Timeline Info */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">08.2022 - 06.2023</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Clock className="h-4 w-4" />
              <span className="text-sm">11 months</span>
            </div>
          </div>

          {/* Description */}
          <p className="mb-4 leading-relaxed text-slate-700 dark:text-slate-300">
            A long-term project that was already about 6 years old. It is a very
            rich manager that allows businesses to work more efficiently with
            bids/contracts/tenders. Tables, analytics, statistics, scrapers,
            history with timeline and much more. Servers are located in 3
            regions – Australia, United Kingdom and USA.
          </p>

          {/* Responsibilities */}
          <div className="mb-6">
            <h3 className="mb-3 text-lg font-semibold text-slate-800 dark:text-white">
              Key Responsibilities
            </h3>
            <ul className="space-y-2">
              {[
                "Implemented and integrated numerous new features into an existing architecture without breaking legacy functionality.",
                "Fixed many long-standing bugs and improved overall system stability and performance. Notably identified and resolved a critical bug that caused the timeline page to slow down and crash.",
                "Maintained direct communication with the client, discussing feature requirements and implementation details collaboratively.",
                "Took responsibility for deploying updates across three regional environments, each with its own user base and infrastructure.",
                "Reacted quickly to user-reported issues and delivered timely fixes to minimize downtime and improve user experience.",
              ].map((responsibility, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600"></div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {responsibility}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Technologies */}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-slate-800 dark:text-white">
              Technologies Used
            </h3>
            <div className="flex flex-wrap gap-2">
              {bidhiveTech.map((tech) => (
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
        </div>

        {/* ---------------------------------------------------------------------------------------- */}

        <div className="rounded-2xl border border-white/20 bg-white/90 p-6 shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-xl dark:border-slate-700/20 dark:bg-slate-800/90">
          {/* Project Header */}
          <div className="mb-4 flex flex-col justify-between lg:flex-row lg:items-center">
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-3">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                  Simple2B Portfolio site
                </h2>
                <span
                  className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getTypeColor("professional")}`}
                >
                  {getTypeIcon("professional")}
                  professional
                </span>
              </div>
              <p className="font-medium text-slate-600 dark:text-slate-400">
                Simple2B
              </p>
            </div>

            <div className="mt-4 flex items-center gap-4 lg:mt-0">
              {/* {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-slate-100 p-2 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600"
                    >
                      <Github className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                    </a>
                  )} */}

              <a
                href="https://simple2b.com/en"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-slate-100 p-2 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600"
              >
                <ExternalLink className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              </a>
            </div>
          </div>

          {/* Timeline Info */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">06.2023 - 08.2023</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Clock className="h-4 w-4" />
              <span className="text-sm">2 months</span>
            </div>
          </div>

          {/* Description */}
          <p className="mb-4 leading-relaxed text-slate-700 dark:text-slate-300">
            This is an internal project of the company to find potential
            customers and candidates. To apply, the candidate must pass a small
            technical quiz. There is also a portfolio with developed projects.
          </p>

          {/* Responsibilities */}
          <div className="mb-6">
            <h3 className="mb-3 text-lg font-semibold text-slate-800 dark:text-white">
              Key Responsibilities
            </h3>
            <ul className="space-y-2">
              {[
                "Refactored the entire CSS codebase and migrated styles to TailwindCSS, improving consistency, scalability, and development speed.",
                "Implemented an email sending system.",
                "Developed a quiz flow, including logic for questions, progress tracking, and result handling.",
              ].map((responsibility, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600"></div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {responsibility}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Technologies */}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-slate-800 dark:text-white">
              Technologies Used
            </h3>
            <div className="flex flex-wrap gap-2">
              {simple2bTech.map((tech) => (
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
        </div>

        {/* ---------------------------------------------------------------------------------------- */}

        <div className="rounded-2xl border border-white/20 bg-white/90 p-6 shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-xl dark:border-slate-700/20 dark:bg-slate-800/90">
          {/* Project Header */}
          <div className="mb-4 flex flex-col justify-between lg:flex-row lg:items-center">
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-3">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                  Komunalka
                </h2>
                <span
                  className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getTypeColor("professional")}`}
                >
                  {getTypeIcon("professional")}
                  professional
                </span>
              </div>
              <p className="font-medium text-slate-600 dark:text-slate-400">
                Simple2B
              </p>
            </div>

            <div className="mt-4 flex items-center gap-4 lg:mt-0">
              {/* {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-slate-100 p-2 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600"
                    >
                      <Github className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                    </a>
                  )} */}
              <a
                href="https://www.komunalka.ua/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-slate-100 p-2 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600"
              >
                <ExternalLink className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              </a>
            </div>
          </div>

          {/* Timeline Info */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">08.2023 - 12.2023</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Clock className="h-4 w-4" />
              <span className="text-sm">4 months</span>
            </div>
          </div>

          {/* Description */}
          <p className="mb-4 leading-relaxed text-slate-700 dark:text-slate-300">
            Project from Ukrainian customers. Platform for paying for utility
            services, account manager, viewing graphs with statistics, ability
            to connect more than one apartment, etc. (The work was only with the
            frontend part because their backend is a business secret.)
          </p>

          {/* Responsibilities */}
          <div className="mb-6">
            <h3 className="mb-3 text-lg font-semibold text-slate-800 dark:text-white">
              Key Responsibilities
            </h3>
            <ul className="space-y-2">
              {[
                "Built the entire frontend architecture from scratch, following modern best practices.",
                "Implemented a wide range of client-specific requirements, ensuring precision and usability across all features.",
                "Collaborated closely with backend developers from another company, maintaining clear communication.",
                "Integrated multiple APIs, including address lookup, apartment data and personal account management.",
                "Handled data visualization, performing calculations and displaying complex statistics accurately using interactive charts.",
              ].map((responsibility, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600"></div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {responsibility}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Technologies */}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-slate-800 dark:text-white">
              Technologies Used
            </h3>
            <div className="flex flex-wrap gap-2">
              {komunalka.map((tech) => (
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
        </div>

        {/* ---------------------------------------------------------------------------------------- */}

        <div className="rounded-2xl border border-white/20 bg-white/90 p-6 shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-xl dark:border-slate-700/20 dark:bg-slate-800/90">
          {/* Project Header */}
          <div className="mb-4 flex flex-col justify-between lg:flex-row lg:items-center">
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-3">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                  Bidhive
                </h2>
                <span
                  className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getTypeColor("professional")}`}
                >
                  {getTypeIcon("professional")}
                  professional
                </span>
              </div>
              <p className="font-medium text-slate-600 dark:text-slate-400">
                Simple2B
              </p>
            </div>

            <div className="mt-4 flex items-center gap-4 lg:mt-0">
              {/* {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-slate-100 p-2 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600"
                    >
                      <Github className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                    </a>
                  )} */}

              <a
                href="https://bidhive.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-slate-100 p-2 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600"
              >
                <ExternalLink className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              </a>
            </div>
          </div>

          {/* Timeline Info */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">12.2024 - 07.2024</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Clock className="h-4 w-4" />
              <span className="text-sm">7 months</span>
            </div>
          </div>

          {/* Description */}
          <p className="mb-4 leading-relaxed text-slate-700 dark:text-slate-300">
            Second iteration of work with this customer. Continuation of
            development.
          </p>
        </div>

        {/* ---------------------------------------------------------------------------------------- */}

        <div className="rounded-2xl border border-white/20 bg-white/90 p-6 shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-xl dark:border-slate-700/20 dark:bg-slate-800/90">
          {/* Project Header */}
          <div className="mb-4 flex flex-col justify-between lg:flex-row lg:items-center">
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-3">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                  Kraftjar
                </h2>
                <span
                  className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getTypeColor("professional")}`}
                >
                  {getTypeIcon("professional")}
                  professional
                </span>
              </div>
              <p className="font-medium text-slate-600 dark:text-slate-400">
                Simple2B
              </p>
            </div>

            <div className="mt-4 flex items-center gap-4 lg:mt-0">
              {/* {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-slate-100 p-2 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600"
                    >
                      <Github className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                    </a>
                  )} */}

              <a
                href="https://kraftjar.net/uk"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-slate-100 p-2 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600"
              >
                <ExternalLink className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              </a>
            </div>
          </div>

          {/* Timeline Info */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">07.2024 - 11.2024</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Clock className="h-4 w-4" />
              <span className="text-sm">4 months</span>
            </div>
          </div>

          {/* Description */}
          <p className="mb-4 leading-relaxed text-slate-700 dark:text-slate-300">
            A service for finding specialists for various services from
            household to business tasks. The opportunity to be both a customer
            and an executor. The main platform is a mobile application.
          </p>

          {/* Responsibilities */}
          <div className="mb-6">
            <h3 className="mb-3 text-lg font-semibold text-slate-800 dark:text-white">
              Key Responsibilities
            </h3>
            <ul className="space-y-2">
              {[
                "Built a landing page designed to introduce users to the core functionality of the main application.",
                "Took full responsibility for the backend, which serves both the landing page and the mobile application.",
                "Implemented the core business logic managing interactions between clients and service providers — from job acceptance to completion.",
                "Integrated Google and Apple authentication, ensuring secure and seamless user login across platforms.",
              ].map((responsibility, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600"></div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {responsibility}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Technologies */}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-slate-800 dark:text-white">
              Technologies Used
            </h3>
            <div className="flex flex-wrap gap-2">
              {kraftjar.map((tech) => (
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
        </div>

        {/* ---------------------------------------------------------------------------------------- */}

        <div className="rounded-2xl border border-white/20 bg-white/90 p-6 shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-xl dark:border-slate-700/20 dark:bg-slate-800/90">
          {/* Project Header */}
          <div className="mb-4 flex flex-col justify-between lg:flex-row lg:items-center">
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-3">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                  Title Seeker
                </h2>
                <span
                  className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getTypeColor("personal")}`}
                >
                  {getTypeIcon("personal")}
                  personal
                </span>
              </div>
              {/* <p className="font-medium text-slate-600 dark:text-slate-400">
                    {project.role} at {project.company}
                  </p> */}
            </div>

            <div className="mt-4 flex items-center gap-4 lg:mt-0">
              {/* {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-slate-100 p-2 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600"
                    >
                      <Github className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                    </a>
                  )} */}

              <a
                href="https://titleseeker.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-slate-100 p-2 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600"
              >
                <ExternalLink className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              </a>
            </div>
          </div>

          {/* Timeline Info */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">11.2024 - present</span>
            </div>
            {/* <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{project.duration}</span>
                </div> */}
          </div>

          {/* Description */}
          <p className="mb-4 leading-relaxed text-slate-700 dark:text-slate-300">
            The database with titles was created in order to speed up the search
            for what you want. Allows you to effectively analyze titles before
            viewing and reduces false expectations. Ability to rate and create
            your own lists and view statistics.
          </p>

          {/* Responsibilities */}
          <div className="mb-6">
            <h3 className="mb-3 text-lg font-semibold text-slate-800 dark:text-white">
              Key Responsibilities
            </h3>
            <ul className="space-y-2">
              {[
                "Worked across the full development cycle, from frontend and backend to CI/CD setup and deployment.",
                "I implemented only the first part of my big idea.",
                "Implemented multi-language support, light/dark themes, and high-quality mobile responsiveness for a seamless user experience.",
                "Built a complex 8-step form for adding new titles, with validation and saving.",
                "Developed creative approaches for analyzing titles.",
              ].map((responsibility, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600"></div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {responsibility}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Technologies */}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-slate-800 dark:text-white">
              Technologies Used
            </h3>
            <div className="flex flex-wrap gap-2">
              {titleSeeker.map((tech) => (
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
        </div>
      </div>
    </div>
  );
}
