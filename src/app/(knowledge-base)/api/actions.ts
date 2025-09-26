import axios from "axios";
import { getAdmin } from "@/app/(app)/services/admin-api";
import { fetchSettings } from "@/app/(app)/services/global-api";
import { getKnowledgeBase } from "@/orval_api/knowledge-base/knowledge-base";
import type {
  KBCategoryOut,
  KBQuestionIn,
  KBQuestionAnswerPutIn,
  KBTechnologyIn,
} from "@/orval_api/model";
import type { ValidationError } from "@/types/general";

export async function createKBCategory(formData: KBCategoryOut) {
  const admin = await getAdmin();

  if (!admin) {
    return { status: 403, message: "You are not allowed to do this" };
  }

  const { backendURL, unknownError } = await fetchSettings();
  const { aPICreateCategory } = getKnowledgeBase();

  try {
    await aPICreateCategory(formData, backendURL);
    return { status: 201, message: "Movie created" };
  } catch (error) {
    if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
      return { status: error.status, message: error.response?.data.detail };
    } else {
      return unknownError;
    }
  }
}

export async function createKBTechnology(formData: KBTechnologyIn) {
  const admin = await getAdmin();

  if (!admin) {
    return { status: 403, message: "You are not allowed to do this" };
  }

  const { backendURL, unknownError } = await fetchSettings();
  const { aPICreateTechnology } = getKnowledgeBase();

  try {
    await aPICreateTechnology(formData, backendURL);

    return { status: 201, message: "Movie created" };
  } catch (error) {
    if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
      return { status: error.status, message: error.response?.data.detail };
    } else {
      return unknownError;
    }
  }
}

export async function createKBQuestion(formData: KBQuestionIn) {
  const admin = await getAdmin();

  if (!admin) {
    return { status: 403, message: "You are not allowed to do this" };
  }

  const { backendURL, unknownError } = await fetchSettings();
  const { aPICreateQuestionAnswer } = getKnowledgeBase();

  try {
    await aPICreateQuestionAnswer(formData, backendURL);

    return { status: 201, message: "Question created" };
  } catch (error) {
    if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
      return { status: error.status, message: error.response?.data.detail };
    } else {
      return unknownError;
    }
  }
}

export async function updateAnswer(formData: KBQuestionAnswerPutIn) {
  const admin = await getAdmin();

  if (!admin) {
    return { status: 403, message: "You are not allowed to do this" };
  }

  const { backendURL, unknownError } = await fetchSettings();
  const { aPIUpdateQuestionAnswer } = getKnowledgeBase();

  try {
    await aPIUpdateQuestionAnswer(formData, backendURL);
  } catch (error) {
    if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
      return { status: error.status, message: error.response?.data.detail };
    } else {
      return unknownError;
    }
  }
}
