"use server";
// CORS errors occur without this directive

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
  const { aPICreateKbCategory } = getKnowledgeBase();

  try {
    await aPICreateKbCategory(formData, { user_uuid: admin.uuid }, backendURL);
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
  const { aPICreateKbTechnology } = getKnowledgeBase();

  try {
    await aPICreateKbTechnology(
      formData,
      { user_uuid: admin.uuid },
      backendURL,
    );

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
  const { aPICreateKbQuestionAnswer } = getKnowledgeBase();

  try {
    await aPICreateKbQuestionAnswer(
      formData,
      { user_uuid: admin.uuid },
      backendURL,
    );

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
  const { aPIUpdateKbQuestionAnswer } = getKnowledgeBase();

  try {
    await aPIUpdateKbQuestionAnswer(
      formData,
      { user_uuid: admin.uuid },
      backendURL,
    );
  } catch (error) {
    if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
      return { status: error.status, message: error.response?.data.detail };
    } else {
      return unknownError;
    }
  }
}
