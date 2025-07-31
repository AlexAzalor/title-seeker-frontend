import {
  GraduationCap,
  BookOpen,
  Building2,
  Code2,
  Rocket,
  Calendar,
  MapPin,
  Award,
  TrendingUp,
} from "lucide-react";
import { skillsTools } from "../page";
import type React from "react";

type TimelineItem = {
  id: string;
  title: string;
  organization?: string;
  location?: string;
  startDate: string;
  endDate: string;
  type: "education" | "course" | "work" | "personal";
  description: string;
  achievements?: string[];
  skills?: {
    label: string;
    icon: React.ReactNode;
  }[];
};

const timelineData: TimelineItem[] = [
  {
    id: "4",
    title: "Full Stack developer",
    organization: "Title Seeker",
    startDate: "11.2024",
    endDate: "present",
    type: "personal",
    description:
      "Thanks to the experience and skills I’ve gained, I built my own platform with a database of titles. I’m proud to have turned that idea into reality, even if it's still just an MVP. I have many features planned and a lot of ideas I’m excited to bring to life.",
    achievements: [
      "Fulfilled a long-time personal dream by building and launching my own platform",
      "Deployed the entire project from scratch, including domain setup, hosting, and infrastructure configuration",
      "Truly enjoyed the development journey — from idea to release",
    ],
  },
  {
    id: "3",
    title: "Full Stack developer",
    organization: "Simple2B",
    location: "Remote",
    startDate: "03.2022",
    endDate: "11.2024",
    type: "work",
    description:
      "At this outsourcing company, I gained a lot of knowledge, skills, and hands-on experience. What I appreciated most was the constant encouragement from both management and colleagues to keep learning and improving. We also had internal lectures from senior developers on various interesting topics, which gave me valuable insights directly from experienced professionals.",
    achievements: [
      "Collaborated effectively within cross-functional teams, participated in code reviews, and maintained strong, clear communication throughout the development cycle",
      "Gained hands-on experience in backend development and DevOps tasks, expanding beyond frontend responsibilities",
      "Led direct communication with customers, including presenting completed features and gathering feedback",
      "Estimated a wide range of diverse projects, contributing to planning, prioritization, and quality assessment",
      "Demonstrated rapid adaptability during difficult working conditions, including maintaining productivity through blackout periods",
      "Took on a leadership role in a project with a team of two, managing responsibilities and technical direction",
      "Acquired long-term project experience, working on a single product for over 1.5 years and contributing across multiple phases of development",
    ],
    skills: skillsTools.filter((e) =>
      [
        "Next.js",
        "Tailwind CSS",
        "Python",
        "Flask",
        "Django",
        "FastAPI",
        "PostgreSQL",
        "Docker",
        "WSL / Ubuntu",
        "AWS",
      ].includes(e.label),
    ),
  },
  {
    id: "2",
    title: "Frontend developer",
    organization: "Mate academy",
    location: "Online",
    startDate: "11.2021",
    endDate: "02.2022",
    type: "course",
    description:
      "This course was very intensive, with a schedule that felt like a full-time job. Daily task deadlines taught me strict discipline and how to make decisions quickly. The amount of hands-on practice was so high that it helped me build my first fully functional ",
    skills: skillsTools.filter((e) =>
      [
        "HTML",
        "CSS",
        "SASS",
        "JavaScript",
        "React",
        "TypeScript",
        "Git",
        "GitHub",
      ].includes(e.label),
    ),
  },

  {
    id: "1",
    title: "Student",
    organization: "Lviv University of Trade and Economics",
    location: "Lviv, Ukraine",
    startDate: "2010",
    endDate: "2016",
    type: "education",
    description: "Specialization: Management",
    achievements: ["Master's Degree"],
  },
];

const getTypeIcon = (type: TimelineItem["type"]) => {
  switch (type) {
    case "education":
      return <GraduationCap className="h-5 w-5" />;
    case "course":
      return <BookOpen className="h-5 w-5" />;
    case "work":
      return <Building2 className="h-5 w-5" />;
    case "personal":
      return <Rocket className="h-5 w-5" />;
    default:
      return <Code2 className="h-5 w-5" />;
  }
};

const getTypeColor = (type: TimelineItem["type"]) => {
  switch (type) {
    case "education":
      return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800";
    case "course":
      return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800";
    case "work":
      return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800";
    case "personal":
      return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800";
  }
};

export default function ExperienceEducationPage() {
  return (
    <div className="p-3 lg:col-span-2 lg:p-6">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-slate-800 dark:text-white">
          Experience & Education
        </h1>
        <p className="mb-6 text-slate-600 dark:text-slate-400">
          My journey from university student to professional developer
        </p>
      </div>

      <div className="relative">
        <div className="absolute top-0 bottom-0 left-6 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-orange-500 sm:left-8"></div>

        <div className="space-y-8">
          {timelineData.map((item) => (
            <div
              key={item.id}
              className="relative flex items-start gap-2 sm:gap-6"
            >
              <div className="relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-4 border-white bg-white shadow-lg sm:h-16 sm:w-16 dark:border-slate-700 dark:bg-slate-800">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${getTypeColor(item.type)}`}
                >
                  {getTypeIcon(item.type)}
                </div>
              </div>

              <div className="flex-1 rounded-2xl border border-white/20 bg-white/90 p-3 shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-xl sm:p-6 dark:border-slate-700/20 dark:bg-slate-800/90">
                <div className="mb-4 flex flex-col justify-between lg:flex-row lg:items-center">
                  <div className="flex-1">
                    <h3 className="mb-1 text-xl font-bold text-slate-800 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
                      {item.organization}
                    </p>
                  </div>
                  <div className="mt-2 flex flex-col gap-2 sm:flex-row lg:mt-0">
                    <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {item.startDate} - {item.endDate}
                      </span>
                    </div>
                    {item.location && (
                      <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                        <MapPin className="h-4 w-4" />
                        <span>{item.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                <p className="mb-4 leading-relaxed text-slate-700 dark:text-slate-300">
                  {item.description}
                  {item.id === "2" && (
                    <a
                      className="inline text-blue-600 dark:text-blue-400"
                      href="https://alexazalor.github.io/kickstarter-landing/"
                      target="_blank"
                    >
                      {" "}
                      landing page.
                    </a>
                  )}
                </p>

                {item.achievements && (
                  <div className="mb-4">
                    <h4 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-white">
                      <Award className="h-4 w-4 text-yellow-500" />
                      Key Achievements
                    </h4>
                    <ul className="space-y-2">
                      {item.achievements.map((achievement, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-500"></div>
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {achievement}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {item.skills && (
                  <div>
                    <h4 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-white">
                      <TrendingUp className="h-4 w-4 text-blue-500" />
                      Skills Gained
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {item.skills.map((skill) => (
                        <span
                          key={skill.label}
                          className="flex items-center gap-1 rounded-full bg-gradient-to-r from-slate-100 to-slate-200 px-3 py-2 font-medium text-slate-700 transition-all duration-300 hover:from-blue-100 hover:to-blue-200"
                        >
                          {skill.icon}
                          <span>{skill.label}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 px-6 py-3 dark:from-blue-900/30 dark:to-purple-900/30">
          <Code2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <span className="font-medium text-slate-700 dark:text-slate-300">
            The journey continues... Always learning, always growing
          </span>
        </div>
      </div>
    </div>
  );
}
