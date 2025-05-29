"use server";

import axios, { AxiosResponse } from "axios";

import type { ValidationError } from "@/types/general";
import { CriterionFormList } from "@/orval_api/model";

import { getAdmin } from "../admin-api";
import { fetchSettings } from "../global-api";
import { getVisualProfile } from "@/orval_api/visual-profile/visual-profile";
import { VisualProfileFieldType } from "@/types/zod-scheme";

export async function getVisualProfileCriteria() {
  const admin = await getAdmin();

  if (!admin) {
    return { status: 403, message: "You are not allowed to do this" };
  }

  const { backendURL, unknownError } = await fetchSettings();
  const { aPIGetCriteria } = getVisualProfile();

  try {
    const response: AxiosResponse<CriterionFormList> = await aPIGetCriteria(
      { user_uuid: admin.uuid },
      backendURL,
    );

    return response.data.criteria;
  } catch (error) {
    if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
      return { status: error.status, message: error.response?.data.detail };
    } else {
      return unknownError;
    }
  }
}

export async function editVisualProfileCriterion(
  old_key: string,
  criterionFields: VisualProfileFieldType,
) {
  const admin = await getAdmin();

  if (!admin) {
    return { status: 403, message: "You are not allowed to do this" };
  }

  const { backendURL, unknownError } = await fetchSettings();
  const { aPIUpdateCriterion } = getVisualProfile();

  try {
    await aPIUpdateCriterion(
      {
        old_key,
        ...criterionFields,
      },
      { user_uuid: admin.uuid },
      backendURL,
    );

    return { status: 200, message: "Criterion updated" };
  } catch (error) {
    if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
      return { status: error.status, message: error.response?.data.detail };
    } else {
      return unknownError;
    }
  }
}

export async function editVisualProfileCategory(
  old_key: string,
  categoryFields: VisualProfileFieldType,
) {
  const admin = await getAdmin();

  if (!admin) {
    return { status: 403, message: "You are not allowed to do this" };
  }

  const { backendURL, unknownError } = await fetchSettings();
  const { aPIUpdateCategory } = getVisualProfile();

  try {
    await aPIUpdateCategory(
      {
        old_key,
        ...categoryFields,
      },
      { user_uuid: admin.uuid },
      backendURL,
    );

    return { status: 200, message: "Criterion updated" };
  } catch (error) {
    if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
      return { status: error.status, message: error.response?.data.detail };
    } else {
      return unknownError;
    }
  }
}
