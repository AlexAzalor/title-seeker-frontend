import {
  MovieOutUserRatingCriterion,
  UserRatingCriteria,
} from "@/orval_api/model";
import { RatingType } from "./rate-slider";

export type RateCriteriesEnum = keyof UserRatingCriteria;

// export type RatingAction = {
//   [K in keyof UserRatingCriteria]: { type: K; value: UserRatingCriteria[K] };
// }[keyof UserRatingCriteria];

export type GroupedCriteria<T extends keyof UserRatingCriteria> = Extract<
  keyof UserRatingCriteria,
  T
>;

export type ExtraRateCriteria = GroupedCriteria<
  "visual_effects" | "scare_factor" | "humor" | "animation_cartoon"
>;

export type RatingTemplate = Omit<UserRatingCriteria, ExtraRateCriteria> & {
  visual_effects: number;
  scare_factor: number;
  humor: number;
  animation_cartoon: number;
};

export const MIN_RATE = 0.01;

/**BASIC Initial Rate */
export const INITIAL_RATE: UserRatingCriteria = {
  acting: MIN_RATE,
  plot_storyline: MIN_RATE,
  script_dialogue: MIN_RATE,
  music: MIN_RATE,
  enjoyment: MIN_RATE,
  production_design: MIN_RATE,
};

/**Visual effect */
export const VE_INITIAL_RATE: UserRatingCriteria = {
  ...INITIAL_RATE,
  visual_effects: MIN_RATE,
};

/**Scare factor */
export const SF_INITIAL_RATE: UserRatingCriteria = {
  ...INITIAL_RATE,
  scare_factor: MIN_RATE,
};

/**Humor */
export const H_INITIAL_RATE: UserRatingCriteria = {
  ...INITIAL_RATE,
  humor: MIN_RATE,
};

/**Animation/Cartoon */
export const AC_INITIAL_RATE: UserRatingCriteria = {
  ...INITIAL_RATE,
  animation_cartoon: MIN_RATE,
};

export const RATING_MAX: RatingTemplate = {
  acting: 2.5,
  plot_storyline: 2,
  script_dialogue: 2,
  music: 1.5,
  enjoyment: 1,
  production_design: 1,
  // Additional
  visual_effects: 2,
  scare_factor: 3,
  humor: 3,
  animation_cartoon: 2,
};

/**Visual effects */
export const VS_MAX: RatingTemplate = {
  ...RATING_MAX,
  acting: RATING_MAX.acting - 0.5,
  plot_storyline: RATING_MAX.plot_storyline - 0.5,
  script_dialogue: RATING_MAX.script_dialogue - 0.5,
  production_design: RATING_MAX.production_design - 0.5,
};

/**Scare factor */
export const SF_MAX: RatingTemplate = {
  ...RATING_MAX,
  acting: RATING_MAX.acting - 1,
  plot_storyline: RATING_MAX.plot_storyline - 1,
  script_dialogue: RATING_MAX.script_dialogue - 1,
};

export const HUMOR_MAX: RatingTemplate = {
  ...RATING_MAX,
  acting: RATING_MAX.acting - 1,
  plot_storyline: RATING_MAX.plot_storyline - 1,
  script_dialogue: RATING_MAX.script_dialogue - 0.5,
  music: RATING_MAX.music - 0.5,
};

/**Animation/Cartoon */
export const AC_MAX: RatingTemplate = {
  ...RATING_MAX,
  acting: RATING_MAX.acting - 1.5,
  production_design: RATING_MAX.production_design - 0.5,
};

/**Utility function for exhaustive type checking */
// export function assertNever(x: never): never {
//   throw new Error(`Unhandled action: ${JSON.stringify(x)}`);
// }

export const checkRatingChanges = (
  state: UserRatingCriteria,
  ratingCriteria: MovieOutUserRatingCriterion | undefined,
  isVisualEffects: boolean,
  isScareFactor: boolean,
  isHumor: boolean,
  isAnimationCartoon: boolean,
) => {
  if (ratingCriteria) {
    const criteriaKeys: RateCriteriesEnum[] = [
      "acting",
      "plot_storyline",
      "script_dialogue",
      "music",
      "enjoyment",
      "production_design",
    ];

    if (isVisualEffects) {
      criteriaKeys.push("visual_effects");
    }

    if (isScareFactor) {
      criteriaKeys.push("scare_factor");
    }

    if (isHumor) {
      criteriaKeys.push("humor");
    }

    if (isAnimationCartoon) {
      criteriaKeys.push("animation_cartoon");
    }

    const isSame = criteriaKeys.every(
      (key) => state[key] === ratingCriteria[key],
    );

    if (isSame) {
      return true;
    }

    return false;
  }
};

/**Get a max value depending of a selected Rating Type. */
export const getMaxValue = (
  isVisualEffects: boolean,
  isScareFactor: boolean,
  isHumor: boolean,
  isAnimationCartoon: boolean,
  vsMax: number,
  sfMax: number,
  hMax: number,
  acMax: number,
  defaultMax: number,
) => {
  if (isVisualEffects) return vsMax;
  if (isScareFactor) return sfMax;
  if (isHumor) return hMax;
  if (isAnimationCartoon) return acMax;
  return defaultMax;
};

export const RATING_TOOLTIP: Record<RatingType, string | React.ReactNode> = {
  ["acting"]: (
    <div className="flex flex-col gap-3">
      <div>
        Оцінюється акторська гра, їх вміння добре передати емоції, розкрити
        характер персонажа, як вони вписується у всесвіт фільму і їх взаємодія з
        іншими акторами.
      </div>
      <div>
        Також оцінюється наскільки персонажі вийшли живими (яким віриш на все
        100%).
      </div>
      <div>
        Ще буває так, що персонаж це просто звичайна людина, але актор зіграв
        так добре, що більше нікого не можна уявити собі на цій ролі (навіть
        якщо така роль одна в кар’єрі актора).
      </div>
      <div>
        Замітка: оцінювати можна як і гру одного актора так і всіх. Головне що
        акторська гра має бути якісною.
      </div>
    </div>
  ),
  ["plot_storyline"]: (
    <div className="flex flex-col gap-3">
      Оцінюється сюжет, сюжетні лінії персонажів, розкриття питань і конфліктів,
      прогресію всього (включаючи і сам світ фільму). Наскільки креативно
      підійшли до різних кліше. Якісне завершення і відповідь на підняті питання
      або розумне продовження (тобто не тільки ради грошей).
    </div>
  ),
  ["script_dialogue"]: (
    <div className="flex flex-col gap-3">
      <div>
        Оцінюється якість діалогів, як добре вони розкривають персонажів і
        навколишній світ. Чи є сила підтексту і розумної недосказаності, де тобі
        не розжовують все як дитині. Де нема діалогів по 10 хв «ніпрощо».
      </div>
      <div>
        Замітка: не варто все зрівнювати з «Тарантиновськими» діалогами, то
        звичайно вершина мистецтва, але більшість фільмів просто не підходять до
        подібного критерію.
      </div>
    </div>
  ),
  ["music"]: (
    <div className="flex flex-col gap-3">
      <div>
        Оцінюється наскільки музика підходе до контексту фільма, задає потрібний
        настрій і описує події. Вона може навіть занурити в кіно більше ніж любі
        інші аспекти. Музика може запамятатись і потім дати стимул передивитись
        фільм.
      </div>
      <div>
        Не треба давати погану оцінку якщо музики мало чи вона тиха чи взагалі
        відсутня. Епічна музика або відсутність має працювати у контексті.
      </div>
    </div>
  ),
  ["enjoyment"]: (
    <div className="flex flex-col gap-3">
      <div>
        Оцінюється задоволення яке доставило кіно. Тут не треба думати про інші
        критерії оцінки, про рецензії чи огляди інших людей. Найважливіше тільки
        суб’єктивні враження.
      </div>
      <div>
        Наприклад, кіно може бути дурним але якщо воно подарувало трохи гарно
        настрою то і оцінити треба відносно.
      </div>
    </div>
  ),
  ["production_design"]: (
    <div className="flex flex-col gap-3">
      Оцінюється якість одягу, костюмів, декорацій, реквізиту і т.д (не
      графіка). Наскільки ці речі передають певний проміжок часу. Наприклад якщо
      в Древній Греції замість гарних декорацій буде показана сучасна
      архітектура, яка просто схожа, то це неякісна робота.
    </div>
  ),
  ["visual_effects"]: (
    <div className="flex flex-col gap-3">
      Оцінюється якість графіки і різних ефектів відносно даного кіно. Тобто не
      треба зрівнювати графіку 80х років і 2020х. Графіка має бути гармонічно
      інтегрована в загальну картину фільму і має бути доречною, а не просто
      графіка ради графіки.
    </div>
  ),
  ["scare_factor"]: (
    <div className="flex flex-col gap-3">
      <div>
        Оцінюється наскільки кіно змогло визвати відчуття страху чи моторошність
        коли події фільму ще деякий час не відпускали.
      </div>
      <div>
        Замітка: прості скримери, які лякають, це не справжній страх, а просто
        реакція на раптову/різку дію, яка супроводжується голосним звуком. Такий
        прийом має бути допоміжним, а не основним чи часто використовуваним.
      </div>
    </div>
  ),
  ["humor"]: (
    <div className="flex flex-col gap-3">
      <div>
        Кіно яке від початку до кінця має комедійний елемент, де смішна
        акторська гра це елемент світу, а не «кривляння ради кривляння».
        Світобудова має смішний чи карикатурний елемент. Персонажі існують з
        чимось що здається для нас смішним і дурним, але для них це частина
        життя. Саме головне – смішний/дурний елемент до кінця кіно лишається, і
        його не позбуваються. Наприклад Містер Бін чи Розова Пантера, які
        спасають світ чудернацькими способами. Тобто вони не стали «нормальними»
        до кінця кіно, а продовжили своє «натуральне» життя далі.
      </div>
      <div>
        Оцінюється наскільки логіка і комедія співпрацюють разом. І наскільки в
        цілому кіно було смішне.
      </div>
      <div>
        Приклади: Ідіократія, Не погрожуй Південному Централу…, Джей і мовчазний
        Боб…
      </div>
      <div>
        Замітка: такі фільми як 9 ярдів не підходе під цю критерію, тому що там
        комедія в тому що проста людина попадає в кримінал і починає себе вести
        як дурник, але потім привикає і тому все плавно стає нормальним для
        нього (і для глядача).
      </div>
    </div>
  ),
  ["animation_cartoon"]: (
    <div className="flex flex-col gap-3">
      <div>
        Це любі мультики повнометражні як Шрек чи Острів скарбів. Оцінюється
        якість картинки, анімації, персонажі і т.д.
      </div>
      <div>
        В критерії «Action» - оцінюється голос, емоції і як актор озвучки
        натурально передав характер персонажа.
      </div>
    </div>
  ),
};
