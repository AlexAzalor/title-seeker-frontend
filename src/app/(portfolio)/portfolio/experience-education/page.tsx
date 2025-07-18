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
import { gained, mateAcademySkills } from "../page";
import type React from "react";

interface TimelineItem {
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
}

const timelineData: TimelineItem[] = [
  {
    id: "4",
    title: "Software Developer",
    organization: "Title Seeker",
    // location: "San Francisco, CA",
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
    skills: gained,
  },
  {
    id: "2",
    title: "Frontend developer",
    organization: "Mate academy",
    location: "Online",
    startDate: "10.2021",
    endDate: "02.2022",
    type: "course",
    description:
      "This course was very intensive, with a schedule that felt like a full-time job. Daily task deadlines taught me strict discipline and how to make decisions quickly. The amount of hands-on practice was so high that it helped me build my first fully functional landing page.",
    skills: mateAcademySkills,
  },

  {
    id: "1",
    title: "Lviv University of Trade and Economics",
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
    <div className="p-4 lg:col-span-2 lg:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-slate-800 dark:text-white">
          Experience & Education
        </h1>
        <p className="mb-6 text-slate-600 dark:text-slate-400">
          My journey from university student to self-taught full-stack developer
        </p>

        {/* Self-taught Banner */}
        {/* <div className="mb-8 rounded-2xl border border-blue-200/50 bg-gradient-to-r from-blue-50 to-purple-50 p-6 dark:border-blue-800/50 dark:from-blue-900/20 dark:to-purple-900/20">
            <div className="mb-3 flex items-center gap-3">
              <Heart className="h-6 w-6 text-red-500" />
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
                Passionate Self-Learner
              </h2>
            </div>
            <p className="leading-relaxed text-slate-700 dark:text-slate-300">
              I&apos;m a passionate self-taught developer who believes that
              learning never stops. While my formal education provided a strong
              foundation, the majority of my practical skills come from
              continuous self-learning, online courses, and hands-on projects. I
              stay current with the latest technologies and best practices
              through documentation, tutorials, and building real-world
              applications. This journey of constant growth and adaptation is
              what drives my passion for software development.
            </p>
          </div> */}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute top-0 bottom-0 left-8 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-orange-500"></div>

        <div className="space-y-8">
          {timelineData.map((e) => (
            <div key={e.id} className="relative flex items-start gap-6">
              {/* Timeline Dot */}
              <div className="relative z-10 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border-4 border-white bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${getTypeColor(e.type)}`}
                >
                  {getTypeIcon(e.type)}
                </div>
              </div>

              {/* Content Card */}
              <div className="flex-1 rounded-2xl border border-white/20 bg-white/90 p-6 shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-xl dark:border-slate-700/20 dark:bg-slate-800/90">
                {/* Header */}
                <div className="mb-4 flex flex-col justify-between lg:flex-row lg:items-center">
                  <div className="flex-1">
                    <h3 className="mb-1 text-xl font-bold text-slate-800 dark:text-white">
                      {e.title}
                    </h3>
                    <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
                      {e.organization}
                    </p>
                  </div>
                  <div className="mt-2 flex flex-col gap-2 sm:flex-row lg:mt-0">
                    <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {e.startDate} - {e.endDate}
                      </span>
                    </div>
                    {e.location && (
                      <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                        <MapPin className="h-4 w-4" />
                        <span>{e.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="mb-4 leading-relaxed text-slate-700 dark:text-slate-300">
                  {e.description}
                </p>

                {/* Achievements */}
                {e.achievements && (
                  <div className="mb-4">
                    <h4 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-white">
                      <Award className="h-4 w-4 text-yellow-500" />
                      Key Achievements
                    </h4>
                    <ul className="space-y-2">
                      {e.achievements.map((achievement, idx) => (
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

                {/* Skills */}
                {e.skills && (
                  <div>
                    <h4 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-white">
                      <TrendingUp className="h-4 w-4 text-blue-500" />
                      Skills Gained
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {e.skills.map((skill) => (
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

      {/* Footer Message */}
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
