import { useState } from "react";

export default function ModulesList() {
  const modules = [
    {
      title: "1 МОДУЛЬ",
      lessons: [
        { name: "Вступний урок", type: "Теорія" },
        { name: "Матеріали — види гелів", type: "Теорія" },
        { name: "Як вибрати нижні форми, де замовляти", type: "Теорія" },
        { name: "Як підготувати нігтьову пластину", type: "Практика" },
        { name: "Етапи нарощування форми квадрат", type: "Практика" },
        { name: "Схема опила форми квадрат і покриття", type: "Практика" },
      ],
    },
    {
      title: "2 МОДУЛЬ",
      lessons: [
        { name: "Що таке архітектура і якою вона має бути", type: "Теорія" },
        { name: "Підготовка форми і підложка", type: "Практика" },
        { name: "Викладка гелю і опил", type: "Практика" },
        { name: "3D дизайн", type: "Практика" },
      ],
    },
    {
      title: "3 МОДУЛЬ",
      lessons: [
        { name: "Протипоказання до нарощування екстра довжини", type: "Теорія" },
        { name: "Підготовка форми — архітектура і підложка", type: "Практика" },
        { name: "Викладка гелю і опил форми стилет", type: "Практика" },
        { name: "3D дизайн", type: "Практика" },
      ],
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);
  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  const badgeClass = (type) =>
    type === "Теорія"
      ? "bg-pink-500/20 text-pink-700 dark:bg-pink-400/20 dark:text-pink-200"
      : "bg-rose-500/20 text-rose-700 dark:bg-rose-400/20 dark:text-rose-200";

  return (
    <div className="flex flex-col gap-4 w-full max-w-3xl mx-auto text-left">
      {modules.map((m, i) => (
        <div
          key={i}
          className="bg-white/70 dark:bg-white/10 border border-pink-100 dark:border-neutral-700 rounded-2xl shadow-md backdrop-blur-md overflow-hidden transition-all"
        >
          <button
            onClick={() => toggle(i)}
            className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-pink-50/50 dark:hover:bg-white/5 transition-colors"
          >
            <span className="font-semibold text-gray-900 dark:text-white text-lg">
              {m.title}
            </span>
            <span
              className={`transform transition-transform text-pink-500 ${
                openIndex === i ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </button>

          <div
            className={`transition-all duration-300 ${
              openIndex === i ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            } overflow-hidden`}
          >
            <ul className="px-6 pb-4 list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              {m.lessons.map((lesson, idx) => (
                <li key={idx} className="flex items-center justify-between">
                  <span>{lesson.name}</span>
                  <span
                    className={`${badgeClass(
                      lesson.type
                    )} px-3 py-1 text-xs font-medium rounded-full shadow-sm hover:shadow-pink-200 dark:hover:shadow-pink-900 transition-all`}
                  >
                    {lesson.type}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
