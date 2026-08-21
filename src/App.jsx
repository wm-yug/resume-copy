import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  BriefcaseBusiness,
  Download,
  FileText,
  FolderKanban,
  GraduationCap,
  Mail,
  MessageCircle,
  PanelsTopLeft,
  Sparkles,
  Star,
} from "lucide-react";

const TYPEWRITER_TEXTS = ["你的姓名", "欢迎来到我的在线简历"];
const TYPEWRITER_CONFIG = {
  typeSpeed: 100,
  deleteSpeed: 50,
  stayTime: 2000,
  startDelay: 500,
};

const profile = {
  name: "你的姓名",
  title: "目标岗位",
  tagline: "这里填写你的首屏介绍文案，可在后台快速修改。",
  location: "所在城市",
  salary: "求职方向",
  years: "工作年限",
  education: "学历",
  phone: "手机号",
  wechat: "微信号",
  resumeUrl: "",
  wechatQr: "",
  aboutImage: "",
};

const jobs = [
  {
    company: "公司名称",
    startDate: "开始时间",
    endDate: "至今",
    role: "岗位名称",
    responsibilities: [
      "在后台填写这段经历的核心职责、项目范围和协作方式。",
      "补充可量化成果、关键贡献或上线结果。",
    ],
  },
];

const projects = [
  {
    title: "项目作品 01",
    slug: "project-01",
    tone: "red",
    image: "",
    mobileImage: "",
    detailImages: [],
  },
  {
    title: "项目作品 02",
    slug: "project-02",
    tone: "lime",
    image: "",
    mobileImage: "",
    detailImages: [],
  },
  {
    title: "项目作品 03",
    slug: "project-03",
    tone: "rose",
    image: "",
    mobileImage: "",
    detailImages: [],
  },
  {
    title: "项目作品 04",
    slug: "project-04",
    tone: "violet",
    image: "",
    mobileImage: "",
    detailImages: [],
  },
  {
    title: "项目作品 05",
    slug: "project-05",
    tone: "amber",
    image: "",
    mobileImage: "",
    detailImages: [],
  },
];

const introParagraphs = [
  "这里是个人介绍占位文案。请到后台填写你的能力结构、项目经验、协作方式和求职方向。",
  "可以补充你擅长的工具、行业经验、设计方法、技术能力或代表性成果。",
];

const introStats = [
  { value: "0", label: "工作年限", icon: "briefcase" },
  { value: "0", label: "完整项目", icon: "project" },
  { value: "0", label: "技术文章", icon: "article" },
  { value: "学历", label: "学历", icon: "education" },
];

const advantages = [
  {
    title: "界面与视觉设计",
    category: "UI / VISUAL",
    description: "从业务目标与用户场景出发，打造清晰、美观且具有一致性的界面体验。",
    tags: ["界面设计", "视觉规范", "响应式设计"],
    tone: "lime",
  },
  {
    title: "交互与体验设计",
    category: "UX / INTERACTION",
    description: "梳理复杂流程与信息层级，用原型快速验证，让产品更自然、更易用。",
    tags: ["用户流程", "交互原型", "体验优化"],
    tone: "red",
  },
  {
    title: "设计系统搭建",
    category: "DESIGN SYSTEM",
    description: "沉淀可复用的组件、规则与设计资产，提升团队协作和产品迭代效率。",
    tags: ["组件规范", "设计资产", "一致性治理"],
    tone: "violet",
  },
  {
    title: "协作与落地",
    category: "DELIVERY",
    description: "主动对齐产品与研发，在细节、成本和节奏之间取得平衡，推动方案落地。",
    tags: ["跨职能协作", "设计走查", "项目推进"],
    tone: "amber",
  },
];

const navItems = [
  ["overview", "概览"],
  ["about", "介绍"],
  ["experience", "经历"],
  ["projects", "项目"],
  ["advantages", "技能"],
];

const defaultResumeData = {
  typewriterTexts: TYPEWRITER_TEXTS,
  profile,
  introParagraphs,
  introStats,
  jobs,
  projects,
  advantages,
  heroCards: ["", ""],
};

const statIconMap = {
  briefcase: BriefcaseBusiness,
  project: FolderKanban,
  article: FileText,
  education: GraduationCap,
};

function mergeResumeData(baseData, overrideData) {
  if (!overrideData || typeof overrideData !== "object") {
    return baseData;
  }

  return {
    ...baseData,
    ...overrideData,
    profile: {
      ...baseData.profile,
      ...(overrideData.profile ?? {}),
    },
    introStats: (overrideData.introStats ?? baseData.introStats).map((stat, index) => ({
      ...(baseData.introStats[index] ?? {}),
      ...stat,
    })),
    projects: (overrideData.projects ?? baseData.projects)
      .slice(0, 5)
      .map((project, index) => ({
        ...(baseData.projects[index] ?? {}),
        ...project,
      })),
    advantages: (overrideData.advantages ?? baseData.advantages).map((advantage, index) => ({
      ...(baseData.advantages[index] ?? createEmptyAdvantage()),
      ...advantage,
      tags: advantage.tags ?? baseData.advantages[index]?.tags ?? [],
    })),
  };
}

function createEmptyAdvantage() {
  return {
    title: "能力名称",
    category: "CAPABILITY",
    description: "描述这项能力如何帮助你解决问题、创造价值或推动项目落地。",
    tags: ["能力标签"],
    tone: "lime",
  };
}

function StatIcon({ icon }) {
  const Icon = statIconMap[icon] ?? BriefcaseBusiness;
  return <Icon className="about-stat-icon" size={34} strokeWidth={1.9} aria-hidden="true" />;
}

function handleSpotlightMove(event) {
  event.currentTarget.querySelectorAll(".about-stat-card").forEach((card) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mouse-x", `${event.clientX - rect.left}px`);
    card.style.setProperty("--mouse-y", `${event.clientY - rect.top}px`);
  });
}

function handleHeroCardTilt(event) {
  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;

  card.style.setProperty("--tilt-x", `${(x * 24).toFixed(2)}deg`);
  card.style.setProperty("--tilt-y", `${(-y * 24).toFixed(2)}deg`);
}

function resetHeroCardTilt(event) {
  event.currentTarget.style.setProperty("--tilt-x", "0deg");
  event.currentTarget.style.setProperty("--tilt-y", "0deg");
}

function useScrollReveal() {
  useEffect(() => {
    const sections = document.querySelectorAll(".reveal-section");

    if (!sections.length) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-visible", entry.isIntersecting);
        });
      },
      {
        rootMargin: "-8% 0px -12% 0px",
        threshold: 0.18,
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
    };
  }, []);
}

function useHeroAboutTransition(enabled) {
  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const hero = document.querySelector(".hero");
    const about = document.querySelector(".about-section");
    const aboutTitle = about?.querySelector(".section-title");

    if (!hero || !about || !aboutTitle) {
      return undefined;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame = 0;

    const renderTransition = () => {
      const heroRect = hero.getBoundingClientRect();
      const viewportHeight = Math.max(window.innerHeight, 1);
      const progress = Math.min(1, Math.max(0, -heroRect.top / (viewportHeight * 0.78)));
      const titleRect = aboutTitle.getBoundingClientRect();

      hero.style.setProperty("--hero-scale", (1 + progress * 0.025).toFixed(4));
      hero.style.setProperty("--hero-media-opacity", (1 - progress * 0.18).toFixed(4));
      hero.style.setProperty("--hero-copy-y", `${(-24 * progress).toFixed(2)}px`);
      hero.style.setProperty("--hero-copy-opacity", (1 - progress * 0.86).toFixed(4));
      hero.style.setProperty("--hero-glow-scale", (1 + progress * 0.42).toFixed(4));
      hero.style.setProperty("--hero-glow-opacity", (1 - progress).toFixed(4));
      about.classList.toggle(
        "is-transition-visible",
        reducedMotion.matches || titleRect.top < viewportHeight * 0.9,
      );
      animationFrame = 0;
    };

    const requestRender = () => {
      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(renderTransition);
      }
    };

    renderTransition();
    window.addEventListener("scroll", requestRender, { passive: true });
    window.addEventListener("resize", requestRender);
    reducedMotion.addEventListener("change", requestRender);

    return () => {
      window.removeEventListener("scroll", requestRender);
      window.removeEventListener("resize", requestRender);
      reducedMotion.removeEventListener("change", requestRender);
      window.cancelAnimationFrame(animationFrame);
      hero.removeAttribute("style");
      about.classList.remove("is-transition-visible");
    };
  }, [enabled]);
}

function useCurrentHash() {
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash);

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return hash;
}

function useTypewriter(texts, config) {
  const [displayText, setDisplayText] = useState("");
  const [isDeletingText, setIsDeletingText] = useState(false);

  useEffect(() => {
    let timeout;
    let currentTextIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;

    const runTypewriter = () => {
      const currentText = texts[currentTextIndex] ?? "";
      const currentChars = Array.from(currentText);

      if (!isDeleting) {
        currentCharIndex += 1;
        setDisplayText(currentChars.slice(0, currentCharIndex).join(""));
        setIsDeletingText(false);

        if (currentCharIndex === currentChars.length) {
          timeout = window.setTimeout(() => {
            isDeleting = true;
            runTypewriter();
          }, config.stayTime);
          return;
        }
      } else {
        currentCharIndex -= 1;
        setDisplayText(currentChars.slice(0, currentCharIndex).join(""));
        setIsDeletingText(true);

        if (currentCharIndex === 0) {
          isDeleting = false;
          currentTextIndex = (currentTextIndex + 1) % texts.length;
        }
      }

      timeout = window.setTimeout(
        runTypewriter,
        isDeleting ? config.deleteSpeed : config.typeSpeed,
      );
    };

    timeout = window.setTimeout(runTypewriter, config.startDelay);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [config.deleteSpeed, config.startDelay, config.stayTime, config.typeSpeed, texts]);

  return { displayText, isDeleting: isDeletingText };
}

function useHashScroll(hash, enabled) {
  useEffect(() => {
    if (!enabled || !hash || hash.startsWith("#project/")) {
      return undefined;
    }

    const frame = window.requestAnimationFrame(() => {
      const target = document.getElementById(hash.slice(1));
      target?.scrollIntoView({ block: "start" });
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [hash, enabled]);
}

function getProjectDetailImages(project) {
  if (project.detailImages?.length) {
    return project.detailImages;
  }

  return [];
}

function ProjectDetailPage({ project }) {
  const detailImages = getProjectDetailImages(project);

  return (
    <main className="project-detail-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="project-marquee" aria-label="作品加载提示">
        <div className="project-marquee-track">
          {Array.from({ length: 4 }, (_, index) => (
            <span key={index}>
              作品集内动画较多，首次加载会稍慢一些，感谢您的耐心等待～
            </span>
          ))}
        </div>
      </div>
      <header className="project-detail-header">
        <a className="back-link" href="#projects">
          <ArrowLeft size={18} />
          返回项目
        </a>
        <span>{project.title}</span>
      </header>

      <section className="project-image-stack" aria-label={`${project.title}作品图片`}>
        {detailImages.length > 0 ? (
          detailImages.map((imageUrl, index) => (
            <img
              src={imageUrl}
              alt={`${project.title}作品图 ${index + 1}`}
              loading={index === 0 ? "eager" : "lazy"}
              draggable="false"
              key={imageUrl}
            />
          ))
        ) : (
          <div className="project-empty-state">
            <p>作品图片待配置</p>
          </div>
        )}
      </section>
    </main>
  );
}

export function App() {
  const currentHash = useCurrentHash();
  const [resumeData, setResumeData] = useState(defaultResumeData);
  const { profile, introParagraphs, introStats, jobs, projects, advantages, heroCards } =
    resumeData;
  const activeProjectSlug = currentHash.replace("#project/", "");
  const activeProject = projects.find((project) => project.slug === activeProjectSlug);
  const typewriter = useTypewriter(
    resumeData.typewriterTexts.length ? resumeData.typewriterTexts : TYPEWRITER_TEXTS,
    TYPEWRITER_CONFIG,
  );
  const [isHeaderElevated, setIsHeaderElevated] = useState(false);
  const [isAboutCardPulled, setIsAboutCardPulled] = useState(false);
  const workYearsStat =
    introStats.find((stat) => stat.label.includes("工作")) ?? introStats[0];
  const completedProjectsStat =
    introStats.find((stat) => stat.label.includes("项目")) ?? introStats[1];

  useScrollReveal();
  useHashScroll(currentHash, !activeProject);
  useHeroAboutTransition(!activeProject);

  useEffect(() => {
    let isMounted = true;

    fetch(`/resume-data.json?updated=${Date.now()}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((remoteData) => {
        if (isMounted && remoteData) {
          setResumeData((currentData) => mergeResumeData(currentData, remoteData));
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (activeProject) {
      return undefined;
    }

    const updateHeaderState = () => {
      setIsHeaderElevated(window.scrollY > 12);
    };

    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateHeaderState);
    };
  }, [activeProject]);

  if (activeProject) {
    return <ProjectDetailPage project={activeProject} />;
  }

  return (
    <main className="resume-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <header
        className={`site-header ${isHeaderElevated ? "is-elevated" : ""}`}
        aria-label="页面导航"
      >
        <a className="brand" href="#overview" aria-label="回到首页">
          <span className="brand-mark">
            <Star size={18} fill="currentColor" />
          </span>
          <span>UI Portfolio</span>
        </a>
        <nav className="nav-pill" aria-label="简历章节">
          {navItems.map(([href, label]) => (
            <a key={href} href={`#${href}`}>
              {label}
            </a>
          ))}
        </nav>
        <div className="wechat-popover-wrap header-contact-wrap">
          <button
            className="contact-link"
            type="button"
            aria-describedby="header-wechat-popover"
          >
            <Mail size={16} />
            联系
          </button>
          <div className="wechat-popover" id="header-wechat-popover" role="tooltip">
            {profile.wechatQr ? (
              <img src={profile.wechatQr} alt="微信二维码" loading="lazy" />
            ) : (
              <div className="wechat-placeholder">QR</div>
            )}
            <p>{profile.wechatQr ? "扫一扫，添加我为朋友" : "请在后台上传微信二维码"}</p>
          </div>
        </div>
      </header>

      <section className="hero reveal-section is-visible" id="overview">
        <div className="hero-background" aria-hidden="true" />
        <div className="hero-copy">
          <p className="hero-kicker">
            <Sparkles size={16} />
            Full-STACK DESIGNER
          </p>
          <h1 className="hero-intro-title">
            <span>{typewriter.displayText}</span>
            <span
              className={`typewriter-cursor ${typewriter.isDeleting ? "cursor-hidden" : ""}`}
              aria-hidden="true"
            />
          </h1>
          <p className="hero-role">UI/UX Designer</p>
          <p className="hero-description">
            I transform complex ideas into clear, intuitive and meaningful digital experiences.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#projects">
              查看项目
              <ArrowUpRight size={18} />
            </a>
            <a
              className={`ghost-button ${profile.resumeUrl ? "" : "is-disabled"}`}
              href={profile.resumeUrl || undefined}
              download={Boolean(profile.resumeUrl)}
              aria-disabled={!profile.resumeUrl}
              onClick={(event) => {
                if (!profile.resumeUrl) event.preventDefault();
              }}
            >
              <Download size={19} />
              下载简历
            </a>
          </div>
        </div>

        <div className="hero-float-layer" aria-hidden="true">
          <div
            className="hero-info-card hero-info-card-3"
            onPointerLeave={resetHeroCardTilt}
            onPointerMove={handleHeroCardTilt}
          >
            {heroCards?.[1] ? (
              <img src={heroCards[1]} alt="" draggable="false" />
            ) : (
              <div className="hero-card-placeholder">上传首屏浮图</div>
            )}
          </div>
          <div
            className="hero-info-card hero-info-card-4"
            onPointerLeave={resetHeroCardTilt}
            onPointerMove={handleHeroCardTilt}
          >
            {heroCards?.[0] ? (
              <img src={heroCards[0]} alt="" draggable="false" />
            ) : (
              <div className="hero-card-placeholder">上传作品预览</div>
            )}
          </div>
        </div>
        <div className="hero-transition" aria-hidden="true" />
      </section>

      <section className="about-section reveal-section" id="about">
        <div className="section-title">
          <Sparkles size={20} />
          <div>
            <span>About</span>
            <h2>介绍</h2>
          </div>
        </div>
        <div className="about-profile-layout">
          <div className="about-photo-column">
            <article
              className={`about-photo-card ${isAboutCardPulled ? "is-pulled" : ""}`}
              role="button"
              tabIndex={0}
              aria-label={isAboutCardPulled ? "收回人物照片卡" : "轻轻拉出人物照片卡"}
              aria-pressed={isAboutCardPulled}
              onClick={() => setIsAboutCardPulled((isPulled) => !isPulled)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setIsAboutCardPulled((isPulled) => !isPulled);
                }
              }}
            >
              <div className="about-photo-spine" aria-hidden="true">
                <strong>{profile.name}</strong>
                <span>
                  MAKE 2026
                  <br />
                  THIS IS MY PERSONAL PHOTO
                </span>
              </div>
              <div className="about-photo-frame">
                {profile.aboutImage ? (
                  <img src={profile.aboutImage} alt={`${profile.name}个人照片`} loading="lazy" />
                ) : (
                  <div className="about-photo-placeholder">
                    <Sparkles size={28} />
                    <span>请在后台上传个人照片</span>
                  </div>
                )}
                <div className="about-photo-footer" aria-hidden="true">
                  <span>LIVE PHOTO</span>
                  <span>LIVE PHOTO</span>
                </div>
              </div>
            </article>
          </div>

          <div className="about-profile-content">
            <div className="about-identity-grid" aria-label="个人资料">
              <article className="about-identity-name">
                <span>Name</span>
                <h3>{profile.name}</h3>
              </article>
              <article className="about-identity-stat">
                <span>{workYearsStat?.label ?? "工作年限"}</span>
                <strong>{workYearsStat?.value ?? "0"}</strong>
              </article>
              <article className="about-identity-stat">
                <span>{completedProjectsStat?.label ?? "完整项目"}</span>
                <strong>{completedProjectsStat?.value ?? "0"}</strong>
              </article>
            </div>

            <div className="about-experience" id="experience">
              <div className="about-experience-title">
                <span>Experience</span>
                <h3>工作经历</h3>
              </div>
              <div className="about-experience-list">
                {jobs.map((job, index) => (
                  <article className="about-experience-item" key={`${job.company}-${index}`}>
                    <time>
                      {job.startDate} — {job.endDate}
                    </time>
                    <div className="about-experience-heading">
                      <h4>{job.company}</h4>
                      <span>{job.role}</span>
                    </div>
                    <ul>
                      {job.responsibilities.map((item, itemIndex) => (
                        <li key={`${item}-${itemIndex}`}>{item}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="project-showcase reveal-section" id="projects">
        <div className="section-title">
          <PanelsTopLeft size={20} />
          <div>
            <span>Project Work</span>
            <h2>项目经历</h2>
          </div>
        </div>
        <div
          className={`project-card-row ${projects.length === 5 ? "is-stacked" : ""}`}
          aria-label="项目经历卡片"
        >
          {projects.map((project, index) => (
            <a
              className={`project-card project-card-${project.tone}`}
              href={`#project/${project.slug}`}
              key={`${project.slug}-${index}`}
              aria-label={`打开项目：${project.title}`}
            >
              {project.image || project.mobileImage ? (
                <picture>
                  {project.mobileImage ? (
                    <source media="(max-width: 760px)" srcSet={project.mobileImage} />
                  ) : null}
                  <img
                    src={project.image || project.mobileImage}
                    alt={project.title}
                    loading="lazy"
                  />
                </picture>
              ) : (
                <div className="project-card-placeholder">
                  <span>{project.title}</span>
                  <small>请在后台上传项目封面</small>
                </div>
              )}
            </a>
          ))}
        </div>
      </section>

      <section className="advantages-section reveal-section" id="advantages">
        <div className="advantages-header">
          <div className="section-title">
            <Sparkles size={20} />
            <div>
              <span>Core Skills</span>
              <h2>个人技能</h2>
            </div>
          </div>
          <p className="advantages-intro">将审美、方法与协作能力，转化为真正可落地的产品体验。</p>
        </div>
        <div className="advantage-grid" aria-label="个人能力卡片">
          {advantages.map((advantage, index) => (
            <article
              className={`advantage-card advantage-card-${advantage.tone}`}
              key={`${advantage.title}-${index}`}
            >
              <div className="advantage-card-topline">
                <span className="advantage-index">{String(index + 1).padStart(2, "0")}</span>
                <span className="advantage-category">{advantage.category}</span>
              </div>
              <h3>{advantage.title}</h3>
              <p>{advantage.description}</p>
              <div className="advantage-tags" aria-label={`${advantage.title}能力标签`}>
                {(advantage.tags ?? []).map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <div className="advantage-card-footer" aria-hidden="true">
                <span>CORE CAPABILITY</span>
                <ArrowUpRight size={19} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer-panel reveal-section">
        <div>
          <span>联系方式</span>
          <p>{profile.phone}</p>
          <p>{profile.wechat}</p>
        </div>
        <div className="wechat-popover-wrap">
          <a href="mailto:hello@example.com" aria-describedby="wechat-popover">
            <MessageCircle size={18} />
            预约沟通
          </a>
          <div className="wechat-popover" id="wechat-popover" role="tooltip">
            {profile.wechatQr ? (
              <img src={profile.wechatQr} alt="微信二维码" loading="lazy" />
            ) : (
              <div className="wechat-placeholder">QR</div>
            )}
            <p>{profile.wechatQr ? "扫一扫，添加我为朋友" : "请在后台上传微信二维码"}</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
