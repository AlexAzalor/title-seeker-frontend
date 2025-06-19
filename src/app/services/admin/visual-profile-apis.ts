"use server";

import axios from "axios";

import { getAdmin } from "@/app/services/admin-api";
import { fetchSettings } from "@/app/services/global-api";
import { getVisualProfile } from "@/orval_api/visual-profile/visual-profile";

import type { ValidationError } from "@/types/general";
import type {
  VisualProfileFieldWithUUID,
  VisualProfileFormIn,
} from "@/orval_api/model";

export async function createVisualProfileCategory(
  categoryFields: VisualProfileFormIn,
) {
  const admin = await getAdmin();

  if (!admin) {
    return { status: 403, message: "You are not allowed to do this" };
  }

  const { backendURL, unknownError } = await fetchSettings();
  const { aPICreateVisualProfile } = getVisualProfile();

  try {
    await aPICreateVisualProfile(
      categoryFields,
      { user_uuid: admin.uuid },
      backendURL,
    );

    return { status: 201, message: "Category created!" };
  } catch (error) {
    if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
      return { status: error.status, message: error.response?.data.detail };
    } else {
      return unknownError;
    }
  }
}

export async function editVisualProfileCategory(
  categoryFields: VisualProfileFieldWithUUID,
) {
  const admin = await getAdmin();

  if (!admin) {
    return { status: 403, message: "You are not allowed to do this" };
  }

  const { backendURL, unknownError } = await fetchSettings();
  const { aPIUpdateCategory } = getVisualProfile();

  try {
    await aPIUpdateCategory(
      categoryFields,
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

export async function editVisualProfileCriterion(
  criterionFields: VisualProfileFieldWithUUID,
) {
  const admin = await getAdmin();

  if (!admin) {
    return { status: 403, message: "You are not allowed to do this" };
  }

  const { backendURL, unknownError } = await fetchSettings();
  const { aPIUpdateCriterion } = getVisualProfile();

  try {
    await aPIUpdateCriterion(
      criterionFields,
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
