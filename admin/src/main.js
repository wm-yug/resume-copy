const form = document.querySelector("#adminForm");
const saveButton = document.querySelector("#saveButton");
const statusNote = document.querySelector("#statusNote");
const MAX_PROJECTS = 5;
const MAX_ADVANTAGES = 6;

let resumeData = null;

function normalizeResumeData() {
  resumeData.projects = (resumeData.projects ?? []).slice(0, MAX_PROJECTS);
  resumeData.profile = {
    ...(resumeData.profile ?? {}),
    aboutImage: resumeData.profile?.aboutImage ?? "",
  };
  resumeData.advantages = (resumeData.advantages ?? [
    {
      title: "界面与视觉设计",
      category: "UI / VISUAL",
      description: "从业务目标与用户场景出发，打造清晰、美观且具有一致性的界面体验。",
      tags: ["界面设计", "视觉规范", "响应式设计"],
      tone: "lime",
    },
  ]).slice(0, MAX_ADVANTAGES);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function linesToText(lines) {
  return (lines ?? []).join("\n");
}

function textToLines(value) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function getByPath(path) {
  return path.split(".").reduce((current, key) => current?.[key], resumeData);
}

function setByPath(path, value) {
  const keys = path.split(".");
  const lastKey = keys.pop();
  const target = keys.reduce((current, key) => current[key], resumeData);
  target[lastKey] = value;
}

function createField(label, path, options = {}) {
  const value = getByPath(path);
  const tag = options.multiline ? "textarea" : "input";
  const rows = options.multiline ? ` rows="${options.rows ?? 4}"` : "";
  return `
    <label class="field">
      <span>${label}</span>
      <${tag} data-path="${path}" data-kind="${options.kind ?? "text"}"${rows}>${tag === "textarea" ? escapeHtml(options.kind === "lines" ? linesToText(value) : value) : ""}</${tag}>
    </label>
  `;
}

function createInputField(label, path) {
  return `
    <label class="field">
      <span>${label}</span>
      <input data-path="${path}" value="${escapeHtml(getByPath(path))}" />
    </label>
  `;
}

function createSelectField(label, path, options) {
  const value = getByPath(path);
  return `
    <label class="field">
      <span>${label}</span>
      <select data-path="${path}">
        ${options
          .map(
            (option) =>
              `<option value="${escapeHtml(option.value)}" ${
                option.value === value ? "selected" : ""
              }>${escapeHtml(option.label)}</option>`,
          )
          .join("")}
      </select>
    </label>
  `;
}

function createImageField(label, path) {
  const value = getByPath(path);
  return `
    <div class="image-field">
      <span>${label}</span>
      <div class="image-row">
        ${value ? `<img src="${escapeHtml(value)}" alt="" />` : `<div class="image-placeholder"></div>`}
        <label class="upload-button">
          上传图片
          <input type="file" accept="image/*" data-image-path="${path}" />
        </label>
      </div>
    </div>
  `;
}

function createStat(stat, index) {
  return `
    <article class="edit-card compact-card">
      <div class="grid">
        ${createInputField("数值", `introStats.${index}.value`)}
        ${createInputField("标签", `introStats.${index}.label`)}
        ${createSelectField("图标", `introStats.${index}.icon`, [
          { value: "briefcase", label: "工作年限" },
          { value: "project", label: "项目" },
          { value: "article", label: "文章" },
          { value: "education", label: "学历" },
        ])}
      </div>
    </article>
  `;
}

function createJob(job, index) {
  return `
    <article class="edit-card">
      <div class="card-heading">
        <strong>${escapeHtml(job.company)}</strong>
        <button type="button" data-remove-job="${index}">删除</button>
      </div>
      <div class="grid">
        ${createInputField("公司", `jobs.${index}.company`)}
        ${createInputField("职位", `jobs.${index}.role`)}
        ${createInputField("开始时间", `jobs.${index}.startDate`)}
        ${createInputField("结束时间", `jobs.${index}.endDate`)}
      </div>
      ${createField("职责描述（每行一条）", `jobs.${index}.responsibilities`, {
        multiline: true,
        kind: "lines",
        rows: 5,
      })}
    </article>
  `;
}

function createProject(project, index) {
  return `
    <article class="edit-card">
      <div class="card-heading">
        <strong>${escapeHtml(project.title)}</strong>
        <button type="button" data-remove-project="${index}">删除</button>
      </div>
      <div class="grid">
        ${createInputField("项目标题", `projects.${index}.title`)}
        ${createInputField("链接标识", `projects.${index}.slug`)}
        ${createSelectField("封面色彩", `projects.${index}.tone`, [
          { value: "red", label: "红色" },
          { value: "lime", label: "珊瑚红" },
          { value: "rose", label: "玫瑰红" },
          { value: "violet", label: "莓果红" },
          { value: "amber", label: "朱砂红" },
        ])}
        ${createImageField("项目封面", `projects.${index}.image`)}
        ${createImageField("移动端封面", `projects.${index}.mobileImage`)}
      </div>
      <div class="gallery-block">
        <div class="gallery-heading">
          <span>本地作品详情图</span>
          <label class="upload-button">
            上传多图
            <input type="file" accept="image/*" multiple data-gallery-index="${index}" />
          </label>
        </div>
        <p class="field-tip">建议作品图片按“项目名.01、项目名.02、项目名.03”命名后再上传，方便排序和维护。</p>
        <div class="gallery">
          ${(project.detailImages ?? [])
            .map(
              (image, imageIndex) => `
                <div class="gallery-item">
                  <img src="${escapeHtml(image)}" alt="" />
                  <button type="button" data-remove-detail-image="${index}:${imageIndex}">删除</button>
                </div>
              `,
            )
            .join("")}
        </div>
      </div>
    </article>
  `;
}

function createAdvantage(advantage, index) {
  return `
    <article class="edit-card">
      <div class="card-heading">
        <strong>${escapeHtml(advantage.title)}</strong>
        <button type="button" data-remove-advantage="${index}">删除</button>
      </div>
      <div class="grid">
        ${createInputField("能力名称", `advantages.${index}.title`)}
        ${createInputField("英文分类", `advantages.${index}.category`)}
        ${createSelectField("卡片色彩", `advantages.${index}.tone`, [
          { value: "lime", label: "正红" },
          { value: "red", label: "红色" },
          { value: "violet", label: "莓果红" },
          { value: "amber", label: "朱砂红" },
        ])}
      </div>
      ${createField("能力描述", `advantages.${index}.description`, { multiline: true, rows: 3 })}
      ${createField("能力标签（每行一条）", `advantages.${index}.tags`, {
        multiline: true,
        kind: "lines",
        rows: 4,
      })}
    </article>
  `;
}

function syncFormValue(element) {
  const path = element.dataset.path;
  if (!path) return;

  if (element.dataset.kind === "lines") {
    setByPath(path, textToLines(element.value));
    return;
  }

  if (path.endsWith("detailCount")) {
    setByPath(path, Number(element.value) || 0);
    return;
  }

  setByPath(path, element.value);
}

function fileToDataUrl(file) {
  return new Promise((resolveFile) => {
    const reader = new FileReader();
    reader.onload = () => resolveFile(reader.result);
    reader.readAsDataURL(file);
  });
}

async function uploadImage(file) {
  const dataUrl = await fileToDataUrl(file);
  const response = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename: file.name,
      dataUrl,
    }),
  });

  if (!response.ok) {
    throw new Error("图片上传失败");
  }

  const result = await response.json();
  return result.path;
}

function render() {
  const projectCount = resumeData.projects?.length ?? 0;
  const advantageCount = resumeData.advantages?.length ?? 0;

  form.innerHTML = `
    <section class="panel">
      <div class="section-title"><span>Hero</span><h2>首屏文字</h2></div>
      <div class="grid">
        ${createInputField("姓名", "profile.name")}
        ${createInputField("岗位标题", "profile.title")}
        ${createField("打字机文字（每行一条）", "typewriterTexts", {
          multiline: true,
          kind: "lines",
        })}
        ${createField("一句话介绍", "profile.tagline", { multiline: true })}
        ${createInputField("简历下载链接", "profile.resumeUrl")}
        ${createInputField("手机号", "profile.phone")}
        ${createInputField("微信号", "profile.wechat")}
        ${createImageField("微信二维码", "profile.wechatQr")}
        ${createImageField("首屏浮图 1", "heroCards.0")}
        ${createImageField("首屏浮图 2", "heroCards.1")}
      </div>
    </section>
    <section class="panel">
      <div class="section-title"><span>About</span><h2>介绍资料</h2></div>
      <p class="field-tip">人物照片显示在介绍板块左侧；姓名会与首屏姓名保持一致。</p>
      <div class="grid">
        ${createInputField("姓名", "profile.name")}
        ${createImageField("介绍人物照片", "profile.aboutImage")}
      </div>
    </section>
    <section class="panel">
      <div class="section-title"><span>Stats</span><h2>介绍数据</h2></div>
      <p class="field-tip">前台介绍板块展示前两项：工作年限与完整项目。</p>
      <div class="stack">${(resumeData.introStats ?? []).slice(0, 2).map(createStat).join("")}</div>
    </section>
    <section class="panel">
      <div class="section-toolbar">
        <div class="section-title"><span>Projects</span><h2>项目作品</h2></div>
        <button type="button" data-add-project ${projectCount >= MAX_PROJECTS ? "disabled" : ""}>
          新增项目
        </button>
      </div>
      <p class="field-tip">项目最多 ${MAX_PROJECTS} 个。少于 ${MAX_PROJECTS} 个时前台会正常网格展示，等于 ${MAX_PROJECTS} 个时会切换为扇形叠放效果。</p>
      <div class="stack">${(resumeData.projects ?? []).map(createProject).join("")}</div>
    </section>
    <section class="panel">
      <div class="section-toolbar">
        <div class="section-title"><span>Experience</span><h2>工作经历</h2></div>
        <button type="button" data-add-job>新增经历</button>
      </div>
      <div class="stack">${(resumeData.jobs ?? []).map(createJob).join("")}</div>
    </section>
    <section class="panel">
      <div class="section-toolbar">
        <div class="section-title"><span>Skills</span><h2>个人技能</h2></div>
        <button type="button" data-add-advantage ${advantageCount >= MAX_ADVANTAGES ? "disabled" : ""}>新增能力</button>
      </div>
      <p class="field-tip">最多展示 ${MAX_ADVANTAGES} 张能力卡片，建议保留 4 张以获得最佳桌面端布局。</p>
      <div class="stack">${(resumeData.advantages ?? []).map(createAdvantage).join("")}</div>
    </section>
  `;
}

form.addEventListener("input", (event) => {
  syncFormValue(event.target);
});

form.addEventListener("change", async (event) => {
  syncFormValue(event.target);

  const imagePath = event.target.dataset.imagePath;
  if (imagePath) {
    const file = event.target.files?.[0];
    if (file) {
      statusNote.textContent = "正在上传图片...";
      setByPath(imagePath, await uploadImage(file));
      statusNote.textContent = "图片已上传到 public/uploads/，记得保存配置。";
      render();
    }
  }

  const galleryIndex = event.target.dataset.galleryIndex;
  if (galleryIndex) {
    statusNote.textContent = "正在上传作品详情图...";
    const files = Array.from(event.target.files ?? []).sort((a, b) =>
      a.name.localeCompare(b.name, "zh-Hans-CN", { numeric: true }),
    );
    const images = await Promise.all(files.map(uploadImage));
    const project = resumeData.projects[Number(galleryIndex)];
    project.detailImages = [...(project.detailImages ?? []), ...images];
    statusNote.textContent = "作品详情图已上传到 public/uploads/，并按文件名排序加入配置。";
    render();
  }
});

form.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.addProject !== undefined) {
    if ((resumeData.projects?.length ?? 0) >= MAX_PROJECTS) {
      statusNote.textContent = `项目最多只能添加 ${MAX_PROJECTS} 个。`;
      return;
    }

    resumeData.projects.push({
      title: `项目作品 ${String((resumeData.projects?.length ?? 0) + 1).padStart(2, "0")}`,
      slug: `project-${Date.now()}`,
      tone: ["red", "lime", "rose", "violet", "amber"][
        (resumeData.projects?.length ?? 0) % MAX_PROJECTS
      ],
      image: "",
      mobileImage: "",
      detailImages: [],
    });
    render();
  }

  if (button.dataset.addJob !== undefined) {
    resumeData.jobs.push({
      company: "新公司名称",
      startDate: "2026年1月1日",
      endDate: "至今",
      role: "UI设计师",
      responsibilities: ["描述这段工作中最重要的职责或成果。"],
    });
    render();
  }

  if (button.dataset.addAdvantage !== undefined) {
    if ((resumeData.advantages?.length ?? 0) >= MAX_ADVANTAGES) {
      statusNote.textContent = `个人技能最多只能添加 ${MAX_ADVANTAGES} 项。`;
      return;
    }

    resumeData.advantages.push({
      title: "能力名称",
      category: "CAPABILITY",
      description: "描述这项能力如何帮助你解决问题、创造价值或推动项目落地。",
      tags: ["能力标签"],
      tone: ["lime", "red", "violet", "amber"][
        (resumeData.advantages?.length ?? 0) % 4
      ],
    });
    render();
  }

  if (button.dataset.removeProject) {
    resumeData.projects.splice(Number(button.dataset.removeProject), 1);
    render();
  }

  if (button.dataset.removeJob) {
    resumeData.jobs.splice(Number(button.dataset.removeJob), 1);
    render();
  }

  if (button.dataset.removeAdvantage) {
    resumeData.advantages.splice(Number(button.dataset.removeAdvantage), 1);
    render();
  }

  if (button.dataset.removeDetailImage) {
    const [projectIndex, imageIndex] = button.dataset.removeDetailImage.split(":").map(Number);
    resumeData.projects[projectIndex].detailImages.splice(imageIndex, 1);
    render();
  }
});

saveButton.addEventListener("click", async () => {
  document.querySelectorAll("[data-path]").forEach(syncFormValue);
  normalizeResumeData();
  statusNote.textContent = "正在保存...";

  const response = await fetch("/api/resume-data", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(resumeData),
  });

  statusNote.textContent = response.ok
    ? "已保存到 public/resume-data.json。刷新前台即可查看，部署前请重新 npm run build。"
    : "保存失败，请检查终端报错。";
});

async function init() {
  const response = await fetch("/api/resume-data");
  resumeData = await response.json();
  normalizeResumeData();
  render();
}

init();
