import type { EventItem } from "@/lib/events";

export type AttendanceBand = "Low" | "Medium" | "High";

type FeatureRow = {
  hourOfDay: number;
  dayOfWeek: number;
  isWeekend: number;
  isFeatured: number;
  hasFood: number;
  categoryScore: number;
};

type TrainingRow = {
  features: FeatureRow;
  attendance: number;
};

export type AttendancePrediction = {
  eventId: string;
  predictedAttendance: number;
  predictedBand: AttendanceBand;
};

export type AttendanceModelSummary = {
  featuresUsed: string[];
  generatedDataDescription: string;
  modelChoiceExplanation: string;
  trainSize: number;
  testSize: number;
  meanAbsoluteError: number;
  testBandAccuracy: number;
};

const FEATURE_KEYS: (keyof FeatureRow)[] = [
  "hourOfDay",
  "dayOfWeek",
  "isWeekend",
  "isFeatured",
  "hasFood",
  "categoryScore",
];

const CATEGORY_SCORE: Record<string, number> = {
  Tech: 1.0,
  Careers: 0.9,
  Sports: 0.8,
  Music: 0.7,
  Social: 0.6,
  Wellbeing: 0.5,
};

function toFeatureRow(event: EventItem): FeatureRow {
  const date = new Date(event.date);
  const [hoursText] = event.time.split(":");
  const hourOfDay = Number.parseInt(hoursText, 10);
  const dayOfWeek = date.getDay();

  return {
    hourOfDay: Number.isNaN(hourOfDay) ? 18 : hourOfDay,
    dayOfWeek,
    isWeekend: dayOfWeek === 0 || dayOfWeek === 6 ? 1 : 0,
    isFeatured: event.featured ? 1 : 0,
    hasFood: event.foodProvided ? 1 : 0,
    categoryScore: CATEGORY_SCORE[event.category] ?? 0.55,
  };
}

function hashToUnit(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return (Math.abs(hash) % 1000) / 1000;
}

function clampAttendance(value: number): number {
  return Math.max(20, Math.min(260, Math.round(value)));
}

function attendanceToBand(attendance: number): AttendanceBand {
  if (attendance < 80) return "Low";
  if (attendance < 140) return "Medium";
  return "High";
}

function generateHistoricalRows(events: EventItem[]): TrainingRow[] {
  const rows: TrainingRow[] = [];

  for (const event of events) {
    const baseFeatures = toFeatureRow(event);

    for (let weekLag = 1; weekLag <= 12; weekLag += 1) {
      const seasonality = Math.sin((weekLag / 12) * Math.PI * 2) * 8;
      const deterministicNoise = (hashToUnit(`${event.id}-${weekLag}`) - 0.5) * 20;

      const expected =
        30 +
        baseFeatures.hourOfDay * 2.1 +
        baseFeatures.dayOfWeek * 3.3 +
        baseFeatures.isWeekend * 26 +
        baseFeatures.isFeatured * 38 +
        baseFeatures.hasFood * 22 +
        baseFeatures.categoryScore * 48 +
        seasonality +
        deterministicNoise;

      rows.push({
        features: baseFeatures,
        attendance: clampAttendance(expected),
      });
    }
  }

  return rows;
}

function normalizeRows(rows: TrainingRow[]) {
  const means: Record<keyof FeatureRow, number> = {
    hourOfDay: 0,
    dayOfWeek: 0,
    isWeekend: 0,
    isFeatured: 0,
    hasFood: 0,
    categoryScore: 0,
  };
  const stds: Record<keyof FeatureRow, number> = { ...means };

  for (const key of FEATURE_KEYS) {
    const mean = rows.reduce((sum, row) => sum + row.features[key], 0) / rows.length;
    means[key] = mean;
    const variance =
      rows.reduce((sum, row) => sum + (row.features[key] - mean) ** 2, 0) / rows.length;
    stds[key] = Math.sqrt(variance) || 1;
  }

  return { means, stds };
}

function toVector(
  features: FeatureRow,
  means: Record<keyof FeatureRow, number>,
  stds: Record<keyof FeatureRow, number>
): number[] {
  return FEATURE_KEYS.map((key) => (features[key] - means[key]) / stds[key]);
}

function trainLinearRegression(
  trainRows: TrainingRow[],
  means: Record<keyof FeatureRow, number>,
  stds: Record<keyof FeatureRow, number>
) {
  const weights = new Array(FEATURE_KEYS.length).fill(0);
  let bias = 0;
  const learningRate = 0.02;
  const epochs = 500;

  for (let epoch = 0; epoch < epochs; epoch += 1) {
    let gradBias = 0;
    const gradWeights = new Array(FEATURE_KEYS.length).fill(0);

    for (const row of trainRows) {
      const x = toVector(row.features, means, stds);
      const prediction = bias + x.reduce((sum, value, idx) => sum + value * weights[idx], 0);
      const error = prediction - row.attendance;

      gradBias += error;
      for (let i = 0; i < gradWeights.length; i += 1) {
        gradWeights[i] += error * x[i];
      }
    }

    const n = trainRows.length;
    bias -= learningRate * (gradBias / n);
    for (let i = 0; i < weights.length; i += 1) {
      weights[i] -= learningRate * (gradWeights[i] / n);
    }
  }

  return { weights, bias };
}

function predictAttendance(
  features: FeatureRow,
  model: { weights: number[]; bias: number },
  means: Record<keyof FeatureRow, number>,
  stds: Record<keyof FeatureRow, number>
) {
  const x = toVector(features, means, stds);
  const score = model.bias + x.reduce((sum, value, idx) => sum + value * model.weights[idx], 0);
  return clampAttendance(score);
}

export function buildAttendancePredictions(events: EventItem[]): {
  predictions: AttendancePrediction[];
  summary: AttendanceModelSummary;
} {
  const historicalRows = generateHistoricalRows(events);
  const splitIndex = Math.floor(historicalRows.length * 0.8);
  const trainRows = historicalRows.slice(0, splitIndex);
  const testRows = historicalRows.slice(splitIndex);
  const { means, stds } = normalizeRows(trainRows);
  const model = trainLinearRegression(trainRows, means, stds);

  let absoluteErrorTotal = 0;
  let correctBandPredictions = 0;

  for (const row of testRows) {
    const predicted = predictAttendance(row.features, model, means, stds);
    absoluteErrorTotal += Math.abs(predicted - row.attendance);
    if (attendanceToBand(predicted) === attendanceToBand(row.attendance)) {
      correctBandPredictions += 1;
    }
  }

  const predictions = events.map((event) => {
    const predictedAttendance = predictAttendance(toFeatureRow(event), model, means, stds);
    return {
      eventId: event.id,
      predictedAttendance,
      predictedBand: attendanceToBand(predictedAttendance),
    };
  });

  return {
    predictions,
    summary: {
      featuresUsed: [
        "Hour of day",
        "Day of week",
        "Weekend vs weekday",
        "Featured event flag",
        "Food provided flag",
        "Category score",
      ],
      generatedDataDescription:
        "For each real event from the database, 12 fictional past weekly attendance records were generated using a deterministic formula (time, weekday/weekend, featured, food, category), plus small deterministic noise and seasonality.",
      modelChoiceExplanation:
        "A small linear regression model was used because it is lightweight, fast to train, and easy to explain: each feature contributes additively to the attendance estimate.",
      trainSize: trainRows.length,
      testSize: testRows.length,
      meanAbsoluteError: Number((absoluteErrorTotal / Math.max(testRows.length, 1)).toFixed(2)),
      testBandAccuracy: Number(
        ((correctBandPredictions / Math.max(testRows.length, 1)) * 100).toFixed(1)
      ),
    },
  };
}
